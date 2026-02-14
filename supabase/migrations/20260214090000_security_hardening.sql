-- IMPORTANT: Before running this migration, set the encryption key:
-- ALTER DATABASE postgres SET app.tokens_encryption_key = 'your-secret-key-here';
-- Generate a key with: openssl rand -base64 32
-- This key must also be backed up securely — losing it means losing access to all encrypted tokens.

-- ========================================
-- 1. Create admin_users table
-- ========================================

CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Bootstrap: only existing admins (via current is_admin) can manage this table
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

-- ========================================
-- 4. Encrypt OAuth tokens using pgcrypto
-- ========================================

-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add encrypted columns
ALTER TABLE social_accounts ADD COLUMN access_token_encrypted bytea;
ALTER TABLE social_accounts ADD COLUMN refresh_token_encrypted bytea;

-- Encryption/decryption helpers using env-based key
-- The key will be set via a Supabase secret: TOKENS_ENCRYPTION_KEY
CREATE OR REPLACE FUNCTION encrypt_token(plain_text text)
RETURNS bytea AS $$
BEGIN
  RETURN pgp_sym_encrypt(
    plain_text,
    current_setting('app.tokens_encryption_key')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_token(encrypted bytea)
RETURNS text AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    encrypted,
    current_setting('app.tokens_encryption_key')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migrate existing plaintext tokens (if any exist)
UPDATE social_accounts
SET
  access_token_encrypted = encrypt_token(access_token),
  refresh_token_encrypted = CASE WHEN refresh_token IS NOT NULL THEN encrypt_token(refresh_token) ELSE NULL END
WHERE access_token IS NOT NULL;

-- Drop plaintext columns
ALTER TABLE social_accounts DROP COLUMN access_token;
ALTER TABLE social_accounts DROP COLUMN refresh_token;

-- Rename encrypted columns
ALTER TABLE social_accounts RENAME COLUMN access_token_encrypted TO access_token;
ALTER TABLE social_accounts RENAME COLUMN refresh_token_encrypted TO refresh_token;

-- ========================================
-- 5. Helper functions for edge functions
-- ========================================

-- Function to get decrypted social account
CREATE OR REPLACE FUNCTION get_decrypted_social_account(p_platform text)
RETURNS TABLE (
  id uuid,
  platform text,
  platform_user_id text,
  platform_username text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  scopes text[],
  is_active boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sa.id,
    sa.platform,
    sa.platform_user_id,
    sa.platform_username,
    decrypt_token(sa.access_token) as access_token,
    CASE WHEN sa.refresh_token IS NOT NULL THEN decrypt_token(sa.refresh_token) ELSE NULL END as refresh_token,
    sa.token_expires_at,
    sa.scopes,
    sa.is_active
  FROM social_accounts sa
  WHERE sa.platform = p_platform AND sa.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update tokens (with encryption)
CREATE OR REPLACE FUNCTION update_social_account_tokens(
  p_id uuid,
  p_access_token text,
  p_refresh_token text DEFAULT NULL,
  p_token_expires_at timestamptz DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE social_accounts SET
    access_token = encrypt_token(p_access_token),
    refresh_token = CASE WHEN p_refresh_token IS NOT NULL THEN encrypt_token(p_refresh_token) ELSE refresh_token END,
    token_expires_at = COALESCE(p_token_expires_at, token_expires_at),
    updated_at = now()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upsert social account (with encryption)
CREATE OR REPLACE FUNCTION upsert_social_account(
  p_platform text,
  p_access_token text,
  p_refresh_token text DEFAULT NULL,
  p_token_expires_at timestamptz DEFAULT NULL,
  p_scopes text[] DEFAULT NULL,
  p_platform_user_id text DEFAULT NULL,
  p_platform_username text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO social_accounts (platform, access_token, refresh_token, token_expires_at, scopes, platform_user_id, platform_username, is_active, updated_at)
  VALUES (
    p_platform,
    encrypt_token(p_access_token),
    CASE WHEN p_refresh_token IS NOT NULL THEN encrypt_token(p_refresh_token) ELSE NULL END,
    p_token_expires_at,
    p_scopes,
    p_platform_user_id,
    p_platform_username,
    true,
    now()
  )
  ON CONFLICT (platform) DO UPDATE SET
    access_token = encrypt_token(p_access_token),
    refresh_token = CASE WHEN p_refresh_token IS NOT NULL THEN encrypt_token(p_refresh_token) ELSE social_accounts.refresh_token END,
    token_expires_at = COALESCE(p_token_expires_at, social_accounts.token_expires_at),
    scopes = COALESCE(p_scopes, social_accounts.scopes),
    platform_user_id = COALESCE(p_platform_user_id, social_accounts.platform_user_id),
    platform_username = COALESCE(p_platform_username, social_accounts.platform_username),
    is_active = true,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
