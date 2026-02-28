-- PakkaRent Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
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

-- Categories
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

-- Products
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

-- Orders
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

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed Categories
INSERT INTO categories (name, description, icon, sort_order) VALUES
  ('Appliances', 'Home appliances for rent', '🏠', 1),
  ('Event Rentals', 'Event & celebration items', '🎉', 2),
  ('Kids & Baby', 'Safe items for your little ones', '👶', 3),
  ('Furniture', 'Quality furniture on rent', '🛋️', 4)
ON CONFLICT DO NOTHING;

-- Seed Admin User (password: Admin@123)
INSERT INTO users (name, email, password, phone, city, role) VALUES
  ('PakkaRent Admin', 'admin@pakkarent.com', '$2a$10$baLGHG8Vg3dSeHktE5UJxeYmRoRR.VllPohPzJwPJo6IOXJGCx0eu', '9999999999', 'Chennai', 'admin')
ON CONFLICT DO NOTHING;

-- Seed Sample Products
INSERT INTO products (name, description, category_id, city, monthly_price, price_3month, price_6month, price_12month, security_deposit, images, specs, stock, is_featured) VALUES
  ('Split AC 1.5 Ton', 'Energy efficient 5 star AC perfect for Indian summers. Includes installation.', 1, 'all', 1299, 3599, 6599, 11999, 2000, '["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600"]', '{"Brand":"Generic","Capacity":"1.5 Ton","Star Rating":"5 Star","Type":"Split"}', 20, true),
  ('Washing Machine 7kg', 'Fully automatic front-load washing machine with multiple wash programs.', 1, 'all', 899, 2499, 4799, 8999, 1500, '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"]', '{"Capacity":"7 kg","Type":"Front Load","Programs":"15"}', 15, true),
  ('Double Door Refrigerator', '300L double door frost-free refrigerator. Energy efficient.', 1, 'all', 999, 2799, 5399, 9999, 2000, '["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600"]', '{"Capacity":"300L","Type":"Double Door","Frost Free":"Yes"}', 10, true),
  ('Baby Cradle (Jhula)', 'Traditional wooden cradle with soft mattress. Safe for newborns to 6 months.', 2, 'all', 299, 799, 1499, 2599, 500, '["https://images.unsplash.com/photo-1620912189865-1e8a33da7c71?w=600"]', '{"Material":"Wood","Age":"0-6 months","Weight Limit":"10 kg"}', 25, true),
  ('Party Backdrop Stand', 'Adjustable backdrop stand for events. Height upto 8 feet. Background not included.', 2, 'Chennai', 199, 499, 899, 1599, 300, '["https://images.unsplash.com/photo-1519741497674-611481863552?w=600"]', '{"Height":"8 feet","Material":"Aluminium","Setup":"Easy"}', 30, false),
  ('Baby Stroller', 'Lightweight foldable stroller with sun canopy. Suitable for 0-3 years.', 3, 'all', 499, 1399, 2699, 4999, 800, '["https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600"]', '{"Age":"0-3 years","Weight Limit":"15 kg","Foldable":"Yes"}', 20, true),
  ('Infant Car Seat', 'ISOFIX compatible car seat. Rear-facing for infants 0-13 kg.', 3, 'all', 599, 1699, 3199, 5999, 1000, '["https://images.unsplash.com/photo-1586816879360-2a40dfc0b7fb?w=600"]', '{"Weight":"0-13 kg","ISOFIX":"Yes","Direction":"Rear-facing"}', 15, true),
  ('High Chair', 'Adjustable height feeding chair with removable tray. Easy to clean.', 3, 'all', 349, 949, 1799, 3299, 600, '["https://images.unsplash.com/photo-1553267751-1c148a7280a1?w=600"]', '{"Age":"6 months - 3 years","Adjustable":"Yes","Washable":"Yes"}', 20, false),
  ('Microwave Oven 25L', 'Convection microwave with grill function. Perfect for small families.', 1, 'all', 499, 1399, 2699, 4999, 800, '["https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600"]', '{"Capacity":"25L","Type":"Convection","Wattage":"900W"}', 18, false),
  ('Play Yard / Baby Gate', 'Safety play yard with 6 panels. Creates a safe play zone for toddlers.', 3, 'Bangalore', 399, 1099, 2099, 3799, 700, '["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600"]', '{"Panels":"6","Material":"Non-toxic plastic","Age":"6m - 2yr"}', 12, false)
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_products_city ON products(city);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
