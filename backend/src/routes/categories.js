const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticate, adminOnly } = require('../middleware/auth');

// Admin: all categories including inactive (no city filter)
router.get('/admin-list', authenticate, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, pc.name AS parent_name,
        (SELECT COUNT(*)::int FROM products p
         WHERE p.is_active = true
           AND (p.category_id = c.id OR p.subcategory_id = c.id)) AS product_count,
        (SELECT COUNT(*)::int FROM categories child
         WHERE child.parent_id = c.id AND child.is_active = true) AS subcategory_count
       FROM categories c
       LEFT JOIN categories pc ON pc.id = c.parent_id
       ORDER BY COALESCE(c.parent_id, c.id), c.parent_id NULLS FIRST, c.sort_order, c.name`
    );
    res.json({ success: true, categories: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  const { city, parent_id, parents_only } = req.query;
  try {
    let conditions = ['c.is_active = true'];
    const params = [];
    let idx = 1;

    if (parents_only === 'true') {
      conditions.push('c.parent_id IS NULL');
    }
    if (parent_id) {
      conditions.push(`c.parent_id = $${idx}`);
      params.push(parseInt(parent_id, 10));
      idx++;
    }

    if (city) {
      conditions.push(`EXISTS (
        SELECT 1 FROM products p
        LEFT JOIN categories sc ON sc.id = p.subcategory_id
        WHERE p.is_active = true
          AND (p.city = $${idx} OR p.city = 'all')
          AND (
            p.category_id = c.id
            OR p.subcategory_id = c.id
            OR sc.parent_id = c.id
          )
      )`);
      params.push(city);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT c.*, pc.name AS parent_name
       FROM categories c
       LEFT JOIN categories pc ON pc.id = c.parent_id
       ${where}
       ORDER BY COALESCE(c.parent_id, c.id), c.parent_id NULLS FIRST, c.sort_order, c.name`,
      params
    );
    res.json({ success: true, categories: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  const { name, description, icon, image, sort_order, parent_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO categories (name, description, icon, image, sort_order, parent_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, description, icon, image, sort_order || 0, parent_id || null]
    );
    res.status(201).json({ success: true, category: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { name, description, icon, image, sort_order, is_active, parent_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE categories
       SET name=$1, description=$2, icon=$3, image=$4, sort_order=$5,
           is_active=$6, parent_id=$7
       WHERE id=$8 RETURNING *`,
      [name, description, icon, image, sort_order, is_active, parent_id ?? null, req.params.id]
    );
    res.json({ success: true, category: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE categories SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Category deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
