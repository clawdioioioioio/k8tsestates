-- =============================================
-- Feature 1: Transaction History
-- =============================================

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'buy' or 'sell'
  property_address text NOT NULL,
  city text,
  neighborhood text,
  property_type text, -- detached, semi, townhouse, condo, commercial, land
  price numeric,
  closing_date date,
  mls_number text,
  status text NOT NULL DEFAULT 'active', -- active, pending, closed, fell_through
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on transactions" ON transactions FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE INDEX idx_transactions_client ON transactions(client_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_closing ON transactions(closing_date DESC);

CREATE TRIGGER transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- Feature 2: Open House Digital Sign-In
-- =============================================

CREATE TABLE open_houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address text NOT NULL,
  city text,
  date date NOT NULL,
  start_time time,
  end_time time,
  mls_number text,
  listing_price numeric,
  description text,
  slug text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'upcoming', -- upcoming, active, completed
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE open_house_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  open_house_id uuid NOT NULL REFERENCES open_houses(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  working_with_agent boolean DEFAULT false,
  agent_name text,
  how_heard text,
  notes text,
  signed_in_at timestamptz DEFAULT now()
);

ALTER TABLE open_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_house_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on open_houses" ON open_houses FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Public can read open houses" ON open_houses FOR SELECT USING (true);
CREATE POLICY "Admin full access on open_house_visitors" ON open_house_visitors FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE INDEX idx_oh_slug ON open_houses(slug);
CREATE INDEX idx_oh_date ON open_houses(date DESC);
CREATE INDEX idx_ohv_open_house ON open_house_visitors(open_house_id);
CREATE INDEX idx_ohv_client ON open_house_visitors(client_id);

CREATE TRIGGER open_houses_updated_at BEFORE UPDATE ON open_houses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
