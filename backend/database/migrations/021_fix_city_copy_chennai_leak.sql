-- Fix Bangalore/Hyderabad product copy that still says "Chennai"
-- (cloned from Chennai catalog / legacy scrape details).

-- 1) description text
UPDATE products
SET
  description = regexp_replace(description, 'Chennai', city, 'gi'),
  updated_at = NOW()
WHERE is_active = true
  AND city IN ('Bangalore', 'Hyderabad')
  AND description ILIKE '%chennai%';

-- 2) specs.details as plain string
UPDATE products
SET
  specs = jsonb_set(
    COALESCE(specs, '{}'::jsonb),
    '{details}',
    to_jsonb(regexp_replace(specs->>'details', 'Chennai', city, 'gi'))
  ),
  updated_at = NOW()
WHERE is_active = true
  AND city IN ('Bangalore', 'Hyderabad')
  AND specs ? 'details'
  AND jsonb_typeof(specs->'details') = 'string'
  AND specs->>'details' ILIKE '%chennai%';

-- 3) specs.details as JSON array of strings
UPDATE products p
SET
  specs = jsonb_set(
    COALESCE(p.specs, '{}'::jsonb),
    '{details}',
    (
      SELECT COALESCE(jsonb_agg(to_jsonb(regexp_replace(elem, 'Chennai', p.city, 'gi'))), '[]'::jsonb)
      FROM jsonb_array_elements_text(p.specs->'details') AS elem
    )
  ),
  updated_at = NOW()
WHERE p.is_active = true
  AND p.city IN ('Bangalore', 'Hyderabad')
  AND p.specs ? 'details'
  AND jsonb_typeof(p.specs->'details') = 'array'
  AND p.specs::text ILIKE '%chennai%';
