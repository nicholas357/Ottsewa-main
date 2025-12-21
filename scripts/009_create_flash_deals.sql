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

-- Allow public read access for active deals
CREATE POLICY "Anyone can view active flash deals"
  ON flash_deals FOR SELECT
  USING (is_active = true AND end_time > NOW());

-- Allow admins full access
CREATE POLICY "Admins can manage flash deals"
  ON flash_deals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for performance
CREATE INDEX idx_flash_deals_active ON flash_deals(is_active, end_time);
CREATE INDEX idx_flash_deals_product ON flash_deals(product_id);
