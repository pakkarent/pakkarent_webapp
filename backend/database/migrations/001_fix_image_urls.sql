-- ============================================================
-- 001_fix_image_urls.sql
-- Replaces seed image URLs that point to pakkarent.com HTML pages
-- with local /uploads/... paths bundled with the frontend build.
-- For products with no matching local asset the images array is
-- cleared so the UI shows a clean placeholder instead of a 404.
-- ============================================================

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
WHERE name ILIKE 'Barbeque Grill%';

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

-- ── EVENTS ─────────────────────────────────────────────────
UPDATE products SET images = '[
  "/uploads/products/event/silver_cradle/img_01.jpg",
  "/uploads/products/event/silver_cradle/img_02.jpg",
  "/uploads/products/event/silver_cradle/img_03.jpg",
  "/uploads/products/event/silver_cradle/img_05.jpg"
]'::jsonb
WHERE name ILIKE 'Silver Grand Cradle%' OR name ILIKE 'Silver Cradle%';

UPDATE products SET images = '[
  "/uploads/products/event/Grand_Moon_cradle_Rental/img_01.jpg"
]'::jsonb
WHERE name ILIKE 'Grand Moon Cradle%';

UPDATE products SET images = '[
  "/uploads/products/event/crown/img_01.jpg",
  "/uploads/products/event/crown/img_02.jpg",
  "/uploads/products/event/crown/img_03.jpg",
  "/uploads/products/event/crown/img_04.jpg",
  "/uploads/products/event/crown/img_05.jpg"
]'::jsonb
WHERE name ILIKE 'Crown Baby Cradle%' OR name ILIKE 'Crown Cradle%';

UPDATE products SET images = '[
  "/uploads/products/event/golden_oonjal/img_01.png"
]'::jsonb
WHERE name ILIKE 'Golden Oonjal%' OR name ILIKE '%Golden%Jhula%' OR name ILIKE '%Golden Swing%';

-- ── BABY PROPS ─────────────────────────────────────────────
UPDATE products SET images = '[
  "/uploads/products/baby/stroller/img_01.png"
]'::jsonb
WHERE name ILIKE '%Stroller%';

UPDATE products SET images = '[
  "/uploads/products/baby/baby_crib/img_01.png"
]'::jsonb
WHERE name ILIKE '%Crib%';

UPDATE products SET images = '[
  "/uploads/products/baby/high_chair/img_01.jpg"
]'::jsonb
WHERE name ILIKE '%High Chair%';

-- ── CLEAR REMAINING BROKEN URLS ────────────────────────────
-- Anything still pointing to pakkarent.com HTML pages or store
-- pages becomes an empty array so the placeholder shows.
UPDATE products
SET images = '[]'::jsonb
WHERE images::text ILIKE '%pakkarent.com%';
