-- Create product FAQs table
CREATE TABLE IF NOT EXISTS product_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_faqs_product_id ON product_faqs(product_id);
CREATE INDEX IF NOT EXISTS idx_product_faqs_sort_order ON product_faqs(sort_order);

-- Enable RLS
ALTER TABLE product_faqs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "product_faqs_select_all" ON product_faqs
  FOR SELECT USING (is_active = true);

CREATE POLICY "product_faqs_admin_all" ON product_faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update trigger
CREATE TRIGGER update_product_faqs_updated_at
  BEFORE UPDATE ON product_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
