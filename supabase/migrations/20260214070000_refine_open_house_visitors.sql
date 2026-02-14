-- Migrate orphaned visitor records (client_id IS NULL) by matching on email
UPDATE open_house_visitors ohv
SET client_id = c.id
FROM clients c
WHERE ohv.client_id IS NULL
  AND lower(trim(ohv.email)) = lower(trim(c.email));

-- Create client records for any remaining orphans (no matching email in clients)
INSERT INTO clients (first_name, last_name, email, phone)
SELECT ohv.first_name, ohv.last_name, lower(trim(ohv.email)), ohv.phone
FROM open_house_visitors ohv
WHERE ohv.client_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM clients c WHERE lower(trim(c.email)) = lower(trim(ohv.email)))
GROUP BY lower(trim(ohv.email)), ohv.first_name, ohv.last_name, ohv.phone;

-- Now link any remaining orphans
UPDATE open_house_visitors ohv
SET client_id = c.id
FROM clients c
WHERE ohv.client_id IS NULL
  AND lower(trim(ohv.email)) = lower(trim(c.email));

-- Delete any that still have no client_id (shouldn't happen but safety)
DELETE FROM open_house_visitors WHERE client_id IS NULL;

-- Remove duplicated columns
ALTER TABLE open_house_visitors
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS last_name,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS phone;

-- Make client_id NOT NULL
ALTER TABLE open_house_visitors
  ALTER COLUMN client_id SET NOT NULL;

-- Add unique constraint to prevent duplicate sign-ins
ALTER TABLE open_house_visitors
  ADD CONSTRAINT uq_open_house_visitor UNIQUE (open_house_id, client_id);
