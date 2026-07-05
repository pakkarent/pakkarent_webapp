const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
const SUPABASE_URL = (process.env.REACT_APP_SUPABASE_URL || '').replace(/\/$/, '');
const STORAGE_BUCKET = process.env.REACT_APP_SUPABASE_STORAGE_BUCKET || 'pakkarent_images';

export const IMAGE_PRESETS = {
  card: { width: 400, height: 300, resize: 'cover', quality: 75 },
  cart: { width: 120, height: 120, resize: 'cover', quality: 70 },
  search: { width: 64, height: 64, resize: 'cover', quality: 70 },
  gallery: { width: 96, height: 96, resize: 'cover', quality: 70 },
  detail: { width: 900, height: 900, resize: 'contain', quality: 80 },
};

function extractStorageKey(normalized) {
  const markers = [
    `/storage/v1/object/public/${STORAGE_BUCKET}/`,
    `/storage/v1/render/image/public/${STORAGE_BUCKET}/`,
  ];
  for (const marker of markers) {
    const idx = normalized.indexOf(marker);
    if (idx !== -1) {
      let key = normalized.slice(idx + marker.length);
      const q = key.indexOf('?');
      if (q !== -1) key = key.slice(0, q);
      return key;
    }
  }
  if (normalized.includes('/uploads/')) {
    return normalized.slice(normalized.indexOf('/uploads/') + '/uploads/'.length);
  }
  return null;
}

function buildStorageUrl(storageKey, transform) {
  if (!SUPABASE_URL || !storageKey) return null;
  if (transform) {
    const params = new URLSearchParams();
    if (transform.width) params.set('width', String(transform.width));
    if (transform.height) params.set('height', String(transform.height));
    if (transform.resize) params.set('resize', transform.resize);
    if (transform.quality) params.set('quality', String(transform.quality));
    const qs = params.toString();
    return `${SUPABASE_URL}/storage/v1/render/image/public/${STORAGE_BUCKET}/${storageKey}${qs ? `?${qs}` : ''}`;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${storageKey}`;
}

/** Full-size URL (no transform). */
export function resolveImageUrl(src) {
  if (!src) return null;
  const normalized = String(src).replace(/\\/g, '/');

  if (normalized.startsWith('http')) {
    const key = extractStorageKey(normalized);
    if (key && SUPABASE_URL) return buildStorageUrl(key);
    return normalized.split('?')[0];
  }

  const key = extractStorageKey(normalized);
  if (key && SUPABASE_URL) return buildStorageUrl(key);

  if (normalized.includes('/uploads/')) {
    return normalized.slice(normalized.indexOf('/uploads/'));
  }

  if (normalized.startsWith('/')) return normalized;

  return `${API_BASE}/${normalized}`;
}

/** Thumbnail URL — uses public object URLs (Supabase /render/image transforms need a paid plan). */
export function resolveThumbnailUrl(src, preset = 'card') {
  if (!src) return null;
  return resolveImageUrl(src);
}

/** onError handler: retry full-size if transform URL fails. */
export function imageErrorFallback(e, src) {
  const full = resolveImageUrl(src);
  if (full && e.currentTarget.src !== full) {
    e.currentTarget.src = full;
  }
}

export function safeJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function safeJsonObject(value) {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
