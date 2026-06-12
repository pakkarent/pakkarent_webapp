-- Subcategories: child categories under a parent (e.g. Event → Cradle, Props)
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS subcategory_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);

-- Event Rental subcategories (parent_id = 3)
INSERT INTO categories (name, description, icon, sort_order, parent_id)
SELECT v.name, v.description, v.icon, v.sort_order, v.parent_id
FROM (VALUES
  ('Cradle',            'Silver, teak and royal cradles for naming ceremonies', '👶', 1, 3),
  ('Swings & Oonjal',   'Oonjal and jhula swings for weddings and baby showers', '🪷', 2, 3),
  ('Chairs & Furniture','Chairs, sofas and traditional seating for functions', '🪑', 3, 3),
  ('Decor & Urli',      'Urli, traditional items and ambience decor', '🪔', 4, 3),
  ('Props & Stands',    'Backdrop stands, boards and event props', '🎭', 5, 3)
) AS v(name, description, icon, sort_order, parent_id)
WHERE NOT EXISTS (
  SELECT 1 FROM categories c WHERE c.parent_id = v.parent_id AND c.name = v.name
);

-- Map existing Event products to subcategories
UPDATE products p SET subcategory_id = sc.id
FROM categories sc
WHERE p.category_id = 3 AND sc.parent_id = 3 AND sc.name = 'Cradle'
  AND p.name ILIKE '%cradle%';

UPDATE products p SET subcategory_id = sc.id
FROM categories sc
WHERE p.category_id = 3 AND sc.parent_id = 3 AND sc.name = 'Swings & Oonjal'
  AND (p.name ILIKE '%oonjal%' OR p.name ILIKE '%jhula%' OR p.name ILIKE '%swing%');

UPDATE products p SET subcategory_id = sc.id
FROM categories sc
WHERE p.category_id = 3 AND sc.parent_id = 3 AND sc.name = 'Chairs & Furniture'
  AND (
    p.name ILIKE '%chair%' OR p.name ILIKE '%sofa%' OR p.name ILIKE '%manai%'
    OR p.name ILIKE '%palagai%' OR p.name ILIKE '%manakatti%'
  );

UPDATE products p SET subcategory_id = sc.id
FROM categories sc
WHERE p.category_id = 3 AND sc.parent_id = 3 AND sc.name = 'Decor & Urli'
  AND (
    p.name ILIKE '%urli%' OR p.name ILIKE '%rokali%' OR p.name ILIKE '%ural%'
    OR p.name ILIKE '%led light%' OR p.name ILIKE '%balloon%'
  );

UPDATE products p SET subcategory_id = sc.id
FROM categories sc
WHERE p.category_id = 3 AND sc.parent_id = 3 AND sc.name = 'Props & Stands'
  AND p.category_id = 3 AND p.subcategory_id IS NULL;
