-- Home appliances are monthly rentals; ensure pricing_type is set in specs.
UPDATE products
SET specs = COALESCE(specs, '{}'::jsonb) || '{"pricing_type":"per_month"}'::jsonb
WHERE category_id = 2
  AND (specs IS NULL OR specs->>'pricing_type' IS NULL OR specs->>'pricing_type' = '');
