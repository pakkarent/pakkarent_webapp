const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticate, adminOnly } = require('../middleware/auth');

function specsObj(specs) {
  if (!specs) return {};
  if (typeof specs === 'object' && specs !== null) return specs;
  try {
    return JSON.parse(specs);
  } catch {
    return {};
  }
}

function isMonthlyProductRow(p) {
  return specsObj(p.specs).pricing_type === 'per_month';
}

/** Inclusive day count; 0 if invalid */
function rentalDaysInclusive(startStr, endStr) {
  if (!startStr || !endStr) return 0;
  const from = new Date(`${startStr}T12:00:00`);
  const to = new Date(`${endStr}T12:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
  const dayMs = 86400000;
  const days = Math.floor((to - from) / dayMs) + 1;
  return days > 0 ? days : 0;
}

function linePriceMonthly(p, tenureMonths) {
  let price = Number(p.monthly_price);
  if (tenureMonths === 3) price = p.price_3month != null ? Number(p.price_3month) : price * 3;
  else if (tenureMonths === 6) price = p.price_6month != null ? Number(p.price_6month) : price * 6;
  else if (tenureMonths === 12) price = p.price_12month != null ? Number(p.price_12month) : price * 12;
  else price = Number(p.monthly_price) * tenureMonths;
  return price;
}

function dateToYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Create order
router.post('/', authenticate, async (req, res) => {
  const { items, delivery_address, tenure_months, start_date, end_date } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (!items?.length) throw new Error('No items in order');

    const rows = [];
    for (const item of items) {
      const prod = await client.query('SELECT * FROM products WHERE id=$1', [item.product_id]);
      if (!prod.rows.length) throw new Error(`Product ${item.product_id} not found`);
      rows.push({ item, p: prod.rows[0] });
    }

    let sawMonthly = null;
    for (const { p } of rows) {
      const m = isMonthlyProductRow(p);
      if (sawMonthly === null) sawMonthly = m;
      else if (sawMonthly !== m) throw new Error('Mixed monthly and day-based rental products are not allowed in one order');
    }

    const isMonthlyOrder = sawMonthly;
    let orderTenureMonths = Number(tenure_months);
    let orderStart = start_date;
    let orderEnd = end_date;

    if (isMonthlyOrder) {
      if (!orderStart) throw new Error('Rental start date is required');
      orderTenureMonths = Number(tenure_months);
      if (![1, 3, 6, 12].includes(orderTenureMonths)) throw new Error('Invalid rental tenure');
      const startD = new Date(orderStart);
      if (Number.isNaN(startD.getTime())) throw new Error('Invalid start date');
      const endD = new Date(startD);
      endD.setMonth(endD.getMonth() + orderTenureMonths);
      orderEnd = dateToYMD(endD);
    } else {
      orderTenureMonths = 0;
      if (!orderStart || !orderEnd) throw new Error('Rental start and end dates are required');
      const days = rentalDaysInclusive(orderStart, orderEnd);
      if (days < 1) throw new Error('Invalid rental date range');
    }

    let total_amount = 0;
    let total_deposit = 0;

    for (const { item, p } of rows) {
      let price;
      if (isMonthlyProductRow(p)) {
        price = linePriceMonthly(p, orderTenureMonths);
      } else {
        const days = rentalDaysInclusive(orderStart, orderEnd);
        price = Number(p.monthly_price) * days;
      }
      total_amount += price * item.quantity;
      total_deposit += Number(p.security_deposit) * item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, total_amount, security_deposit, delivery_address, tenure_months, start_date, end_date)
       VALUES ($1,'pending',$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        req.user.id,
        total_amount,
        total_deposit,
        JSON.stringify(delivery_address),
        orderTenureMonths,
        orderStart,
        orderEnd,
      ]
    );
    const order = orderResult.rows[0];

    for (const { item, p } of rows) {
      let price;
      if (isMonthlyProductRow(p)) {
        price = linePriceMonthly(p, orderTenureMonths);
      } else {
        const days = rentalDaysInclusive(orderStart, orderEnd);
        price = Number(p.monthly_price) * days;
      }

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
