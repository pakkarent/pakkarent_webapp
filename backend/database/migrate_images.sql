-- ============================================================
-- PakkaRent: Product Image Migration
-- Maps locally stored images (under /uploads/products/) to
-- products in the database by matching product names.
-- Run this AFTER the main schema + seed has been applied.
-- ============================================================

-- Helper: update images where name matches (ILIKE for safety)

-- ── CAMPING ────────────────────────────────────────────────

-- Camping Tent - Single Layer
UPDATE products SET images = '[
  "/uploads/products/camping/camping_tent-single_layer/img_01.jpg",
  "/uploads/products/camping/camping_tent-single_layer/img_02.png",
  "/uploads/products/camping/camping_tent-single_layer/img_03.png",
  "/uploads/products/camping/camping_tent-single_layer/img_04.png"
]'::jsonb
WHERE name ILIKE '%single%' AND category_id = (SELECT id FROM categories WHERE name ILIKE '%camping%' LIMIT 1);

-- Camping Tent - Double Layer
UPDATE products SET images = '[
  "/uploads/products/camping/camping_tent/img_01.png",
  "/uploads/products/camping/camping_tent/img_02.png",
  "/uploads/products/camping/camping_tent/img_03.png",
  "/uploads/products/camping/camping_tent/img_04.png"
]'::jsonb
WHERE name ILIKE '%double%' AND category_id = (SELECT id FROM categories WHERE name ILIKE '%camping%' LIMIT 1);

-- Sleeping Bags
UPDATE products SET images = '[
  "/uploads/products/camping/sleeping_bag/img_01.jpg",
  "/uploads/products/camping/sleeping_bag/img_02.jpg",
  "/uploads/products/camping/sleeping_bag/img_03.jpg",
  "/uploads/products/camping/sleeping_bag/img_04.png"
]'::jsonb
WHERE name ILIKE '%sleeping%' AND category_id = (SELECT id FROM categories WHERE name ILIKE '%camping%' LIMIT 1);

-- Life Jacket
UPDATE products SET images = '[
  "/uploads/products/camping/life_jacket/img_01.jpg",
  "/uploads/products/camping/life_jacket/img_02.jpg",
  "/uploads/products/camping/life_jacket/img_03.jpg"
]'::jsonb
WHERE name ILIKE '%life jacket%' AND category_id = (SELECT id FROM categories WHERE name ILIKE '%camping%' LIMIT 1);

-- Barbeque (Indoor / Portable)
UPDATE products SET images = '[
  "/uploads/products/camping/barbeque/img_01.png",
  "/uploads/products/camping/barbeque/img_02.png",
  "/uploads/products/camping/barbeque/img_03.jpg"
]'::jsonb
WHERE name ILIKE '%barbeque%' AND name NOT ILIKE '%outdoor%'
  AND category_id = (SELECT id FROM categories WHERE name ILIKE '%camping%' LIMIT 1);

-- Outdoor Barbeque / BBQ
UPDATE products SET images = '[
  "/uploads/products/camping/OutdoorBarbeque/img_01.jpg",
  "/uploads/products/camping/OutdoorBarbeque/img_02.png",
  "/uploads/products/camping/OutdoorBarbeque/img_03.jpg"
]'::jsonb
WHERE name ILIKE '%outdoor%barbeque%' OR name ILIKE '%outdoor%bbq%'
  AND category_id = (SELECT id FROM categories WHERE name ILIKE '%camping%' LIMIT 1);

-- ── HOME APPLIANCES ────────────────────────────────────────

-- Washing Machine
UPDATE products SET images = '[
  "/uploads/products/home_appliances/washing_machine/img_01.png"
]'::jsonb
WHERE name ILIKE '%washing machine%'
  AND category_id = (SELECT id FROM categories WHERE name ILIKE '%appliance%' LIMIT 1);

-- Fridge / Refrigerator
UPDATE products SET images = '[
  "/uploads/products/home_appliances/fridge/img_01.png"
]'::jsonb
WHERE (name ILIKE '%fridge%' OR name ILIKE '%refrigerator%')
  AND category_id = (SELECT id FROM categories WHERE name ILIKE '%appliance%' LIMIT 1);

-- AC / Air Conditioner
UPDATE products SET images = '[
  "/uploads/products/home_appliances/AC/img_01.png"
]'::jsonb
WHERE name ILIKE '%ac%' OR name ILIKE '%air condition%'
  AND category_id = (SELECT id FROM categories WHERE name ILIKE '%appliance%' LIMIT 1);

-- LED TV / Television
UPDATE products SET images = '[
  "/uploads/products/home_appliances/tv/img_01.png"
]'::jsonb
WHERE (name ILIKE '%tv%' OR name ILIKE '%television%' OR name ILIKE '%led%')
  AND category_id = (SELECT id FROM categories WHERE name ILIKE '%appliance%' LIMIT 1);

-- ── EVENTS ────────────────────────────────────────────────

-- Grand Moon Cradle
UPDATE products SET images = '[
  "/uploads/products/event/Grand_Moon_cradle_Rental/img_01.jpg"
]'::jsonb
WHERE name ILIKE '%grand moon%' OR name ILIKE '%moon cradle%';

-- Crown Cradle / Classic Crown
UPDATE products SET images = '[
  "/uploads/products/event/crown/img_01.jpg",
  "/uploads/products/event/crown/img_02.jpg",
  "/uploads/products/event/crown/img_03.jpg",
  "/uploads/products/event/crown/img_04.jpg",
  "/uploads/products/event/crown/img_05.jpg"
]'::jsonb
WHERE name ILIKE '%crown%' AND (name ILIKE '%cradle%' OR name ILIKE '%crown%');

-- Silver Grand Cradle / Silver Cradle (Chennai)
UPDATE products SET images = '[
  "/uploads/products/event/silver_cradle/img_01.jpg",
  "/uploads/products/event/silver_cradle/img_02.jpg",
  "/uploads/products/event/silver_cradle/img_03.jpg",
  "/uploads/products/event/silver_cradle/img_05.jpg"
]'::jsonb
WHERE (name ILIKE '%silver%' AND name ILIKE '%cradle%') AND city = 'Chennai';

-- Golden Oonjal / Oonjal Golden Swing
UPDATE products SET images = '[
  "/uploads/products/event/golden_oonjal/img_01.png"
]'::jsonb
WHERE name ILIKE '%golden%oonjal%' OR name ILIKE '%golden%swing%' OR name ILIKE '%golden%jhula%';

-- ── BABY PROPS ────────────────────────────────────────────

-- Stroller
UPDATE products SET images = '[
  "/uploads/products/baby/stroller/img_01.png"
]'::jsonb
WHERE name ILIKE '%stroller%';

-- Baby Crib
UPDATE products SET images = '[
  "/uploads/products/baby/baby_crib/img_01.png"
]'::jsonb
WHERE name ILIKE '%crib%';

-- High Chair
UPDATE products SET images = '[
  "/uploads/products/baby/high_chair/img_01.jpg"
]'::jsonb
WHERE name ILIKE '%high chair%';

-- ── VERIFICATION ──────────────────────────────────────────
-- Run this query to confirm images were updated:
-- SELECT id, name, city, images FROM products WHERE jsonb_array_length(images) > 0 ORDER BY id;
