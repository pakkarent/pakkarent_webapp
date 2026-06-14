const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
const { getSupabase } = require('../utils/supabase');
const { findOrCreateAppUser } = require('../utils/authUser');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimit');
const { rejectHoneypot } = require('../middleware/honeypot');

// Legacy email/password register
router.post('/register', registerLimiter, rejectHoneypot(), async (req, res) => {
  const { name, email, password, phone, city } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, city) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, phone, city, role',
      [name, email, hash, phone, city]
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Legacy email/password login (demo admin)
router.post('/login', loginLimiter, rejectHoneypot(), async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const { password: _, ...userSafe } = user;
    res.json({ success: true, token, user: userSafe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Sync Supabase Auth session → app user row
router.post('/supabase/sync', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const sb = getSupabase();
  if (!sb) {
    return res.status(503).json({ success: false, message: 'Supabase not configured' });
  }

  try {
    const { data: { user: sbUser }, error } = await sb.auth.getUser(token);
    if (error || !sbUser) {
      return res.status(401).json({ success: false, message: 'Invalid Supabase session' });
    }

    const user = await findOrCreateAppUser(sbUser, req.body || {});
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
