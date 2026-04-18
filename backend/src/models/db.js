/**
 * Database connection — tries real PostgreSQL first, falls back to pg-mem
 * (in-memory database) if the connection fails.
 */
const { Pool } = require('pg');
const { seedMemoryDB } = require('./seed-memory');

let _pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 3000,
});

let initPromise = null;

async function init() {
  // ── Try real PostgreSQL ──────────────────────────────────────────────────
  try {
    const client = await _pool.connect();
    await client.query('SELECT 1');
    client.release();
    _pool.on('error', (err) => console.error('PostgreSQL error:', err));
    console.log('✅  Connected to PostgreSQL');
    return;
  } catch (err) {
    console.warn(`⚠️  PostgreSQL unavailable: ${err.message}`);
    console.warn('    Starting in-memory database (demo mode)...');
  }

  // ── Fall back to pg-mem ──────────────────────────────────────────────────
  const { newDb } = require('pg-mem');
  const db = newDb();

  seedMemoryDB(db);   // synchronous

  const { Pool: MemPool } = db.adapters.createPg();
  _pool = new MemPool();
  console.log('✅  In-memory database ready (data resets on server restart)');
}

// Lazy-init proxy — first query triggers setup
const pool = {
  query: async (...args) => {
    if (!initPromise) initPromise = init();
    await initPromise;
    return _pool.query(...args);
  },
  connect: async () => {
    if (!initPromise) initPromise = init();
    await initPromise;
    return _pool.connect();
  },
  on: () => {},
};

module.exports = pool;
