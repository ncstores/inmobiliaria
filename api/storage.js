import { list, put } from '@vercel/blob';
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const keys = ['vergnano_properties', 'vergnano_locations', 'vergnano_types', 'vergnano_site_content'];
const pathFor = (key) => `catalog/current/${key}.json`;
class MigrationError extends Error {}

function sourceError(error, dataset) {
  console.error(`Supabase migration (${dataset}):`, error);
  const code = String(error.code || 'sin código');
  if (error.code === 'PGRST301' || error.code === 'PGRST303' || /invalid api key|invalid jwt/i.test(error.message || '')) {
    return new MigrationError('Supabase rechazó la clave de acceso. Revisá las variables de Supabase en Production.');
  }
  if (error.code === '42P01' || error.code === 'PGRST205') {
    return new MigrationError(`No se encontró la tabla ${dataset} en Supabase. Verificá que las variables apunten al proyecto correcto.`);
  }
  if (/fetch failed|network|resolve|timeout/i.test(error.message || '')) {
    return new MigrationError('No se pudo conectar a Supabase. Revisá si el proyecto está pausado y si la URL de Production es correcta.');
  }
  return new MigrationError(`No se pudo leer ${dataset} de Supabase (${code.replace(/[^a-zA-Z0-9 _-]/g, '')}). Revisá el estado del proyecto y sus permisos de lectura.`);
}
const sign = (value) => createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(value).digest('hex');
const equal = (a, b) => {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  return left.length === right.length && timingSafeEqual(left, right);
};

async function read(key) {
  const { blobs } = await list({ prefix: pathFor(key), limit: 10 });
  const blob = blobs.find((item) => item.pathname === pathFor(key));
  if (!blob) return null;
  const response = await fetch(`${blob.url}?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('No se pudo leer el catálogo.');
  return response.json();
}

// Store uploaded images independently; JSON retains durable Blob URLs.
async function uploadImages(value) {
  if (typeof value === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(value)) {
    const [, type, data] = value.match(/^data:image\/(jpeg|png|webp);base64,(.*)$/s);
    const image = await put(`catalog/images/${randomUUID()}.${type}`, Buffer.from(data, 'base64'), {
      access: 'public', contentType: `image/${type}`, addRandomSuffix: false
    });
    return image.url;
  }
  if (Array.isArray(value)) return Promise.all(value.map(uploadImages));
  if (value && typeof value === 'object') {
    return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await uploadImages(item)])));
  }
  return value;
}

async function save(key, value) {
  const current = await read(key);
  if (current !== null) {
    await put(`catalog/backups/${key}/${Date.now()}-${randomUUID()}.json`, JSON.stringify(current), {
      access: 'public', contentType: 'application/json', addRandomSuffix: false
    });
  }
  const next = await uploadImages(value);
  await put(pathFor(key), JSON.stringify(next), {
    access: 'public', contentType: 'application/json', allowOverwrite: true, addRandomSuffix: false, cacheControlMaxAge: 60
  });
  return next;
}

export function authorized(req) {
  if (!process.env.ADMIN_SESSION_SECRET) return false;
  const cookie = (req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith('catalog_session='));
  const [expiry, signature] = (cookie?.slice('catalog_session='.length) || '').split('.');
  return Number(expiry) > Date.now() && equal(signature, sign(expiry));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return res.status(503).json({ error: 'Falta configurar Vercel Blob y las variables de acceso del administrador.' });
  }
  try {
    if (req.method === 'GET') {
      const key = req.query.key;
      if (!keys.includes(key)) return res.status(400).json({ error: 'Clave inválida.' });
      const value = await read(key);
      if (value === null) return res.status(503).json({ error: 'El catálogo todavía no fue migrado a Vercel. No se cargaron datos de ejemplo.' });
      return res.json({ value });
    }
    if (req.method !== 'POST') return res.status(405).end();
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (body.action === 'login') {
      if (!equal(body.password, process.env.ADMIN_PASSWORD)) return res.status(401).json({ error: 'Contraseña incorrecta.' });
      const expiry = String(Date.now() + 8 * 60 * 60 * 1000);
      res.setHeader('Set-Cookie', `catalog_session=${expiry}.${sign(expiry)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`);
      return res.json({ value: true });
    }
    if (!authorized(req)) return res.status(401).json({ error: 'Iniciá sesión nuevamente para guardar.' });
    if (body.action === 'logout') {
      res.setHeader('Set-Cookie', 'catalog_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
      return res.json({ value: true });
    }
    if (body.action === 'migrate') {
      const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      if (!url || !key) throw new MigrationError('Faltan las variables de Supabase en Production para recuperar los datos existentes.');
      try { new URL(url); } catch { throw new MigrationError('La URL de Supabase en Production no es válida.'); }
      const legacy = createClient(url, key);
      const properties = await legacy.from('properties').select('*').order('sort_order');
      const settings = await legacy.from('app_settings').select('key,value').in('key', keys.slice(1));
      if (properties.error) throw sourceError(properties.error, 'properties');
      if (settings.error) throw sourceError(settings.error, 'app_settings');
      if (!properties.data?.length) throw new MigrationError('Supabase no devolvió propiedades. Revisá la tabla properties y sus permisos: la migración no puede recuperar datos que ya no estén en el origen.');
      const missingKeys = keys.slice(1).filter((item) => !settings.data?.some((setting) => setting.key === item));
      if (missingKeys.length) throw new MigrationError(`Faltan estos datos en app_settings: ${missingKeys.join(', ')}. Revisá el proyecto de Supabase antes de migrar.`);
      if (settings.data.some((setting) => setting.key === 'vergnano_site_content' ? !setting.value || typeof setting.value !== 'object' || Array.isArray(setting.value) : !Array.isArray(setting.value))) {
        throw new MigrationError('Los datos de app_settings tienen un formato inesperado. No se copió el catálogo.');
      }
      const rows = properties.data.map(({ map_url, sort_order: _sort, updated_at: _updated, ...item }) => ({ ...item, mapUrl: map_url || '' }));
      // A retry resumes missing datasets without replacing data already copied/edited.
      try {
        if (await read(keys[0]) === null) await save(keys[0], rows);
        for (const setting of settings.data) {
          if (await read(setting.key) === null) await save(setting.key, setting.value);
        }
      } catch (error) {
        console.error('Migration Blob write:', error);
        throw new MigrationError('Se leyeron los datos de Supabase, pero falló la copia a Blob. Revisá el token, permisos, límites y estado del almacenamiento en Vercel. Podés reintentar para completar los datos faltantes.');
      }
      return res.json({ value: true });
    }
    if (body.action === 'save' && keys.includes(body.key)) {
      if (body.key === 'vergnano_site_content' ? !body.value || Array.isArray(body.value) || typeof body.value !== 'object' : !Array.isArray(body.value)) {
        return res.status(400).json({ error: 'Formato de datos inválido.' });
      }
      return res.json({ value: await save(body.key, body.value) });
    }
    return res.status(400).json({ error: 'Acción inválida.' });
  } catch (error) {
    console.error('Vercel storage:', error);
    if (error instanceof MigrationError) return res.status(422).json({ error: error.message });
    return res.status(500).json({ error: 'No se pudo completar la operación. Revisá los registros de Vercel y la conexión de origen.' });
  }
}
