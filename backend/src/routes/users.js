const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, phone, city, role, created_at FROM users WHERE id=$1', [req.user.id]);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/me', authenticate, async (req, res) => {
  const { name, phone, city, address } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name=$1, phone=$2, city=$3, address=$4, updated_at=NOW() WHERE id=$5 RETURNING id, name, email, phone, city, address, role',
      [name, phone, city, JSON.stringify(address), req.user.id]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
