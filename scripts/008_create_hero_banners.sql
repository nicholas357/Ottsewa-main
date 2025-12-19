-- Create hero_banners table for dynamic banner management
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'none' CHECK (link_type IN ('none', 'product', 'category', 'custom')),
  link_url TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  banner_type TEXT NOT NULL DEFAULT 'main' CHECK (banner_type IN ('main', 'side')),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Public can view active banners
CREATE POLICY "hero_banners_select_active" ON hero_banners
  FOR SELECT USING (is_active = true AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at >= NOW()));

-- Admins can do everything
CREATE POLICY "hero_banners_admin_all" ON hero_banners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Create index for efficient queries
CREATE INDEX idx_hero_banners_active ON hero_banners(is_active, banner_type, sort_order);
CREATE INDEX idx_hero_banners_dates ON hero_banners(starts_at, ends_at);
