-- Link app users to Supabase Auth (OAuth / phone / email)
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
