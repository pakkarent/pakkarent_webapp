-- Products were sometimes assigned category_id = subcategory row (e.g. Cradle id=10)
-- instead of category_id = Event (3) + subcategory_id = 10. Normalize those rows.
UPDATE products p
SET
  subcategory_id = p.category_id,
  category_id = c.parent_id
FROM categories c
WHERE c.id = p.category_id
  AND c.parent_id IS NOT NULL
  AND (p.subcategory_id IS DISTINCT FROM p.category_id OR p.category_id <> c.parent_id);
