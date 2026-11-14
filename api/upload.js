import { handleUpload } from '@vercel/blob/client';
import { authorized } from './storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const result = await handleUpload({
      request: req,
      body: typeof req.body === 'string' ? JSON.parse(req.body) : req.body,
      onBeforeGenerateToken: async (pathname) => {
        if (!authorized(req)) throw new Error('Iniciá sesión para subir imágenes.');
        if (!pathname.startsWith('catalog/images/')) throw new Error('Ruta inválida.');
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true
        };
      },
      onUploadCompleted: async () => {}
    });
    return res.json(result);
  } catch (error) {
    console.error('Blob upload:', error);
    return res.status(400).json({ error: 'No se pudo subir la imagen. Revisá la sesión y Vercel Blob.' });
  }
}
