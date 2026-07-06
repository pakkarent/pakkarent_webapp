-- Bangalore birthday catalog: Irish Cake Table Combo (clone from Chennai: product 83)

INSERT INTO products (
  name, description, category_id, subcategory_id, city,
  monthly_price, price_3month, price_6month, price_12month,
  security_deposit, images, specs, stock, is_featured, is_active, slug
)
SELECT
  src.name,
  regexp_replace(src.description, 'Chennai', 'Bangalore', 'gi'),
  src.category_id,
  src.subcategory_id,
  'Bangalore',
  src.monthly_price,
  src.price_3month,
  src.price_6month,
  src.price_12month,
  src.security_deposit,
  src.images,
  CASE
    WHEN src.specs IS NULL THEN '{"city":"Bangalore","pricing_type":"per_event"}'::jsonb
    ELSE src.specs || '{"city":"Bangalore"}'::jsonb
  END,
  src.stock,
  src.is_featured,
  true,
  src.slug
FROM products src
WHERE src.id = 83
  AND src.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(src.name))
      AND p.city = 'Bangalore'
      AND p.is_active = true
  );
