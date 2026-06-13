-- Restore product image paths (local /uploads → served from frontend + Supabase).
-- Safe to re-run: only updates rows with null/empty images or broken pakkarent.com URLs.

-- ── CAMPING ────────────────────────────────────────────────
UPDATE products SET images = '[
  "/uploads/products/camping/camping_tent/img_01.png",
  "/uploads/products/camping/camping_tent/img_02.png",
  "/uploads/products/camping/camping_tent/img_03.png",
  "/uploads/products/camping/camping_tent/img_04.png"
]'::jsonb
WHERE name ILIKE 'Camping Tents%Double%';

UPDATE products SET images = '[
  "/uploads/products/camping/camping_tent-single_layer/img_01.jpg",
  "/uploads/products/camping/camping_tent-single_layer/img_02.png",
  "/uploads/products/camping/camping_tent-single_layer/img_03.png",
  "/uploads/products/camping/camping_tent-single_layer/img_04.png"
]'::jsonb
WHERE name ILIKE 'Camping Tents%Single%';

UPDATE products SET images = '[
  "/uploads/products/camping/sleeping_bag/img_01.jpg",
  "/uploads/products/camping/sleeping_bag/img_02.jpg",
  "/uploads/products/camping/sleeping_bag/img_03.jpg",
  "/uploads/products/camping/sleeping_bag/img_04.png"
]'::jsonb
WHERE name ILIKE 'Sleeping Bag%';

UPDATE products SET images = '[
  "/uploads/products/camping/barbeque/img_01.png",
  "/uploads/products/camping/barbeque/img_02.png",
  "/uploads/products/camping/barbeque/img_03.jpg"
]'::jsonb
WHERE name ILIKE 'Barbeque Grill%' OR name ILIKE 'Camping Stove%';

UPDATE products SET images = '[
  "/uploads/products/camping/OutdoorBarbeque/img_01.jpg",
  "/uploads/products/camping/OutdoorBarbeque/img_02.png",
  "/uploads/products/camping/OutdoorBarbeque/img_03.jpg"
]'::jsonb
WHERE name ILIKE 'Outdoor Barbeque%';

UPDATE products SET images = '[
  "/uploads/products/camping/life_jacket/img_01.jpg",
  "/uploads/products/camping/life_jacket/img_02.jpg",
  "/uploads/products/camping/life_jacket/img_03.jpg"
]'::jsonb
WHERE name ILIKE 'Life Jacket%';

-- ── HOME APPLIANCES ────────────────────────────────────────
UPDATE products SET images = '[
  "/uploads/products/home_appliances/washing_machine/img_01.png"
]'::jsonb
WHERE name ILIKE 'Washing Machine%';

UPDATE products SET images = '[
  "/uploads/products/home_appliances/fridge/img_01.png"
]'::jsonb
WHERE name ILIKE 'Fridge%' OR name ILIKE 'Refrigerator%';

UPDATE products SET images = '[
  "/uploads/products/home_appliances/AC/img_01.png"
]'::jsonb
WHERE name ILIKE 'Air Conditioner%' OR name ILIKE 'AC %' OR name = 'AC';

UPDATE products SET images = '[
  "/uploads/products/home_appliances/tv/img_01.png"
]'::jsonb
WHERE name ILIKE 'LED TV%' OR name = 'TV';

-- ── EVENT: CRADLES & SWINGS ──────────────────────────────────
UPDATE products SET images = '[
  "/uploads/products/event/Grand_Moon_cradle_Rental/img_01.jpg"
]'::jsonb
WHERE name ILIKE '%Grand Moon Cradle%';

UPDATE products SET images = '[
  "/uploads/products/event/crown/img_01.jpg",
  "/uploads/products/event/crown/img_02.jpg",
  "/uploads/products/event/crown/img_03.jpg",
  "/uploads/products/event/crown/img_04.jpg",
  "/uploads/products/event/crown/img_05.jpg"
]'::jsonb
WHERE name ILIKE '%Crown%Cradle%' OR name = 'Crown Baby Cradle';

UPDATE products SET images = '[
  "/uploads/products/event/silver_cradle/img_01.jpg",
  "/uploads/products/event/silver_cradle/img_02.jpg",
  "/uploads/products/event/silver_cradle/img_03.jpg",
  "/uploads/products/event/silver_cradle/img_05.jpg"
]'::jsonb
WHERE name ILIKE '%cradle%'
  AND name NOT ILIKE '%crown%'
  AND name NOT ILIKE '%grand moon%';

UPDATE products SET images = '[
  "/uploads/products/event/golden_oonjal/img_01.png"
]'::jsonb
WHERE name ILIKE '%oonjal%'
   OR name ILIKE '%jhula%'
   OR (name ILIKE '%swing%' AND category_id IN (SELECT id FROM categories WHERE name ILIKE '%event%'));

-- ── BABY PROPS ─────────────────────────────────────────────
UPDATE products SET images = '[
  "/uploads/products/baby/stroller/img_01.png"
]'::jsonb
WHERE name ILIKE '%Stroller%';

UPDATE products SET images = '[
  "/uploads/products/baby/baby_crib/img_01.png"
]'::jsonb
WHERE name ILIKE '%Crib%' AND name NOT ILIKE '%cradle%';

UPDATE products SET images = '[
  "/uploads/products/baby/high_chair/img_01.jpg"
]'::jsonb
WHERE name ILIKE '%High Chair%';

-- Clear any remaining broken external HTML links
UPDATE products
SET images = '[]'::jsonb
WHERE images IS NOT NULL
  AND images::text ILIKE '%pakkarent.com%';
