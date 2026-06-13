-- Remove duplicate Chennai products (same name + city).
-- Keeps the canonical row (lowest id with images/featured); deactivates extras.
-- Safe to re-run: only touches known duplicate ids.

UPDATE products SET is_active = false, updated_at = NOW()
WHERE id IN (
  36, 39, 41, 48, 49, 54, 61, 86,  -- exact duplicate rows (re-import)
  25, 59                            -- near-duplicates: Lotus Urli, Gangalam variant
)
AND is_active = true;

-- Already-inactive legacy duplicates (idempotent)
UPDATE products SET is_active = false, updated_at = NOW()
WHERE id IN (17, 22)
AND is_active = true;

-- Prevent future exact duplicates (active catalog only)
CREATE UNIQUE INDEX IF NOT EXISTS products_unique_name_city_active
  ON products (LOWER(TRIM(name)), LOWER(TRIM(city)))
  WHERE is_active = true;
