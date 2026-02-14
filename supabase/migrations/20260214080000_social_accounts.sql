-- Social accounts for direct publishing
CREATE TABLE social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('x', 'facebook', 'instagram', 'tiktok')),
  platform_user_id text,
  platform_username text,
  access_token text NOT NULL,
  refresh_token text,
  token_expires_at timestamptz,
  scopes text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (platform)
);

ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only: social_accounts" ON social_accounts
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
  );

-- Post distributions tracking
CREATE TABLE post_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('x', 'facebook', 'instagram', 'tiktok')),
  social_account_id uuid REFERENCES social_accounts(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'publishing', 'published', 'failed')),
  platform_post_id text,
  platform_post_url text,
  error_message text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (post_id, platform)
);

ALTER TABLE post_distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only: post_distributions" ON post_distributions
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
  );
