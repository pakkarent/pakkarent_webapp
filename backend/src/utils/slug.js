/** URL-safe slug from product name (hyphen-separated). */
function slugifyProductName(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'product';
}

const CITY_FROM_URL = {
  chennai: 'Chennai',
  bangalore: 'Bangalore',
  hyderabad: 'Hyderabad',
  india: 'all',
};

const URL_FROM_CITY = {
  Chennai: 'chennai',
  Bangalore: 'bangalore',
  Hyderabad: 'hyderabad',
  all: 'india',
};

function cityFromUrlSegment(segment) {
  if (!segment) return null;
  return CITY_FROM_URL[String(segment).toLowerCase()] ?? null;
}

function cityUrlSegment(city) {
  if (!city || city === 'all') return 'india';
  return URL_FROM_CITY[city] || String(city).toLowerCase();
}

async function ensureUniqueSlug(pool, baseSlug, city, excludeId = null) {
  let slug = baseSlug;
  let suffix = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const params = [slug, city];
    let sql = 'SELECT id FROM products WHERE slug = $1 AND city = $2 AND is_active = true';
    if (excludeId) {
      sql += ' AND id != $3';
      params.push(excludeId);
    }
    const { rows } = await pool.query(sql, params);
    if (!rows.length) return slug;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}

module.exports = {
  slugifyProductName,
  cityFromUrlSegment,
  cityUrlSegment,
  ensureUniqueSlug,
};
