-- SEO-friendly product slugs (unique per city)
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(200);

UPDATE products
SET slug = trim(both '-' from regexp_replace(
  regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g'),
  '-+', '-', 'g'
))
WHERE slug IS NULL OR slug = '';

UPDATE products SET slug = 'product-' || id::text WHERE slug IS NULL OR slug = '';

-- De-dupe active products sharing slug+city (keep lowest id)
UPDATE products p
SET slug = p.slug || '-' || p.id::text
FROM (
  SELECT slug, city
  FROM products
  WHERE is_active = true
  GROUP BY slug, city
  HAVING COUNT(*) > 1
) d
WHERE p.slug = d.slug
  AND p.city = d.city
  AND p.is_active = true
  AND p.id NOT IN (
    SELECT MIN(id) FROM products
    WHERE slug = d.slug AND city = d.city AND is_active = true
  );

ALTER TABLE products ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_city_active_unique
  ON products (slug, city)
  WHERE is_active = true;
