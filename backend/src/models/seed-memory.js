/**
 * Seeds the in-memory pg-mem database with PakkaRent schema + data.
 * Uses pg-mem's synchronous public API (db.public.none / db.public.query).
 */
function seedMemoryDB(db) {
  const run = (sql) => { try { db.public.none(sql); } catch (e) { /* skip */ } };

  // ── Tables ─────────────────────────────────────────────────────────────────

  run(`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    city TEXT DEFAULT 'Chennai',
    address JSONB,
    role TEXT DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  run(`CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  run(`CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    city TEXT DEFAULT 'all',
    monthly_price NUMERIC(10,2) NOT NULL,
    price_3month NUMERIC(10,2),
    price_6month NUMERIC(10,2),
    price_12month NUMERIC(10,2),
    security_deposit NUMERIC(10,2) DEFAULT 0,
    images JSONB DEFAULT '[]',
    specs JSONB DEFAULT '{}',
    stock INTEGER DEFAULT 10,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  run(`CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    status TEXT DEFAULT 'pending',
    total_amount NUMERIC(10,2) NOT NULL,
    security_deposit NUMERIC(10,2) DEFAULT 0,
    delivery_address JSONB,
    tenure_months INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  run(`CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  // ── Admin user (password: Admin@123) ──────────────────────────────────────
  run(`INSERT INTO users (name, email, password, phone, city, role) VALUES
    ('PakkaRent Admin', 'admin@pakkarent.com',
     '$2a$10$baLGHG8Vg3dSeHktE5UJxeYmRoRR.VllPohPzJwPJo6IOXJGCx0eu',
     '9403890901', 'Chennai', 'admin')`);

  // ── Categories ─────────────────────────────────────────────────────────────
  const cats = [
    [1,'Camping Rental','Camping tents, sleeping bags, barbeque, life jackets and outdoor gear','⛺',1],
    [2,'Home Appliances Rental','Washing machines, fridges, AC and LED TV on monthly rent','🏠',2],
    [3,'Event Rental','Cradles, oonjal swings, chairs, sofa, urli and more for functions','🎉',3],
    [4,'Backdrop Rental','Beautiful backdrops and decoration setups for all events','🖼',4],
    [5,'Birthday Rental','Cake stands, combos, baby car and props for birthday parties','🎂',5],
    [6,'Baby Props Rental','Baby car seats, strollers, cribs, high chairs and kids cars','👶',6],
    [7,'Kids Toys on Rent','Kids slides, swings, remote cars and jeeps on rent','🧸',7],
    [8,'Games Rental','Tug of war rope, moonwalk and team building games for events','🎯',8],
  ];
  for (const [id,name,desc,icon,sort] of cats) {
    run(`INSERT INTO categories (id,name,description,icon,sort_order)
         VALUES (${id},'${e(name)}','${e(desc)}','${e(icon)}',${sort})`);
  }

  // ── Products ───────────────────────────────────────────────────────────────
  const P = [
    // Camping
    {c:1,city:'Chennai',n:'Camping Tents - Double Layer',d:'Double layer waterproof camping tent. Comfortable for 3-5 persons with leisure space. Available for rent in Chennai.',p:600,dep:1500,imgs:['/uploads/products/camping/camping_tent/img_01.png','/uploads/products/camping/camping_tent/img_02.png','/uploads/products/camping/camping_tent/img_03.png','/uploads/products/camping/camping_tent/img_04.png'],feat:true},
    {c:1,city:'Chennai',n:'Camping Tents - Single Layer',d:'Lightweight single layer camping tent. Great for trekking and solo/duo camping trips.',p:500,dep:1000,imgs:['/uploads/products/camping/camping_tent-single_layer/img_01.jpg','/uploads/products/camping/camping_tent-single_layer/img_02.png','/uploads/products/camping/camping_tent-single_layer/img_03.png','/uploads/products/camping/camping_tent-single_layer/img_04.png'],feat:false},
    {c:1,city:'Chennai',n:'Sleeping Bags',d:'Adult sleeping bag for camping. Can be used as single person bag or spread as a bed. Saves luggage space during travel.',p:200,dep:500,imgs:['/uploads/products/camping/sleeping_bag/img_01.jpg','/uploads/products/camping/sleeping_bag/img_02.jpg','/uploads/products/camping/sleeping_bag/img_03.jpg'],feat:true},
    {c:1,city:'Chennai',n:'Barbeque Grill',d:'Compact coal-based barbeque grill. Comes with 1 kg free coal and skewers. Quick to assemble. Portable.',p:800,dep:1000,imgs:['/uploads/products/camping/barbeque/img_01.png','/uploads/products/camping/barbeque/img_02.png','/uploads/products/camping/barbeque/img_03.jpg'],feat:true},
    {c:1,city:'Chennai',n:'Outdoor Barbeque',d:'Large outdoor barbeque grill with 2 kg coal. Perfect for parties and large gatherings.',p:1200,dep:2000,imgs:['/uploads/products/camping/OutdoorBarbeque/img_01.jpg','/uploads/products/camping/OutdoorBarbeque/img_02.png','/uploads/products/camping/OutdoorBarbeque/img_03.jpg'],feat:false},
    {c:1,city:'Chennai',n:'Life Jackets',d:'Adult life jackets for water activities. Can handle weight over 80 kg. Comes with a whistle.',p:300,dep:500,imgs:['/uploads/products/camping/life_jacket/img_01.jpg','/uploads/products/camping/life_jacket/img_02.jpg','/uploads/products/camping/life_jacket/img_03.jpg'],feat:false},
    // Home Appliances
    {c:2,city:'Chennai',n:'Washing Machine',d:'Top load fully automatic washing machine (6.2 KG & 6.5 KG). Maintenance free. Door delivery.',p:2500,p3:1500,p6:900,p12:800,dep:2000,imgs:['/uploads/products/home_appliances/washing_machine/img_01.png'],feat:true},
    {c:2,city:'Chennai',n:'Fridge',d:'Best star-rated refrigerator. Spacious with different cooling options. Maintenance free.',p:2500,p3:1500,p6:800,p12:700,dep:2000,imgs:['/uploads/products/home_appliances/fridge/img_01.png'],feat:true},
    {c:2,city:'Chennai',n:'Air Conditioner',d:'Branded AC with best cooling effect. Completely maintenance free. Installation charges applicable.',p:4000,p3:3000,p6:1800,p12:1600,dep:3000,imgs:['/uploads/products/home_appliances/AC/img_01.png'],feat:true},
    {c:2,city:'Chennai',n:'LED TV',d:'Branded LED TV with best viewing experience. Only branded TVs provided. Maintenance free.',p:2500,p3:1500,p6:900,p12:800,dep:2000,imgs:['/uploads/products/home_appliances/tv/img_01.png'],feat:false},
    // Event
    {c:3,city:'Chennai',n:'Grand Moon Cradle',d:'Grand Moon cradle rental for naming ceremony and baby shower. Beautifully designed.',p:6500,dep:0,imgs:['/uploads/products/event/Grand_Moon_cradle_Rental/img_01.jpg'],feat:true},
    {c:3,city:'Chennai',n:'Classic Crown Cradle',d:'Classic crown-design cradle for naming ceremony. Elegant and traditional.',p:3500,dep:0,imgs:['/uploads/products/event/crown/img_01.jpg','/uploads/products/event/crown/img_02.jpg','/uploads/products/event/crown/img_03.jpg','/uploads/products/event/crown/img_04.jpg','/uploads/products/event/crown/img_05.jpg'],feat:true},
    {c:3,city:'Chennai',n:'Silver Grand Cradle',d:'Pure German Silver cradle for naming ceremony. 4 Ft Height x 3.5 Ft Length. Free transport up to 10 km.',p:7000,dep:0,imgs:['/uploads/products/event/silver_cradle/img_01.jpg','/uploads/products/event/silver_cradle/img_02.jpg','/uploads/products/event/silver_cradle/img_03.jpg','/uploads/products/event/silver_cradle/img_05.jpg'],feat:true},
    {c:3,city:'Chennai',n:'Golden Oonjal / Jhula',d:'Golden-finish traditional oonjal swing for baby shower, engagement and naming ceremony.',p:5200,dep:0,imgs:['/uploads/products/event/golden_oonjal/img_01.png'],feat:false},
    // Baby Props
    {c:6,city:'Chennai',n:'Baby Stroller',d:'Premium baby stroller for infants. Safe, comfortable and easy to maneuver.',p:1500,dep:500,imgs:['/uploads/products/baby/stroller/img_01.png'],feat:false},
    {c:6,city:'Chennai',n:'Baby Crib with Mattress',d:'Safe and comfortable baby crib with mattress. Perfect for newborns. Easy assembly.',p:1200,dep:500,imgs:['/uploads/products/baby/baby_crib/img_01.png'],feat:false},
    {c:6,city:'Chennai',n:'High Chair',d:'Baby high chair for feeding. Adjustable height and footrest. Easy to clean.',p:800,dep:300,imgs:['/uploads/products/baby/high_chair/img_01.jpg'],feat:false},
    // Backdrops
    {c:4,city:'all',n:'Marigold Backdrop',d:'Traditional marigold flower backdrop for baby shower, haldi and naming ceremony.',p:3000,dep:500,imgs:[],feat:false},
    {c:4,city:'all',n:'Ring Backdrop',d:'Dreamy ring-style backdrop for all events and parties.',p:2500,dep:500,imgs:[],feat:false},
    // Birthday
    {c:5,city:'all',n:'Golden Cake Stand',d:'Beautiful golden cake stand combo for birthday parties. Multiple tiers available.',p:1200,dep:200,imgs:[],feat:false},
    {c:5,city:'all',n:'Irish Cake Table Combo',d:'Complete Irish cake table combo with all accessories included.',p:1200,dep:200,imgs:[],feat:false},
    // Toys
    {c:7,city:'all',n:'Kids Slide and Swing',d:'Kids slide and swing set for rent. Perfect for birthday parties and events.',p:2000,dep:500,imgs:[],feat:false},
    {c:7,city:'all',n:'Kids Remote Car',d:'Kids remote control car for rent. Fun for birthday parties and events.',p:1500,dep:500,imgs:[],feat:false},
    // Games
    {c:8,city:'all',n:'Tug of War Rope',d:'Premium tug of war rope for team building events and school sports days.',p:1500,dep:500,imgs:[],feat:false},
  ];

  for (const pr of P) {
    const imgs = JSON.stringify(pr.imgs || []).replace(/'/g, "''");
    const p3 = pr.p3 != null ? pr.p3 : 'NULL';
    const p6 = pr.p6 != null ? pr.p6 : 'NULL';
    const p12 = pr.p12 != null ? pr.p12 : 'NULL';
    run(`INSERT INTO products
      (name,description,category_id,city,monthly_price,price_3month,price_6month,price_12month,
       security_deposit,images,specs,stock,is_featured)
      VALUES
      ('${e(pr.n)}','${e(pr.d)}',${pr.c},'${pr.city}',${pr.p},${p3},${p6},${p12},${pr.dep},'${imgs}','{}',10,${!!pr.feat})`);
  }

  console.log(`✅  Seeded ${P.length} products, ${cats.length} categories (in-memory)`);
}

function e(s) { return (s || '').replace(/'/g, "''"); }

module.exports = { seedMemoryDB };
