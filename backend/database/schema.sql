-- PakkaRent Database Schema
-- Updated to exactly match pakkarent.com products, pricing and cities
-- Cities: Chennai, Bangalore, Hyderabad
-- Scraped: March 2026

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  city VARCHAR(50) DEFAULT 'Chennai',
  address JSONB,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user','admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  image VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pricing columns for products:
--   Camping / Event items  → monthly_price = per-day or per-event rate; price_3/6/12month = NULL
--   Home Appliances        → monthly_price = 0-3 month per-month rate (most expensive / short-term)
--                            price_3month   = 3-6 month per-month rate
--                            price_6month   = 6+ month per-month rate (cheapest / long-term)
--                            price_12month  = 12+ month per-month rate
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  city VARCHAR(50) DEFAULT 'all',
  monthly_price DECIMAL(10,2) NOT NULL,
  price_3month DECIMAL(10,2),
  price_6month DECIMAL(10,2),
  price_12month DECIMAL(10,2),
  security_deposit DECIMAL(10,2) DEFAULT 0,
  images JSONB DEFAULT '[]',
  specs JSONB DEFAULT '{}',
  stock INTEGER DEFAULT 10,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','delivered','active','completed','cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  security_deposit DECIMAL(10,2) DEFAULT 0,
  delivery_address JSONB,
  tenure_months INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_products_city ON products(city);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ==========================================
-- SEED DATA
-- Re-seeds categories and products from pakkarent.com
-- ==========================================

-- Clear existing seed data and restart IDs for clean re-seed
TRUNCATE TABLE order_items RESTART IDENTITY CASCADE;
TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

-- ==========================================
-- SEED: ADMIN USER (password: Admin@123)
-- ==========================================
INSERT INTO users (name, email, password, phone, city, role) VALUES
  ('PakkaRent Admin', 'admin@pakkarent.com', '$2a$10$baLGHG8Vg3dSeHktE5UJxeYmRoRR.VllPohPzJwPJo6IOXJGCx0eu', '9403890901', 'Chennai', 'admin')
ON CONFLICT DO NOTHING;

-- ==========================================
-- SEED: CATEGORIES  (id 1-8, matches nav order on pakkarent.com)
-- ==========================================
INSERT INTO categories (name, description, icon, sort_order) VALUES
  ('Camping Rental',         'Camping tents, sleeping bags, barbeque, life jackets and outdoor gear', '⛺', 1),
  ('Home Appliances Rental', 'Washing machines, fridges, AC and LED TV on monthly rent',              '🏠', 2),
  ('Event Rental',           'Cradles, oonjal swings, chairs, sofa, urli and more for functions',    '🎉', 3),
  ('Backdrop Rental',        'Beautiful backdrops and decoration setups for all events',              '🖼️', 4),
  ('Birthday Rental',        'Cake stands, combos, baby car and props for birthday parties',          '🎂', 5),
  ('Baby Props Rental',      'Baby car seats, strollers, cribs, high chairs and kids cars',          '👶', 6),
  ('Kids Toys on Rent',      'Kids slides, swings, remote cars and jeeps on rent',                   '🧸', 7),
  ('Games Rental',           'Tug of war rope, moonwalk and team building games for events',         '🎯', 8);

-- ==========================================
-- SEED: PRODUCTS
-- ==========================================

INSERT INTO products
  (name, description, category_id, city, monthly_price, price_3month, price_6month, price_12month,
   security_deposit, images, specs, stock, is_featured)
VALUES

-- ============================================================
-- CATEGORY 1: CAMPING RENTAL — Chennai only, priced per day
-- ============================================================

(
  'Camping Tents - Double Layer',
  'Double layer waterproof camping tent. High quality, extremely light weight. Comfortable for 3-5 persons with leisure space and room for rucksacks. Available for rent in Chennai.',
  1, 'Chennai', 600, NULL, NULL, NULL, 1500,
  '["https://pakkarent.com/products/camping/camping_tent.html"]',
  '{"pricing_type":"per_day","price_range":"600-700","layers":"Double layer","capacity":"3-5 persons","features":["Waterproof","Lightweight","Single or double layer available"]}',
  10, true
),
(
  'Sleeping Bags',
  'Adult sleeping bag for camping in cold temperatures. Can be used as single person bag or spread as a bed. Saves luggage space during travel.',
  1, 'Chennai', 200, NULL, NULL, NULL, 500,
  '["https://pakkarent.com/products/camping/sleeping_bag.html"]',
  '{"pricing_type":"per_day","price_range":"200-300","type":"Adult sleeping bag","features":["Cold weather rated","Single or spread use","Space saving"]}',
  20, true
),
(
  'Barbeque Grill',
  'Compact coal-based barbeque grill. Comes with 1 kg free coal and skewers. Quick to assemble with unique air damper. Portable and easy to carry for camping or trekking.',
  1, 'Chennai', 800, NULL, NULL, NULL, 1000,
  '["https://pakkarent.com/products/camping/barbeque.html"]',
  '{"pricing_type":"per_day","price":800,"includes":"1 kg coal and skewers","extra_coal_per_kg":50,"features":["Coal based cooking","Quick assembly","Unique air damper","Portable"]}',
  12, true
),
(
  'Outdoor Barbeque',
  'Large outdoor barbeque grill. Comes with 2 kg free coal and skewers. Quick to assemble with unique air damper. Perfect for parties and large gatherings.',
  1, 'Chennai', 1200, NULL, NULL, NULL, 2000,
  '["https://pakkarent.com/products/camping/OutdoorBarbeque.html"]',
  '{"pricing_type":"per_day","price":1200,"includes":"2 kg coal and skewers","extra_coal_per_kg":50,"features":["Coal based cooking","Quick assembly","Unique air damper","Outdoor use"]}',
  8, false
),
(
  'Life Jackets',
  'Adult life jackets for water activities. Can handle weight over 80 kg. Comes with a whistle. Safe and fun for kayaking, rafting or any water-based adventure.',
  1, 'Chennai', 300, NULL, NULL, NULL, 500,
  '["https://pakkarent.com/products/camping/life_jacket.html"]',
  '{"pricing_type":"per_day","price":300,"type":"Adult life jacket","max_weight_kg":"80+","features":["Whistle included","Safety certified","Water adventures"]}',
  15, false
),
(
  'Party Speaker',
  'Zook brand trolley-type party speaker. Comes with one wireless microphone. Suitable for karaoke singing, corporate events and family parties.',
  1, 'Chennai', 1200, NULL, NULL, NULL, 2000,
  '["https://pakkarent.com/products/camping/party_speaker.html"]',
  '{"pricing_type":"per_day","price_1_day":1200,"price_2_3_days":800,"brand":"Zook","type":"Trolley speaker","includes":"1 wireless mic","features":["Karaoke ready","Corporate events","Family parties"]}',
  5, false
),
(
  'Camping Stove',
  'Portable gas stove for camping and outdoor cooking. Ideal for trekking trips and camping adventures.',
  1, 'Chennai', 800, NULL, NULL, NULL, 500,
  '[]',
  '{"pricing_type":"per_day","price":800,"type":"Portable gas stove","features":["Compact","Outdoor cooking","Trekking use"]}',
  8, false
),
(
  'Dress Changing Tent',
  'Portable privacy tent for outdoor dress changing. Lightweight and easy to set up for camping, trekking and outdoor events.',
  1, 'Chennai', 500, NULL, NULL, NULL, 500,
  '[]',
  '{"pricing_type":"per_day","price":500,"type":"Privacy tent","features":["Privacy","Portable","Easy setup","Outdoor use"]}',
  6, false
),
(
  'Cooler Box',
  'High-insulation cooler box to keep food and drinks cold. Keeps ice cool for longer. Ideal for picnics, outdoors and adventure trips.',
  1, 'Chennai', 400, NULL, NULL, NULL, 500,
  '["https://pakkarent.com/products/camping/cooler_box.html"]',
  '{"pricing_type":"per_day","price_range":"400-500","features":["High insulation","Keeps ice longer","Picnic and outdoor use"]}',
  10, false
),

-- ============================================================
-- CATEGORY 2: HOME APPLIANCES RENTAL — Chennai only, per month
--   monthly_price  = 0-3 month rate (short-term, most expensive)
--   price_3month   = 3-6 month rate per month
--   price_6month   = 6+ month rate per month (cheapest)
--   price_12month  = 12+ month rate per month
-- ============================================================

(
  'Washing Machine',
  'Top load fully automatic washing machine (6.2 KG & 6.5 KG). Maintenance free. One-time transportation charges applicable. Cashless transaction and door delivery.',
  2, 'Chennai', 2500, 1500, 900, 800, 2000,
  '["https://pakkarent.com/products/home_appliances/washing_machine.html"]',
  '{"pricing_type":"per_month","rate_0_3_months":2500,"rate_3_6_months":1500,"rate_6_plus_months":"800-900","type":"Top load fully automatic","capacity_kg":"6.2 and 6.5","features":["Maintenance free","Door delivery","Cashless transaction","One-time transport charges"]}',
  15, true
),
(
  'Fridge',
  'Best star-rated refrigerator. Spacious with different cooling options. Maintenance free. Advance and transportation applicable.',
  2, 'Chennai', 2500, 1500, 800, 700, 2000,
  '["https://pakkarent.com/products/home_appliances/fridge.html"]',
  '{"pricing_type":"per_month","rate_0_3_months":2500,"rate_3_6_months":1500,"rate_6_plus_months":"700-800","features":["Best star rated","Multiple cooling options","Maintenance free","Transportation applicable"]}',
  10, true
),
(
  'Air Conditioner',
  'Branded AC with best cooling effect. Completely maintenance free. Installation charges applicable.',
  2, 'Chennai', 4000, 3000, 1800, 1600, 3000,
  '["https://pakkarent.com/products/home_appliances/ac.html"]',
  '{"pricing_type":"per_month","rate_0_3_months":4000,"rate_3_6_months":3000,"rate_6_plus_months":1800,"features":["Branded AC","Best cooling","Maintenance free","Installation charges applicable"]}',
  10, true
),
(
  'LED TV',
  'Branded LED TV with best viewing experience. Only branded TVs provided. Maintenance free. Advance and transportation applicable.',
  2, 'Chennai', 2500, 1500, 900, 800, 2000,
  '["https://pakkarent.com/products/home_appliances/tv.html"]',
  '{"pricing_type":"per_month","rate_0_3_months":2500,"rate_3_6_months":1500,"rate_6_plus_months":"800-900","features":["Branded TV","Best viewing experience","Maintenance free","Transportation applicable"]}',
  10, true
),

-- ============================================================
-- CATEGORY 3: EVENT RENTAL — Chennai, priced per event
-- ============================================================

-- Silver Cradles
(
  'Silver Grand Cradle',
  'Pure German Silver cradle for naming ceremony. 4 Ft Height × 3.5 Ft Length. Designed by experts. Free transportation up to 10 km from Velachery. Spacious for the baby.',
  3, 'Chennai', 7000, NULL, NULL, NULL, 7000,
  '["https://pakkarent.com/products/event/Silver_cradle.html"]',
  '{"pricing_type":"per_event","material":"Pure German Silver","dimensions":"4 Ft Height x 3.5 Ft Length","transport":"Free upto 10 km from Velachery","occasions":["Naming ceremony","Baby shower"],"features":["Expert design","Spacious for baby"]}',
  2, true
),
(
  'Silver Peacock Cradle',
  'Elegant peacock-motif silver cradle for naming ceremony. Beautiful peacock design in pure silver. Includes free transport within 10 km from Velachery.',
  3, 'Chennai', 7000, NULL, NULL, NULL, 7000,
  '["https://pakkarent.com/store/event/"]',
  '{"pricing_type":"per_event","material":"Silver","design":"Peacock motif","transport":"Free upto 10 km from Velachery","occasions":["Naming ceremony","Baby shower"],"features":["Peacock design","Premium silver"]}',
  2, true
),
(
  'Grand Moon Cradle',
  'Grand moon cradle for naming ceremony. Total Height 7.5 Ft, Length 6 Ft, swing base diameter 2.5 Ft. Designed by experts for naming ceremony. Spacious for the baby. Available as combo with backdrop at ₹9500.',
  3, 'Chennai', 6500, NULL, NULL, NULL, 6500,
  '["https://pakkarent.com/products/event/Grand_Moon_cradle_Rental.html"]',
  '{"pricing_type":"per_event","dimensions":"7.5 Ft Height x 6 Ft Length x 2.5 Ft base diameter","transport":"Free upto 10 km from Velachery","combo_with_backdrop_price":9500,"occasions":["Naming ceremony","Baby shower"],"features":["Expert design","Grand size","Spacious for baby"]}',
  3, true
),
(
  'Traditional Teak Cradle',
  'Traditional teak wood cradle for baby naming and cradle ceremonies. Classic handcrafted design for traditional functions.',
  3, 'Chennai', 3800, NULL, NULL, NULL, 3800,
  '["https://pakkarent.com/products/event/cradle.html"]',
  '{"pricing_type":"per_event","material":"Teak wood","style":"Traditional","occasions":["Naming ceremony","Cradle ceremony"],"features":["Handcrafted","Traditional design"]}',
  4, false
),
(
  'Crown Baby Cradle',
  'Classic crown-style baby cradle for naming ceremony and traditional functions. Elegant crown design.',
  3, 'Chennai', 3500, NULL, NULL, NULL, 3500,
  '["https://pakkarent.com/products/event/crown.html"]',
  '{"pricing_type":"per_event","style":"Crown design","occasions":["Naming ceremony","Traditional functions"],"features":["Crown motif","Elegant design"]}',
  4, false
),
(
  'Royal Chain Cradle',
  'Royal chain-suspension cradle for premium naming ceremony setups. Premium design with royal chain suspension.',
  3, 'Chennai', 3500, NULL, NULL, NULL, 3500,
  '["https://pakkarent.com/products/event/cradle.html"]',
  '{"pricing_type":"per_event","style":"Royal chain","occasions":["Naming ceremony"],"features":["Chain suspension","Premium design"]}',
  3, false
),
(
  'Golden Baby Cradle',
  'Gold-themed cradle for baby naming ceremonies and photo shoots. Elegant golden design that adds a royal touch.',
  3, 'Chennai', 3200, NULL, NULL, NULL, 3200,
  '["https://pakkarent.com/products/event/Golden_Babycradle_Rent.html"]',
  '{"pricing_type":"per_event","style":"Golden","occasions":["Naming ceremony","Photo shoots"],"features":["Golden finish","Royal touch"]}',
  3, false
),
(
  'Cultural Cradle',
  'Cultural-design cradle for traditional naming ceremonies. Reflects the richness of traditional culture and craftsmanship.',
  3, 'Chennai', 3000, NULL, NULL, NULL, 3000,
  '[]',
  '{"pricing_type":"per_event","style":"Cultural","occasions":["Naming ceremony","Traditional events"],"features":["Cultural design","Handcrafted"]}',
  4, false
),
(
  'Classic Teak Cradle',
  'Classic teak wood cradle for traditional events and naming ceremonies. Timeless design crafted from quality teak wood.',
  3, 'Chennai', 3000, NULL, NULL, NULL, 3000,
  '[]',
  '{"pricing_type":"per_event","material":"Teak wood","style":"Classic","occasions":["Naming ceremony","Traditional events"],"features":["Teak wood","Classic design"]}',
  4, false
),

-- Oonjal / Swings — Chennai
(
  'Ivory Oonjal / Royal Swing',
  'Ivory royal swing for weddings, baby showers and receptions. Dimensions: 6.5 Ft Height × 5 Ft Length × 4 Ft Breadth. 10 km free delivery from Velachery.',
  3, 'Chennai', 5000, NULL, NULL, NULL, 5000,
  '["https://pakkarent.com/products/event/royal_swing.html"]',
  '{"pricing_type":"per_event","dimensions":"6.5 Ft Height x 5 Ft Length x 4 Ft Breadth","transport":"Free upto 10 km from Velachery","occasions":["Wedding","Baby shower","Reception","Engagement"],"features":["Royal ivory design","Center of attraction","No decorations included"]}',
  2, true
),
(
  'Golden Oonjal / Jhula',
  'Golden oonjal / jhula for baby showers, weddings and naming ceremonies. Premium golden swing with royal finish.',
  3, 'Chennai', 5200, NULL, NULL, NULL, 5200,
  '["https://pakkarent.com/products/event/golden_oonjal.html"]',
  '{"pricing_type":"per_event","style":"Golden","occasions":["Wedding","Baby shower","Naming ceremony","Reception"],"features":["Golden finish","Premium design"]}',
  2, true
),

-- Other event items — Chennai
(
  'Lotus Urli',
  'Beautiful lotus-shaped urli for haldi ceremonies, baby showers and traditional events. Perfect for flower arrangements and water decor.',
  3, 'Chennai', 2000, NULL, NULL, NULL, 2000,
  '[]',
  '{"pricing_type":"per_event","type":"Lotus urli","occasions":["Haldi","Baby shower","Traditional events"],"features":["Lotus design","Flower arrangements","Water decor"]}',
  5, false
),
(
  'Rolu Rokali / Ural for Wedding',
  'Traditional rolu rokali / ural for wedding and traditional ceremonies. Authentic traditional item essential for many South Indian functions.',
  3, 'Chennai', 2000, NULL, NULL, NULL, 2000,
  '[]',
  '{"pricing_type":"per_event","occasions":["Wedding","Traditional ceremonies","Haldi"],"features":["Traditional","Authentic","South Indian ceremonies"]}',
  4, false
),
(
  'Royal Golden Sofa',
  'Royal golden sofa for weddings and special events. Premium royal seating for the couple or guests of honour.',
  3, 'Chennai', 2500, NULL, NULL, NULL, 2500,
  '[]',
  '{"pricing_type":"per_event","type":"Sofa","style":"Royal golden","occasions":["Wedding","Special events"],"features":["Premium seating","Royal look"]}',
  2, false
),
(
  'Armless Chairs',
  'Premium cream-coloured armless chairs for functions. Available for haldi, puberty and wedding functions. Sturdy and premium feel. Hassle-free transportation and delivery.',
  3, 'Chennai', 500, NULL, NULL, NULL, 0,
  '["https://pakkarent.com/products/event/Chair_rent.html"]',
  '{"pricing_type":"per_event","price_10_chairs":500,"price_20_chairs":800,"colour":"Cream","occasions":["Haldi","Puberty","Wedding"],"features":["Premium feel","Sturdy","Armless design","Transport included"]}',
  200, false
),
(
  'Royal Teak Wood Chair',
  'Premium royal teak wood chair for functions and events. Classic teak wood craftsmanship for a royal look and premium seating experience.',
  3, 'Chennai', 1500, NULL, NULL, NULL, 1500,
  '[]',
  '{"pricing_type":"per_event","material":"Teak wood","style":"Royal","features":["Premium craftsmanship","Royal look","Premium seating"]}',
  5, false
),
(
  'Wooden Manai Palagai / Puja Manakatti',
  'Wooden manai palagai / puja manakatti for traditional ceremonies. Essential for naming ceremonies, puberty functions and puja rituals.',
  3, 'Chennai', 400, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Wooden plank","occasions":["Naming ceremony","Puberty function","Puja"],"features":["Traditional","Wooden","Authentic"]}',
  10, false
),
(
  'Round Backdrop Stand',
  'Sturdy round backdrop stand for event photography and decoration setups. Easy to assemble and dismantle.',
  3, 'Chennai', 1500, NULL, NULL, NULL, 1500,
  '[]',
  '{"pricing_type":"per_event","type":"Round stand","features":["Photography use","Decoration","Sturdy","Easy assembly"]}',
  6, false
),
(
  'Welcome Board Stand',
  'Clean and elegant welcome board stand for events, functions and celebrations. Great for event signage and branding.',
  3, 'Chennai', 600, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Board stand","features":["Welcome display","Elegant","Event signage"]}',
  8, false
),
(
  'Chalk Board Stand',
  'Versatile chalk board stand for event signage and decoration. Write event details, menus or fun messages.',
  3, 'Chennai', 800, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Chalk board","features":["Event signage","Decoration","Versatile","Rewritable"]}',
  6, false
),
(
  'LED Lights',
  'Decorative LED lights for event decoration and ambience. Perfect for all types of celebrations and functions.',
  3, 'Chennai', 300, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"LED lights","features":["Decorative","Ambient lighting","All events"]}',
  20, false
),
(
  'Electric Balloon Blower',
  'Electric balloon blower for parties and events. Fast and efficient balloon inflation for all celebrations.',
  3, 'Chennai', 300, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Electric blower","features":["Fast inflation","Parties","Events","Easy to use"]}',
  4, false
),

-- ============================================================
-- CATEGORY 3: EVENT RENTAL — Bangalore, priced per event
-- ============================================================

(
  'Peacock Silver Cradle',
  'Elegant peacock-motif silver cradle for naming ceremony in Bangalore. Beautiful peacock design in pure silver.',
  3, 'Bangalore', 6000, NULL, NULL, NULL, 6000,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","material":"Silver","design":"Peacock motif","occasions":["Naming ceremony","Baby shower"],"features":["Peacock design","Premium silver"]}',
  2, true
),
(
  'Silver Cradle',
  'Pure silver cradle for naming ceremony in Bangalore. Classic silver design for traditional events.',
  3, 'Bangalore', 5500, NULL, NULL, NULL, 5500,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","material":"Silver","occasions":["Naming ceremony","Traditional events"],"features":["Pure silver"]}',
  2, true
),
(
  'Traditional Teak Cradle',
  'Traditional teak wood carved cradle for naming ceremony in Bangalore.',
  3, 'Bangalore', 2500, NULL, NULL, NULL, 2500,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","material":"Teak wood","style":"Traditional","occasions":["Naming ceremony"],"features":["Teak carved","Traditional"]}',
  4, false
),
(
  'Golden Baby Cradle',
  'Golden design baby cradle for naming ceremony in Bangalore.',
  3, 'Bangalore', 2300, NULL, NULL, NULL, 2300,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","style":"Golden","occasions":["Naming ceremony"],"features":["Golden finish"]}',
  3, false
),
(
  'Classic Teak Cradle',
  'Classic teak wood cradle for traditional naming ceremonies in Bangalore.',
  3, 'Bangalore', 2200, NULL, NULL, NULL, 2200,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","material":"Teak wood","style":"Classic","occasions":["Naming ceremony"],"features":["Teak wood","Classic"]}',
  4, false
),
(
  'Royal Chain Cradle',
  'Royal chain-suspension cradle for naming ceremonies in Bangalore.',
  3, 'Bangalore', 2200, NULL, NULL, NULL, 2200,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","style":"Royal chain","occasions":["Naming ceremony"],"features":["Chain suspension","Premium"]}',
  3, false
),
(
  'Royal Chain - Lotus Cradle',
  'Unique royal chain and lotus motif combination cradle for naming ceremonies in Bangalore.',
  3, 'Bangalore', 2000, NULL, NULL, NULL, 2000,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","style":"Royal chain with lotus","occasions":["Naming ceremony"],"features":["Unique design","Chain and lotus motif"]}',
  3, false
),
(
  'Teak Jhula / Swing',
  'Traditional teak wood jhula / swing for weddings and baby showers in Bangalore. Beautifully crafted teak.',
  3, 'Bangalore', 4500, NULL, NULL, NULL, 4500,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","material":"Teak wood","occasions":["Wedding","Baby shower","Reception"],"features":["Teak crafted","Traditional design"]}',
  2, true
),
(
  'Golden Jhula / Swing',
  'Premium golden jhula / swing for weddings and baby showers in Bangalore.',
  3, 'Bangalore', 4500, NULL, NULL, NULL, 4500,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","style":"Golden","occasions":["Wedding","Baby shower"],"features":["Golden finish","Premium"]}',
  2, true
),
(
  'Silver Rolu Rokali',
  'Silver rolu rokali for weddings and traditional ceremonies in Bangalore.',
  3, 'Bangalore', 3000, NULL, NULL, NULL, 3000,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","material":"Silver","occasions":["Wedding","Traditional"],"features":["Authentic silver"]}',
  3, false
),
(
  'Lotus Urli for Haldi',
  'Lotus urli for haldi ceremonies in Bangalore. Beautiful lotus-shaped urli for flower and water decoration.',
  3, 'Bangalore', 2000, NULL, NULL, NULL, 2000,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","type":"Lotus urli","occasions":["Haldi"],"features":["Lotus design","Haldi decor"]}',
  4, false
),
(
  'Gangalam Set for Haldi',
  'Traditional gangalam set for haldi ceremonies in Bangalore. Authentic set for traditional haldi celebrations.',
  3, 'Bangalore', 1500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","occasions":["Haldi"],"features":["Traditional","Authentic set"]}',
  5, false
),
(
  'Round Backdrop Stand',
  'Round backdrop stand for event photography and decoration setups in Bangalore.',
  3, 'Bangalore', 1500, NULL, NULL, NULL, 1500,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","type":"Round stand","features":["Photography","Decoration","Sturdy"]}',
  4, false
),
(
  'Welcome Board Stand',
  'Elegant welcome board stand for events and functions in Bangalore.',
  3, 'Bangalore', 600, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","type":"Board stand","features":["Event signage","Elegant"]}',
  5, false
),

-- ============================================================
-- CATEGORY 3: EVENT RENTAL — Hyderabad, priced per event
-- ============================================================

(
  'Silver Peacock Cradle',
  'Silver peacock-motif cradle for naming ceremony (Naamakaran) in Hyderabad. Elegant peacock design in premium silver.',
  3, 'Hyderabad', 6500, NULL, NULL, NULL, 6500,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","material":"Silver","design":"Peacock motif","occasions":["Naming ceremony","Naamakaran"],"features":["Peacock design","Premium silver"]}',
  2, true
),
(
  'Silver Cradle',
  'Pure silver cradle for naming ceremony (Naamakaran) in Hyderabad. Classic silver design.',
  3, 'Hyderabad', 5500, NULL, NULL, NULL, 5500,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","material":"Silver","occasions":["Naming ceremony","Naamakaran"],"features":["Pure silver"]}',
  2, true
),
(
  'Golden Baby Cradle',
  'Golden baby cradle for naming ceremony in Hyderabad.',
  3, 'Hyderabad', 2500, NULL, NULL, NULL, 2500,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","style":"Golden","occasions":["Naming ceremony","Naamakaran"],"features":["Golden finish"]}',
  3, false
),
(
  'Traditional Teak Cradle',
  'Traditional teak wood cradle (Uyyala) for naming ceremony in Hyderabad. Classic South Indian teak craftsmanship.',
  3, 'Hyderabad', 2500, NULL, NULL, NULL, 2500,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","material":"Teak wood","local_name":"Uyyala","style":"Traditional","occasions":["Naming ceremony","Naamakaran"],"features":["Teak crafted","Traditional"]}',
  4, false
),
(
  'Royal Chain Cradle',
  'Royal chain cradle for naming ceremony in Hyderabad.',
  3, 'Hyderabad', 2500, NULL, NULL, NULL, 2500,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","style":"Royal chain","occasions":["Naming ceremony"],"features":["Chain suspension"]}',
  3, false
),
(
  'Compact Cradle',
  'Compact cradle for naming ceremony in Hyderabad. Ideal for smaller venues and spaces.',
  3, 'Hyderabad', 2000, NULL, NULL, NULL, 2000,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","style":"Compact","occasions":["Naming ceremony"],"features":["Space efficient","Compact design"]}',
  4, false
),
(
  'Teak Wood Oonjal / Swing / Jhula',
  'Teak wood swing / oonjal / jhula for weddings and baby showers in Hyderabad. Beautifully carved royal teak wood.',
  3, 'Hyderabad', 4500, NULL, NULL, NULL, 4500,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","material":"Teak wood","local_name":"Uyyala","occasions":["Wedding","Baby shower","Seemandam"],"features":["Teak carved","Royal look"]}',
  2, true
),
(
  'Silver Rolu Rokali',
  'Silver rolu rokali for wedding ceremonies in Hyderabad.',
  3, 'Hyderabad', 3000, NULL, NULL, NULL, 3000,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","material":"Silver","occasions":["Wedding","Traditional"],"features":["Authentic silver"]}',
  3, false
),
(
  'Lotus Urli for Haldi',
  'Lotus urli for haldi / mangala snanam ceremonies in Hyderabad.',
  3, 'Hyderabad', 2000, NULL, NULL, NULL, 2000,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","type":"Lotus urli","occasions":["Haldi","Mangala Snanam"],"features":["Lotus design"]}',
  4, false
),
(
  'Gangalam / Mangala Snanam Set',
  'Traditional gangalam / mangala snanam set for ceremonies in Hyderabad. Authentic set for traditional celebrations.',
  3, 'Hyderabad', 1500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","occasions":["Mangala Snanam","Traditional"],"features":["Traditional","Authentic"]}',
  5, false
),
(
  'Cylindrical Cake Table',
  'Cylindrical cake table for birthday celebrations in Hyderabad. Elegant cylindrical design for cake displays.',
  3, 'Hyderabad', 900, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","type":"Cylindrical table","occasions":["Birthday"],"features":["Modern design","Elegant display"]}',
  5, false
),
(
  'Round Backdrop Stand',
  'Round backdrop stand for event photography and decoration in Hyderabad.',
  3, 'Hyderabad', 1500, NULL, NULL, NULL, 1500,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","type":"Round stand","features":["Photography","Decoration","Sturdy"]}',
  4, false
),

-- ============================================================
-- CATEGORY 4: BACKDROP RENTAL — Chennai, priced per event
-- ============================================================

(
  'Pink Rani Backdrop',
  'Stunning pink rani backdrop for baby showers, naming ceremonies and birthday parties.',
  4, 'Chennai', 8500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","colour":"Pink Rani","occasions":["Baby shower","Naming ceremony","Birthday"]}',
  3, true
),
(
  'Birthday Flowerwall Backdrop',
  'Premium flowerwall backdrop for birthday parties and celebrations. Lush floral wall design.',
  4, 'Chennai', 8000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Flowerwall","occasions":["Birthday","Celebrations"],"features":["Lush floral wall","Premium"]}',
  3, true
),
(
  'Traditional Lotus Backdrop',
  'Traditional lotus-themed backdrop for naming ceremonies, baby showers and traditional functions.',
  4, 'Chennai', 7000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Traditional lotus","occasions":["Naming ceremony","Baby shower","Traditional"],"features":["Lotus motif","Traditional style"]}',
  3, false
),
(
  'Crown Cradle Ring Decoration',
  'Exquisite crown cradle ring decoration setup for naming ceremonies. Complete premium decoration package.',
  4, 'Chennai', 7000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Crown ring setup","occasions":["Naming ceremony"],"features":["Complete setup","Crown ring design","Premium"]}',
  2, true
),
(
  'Yellow Lily Blossom Backdrop Setup',
  'Beautiful yellow lily blossom decoration setup for haldi and naming ceremonies.',
  4, 'Chennai', 7000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Lily blossom setup","colour":"Yellow","occasions":["Haldi","Naming ceremony"],"features":["Full setup","Lily blossom theme"]}',
  3, false
),
(
  'Theme Decoration Setup',
  'Custom themed decoration setup for all events. Multiple themes available. Contact for details and customisation.',
  4, 'Chennai', 7000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Themed decoration","occasions":["All events"],"features":["Multiple themes","Customisable","Complete setup"]}',
  3, false
),
(
  'Banana Leaf Backdrop',
  'Traditional banana leaf backdrop for baby showers, naming ceremonies and haldi events.',
  4, 'Chennai', 6500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Banana leaf","occasions":["Baby shower","Naming ceremony","Haldi"],"features":["Traditional style","Natural look"]}',
  3, false
),
(
  'Dreamy Ring Birthday Backdrop',
  'Dreamy ring backdrop for birthday parties and baby showers. Whimsical ring design.',
  4, 'Chennai', 6000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Ring backdrop","occasions":["Birthday","Baby shower"],"features":["Ring design","Dreamy style"]}',
  3, false
),
(
  'Traditional Grass Backdrop',
  'Traditional grass backdrop for haldi and outdoor-themed events. Natural grass aesthetic.',
  4, 'Chennai', 5500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Grass backdrop","occasions":["Haldi","Traditional events"],"features":["Natural grass look","Traditional"]}',
  3, false
),
(
  'Charming Peach Backdrop',
  'Charming peach-coloured backdrop for baby showers, engagements and birthday parties.',
  4, 'Chennai', 5500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","colour":"Peach","occasions":["Baby shower","Engagement","Birthday"],"features":["Soft peach tones","Charming"]}',
  3, false
),
(
  'Haldi Grass Backdrop',
  'Beautiful grass backdrop perfect for haldi ceremonies and outdoor-themed events.',
  4, 'Chennai', 5000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Grass backdrop","occasions":["Haldi","Outdoor events"],"features":["Natural grass","Haldi theme"]}',
  4, false
),
(
  'Garland Grass Backdrop',
  'Garland and grass backdrop for naming ceremonies, baby showers and traditional events.',
  4, 'Chennai', 5000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Garland grass","occasions":["Naming ceremony","Baby shower","Traditional"],"features":["Garland and grass","Traditional style"]}',
  3, false
),
(
  'Heritage Grass Backdrop',
  'Heritage-style grass backdrop for traditional and cultural events.',
  4, 'Chennai', 5000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Heritage grass","occasions":["Traditional","Cultural events"],"features":["Heritage style","Natural look"]}',
  3, false
),
(
  'Flower Wall Backdrop',
  'Elegant flowerwall backdrop for weddings, engagements and birthday parties.',
  4, 'Chennai', 4500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Flowerwall","occasions":["Wedding","Engagement","Birthday"],"features":["Floral wall","Elegant"]}',
  3, false
),
(
  'Tulip Grass Backdrop',
  'Tulip and grass backdrop for baby showers and traditional events. Fresh and vibrant tulip theme.',
  4, 'Chennai', 4500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Tulip grass","occasions":["Baby shower","Traditional events"],"features":["Tulip theme","Fresh look"]}',
  3, false
),
(
  'Baby Blue Backdrop',
  'Baby blue backdrop for baby showers and naming ceremonies. Soft blue tones for a serene, calming atmosphere.',
  4, 'Chennai', 4000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","colour":"Baby blue","occasions":["Baby shower","Naming ceremony"],"features":["Soft blue tones","Serene atmosphere"]}',
  3, false
),
(
  'Royal Gold Backdrop',
  'Royal gold backdrop for weddings, receptions and premium events.',
  4, 'Chennai', 3500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","colour":"Royal gold","occasions":["Wedding","Reception","Premium events"],"features":["Royal gold tones","Premium look"]}',
  3, false
),
(
  'White Floral Backdrop',
  'Elegant white floral backdrop for engagements, baby showers and naming ceremonies.',
  4, 'Chennai', 3000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","colour":"White","type":"Floral","occasions":["Engagement","Baby shower","Naming ceremony"],"features":["White floral","Elegant"]}',
  4, false
),
(
  'White Swan Backdrop',
  'White swan-themed backdrop for baby showers and naming ceremonies. Graceful swan motif.',
  4, 'Chennai', 3000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","theme":"Swan","colour":"White","occasions":["Baby shower","Naming ceremony"],"features":["Swan motif","Graceful design"]}',
  3, false
),
(
  'Elegant Greenish Backdrop',
  'Elegant greenish backdrop for baby showers and traditional events. Fresh and natural green tones.',
  4, 'Chennai', 3000, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","colour":"Green","occasions":["Baby shower","Traditional events"],"features":["Fresh green tones","Elegant"]}',
  3, false
),
(
  'Red Carpet',
  'Classic red carpet for events, functions and special occasions. Perfect for grand entrances.',
  4, 'Chennai', 600, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Red carpet","features":["Grand entrance","Premium feel","Classic red"]}',
  5, false
),

-- ============================================================
-- CATEGORY 5: BIRTHDAY RENTAL — Chennai, priced per event
-- ============================================================

(
  'Irish Cake Table Combo',
  'Irish cake table combo set for birthday and celebration events. Combo of 4 unique cake stands: Cake Stand, Cup Cake Stand, Serving Tray and Baroque Tray.',
  5, 'Chennai', 1200, NULL, NULL, NULL, 0,
  '["https://pakkarent.com/products/prop/Cake_Stand_Combo.html"]',
  '{"pricing_type":"per_event","includes":["Cake stand","Cup cake stand","Serving tray","Baroque tray"],"combo_count":4,"occasions":["Birthday","Anniversary","Celebrations"],"features":["Budget friendly","Complete combo"]}',
  5, true
),
(
  'Golden Cake Stand Combo',
  'Premium golden cake stand combo for birthday displays. Combo of 3-6 unique gold cake stands including Cake Stand, Cup Cake Stand, Serving Tray and Baroque Tray.',
  5, 'Chennai', 1200, NULL, NULL, NULL, 0,
  '["https://pakkarent.com/products/prop/Pakka_Cake_Stand_Combo.html"]',
  '{"pricing_type":"per_event","price_range":"1200-1800","includes":["3-6 Gold cake stands","Cup cake stand","Serving tray","Baroque tray"],"occasions":["Birthday","Anniversary"],"features":["Golden finish","Premium combo"]}',
  5, false
),
(
  'Wooden Cake Stands',
  'Elegant wooden cake stand set for birthday events. Natural wood finish for a classic and timeless look.',
  5, 'Chennai', 900, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","material":"Wood","occasions":["Birthday","Celebrations"],"features":["Natural wood finish","Classic look","Elegant"]}',
  6, false
),
(
  'Cylindrical Cake Table',
  'Cylindrical cake table for birthday events. Modern cylindrical design for elegant cake displays.',
  5, 'Chennai', 800, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Cylindrical","occasions":["Birthday"],"features":["Modern cylindrical design","Elegant display"]}',
  6, false
),
(
  'Baby Car for Birthday',
  'Stylish kids / baby car rental for birthday events and baby entries. Simple remote operation with in-car controls. 30-40 mins run time. Transportation cost applicable.',
  5, 'Chennai', 2000, NULL, NULL, NULL, 2000,
  '["https://pakkarent.com/products/baby/Kids_Car_Rental.html"]',
  '{"pricing_type":"per_event","features":["Remote control","In-car controls","30-40 min runtime","Stylish design"],"occasions":["Birthday","Baby naming ceremony"],"note":"Transportation cost applicable"}',
  3, true
),
(
  'Baby Jeep Rental',
  'Fun kids jeep-style car rental for birthday events and celebrations. Remote operated with fun jeep design.',
  5, 'Chennai', 2000, NULL, NULL, NULL, 2000,
  '[]',
  '{"pricing_type":"per_event","type":"Jeep style","features":["Remote control","Fun jeep design"],"occasions":["Birthday","Baby naming ceremony"]}',
  3, false
),

-- ============================================================
-- CATEGORY 6: BABY PROPS RENTAL — Chennai
-- ============================================================

(
  'Baby Car Seat',
  'Safe and comfortable baby car seat for travel and events. Suitable for infants and toddlers.',
  6, 'Chennai', 500, NULL, NULL, NULL, 500,
  '[]',
  '{"pricing_type":"per_day","features":["Safe","Comfortable","Travel use","Infant and toddler"],"occasions":["Travel","Events"]}',
  8, false
),
(
  'Baby Stroller',
  'Comfortable baby stroller for outings and travel. Easy to fold and carry. Smooth ride for babies.',
  6, 'Chennai', 500, NULL, NULL, NULL, 500,
  '[]',
  '{"pricing_type":"per_day","features":["Comfortable","Foldable","Easy to carry","Smooth ride"],"occasions":["Outings","Travel"]}',
  8, false
),
(
  'Baby Crib with Mattress',
  'Complete baby crib with mattress for temporary stays. Safe and comfortable sleeping solution for babies.',
  6, 'Chennai', 800, NULL, NULL, NULL, 1000,
  '[]',
  '{"pricing_type":"per_day","includes":"Mattress","features":["Complete set","Comfortable","Safe sleeping"],"occasions":["Temporary stay","Events"]}',
  5, false
),
(
  'High Chair',
  'Sturdy baby high chair for feeding and sitting. Safe for infants and toddlers with secure harness.',
  6, 'Chennai', 400, NULL, NULL, NULL, 500,
  '[]',
  '{"pricing_type":"per_day","features":["Sturdy","Safe","Secure harness","Feeding use"],"occasions":["Daily use","Events"]}',
  8, false
),

-- ============================================================
-- CATEGORY 7: KIDS TOYS ON RENT — Chennai, priced per event
-- ============================================================

(
  'Kids Car Rental',
  'Stylish remote-controlled kids car rental for birthday parties and events. Simple remote operation with in-car controls. 30-40 mins run time. Transportation cost applicable.',
  7, 'Chennai', 2000, NULL, NULL, NULL, 2000,
  '["https://pakkarent.com/products/baby/Kids_Car_Rental.html"]',
  '{"pricing_type":"per_event","features":["Remote control","In-car controls","30-40 min runtime","Stylish design"],"occasions":["Birthday party","Events"],"note":"Transportation cost applicable"}',
  3, true
),
(
  'Kids Jeep Rental',
  'Fun remote-controlled kids jeep rental for birthday parties and events.',
  7, 'Chennai', 2000, NULL, NULL, NULL, 2000,
  '[]',
  '{"pricing_type":"per_event","type":"Jeep style","features":["Remote control","Fun jeep design"],"occasions":["Birthday party","Events"]}',
  3, false
),
(
  'Kids Slide and Swing Rental',
  'Kids slide and swing combo rental for birthday parties and outdoor events. Hours of active play for kids.',
  7, 'Chennai', 1500, NULL, NULL, NULL, 1000,
  '[]',
  '{"pricing_type":"per_event","type":"Slide and swing combo","occasions":["Birthday","Outdoor events"],"features":["Active play","Fun","Kids entertainment"]}',
  2, false
),

-- ============================================================
-- CATEGORY 8: GAMES RENTAL — Chennai, Bangalore, Hyderabad
-- ============================================================

(
  'Tug of War Rope',
  'Heavy-duty tug of war rope for corporate team building events, sports days, annual day and family functions. Available in Chennai.',
  8, 'Chennai', 500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","city":"Chennai","occasions":["Corporate team building","Sports day","Annual day","Family functions"],"features":["Heavy duty rope","Team building activity"]}',
  5, true
),
(
  'Tug of War Rope',
  'Heavy-duty tug of war rope for corporate team building events, sports days, annual day and family functions. Available in Bangalore.',
  8, 'Bangalore', 500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","city":"Bangalore","occasions":["Corporate team building","Sports day","Annual day","Family functions"],"features":["Heavy duty rope","Team building activity"]}',
  3, false
),
(
  'Tug of War Rope',
  'Heavy-duty tug of war rope for corporate team building events, sports days, annual day and family functions. Available in Hyderabad.',
  8, 'Hyderabad', 500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","city":"Hyderabad","occasions":["Corporate team building","Sports day","Annual day","Family functions"],"features":["Heavy duty rope","Team building activity"]}',
  3, false
),
(
  'Moon Walk Game',
  'Fun inflatable moonwalk game for birthday parties and events. Great entertainment for kids and adults.',
  8, 'Chennai', 1500, NULL, NULL, NULL, 0,
  '[]',
  '{"pricing_type":"per_event","type":"Inflatable moonwalk","occasions":["Birthday","Events","Fun activities"],"features":["Kids and adults","Fun inflatable","Easy to set up"]}',
  2, false
);
