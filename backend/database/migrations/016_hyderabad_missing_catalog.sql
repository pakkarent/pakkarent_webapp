-- Hyderabad catalog gap: Irish Cake Table Combo, Welcome Board Stand, Dress Changing Tent
-- (clone from Chennai: products 8, 32, 83 — same pattern as 014_baby_props)

INSERT INTO products (
  name, description, category_id, subcategory_id, city,
  monthly_price, price_3month, price_6month, price_12month,
  security_deposit, images, specs, stock, is_featured, is_active, slug
)
SELECT
  src.name,
  regexp_replace(src.description, 'Chennai', 'Hyderabad', 'gi'),
  src.category_id,
  src.subcategory_id,
  'Hyderabad',
  src.monthly_price,
  src.price_3month,
  src.price_6month,
  src.price_12month,
  src.security_deposit,
  src.images,
  CASE
    WHEN src.specs IS NULL THEN '{"city":"Hyderabad","pricing_type":"per_event"}'::jsonb
    ELSE src.specs || '{"city":"Hyderabad"}'::jsonb
  END,
  src.stock,
  src.is_featured,
  true,
  src.slug
FROM products src
WHERE src.id IN (8, 32, 83)
  AND src.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(src.name))
      AND p.city = 'Hyderabad'
      AND p.is_active = true
  );

-- Kalasam is the local name for the gangalam / brass kalash set (already listed under Event Rental)
UPDATE products
SET
  description = 'Traditional gangalam / kalasam (brass kalash) set of 5 bowls for mangala snanam, haldi and wedding ceremonies in Hyderabad. Mild steel bowls arranged around the urli.',
  specs = COALESCE(specs, '{}'::jsonb) || '{
    "city": "Hyderabad",
    "aliases": ["Kalasam", "Kalash", "Gangalam", "Mangala Snanam"],
    "material": "Mild steel",
    "bowl_count": 5,
    "pricing_type": "per_event"
  }'::jsonb
WHERE name = 'Gangalam / Mangala Snanam Set'
  AND city = 'Hyderabad'
  AND is_active = true;
