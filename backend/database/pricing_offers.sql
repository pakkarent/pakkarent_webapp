-- Pricing offers: percentage discount store-wide or per category (category overrides global)
CREATE TABLE IF NOT EXISTS pricing_offers (
  id SERIAL PRIMARY KEY,
  scope VARCHAR(20) NOT NULL CHECK (scope IN ('all', 'category')),
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  discount_percent DECIMAL(5,2) NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  label VARCHAR(120),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT pricing_scope_category_check CHECK (
    (scope = 'all' AND category_id IS NULL) OR
    (scope = 'category' AND category_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_pricing_one_active_global
  ON pricing_offers (scope)
  WHERE scope = 'all' AND is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS ux_pricing_one_active_per_category
  ON pricing_offers (category_id)
  WHERE scope = 'category' AND is_active = true;
