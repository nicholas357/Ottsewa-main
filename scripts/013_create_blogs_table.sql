-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image VARCHAR(500),
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_products junction table for connecting products to blogs
CREATE TABLE IF NOT EXISTS blog_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blog_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_products_blog_id ON blog_products(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_products_product_id ON blog_products(product_id);

-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_products ENABLE ROW LEVEL SECURITY;

-- RLS policies for blogs
CREATE POLICY "Public can view published blogs" ON blogs
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all blogs" ON blogs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS policies for blog_products
CREATE POLICY "Public can view blog products" ON blog_products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog products" ON blog_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
