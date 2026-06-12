-- Separate monthly vs event/day pricing offers
ALTER TABLE pricing_offers
  ADD COLUMN IF NOT EXISTS pricing_segment VARCHAR(20) NOT NULL DEFAULT 'monthly'
  CHECK (pricing_segment IN ('monthly', 'event'));

DROP INDEX IF EXISTS ux_pricing_one_active_global;
DROP INDEX IF EXISTS ux_pricing_one_active_per_category;

CREATE UNIQUE INDEX IF NOT EXISTS ux_pricing_one_active_global_segment
  ON pricing_offers (pricing_segment)
  WHERE scope = 'all' AND is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS ux_pricing_one_active_per_category_segment
  ON pricing_offers (category_id, pricing_segment)
  WHERE scope = 'category' AND is_active = true;
