/**
 * Turn product.specs JSON into human-readable specification bullets for the UI.
 * Hides internal/pricing keys; keeps pricing_type in DB for app logic only.
 */

const HIDDEN_KEYS = new Set([
  'pricing_type',
  'price_per_event',
  'price_per_day',
  'price_per_letter',
  'price_range',
  'price_1_day',
  'price_2_3_days',
  'price_10_chairs',
  'price_20_chairs',
  'city',
  'combo_with_backdrop_price',
  'rate_0_3_months',
  'rate_3_6_months',
  'rate_6_plus_months',
  'extra_coal_per_kg',
]);

const KEY_LABELS = {
  material: 'Material',
  dimensions: 'Dimensions',
  design: 'Design',
  style: 'Style',
  type: 'Type',
  transport: 'Delivery',
  includes: 'Includes',
  note: 'Note',
  use: 'Ideal for',
  colour: 'Colour',
  color: 'Colour',
  theme: 'Theme',
  local_name: 'Also known as',
  capacity: 'Capacity',
  capacity_kg: 'Capacity',
  layers: 'Layers',
  brand: 'Brand',
  max_weight_kg: 'Max weight',
  combo_count: 'Combo includes',
};

function titleCase(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(val) {
  if (val == null || val === '') return null;
  if (Array.isArray(val)) {
    const items = val.map(String).filter(Boolean);
    return items.length ? items.join(', ') : null;
  }
  if (typeof val === 'object') return null;
  return String(val);
}

/** @returns {{ label: string, value: string }[]} */
export function getDisplaySpecs(product) {
  let specs = product?.specs;
  if (!specs) return [];
  if (typeof specs === 'string') {
    try {
      specs = JSON.parse(specs);
    } catch {
      return [];
    }
  }
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) return [];

  const rows = [];

  // Prefer legacy-style detail bullets when present
  if (Array.isArray(specs.details) && specs.details.length) {
    for (const line of specs.details) {
      const text = String(line || '').trim();
      if (text) rows.push({ label: null, value: text });
    }
    const occasions = specs.occasions;
    if (Array.isArray(occasions) && occasions.length) {
      rows.push({ label: 'Occasions', value: occasions.join(', ') });
    }
    const includes = specs.includes;
    if (Array.isArray(includes) && includes.length) {
      rows.push({ label: 'Package includes', value: includes.join(', ') });
    }
    return rows;
  }

  const features = specs.features;
  if (Array.isArray(features) && features.length) {
    rows.push({ label: 'Highlights', value: features.join(' · ') });
  }

  const occasions = specs.occasions;
  if (Array.isArray(occasions) && occasions.length) {
    rows.push({ label: 'Occasions', value: occasions.join(', ') });
  }

  const includes = specs.includes;
  if (Array.isArray(includes) && includes.length) {
    rows.push({ label: 'Package includes', value: includes.join(', ') });
  }

  for (const [key, val] of Object.entries(specs)) {
    if (HIDDEN_KEYS.has(key)) continue;
    if (['details', 'features', 'occasions', 'includes'].includes(key)) continue;
    const formatted = formatValue(val);
    if (!formatted) continue;
    rows.push({
      label: KEY_LABELS[key] || titleCase(key),
      value: formatted,
    });
  }

  return rows;
}

/** Unique image URLs for gallery (dedupe by normalized path). */
export function uniqueProductImages(images) {
  const list = Array.isArray(images) ? images : [];
  const seen = new Set();
  const out = [];
  for (const ref of list) {
    const normalized = String(ref || '').split('?')[0];
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(ref);
  }
  return out;
}
