import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let browserClient = null;

/** Browser Supabase client for auth, realtime, or direct queries when needed. */
export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseKey);
  }
  return browserClient;
}

export default getSupabase;
