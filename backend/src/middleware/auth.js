const jwt = require('jsonwebtoken');
const { getSupabase } = require('../utils/supabase');
const pool = require('../models/db');

async function resolveSupabaseUser(token) {
  const sb = getSupabase();
  if (!sb) return null;

  const { data: { user: sbUser }, error } = await sb.auth.getUser(token);
  if (error || !sbUser) return null;

  const result = await pool.query(
    'SELECT id, email, role FROM users WHERE auth_id = $1',
    [sbUser.id]
  );
  if (!result.rows.length) return null;

  const row = result.rows[0];
  return { id: row.id, email: row.email, role: row.role };
}

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const sbUser = await resolveSupabaseUser(token);
    if (sbUser) {
      req.user = sbUser;
      return next();
    }
  } catch {
    // fall through to legacy JWT
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { authenticate, adminOnly };
