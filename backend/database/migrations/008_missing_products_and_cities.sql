-- Missing products from pakkarent.com + Bangalore/Hyderabad event catalog expansion

-- Helper: Event Rental parent id (stable seed id = 3)
-- Subcategories: Cradle, Swings & Oonjal, Chairs & Furniture, Decor & Urli, Props & Stands

-- ── Chennai: Lantern + Marquee Letters ────────────────────────────────────────
INSERT INTO products
  (name, description, category_id, subcategory_id, city, monthly_price, price_3month, price_6month, price_12month,
   security_deposit, images, specs, stock, is_featured)
SELECT
  'Camping Lantern',
  'Portable camping lantern for outdoor trips, trekking and night camping. Bright and lightweight.',
  1, NULL, 'Chennai', 50, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_day","price_range":"50-75","features":["Portable","Bright","Camping essential"]}'::jsonb,
  20, false
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Camping Lantern' AND p.city = 'Chennai');

INSERT INTO products
  (name, description, category_id, subcategory_id, city, monthly_price, price_3month, price_6month, price_12month,
   security_deposit, images, specs, stock, is_featured)
SELECT
  'Marquee Letters',
  'Light-up marquee letters for birthdays, baby showers and event decor. Spell names, ages or custom words.',
  5, NULL, 'Chennai', 150, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","price_per_letter":150,"features":["LED letters","Birthday decor","Custom words"]}'::jsonb,
  10, false
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Marquee Letters' AND p.city = 'Chennai');

-- ── Bangalore: missing event inventory ──────────────────────────────────────
INSERT INTO products
  (name, description, category_id, subcategory_id, city, monthly_price, price_3month, price_6month, price_12month,
   security_deposit, images, specs, stock, is_featured)
SELECT v.name, v.description, 3, sc.id, 'Bangalore', v.price, NULL, NULL, NULL, v.deposit,
  '[]', v.specs::jsonb, v.stock, v.featured
FROM (VALUES
  ('Classic Teak Cradle', 'Classic teak wood cradle for traditional naming ceremonies in Bangalore.', 2200, 2200,
   '{"pricing_type":"per_event","city":"Bangalore","material":"Teak wood","occasions":["Naming ceremony"]}', 4, false),
  ('Royal Chain Cradle', 'Royal chain-suspension cradle for naming ceremonies in Bangalore.', 2200, 2200,
   '{"pricing_type":"per_event","city":"Bangalore","style":"Royal chain","occasions":["Naming ceremony"]}', 3, false),
  ('Royal Chain - Lotus Cradle', 'Royal chain and lotus motif cradle for naming ceremonies in Bangalore.', 2000, 2000,
   '{"pricing_type":"per_event","city":"Bangalore","style":"Royal chain with lotus","occasions":["Naming ceremony"]}', 3, false),
  ('Golden Jhula / Swing', 'Premium golden jhula / swing for weddings and baby showers in Bangalore.', 4500, 4500,
   '{"pricing_type":"per_event","city":"Bangalore","style":"Golden","occasions":["Wedding","Baby shower"]}', 2, true),
  ('Gangalam Set for Haldi', 'Traditional gangalam set for haldi ceremonies in Bangalore.', 1500, 0,
   '{"pricing_type":"per_event","city":"Bangalore","occasions":["Haldi"]}', 5, false),
  ('Round Backdrop Stand', 'Round backdrop stand for event photography and decoration in Bangalore.', 1500, 1500,
   '{"pricing_type":"per_event","city":"Bangalore","type":"Round stand"}', 4, false),
  ('Welcome Board Stand', 'Elegant welcome board stand for events and functions in Bangalore.', 600, 0,
   '{"pricing_type":"per_event","city":"Bangalore","type":"Board stand"}', 5, false)
) AS v(name, description, price, deposit, specs, stock, featured)
JOIN categories sc ON sc.name = CASE
  WHEN v.name ILIKE '%cradle%' THEN 'Cradle'
  WHEN v.name ILIKE '%jhula%' OR v.name ILIKE '%swing%' THEN 'Swings & Oonjal'
  WHEN v.name ILIKE '%gangalam%' OR v.name ILIKE '%urli%' THEN 'Decor & Urli'
  ELSE 'Props & Stands'
END AND sc.parent_id = 3
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name = v.name AND p.city = 'Bangalore');

-- ── Hyderabad: event catalog ─────────────────────────────────────────────────
INSERT INTO products
  (name, description, category_id, subcategory_id, city, monthly_price, price_3month, price_6month, price_12month,
   security_deposit, images, specs, stock, is_featured)
SELECT v.name, v.description,
  CASE v.cat WHEN 'birthday' THEN 5 WHEN 'games' THEN 8 ELSE 3 END,
  sc.id,
  'Hyderabad', v.price, NULL, NULL, NULL, v.deposit,
  '[]', v.specs::jsonb, v.stock, v.featured
FROM (VALUES
  ('Silver Peacock Cradle', 'Silver peacock-motif cradle for Naamakaran in Hyderabad.', 6500, 6500,
   '{"pricing_type":"per_event","city":"Hyderabad","material":"Silver","occasions":["Naming ceremony","Naamakaran"]}', 2, true, 'cradle'),
  ('Silver Cradle', 'Pure silver cradle for naming ceremony in Hyderabad.', 5500, 5500,
   '{"pricing_type":"per_event","city":"Hyderabad","material":"Silver","occasions":["Naamakaran"]}', 2, true, 'cradle'),
  ('Golden Baby Cradle', 'Golden baby cradle for naming ceremony in Hyderabad.', 2500, 2500,
   '{"pricing_type":"per_event","city":"Hyderabad","style":"Golden","occasions":["Naamakaran"]}', 3, false, 'cradle'),
  ('Traditional Teak Cradle', 'Traditional teak wood Uyyala cradle for naming ceremony in Hyderabad.', 2500, 2500,
   '{"pricing_type":"per_event","city":"Hyderabad","material":"Teak wood","local_name":"Uyyala"}', 4, false, 'cradle'),
  ('Royal Chain Cradle', 'Royal chain cradle for naming ceremony in Hyderabad.', 2500, 2500,
   '{"pricing_type":"per_event","city":"Hyderabad","style":"Royal chain"}', 3, false, 'cradle'),
  ('Compact Cradle', 'Compact cradle for naming ceremony in Hyderabad.', 2000, 2000,
   '{"pricing_type":"per_event","city":"Hyderabad","style":"Compact"}', 4, false, 'cradle'),
  ('Teak Wood Oonjal / Swing / Jhula', 'Teak wood swing for weddings and Seemandam in Hyderabad.', 4500, 4500,
   '{"pricing_type":"per_event","city":"Hyderabad","material":"Teak wood","local_name":"Uyyala"}', 2, true, 'swing'),
  ('Silver Rolu Rokali', 'Silver rolu rokali for wedding ceremonies in Hyderabad.', 3000, 3000,
   '{"pricing_type":"per_event","city":"Hyderabad","material":"Silver"}', 3, false, 'decor'),
  ('Lotus Urli for Haldi', 'Lotus urli for haldi / mangala snanam in Hyderabad.', 2000, 2000,
   '{"pricing_type":"per_event","city":"Hyderabad","type":"Lotus urli","occasions":["Haldi","Mangala Snanam"]}', 4, false, 'decor'),
  ('Gangalam / Mangala Snanam Set', 'Traditional gangalam set for mangala snanam in Hyderabad.', 1500, 0,
   '{"pricing_type":"per_event","city":"Hyderabad","occasions":["Mangala Snanam"]}', 5, false, 'decor'),
  ('Cylindrical Cake Table', 'Cylindrical cake table for birthday celebrations in Hyderabad.', 900, 0,
   '{"pricing_type":"per_event","city":"Hyderabad","type":"Cylindrical table","occasions":["Birthday"]}', 5, false, 'birthday'),
  ('Round Backdrop Stand', 'Round backdrop stand for event photography in Hyderabad.', 1500, 1500,
   '{"pricing_type":"per_event","city":"Hyderabad","type":"Round stand"}', 4, false, 'props'),
  ('Moon Walk Game', 'Inflatable moonwalk for birthday parties and events in Hyderabad.', 500, 0,
   '{"pricing_type":"per_event","city":"Hyderabad","type":"Inflatable moonwalk","occasions":["Birthday","Events"]}', 3, false, 'games')
) AS v(name, description, price, deposit, specs, stock, featured, cat)
LEFT JOIN categories sc ON sc.parent_id = 3 AND sc.name = CASE v.cat
  WHEN 'cradle' THEN 'Cradle'
  WHEN 'swing' THEN 'Swings & Oonjal'
  WHEN 'decor' THEN 'Decor & Urli'
  WHEN 'props' THEN 'Props & Stands'
  ELSE NULL
END
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name = v.name AND p.city = 'Hyderabad');

-- Map subcategories for any new rows still missing subcategory_id
UPDATE products p SET subcategory_id = sc.id
FROM categories sc
WHERE p.category_id = 3 AND p.subcategory_id IS NULL AND sc.parent_id = 3
  AND sc.name = 'Cradle'
  AND (p.name ILIKE '%cradle%');

UPDATE products p SET subcategory_id = sc.id
FROM categories sc
WHERE p.category_id = 3 AND p.subcategory_id IS NULL AND sc.parent_id = 3
  AND sc.name = 'Swings & Oonjal'
  AND (p.name ILIKE '%oonjal%' OR p.name ILIKE '%jhula%' OR p.name ILIKE '%swing%');

UPDATE products p SET subcategory_id = sc.id
FROM categories sc
WHERE p.category_id = 3 AND p.subcategory_id IS NULL AND sc.parent_id = 3
  AND sc.name = 'Decor & Urli'
  AND (p.name ILIKE '%urli%' OR p.name ILIKE '%gangalam%' OR p.name ILIKE '%rokali%');

UPDATE products p SET subcategory_id = sc.id
FROM categories sc
WHERE p.category_id = 3 AND p.subcategory_id IS NULL AND sc.parent_id = 3
  AND sc.name = 'Props & Stands'
  AND (p.name ILIKE '%stand%' OR p.name ILIKE '%board%');
