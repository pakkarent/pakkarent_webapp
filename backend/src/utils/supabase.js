const ws = require('ws');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

let client = null;

/** Server-side Supabase client (REST / Auth / Storage). Requires SUPABASE_URL + key in env. */
function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { transport: ws },
    });
  }
  return client;
}

module.exports = { getSupabase };
