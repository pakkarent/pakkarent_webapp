const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticate, adminOnly } = require('../middleware/auth');

// Create order
router.post('/', authenticate, async (req, res) => {
  const { items, delivery_address, tenure_months, start_date } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let total_amount = 0;
    let total_deposit = 0;

    for (const item of items) {
      const prod = await client.query('SELECT * FROM products WHERE id=$1', [item.product_id]);
      if (!prod.rows.length) throw new Error(`Product ${item.product_id} not found`);
      const p = prod.rows[0];
      let price = p.monthly_price;
      if (tenure_months === 3) price = p.price_3month || p.monthly_price * 3;
      else if (tenure_months === 6) price = p.price_6month || p.monthly_price * 6;
      else if (tenure_months === 12) price = p.price_12month || p.monthly_price * 12;
      else price = p.monthly_price * tenure_months;
      total_amount += price * item.quantity;
      total_deposit += p.security_deposit * item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, total_amount, security_deposit, delivery_address, tenure_months, start_date, end_date)
       VALUES ($1,'pending',$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.user.id, total_amount, total_deposit, JSON.stringify(delivery_address), tenure_months, start_date,
       new Date(new Date(start_date).setMonth(new Date(start_date).getMonth() + tenure_months))]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      const prod = await client.query('SELECT * FROM products WHERE id=$1', [item.product_id]);
      const p = prod.rows[0];
      let price = p.monthly_price;
      if (tenure_months === 3) price = p.price_3month || p.monthly_price * 3;
      else if (tenure_months === 6) price = p.price_6month || p.monthly_price * 6;
      else if (tenure_months === 12) price = p.price_12month || p.monthly_price * 12;
      else price = p.monthly_price * tenure_months;

      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1,$2,$3,$4)',
        [order.id, item.product_id, item.quantity, price]
      );
      await client.query('UPDATE products SET stock=stock-$1 WHERE id=$2', [item.quantity, item.product_id]);
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, order });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});

// Get user orders
router.get('/my', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object('id',oi.id,'product_id',oi.product_id,'quantity',oi.quantity,'unit_price',oi.unit_price,'product_name',p.name,'product_images',p.images)) as items
       FROM orders o LEFT JOIN order_items oi ON o.id=oi.order_id LEFT JOIN products p ON oi.product_id=p.id
       WHERE o.user_id=$1 GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, orders: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all orders (admin)
router.get('/', authenticate, adminOnly, async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (page - 1) * limit;
  let where = '';
  let params = [];
  if (status) { where = 'WHERE o.status=$1'; params.push(status); }
  try {
    const result = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
       json_agg(json_build_object('product_name',p.name,'quantity',oi.quantity,'unit_price',oi.unit_price)) as items
       FROM orders o LEFT JOIN users u ON o.user_id=u.id
       LEFT JOIN order_items oi ON o.id=oi.order_id LEFT JOIN products p ON oi.product_id=p.id
       ${where} GROUP BY o.id, u.name, u.email, u.phone ORDER BY o.created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`,
      [...params, limit, offset]
    );
    const count = await pool.query(`SELECT COUNT(DISTINCT o.id) FROM orders o ${where}`, params);
    res.json({ success: true, orders: result.rows, total: parseInt(count.rows[0].count) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update order status (admin)
router.patch('/:id/status', authenticate, adminOnly, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'delivered', 'active', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
  try {
    const result = await pool.query(
      'UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
