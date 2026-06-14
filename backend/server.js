require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const categoryRoutes = require('./src/routes/categories');
const orderRoutes = require('./src/routes/orders');
const userRoutes = require('./src/routes/users');
const adminRoutes = require('./src/routes/admin');
const pricingAdminRoutes = require('./src/routes/pricingAdmin');
const uploadRoutes = require('./src/routes/uploads');
const inquiryRoutes = require('./src/routes/inquiries');
const { runMigrations } = require('./src/utils/migrations');
const { trustProxy } = require('./src/middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 5000;

trustProxy(app);

app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/pricing', pricingAdminRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.get('/api/health', async (req, res) => {
  const pool = require('./src/models/db');
  let db = 'unknown';
  try {
    await pool.query('SELECT 1');
    db = /supabase\.(co|com)/i.test(process.env.DATABASE_URL || '') ? 'supabase' : 'postgres';
  } catch {
    db = 'unavailable';
  }
  res.json({
    status: 'OK',
    message: 'PakkaRent API running',
    database: db,
    supabase: Boolean(process.env.SUPABASE_URL),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`PakkaRent server running on port ${PORT}`);
  runMigrations().catch((err) => console.error('Migration runner error:', err.message));
});
