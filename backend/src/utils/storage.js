const path = require('path');
const { getSupabase } = require('./supabase');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'pakkarent_images';

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

function getStorageClient() {
  const sb = getSupabase();
  if (!sb) {
    throw new Error('Supabase is not configured (SUPABASE_URL + key required)');
  }
  return sb;
}

/** `/uploads/products/x.jpg` → `products/x.jpg` */
function localPathToStorageKey(localPath) {
  const normalized = String(localPath).replace(/\\/g, '/');
  if (normalized.includes('/storage/v1/object/public/')) {
    const marker = `/public/${BUCKET}/`;
    const idx = normalized.indexOf(marker);
    if (idx !== -1) return normalized.slice(idx + marker.length);
  }
  return normalized.replace(/^\/uploads\//, '').replace(/^\/+/, '');
}

function getPublicUrl(storageKey) {
  const sb = getStorageClient();
  const { data } = sb.storage.from(BUCKET).getPublicUrl(storageKey);
  return data.publicUrl;
}

function localPathToPublicUrl(localPath) {
  return getPublicUrl(localPathToStorageKey(localPath));
}

async function uploadBuffer(storageKey, buffer, contentType) {
  const sb = getStorageClient();
  const { data, error } = await sb.storage.from(BUCKET).upload(storageKey, buffer, {
    contentType: contentType || MIME[path.extname(storageKey).toLowerCase()] || 'application/octet-stream',
    upsert: true,
  });
  if (error) throw error;
  return { storageKey: data.path, publicUrl: getPublicUrl(data.path) };
}

async function uploadFile(storageKey, filePath) {
  const fs = require('fs');
  const buffer = fs.readFileSync(filePath);
  return uploadBuffer(storageKey, buffer);
}

async function removeObject(imageRef) {
  const storageKey = localPathToStorageKey(imageRef);
  if (!storageKey) return;
  const sb = getStorageClient();
  const { error } = await sb.storage.from(BUCKET).remove([storageKey]);
  if (error) throw error;
}

module.exports = {
  BUCKET,
  localPathToStorageKey,
  getPublicUrl,
  localPathToPublicUrl,
  uploadBuffer,
  uploadFile,
  removeObject,
};
