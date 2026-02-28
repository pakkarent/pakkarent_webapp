const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticate, adminOnly } = require('../middleware/auth');

router.use(authenticate, adminOnly);

router.get('/stats', async (req, res) => {
  try {
    const [users, products, orders, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE role=\'user\''),
      pool.query('SELECT COUNT(*) FROM products WHERE is_active=true'),
      pool.query('SELECT COUNT(*), status FROM orders GROUP BY status'),
      pool.query('SELECT SUM(total_amount) FROM orders WHERE status NOT IN (\'cancelled\')'),
    ]);
    const ordersByStatus = {};
    orders.rows.forEach(r => { ordersByStatus[r.status] = parseInt(r.count); });
    res.json({
      success: true,
      stats: {
        total_users: parseInt(users.rows[0].count),
        total_products: parseInt(products.rows[0].count),
        orders_by_status: ordersByStatus,
        total_revenue: parseFloat(revenue.rows[0].sum) || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, city, role, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const count = await pool.query('SELECT COUNT(*) FROM users');
    res.json({ success: true, users: result.rows, total: parseInt(count.rows[0].count) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
  try {
    await pool.query('UPDATE users SET role=$1 WHERE id=$2', [role, req.params.id]);
    res.json({ success: true, message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
