const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE is_active=true ORDER BY sort_order');
    res.json({ success: true, categories: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  const { name, description, icon, image, sort_order } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, description, icon, image, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, description, icon, image, sort_order || 0]
    );
    res.status(201).json({ success: true, category: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { name, description, icon, image, sort_order, is_active } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categories SET name=$1, description=$2, icon=$3, image=$4, sort_order=$5, is_active=$6 WHERE id=$7 RETURNING *',
      [name, description, icon, image, sort_order, is_active, req.params.id]
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
