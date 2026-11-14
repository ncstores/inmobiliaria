import { upload } from '@vercel/blob/client';

export const usesVercelStorage = import.meta.env.VITE_STORAGE_PROVIDER === 'vercel';

const uploadedImages = new Map();

async function prepareImages(value) {
  if (typeof value === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(value)) {
    if (uploadedImages.has(value)) return uploadedImages.get(value);
    const image = await (await fetch(value)).blob();
    const result = await upload(`catalog/images/${crypto.randomUUID()}`, image, {
      access: 'public', handleUploadUrl: '/api/upload', contentType: image.type
    });
    uploadedImages.set(value, result.url);
    return result.url;
  }
  if (Array.isArray(value)) return Promise.all(value.map(prepareImages));
  if (value && typeof value === 'object') {
    return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await prepareImages(item)])));
  }
  return value;
}

export async function storageRequest(body) {
  const response = await fetch('/api/storage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'No se pudo conectar al almacenamiento de Vercel.');
  return result.value;
}

export async function readVercelData(key) {
  const response = await fetch(`/api/storage?key=${encodeURIComponent(key)}`, { cache: 'no-store' });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'No se pudieron cargar los datos guardados.');
  return result.value;
}

export async function saveVercelData(key, value) {
  try {
    await storageRequest({ action: 'save', key, value: await prepareImages(value) });
    return true;
  } catch (error) {
    console.error('Error guardando en Vercel', error);
    return false;
  }
}
