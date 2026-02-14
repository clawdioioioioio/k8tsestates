-- =============================================================
-- Migration: Restructure leads → clients + inquiries
-- =============================================================

-- 1. Create clients table
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create inquiries table
CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  interest_type text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'active', 'closed_won', 'closed_lost')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Migrate data from leads → clients + inquiries
INSERT INTO clients (id, first_name, last_name, email, phone, created_at, updated_at)
SELECT DISTINCT ON (email)
  id, first_name, last_name, email, phone, created_at, updated_at
FROM leads
ORDER BY email, created_at ASC;

-- For each lead, create an inquiry linked to the matching client
INSERT INTO inquiries (client_id, interest_type, message, status, created_at, updated_at)
SELECT
  c.id,
  l.interest_type,
  l.message,
  CASE WHEN l.status = 'closed' THEN 'closed_won' ELSE l.status END,
  l.created_at,
  l.updated_at
FROM leads l
JOIN clients c ON c.email = l.email;

-- 4. Rebuild notes table to support client-level and inquiry-level notes
-- First, create new columns
ALTER TABLE notes ADD COLUMN client_id uuid REFERENCES clients(id) ON DELETE CASCADE;
ALTER TABLE notes ADD COLUMN inquiry_id uuid REFERENCES inquiries(id) ON DELETE CASCADE;
ALTER TABLE notes ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Migrate: map old lead_id notes to client_id (using the client that took the lead's id)
UPDATE notes SET client_id = (
  SELECT c.id FROM clients c
  JOIN leads l ON l.email = c.email
  WHERE l.id = notes.lead_id
  LIMIT 1
);

-- Drop old column and add constraint
ALTER TABLE notes DROP COLUMN lead_id;
ALTER TABLE notes DROP COLUMN author_email;
ALTER TABLE notes ALTER COLUMN client_id SET NOT NULL;
ALTER TABLE notes ADD CONSTRAINT notes_has_parent
  CHECK (client_id IS NOT NULL OR inquiry_id IS NOT NULL);

-- 5. Rebuild tasks table
ALTER TABLE tasks ADD COLUMN client_id uuid REFERENCES clients(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN inquiry_id uuid REFERENCES inquiries(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN description text;
ALTER TABLE tasks ADD COLUMN completed_at timestamptz;
ALTER TABLE tasks ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Migrate: map old lead_id tasks to client_id
UPDATE tasks SET client_id = (
  SELECT c.id FROM clients c
  JOIN leads l ON l.email = c.email
  WHERE l.id = tasks.lead_id
  LIMIT 1
);

ALTER TABLE tasks DROP COLUMN lead_id;
ALTER TABLE tasks ALTER COLUMN client_id SET NOT NULL;

-- 6. Drop old leads table and related objects
DROP TRIGGER IF EXISTS leads_updated_at ON leads;
DROP INDEX IF EXISTS leads_status_idx;
DROP INDEX IF EXISTS leads_created_at_idx;
DROP INDEX IF EXISTS notes_lead_id_idx;
DROP INDEX IF EXISTS tasks_lead_id_idx;
DROP TABLE leads;

-- 7. Enable RLS on new tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- RLS policies for clients
CREATE POLICY "Admin full access" ON clients
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS policies for inquiries
CREATE POLICY "Admin full access" ON inquiries
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 8. Updated_at triggers
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 9. Indexes
CREATE INDEX clients_email_idx ON clients(email);
CREATE INDEX clients_created_at_idx ON clients(created_at DESC);
CREATE INDEX inquiries_client_id_idx ON inquiries(client_id);
CREATE INDEX inquiries_status_idx ON inquiries(status);
CREATE INDEX inquiries_created_at_idx ON inquiries(created_at DESC);
CREATE INDEX notes_client_id_idx ON notes(client_id);
CREATE INDEX notes_inquiry_id_idx ON notes(inquiry_id);
CREATE INDEX tasks_client_id_idx ON tasks(client_id);
CREATE INDEX tasks_inquiry_id_idx ON tasks(inquiry_id);
