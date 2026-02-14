-- ========================================
-- 1. Create admin_users table
-- ========================================

CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Authenticated users can check if their own email is in the admin list
CREATE POLICY "Check own admin status" ON admin_users
  FOR SELECT USING (email = (SELECT auth.jwt() ->> 'email'));

-- Admins get full CRUD (add/remove other admins)
CREATE POLICY "Admin full access" ON admin_users
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Seed current admins
INSERT INTO admin_users (email) VALUES
  ('kminovski@gmail.com'),
  ('nminovski@gmail.com');

-- ========================================
-- 2. Replace is_admin() to query the table
-- ========================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE email = (SELECT auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 3. Fix broken RLS policies
-- ========================================

DROP POLICY IF EXISTS "Admin only: social_accounts" ON social_accounts;
CREATE POLICY "Admin only: social_accounts" ON social_accounts
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin only: post_distributions" ON post_distributions;
CREATE POLICY "Admin only: post_distributions" ON post_distributions
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());
