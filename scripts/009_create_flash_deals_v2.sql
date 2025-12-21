-- Create flash_deals table
CREATE TABLE IF NOT EXISTS flash_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Flash Deal',
  description TEXT,
  discount_percentage INTEGER NOT NULL DEFAULT 10,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE flash_deals ENABLE ROW LEVEL SECURITY;

-- Allow public read access for all flash deals (filtering done in queries)
CREATE POLICY "Anyone can view flash deals"
  ON flash_deals FOR SELECT
  USING (true);

-- Allow admins to insert flash deals
CREATE POLICY "Admins can insert flash deals"
  ON flash_deals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update flash deals
CREATE POLICY "Admins can update flash deals"
  ON flash_deals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to delete flash deals
CREATE POLICY "Admins can delete flash deals"
  ON flash_deals FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_flash_deals_active ON flash_deals(is_active, end_time);
CREATE INDEX IF NOT EXISTS idx_flash_deals_product ON flash_deals(product_id);
