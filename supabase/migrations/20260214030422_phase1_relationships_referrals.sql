-- Interactions / Touch Log
CREATE TABLE interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  interaction_type text NOT NULL,
  notes text,
  interaction_date timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE client_tags (
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, tag_id)
);

-- Client profile additions
ALTER TABLE clients ADD COLUMN IF NOT EXISTS birthday date;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS closing_anniversary date;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES clients(id);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS referral_source text;

-- Default tags
INSERT INTO tags (name, color) VALUES
  ('Past Client', '#10B981'),
  ('Active Client', '#3B82F6'),
  ('Referral Source', '#F59E0B'),
  ('Sphere of Influence', '#8B5CF6'),
  ('Vendor', '#6B7280'),
  ('Prospect', '#EC4899');

-- RLS on all new tables
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on interactions" ON interactions FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full access on tags" ON tags FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin full access on client_tags" ON client_tags FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Indexes
CREATE INDEX idx_interactions_client ON interactions(client_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date DESC);
CREATE INDEX idx_client_tags_client ON client_tags(client_id);
CREATE INDEX idx_client_tags_tag ON client_tags(tag_id);
CREATE INDEX idx_clients_birthday ON clients(birthday);
CREATE INDEX idx_clients_closing_anniversary ON clients(closing_anniversary);
