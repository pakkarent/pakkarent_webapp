const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export function resolveImageUrl(src) {
  if (!src) return null;
  const normalized = String(src).replace(/\\/g, '/');

  if (normalized.startsWith('http')) return normalized;

  if (normalized.includes('/uploads/')) {
    const uploadPath = normalized.slice(normalized.indexOf('/uploads/'));
    return uploadPath;
  }

  if (normalized.startsWith('/')) return normalized;

  return `${API_BASE}/${normalized}`;
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
