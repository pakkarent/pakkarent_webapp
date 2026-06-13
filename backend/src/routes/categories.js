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
       ORDER BY COALESCE(pc.sort_order, c.sort_order), c.parent_id NULLS FIRST, c.sort_order, c.name`
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
        LEFT JOIN categories pc ON pc.id = p.category_id
        WHERE p.is_active = true
          AND (p.city = $${idx} OR p.city = 'all')
          AND (
            p.category_id = c.id
            OR p.subcategory_id = c.id
            OR sc.parent_id = c.id
            OR pc.parent_id = c.id
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
       ORDER BY COALESCE(pc.sort_order, c.sort_order), c.parent_id NULLS FIRST, c.sort_order, c.name`,
      params
    );

    let categories = result.rows;
    const parentIds = [...new Set(
      categories.filter((row) => row.parent_id).map((row) => row.parent_id)
    )];
    const existingIds = new Set(categories.map((row) => row.id));
    const missingParentIds = parentIds.filter((id) => !existingIds.has(id));
    if (missingParentIds.length) {
      const parents = await pool.query(
        `SELECT c.*, pc.name AS parent_name
         FROM categories c
         LEFT JOIN categories pc ON pc.id = c.parent_id
         WHERE c.id = ANY($1) AND c.is_active = true`,
        [missingParentIds]
      );
      categories = [...parents.rows, ...categories];
      const parentById = new Map(
        [...parents.rows, ...categories].filter((row) => !row.parent_id).map((row) => [row.id, row])
      );
      const groupOrder = (cat) => {
        if (cat.parent_id) {
          return Number(parentById.get(cat.parent_id)?.sort_order ?? cat.sort_order ?? 0);
        }
        return Number(cat.sort_order ?? 0);
      };
      categories.sort(
        (a, b) =>
          groupOrder(a) - groupOrder(b)
          || (a.parent_id ? 1 : 0) - (b.parent_id ? 1 : 0)
          || Number(a.sort_order || 0) - Number(b.sort_order || 0)
          || a.name.localeCompare(b.name)
      );
    }

    res.json({ success: true, categories });
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
