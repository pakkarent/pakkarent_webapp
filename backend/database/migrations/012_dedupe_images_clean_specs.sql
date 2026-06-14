-- Deduplicate image URLs per product; remove price_per_event from specs JSON.

UPDATE products
SET images = sub.deduped,
    updated_at = NOW()
FROM (
  SELECT id,
    COALESCE(
      (SELECT jsonb_agg(DISTINCT val)
       FROM jsonb_array_elements_text(COALESCE(p.images, '[]'::jsonb)) AS val
       WHERE val IS NOT NULL AND btrim(val) <> ''),
      '[]'::jsonb
    ) AS deduped
  FROM products p
  WHERE p.is_active = true
) sub
WHERE products.id = sub.id
  AND products.images IS DISTINCT FROM sub.deduped;

UPDATE products
SET specs = specs - 'price_per_event',
    updated_at = NOW()
WHERE specs ? 'price_per_event';
