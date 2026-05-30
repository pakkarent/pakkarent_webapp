const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../models/db');

function displayName(supabaseUser, profile = {}) {
  if (profile.name) return profile.name;
  const meta = supabaseUser.user_metadata || {};
  return meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'User';
}

function placeholderEmail(authId) {
  return `user_${authId.replace(/-/g, '').slice(0, 12)}@auth.pakkarent.local`;
}

async function findOrCreateAppUser(supabaseUser, profile = {}) {
  const authId = supabaseUser.id;
  const email = supabaseUser.email || profile.email || null;

  const existing = await pool.query(
    `SELECT id, name, email, phone, city, role, auth_id
     FROM users WHERE auth_id = $1 OR ($2::text IS NOT NULL AND email = $2)
     LIMIT 1`,
    [authId, email]
  );

  if (existing.rows.length) {
    const user = existing.rows[0];
    if (!user.auth_id) {
      await pool.query('UPDATE users SET auth_id = $1, updated_at = NOW() WHERE id = $2', [authId, user.id]);
    }
    const updates = [];
    const values = [];
    let i = 1;
    if (profile.name && profile.name !== user.name) {
      updates.push(`name = $${i++}`);
      values.push(profile.name);
    }
    if (profile.phone && profile.phone !== user.phone) {
      updates.push(`phone = $${i++}`);
      values.push(profile.phone);
    }
    if (profile.city && profile.city !== user.city) {
      updates.push(`city = $${i++}`);
      values.push(profile.city);
    }
    if (updates.length) {
      values.push(user.id);
      await pool.query(
        `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${i}`,
        values
      );
      const refreshed = await pool.query(
        'SELECT id, name, email, phone, city, role FROM users WHERE id = $1',
        [user.id]
      );
      return refreshed.rows[0];
    }
    const { auth_id, ...safe } = user;
    return safe;
  }

  const name = displayName(supabaseUser, profile);
  const phone = profile.phone || supabaseUser.phone || supabaseUser.user_metadata?.phone || '';
  const city = profile.city || 'Chennai';
  const userEmail = email || placeholderEmail(authId);
  const hash = await bcrypt.hash(crypto.randomUUID(), 10);

  const created = await pool.query(
    `INSERT INTO users (name, email, password, phone, city, auth_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, phone, city, role`,
    [name, userEmail, hash, phone, city, authId]
  );
  return created.rows[0];
}

module.exports = { findOrCreateAppUser };
