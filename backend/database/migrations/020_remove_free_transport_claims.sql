-- Remove "free transportation / free delivery" claims from product copy.
-- Transport charges are confirmed at booking; do not advertise free transport on listing pages.

UPDATE products
SET description = trim(both FROM regexp_replace(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(description,
          '\s*Free transportation[^.]*\.', '', 'gi'),
        '\s*Includes free transport[^.]*\.', '', 'gi'),
      '\s*[0-9]+\s*km free delivery[^.]*\.', '', 'gi'),
    '\s*Hassle[-\s]?free transportation and delivery\.?', '', 'gi'),
  '\s{2,}', ' ', 'g'
))
WHERE description ~* 'free transport|free delivery|hassle[- ]?free transport';

-- Drop transport specs that claim free delivery
UPDATE products
SET specs = specs - 'transport'
WHERE specs ? 'transport'
  AND specs->>'transport' ~* 'free';

-- Clean free-transport bullets inside details arrays
UPDATE products
SET specs = jsonb_set(
  specs,
  '{details}',
  (
    SELECT COALESCE(jsonb_agg(to_jsonb(elem)), '[]'::jsonb)
    FROM jsonb_array_elements_text(specs->'details') AS elem
    WHERE elem !~* 'free transport|free delivery|hassle[- ]?free transport'
  )
)
WHERE jsonb_typeof(specs->'details') = 'array'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(specs->'details') AS elem
    WHERE elem ~* 'free transport|free delivery|hassle[- ]?free transport'
  );
