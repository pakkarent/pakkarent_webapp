/**
 * Database connection — Supabase PostgreSQL (or any Postgres URL).
 * Falls back to pg-mem only in local development when the connection fails.
 */
const { Pool } = require('pg');
const { seedMemoryDB } = require('./seed-memory');

let _pool = new Pool(poolConfig());
let initPromise = null;
let _usingMemoryDb = false;

function poolConfig() {
  const connectionString = process.env.DATABASE_URL;
  const isSupabase = /supabase\.(co|com)/i.test(connectionString || '');

  return {
    connectionString,
    ssl: isSupabase || process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
    connectionTimeoutMillis: isSupabase ? 10000 : 3000,
  };
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

async function init() {
  if (!process.env.DATABASE_URL) {
    if (isProduction()) {
      throw new Error('DATABASE_URL is required in production');
    }
    console.warn('⚠️  DATABASE_URL not set — using in-memory database (demo mode)...');
    return useMemoryDB();
  }

  try {
    const client = await _pool.connect();
    await client.query('SELECT 1');
    client.release();
    _pool.on('error', (err) => console.error('PostgreSQL error:', err));
    const label = /supabase\.(co|com)/i.test(process.env.DATABASE_URL || '')
      ? 'Supabase PostgreSQL'
      : 'PostgreSQL';
    console.log(`✅  Connected to ${label}`);
    return;
  } catch (err) {
    if (isProduction()) {
      console.error(`✗  PostgreSQL unavailable in production: ${err.message}`);
      throw err;
    }
    console.warn(`⚠️  PostgreSQL unavailable: ${err.message}`);
    console.warn('    Starting in-memory database (demo mode)...');
    return useMemoryDB();
  }
}

function useMemoryDB() {
  const { newDb } = require('pg-mem');
  const db = newDb();
  seedMemoryDB(db);
  const { Pool: MemPool } = db.adapters.createPg();
  _pool = new MemPool();
  _usingMemoryDb = true;
  console.log('✅  In-memory database ready (data resets on server restart)');
}

function isUsingMemoryDb() {
  return _usingMemoryDb;
}

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
module.exports.isUsingMemoryDb = isUsingMemoryDb;
