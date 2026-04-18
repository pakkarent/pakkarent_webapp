const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticate, adminOnly } = require('../middleware/auth');

router.use(authenticate, adminOnly);

// List all pricing offers (admin)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, c.name AS category_name
       FROM pricing_offers o
       LEFT JOIN categories c ON c.id = o.category_id
       ORDER BY o.scope, o.id`
    );
    res.json({ success: true, offers: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create or replace store-wide offer (deactivates previous global)
router.post('/global', async (req, res) => {
  const { discount_percent, label, is_active = true } = req.body;
  const pct = Number(discount_percent);
  if (Number.isNaN(pct) || pct < 0 || pct > 100) {
    return res.status(400).json({ success: false, message: 'discount_percent must be 0–100' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE pricing_offers SET is_active = false, updated_at = NOW() WHERE scope = 'all' AND is_active = true`
    );
    const ins = await client.query(
      `INSERT INTO pricing_offers (scope, category_id, discount_percent, label, is_active)
       VALUES ('all', NULL, $1, $2, $3) RETURNING *`,
      [pct, label || null, !!is_active]
    );
    await client.query('COMMIT');
    res.status(201).json({ success: true, offer: ins.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});

// Upsert category-specific offer
router.post('/category', async (req, res) => {
  const { category_id, discount_percent, label, is_active = true } = req.body;
  const cid = parseInt(category_id, 10);
  const pct = Number(discount_percent);
  if (!cid || Number.isNaN(pct) || pct < 0 || pct > 100) {
    return res.status(400).json({ success: false, message: 'Valid category_id and discount_percent 0–100 required' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE pricing_offers SET is_active = false, updated_at = NOW()
       WHERE scope = 'category' AND category_id = $1 AND is_active = true`,
      [cid]
    );
    const ins = await client.query(
      `INSERT INTO pricing_offers (scope, category_id, discount_percent, label, is_active)
       VALUES ('category', $1, $2, $3, $4) RETURNING *`,
      [cid, pct, label || null, !!is_active]
    );
    await client.query('COMMIT');
    res.status(201).json({ success: true, offer: ins.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});

router.patch('/:id', async (req, res) => {
  const { discount_percent, label, is_active } = req.body;
  try {
    const fields = [];
    const vals = [];
    let i = 1;
    if (discount_percent != null) {
      const pct = Number(discount_percent);
      if (Number.isNaN(pct) || pct < 0 || pct > 100) {
        return res.status(400).json({ success: false, message: 'discount_percent must be 0–100' });
      }
      fields.push(`discount_percent = $${i++}`);
      vals.push(pct);
    }
    if (label !== undefined) {
      fields.push(`label = $${i++}`);
      vals.push(label);
    }
    if (is_active !== undefined) {
      fields.push(`is_active = $${i++}`);
      vals.push(!!is_active);
    }
    if (!fields.length) return res.status(400).json({ success: false, message: 'No fields to update' });
    fields.push(`updated_at = NOW()`);
    vals.push(req.params.id);
    const result = await pool.query(
      `UPDATE pricing_offers SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      vals
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.json({ success: true, offer: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query(`UPDATE pricing_offers SET is_active = false, updated_at = NOW() WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Offer deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
