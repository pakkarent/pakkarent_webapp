const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticate, adminOnly } = require('../middleware/auth');

// Get all products with filters
router.get('/', async (req, res) => {
  const { city, category_id, min_price, max_price, search, page = 1, limit = 12, featured } = req.query;
  const offset = (page - 1) * limit;
  let conditions = ['p.is_active = true'];
  let params = [];
  let idx = 1;

  if (city) { conditions.push(`(p.city = $${idx} OR p.city = 'all')`); params.push(city); idx++; }
  if (category_id) { conditions.push(`p.category_id = $${idx}`); params.push(category_id); idx++; }
  if (min_price) { conditions.push(`p.monthly_price >= $${idx}`); params.push(min_price); idx++; }
  if (max_price) { conditions.push(`p.monthly_price <= $${idx}`); params.push(max_price); idx++; }
  if (search) { conditions.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx})`); params.push(`%${search}%`); idx++; }
  if (featured === 'true') { conditions.push(`p.is_featured = true`); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products p ${where}`,
      params
    );
    const result = await pool.query(
      `SELECT p.*, c.name as category_name, c.icon as category_icon
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       ${where} ORDER BY p.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );
    res.json({ success: true, products: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name FROM products p
       LEFT JOIN categories c ON p.category_id = c.id WHERE p.id=$1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create product (admin)
router.post('/', authenticate, adminOnly, async (req, res) => {
  const { name, description, category_id, city, monthly_price, price_3month, price_6month, price_12month, security_deposit, images, specs, stock, is_featured } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, category_id, city, monthly_price, price_3month, price_6month, price_12month, security_deposit, images, specs, stock, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [name, description, category_id, city, monthly_price, price_3month, price_6month, price_12month, security_deposit, JSON.stringify(images), JSON.stringify(specs), stock, is_featured || false]
    );
    res.status(201).json({ success: true, product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update product (admin)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { name, description, category_id, city, monthly_price, price_3month, price_6month, price_12month, security_deposit, images, specs, stock, is_featured, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, category_id=$3, city=$4, monthly_price=$5, price_3month=$6, price_6month=$7, price_12month=$8, security_deposit=$9, images=$10, specs=$11, stock=$12, is_featured=$13, is_active=$14, updated_at=NOW()
       WHERE id=$15 RETURNING *`,
      [name, description, category_id, city, monthly_price, price_3month, price_6month, price_12month, security_deposit, JSON.stringify(images), JSON.stringify(specs), stock, is_featured, is_active, req.params.id]
    );
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete product (admin)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE products SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
