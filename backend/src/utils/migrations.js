const fs = require('fs');
const path = require('path');
const pool = require('../models/db');

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'database', 'migrations');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function runMigrations() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return;
  }

  try {
    await ensureMigrationsTable();
  } catch (err) {
    console.warn('⚠️  Could not ensure _migrations table:', err.message);
    return;
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    let already;
    try {
      const res = await pool.query('SELECT 1 FROM _migrations WHERE name = $1', [file]);
      already = res.rows.length > 0;
    } catch (err) {
      console.warn(`⚠️  Could not check migration ${file}:`, err.message);
      continue;
    }
    if (already) continue;

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log(`▶︎  Running migration: ${file}`);
    try {
      await pool.query(sql);
      await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      console.log(`✓  Applied migration: ${file}`);
    } catch (err) {
      console.error(`✗  Migration ${file} failed:`, err.message);
    }
  }
}

module.exports = { runMigrations };
