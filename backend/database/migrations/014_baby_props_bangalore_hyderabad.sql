-- Baby Props Rental: Baby Stroller, Baby Car Seat, High Chair for Bangalore & Hyderabad
-- (Chennai catalog: products 90, 89, 92)

INSERT INTO products (
  name, description, category_id, subcategory_id, city,
  monthly_price, price_3month, price_6month, price_12month,
  security_deposit, images, specs, stock, is_featured, is_active
)
SELECT
  src.name,
  src.description,
  src.category_id,
  src.subcategory_id,
  target.city,
  src.monthly_price,
  src.price_3month,
  src.price_6month,
  src.price_12month,
  src.security_deposit,
  src.images,
  src.specs,
  src.stock,
  src.is_featured,
  true
FROM products src
CROSS JOIN (VALUES ('Bangalore'), ('Hyderabad')) AS target(city)
WHERE src.id IN (89, 90, 92)
  AND src.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(src.name))
      AND p.city = target.city
      AND p.is_active = true
  );
