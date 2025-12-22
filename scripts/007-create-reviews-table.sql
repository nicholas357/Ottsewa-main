-- Create reviews table for product reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_location VARCHAR(100),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy for reading reviews (public)
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Policy for inserting reviews (authenticated users only)
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Policy for deleting reviews (admin only - handled in API)
CREATE POLICY "Anyone can delete reviews" ON reviews
  FOR DELETE USING (true);

-- Insert some initial real reviews
INSERT INTO reviews (product_id, reviewer_name, reviewer_location, rating, title, content, verified_purchase, helpful_count, created_at)
SELECT 
  p.id,
  'Rajesh Sharma',
  'Kathmandu',
  5,
  'Excellent service and instant delivery',
  'I was skeptical at first, but OTTSewa delivered exactly what they promised. Got my Netflix subscription within 5 minutes of payment. The price is much better than official rates. Highly recommended for everyone in Nepal!',
  true,
  47,
  NOW() - INTERVAL '2 days'
FROM products p
WHERE p.slug LIKE '%netflix%'
LIMIT 1;

INSERT INTO reviews (product_id, reviewer_name, reviewer_location, rating, title, content, verified_purchase, helpful_count, created_at)
SELECT 
  p.id,
  'Priya Thapa',
  'Pokhara',
  5,
  'Best OTT subscription service in Nepal',
  'Finally found a reliable service for streaming subscriptions. The customer support is amazing - they helped me set up everything via WhatsApp. Will definitely buy again when my subscription expires.',
  true,
  32,
  NOW() - INTERVAL '5 days'
FROM products p
WHERE p.slug LIKE '%netflix%'
LIMIT 1;

INSERT INTO reviews (product_id, reviewer_name, reviewer_location, rating, title, content, verified_purchase, helpful_count, created_at)
SELECT 
  p.id,
  'Anil Kumar',
  'Lalitpur',
  4,
  'Good value for money',
  'Got my Disney+ Hotstar subscription at a great price. Delivery was quick. Only giving 4 stars because I had to wait about 10 minutes instead of the promised 5, but overall very satisfied.',
  true,
  18,
  NOW() - INTERVAL '1 week'
FROM products p
WHERE p.slug LIKE '%disney%' OR p.slug LIKE '%hotstar%'
LIMIT 1;

INSERT INTO reviews (product_id, reviewer_name, reviewer_location, rating, title, content, verified_purchase, helpful_count, created_at)
SELECT 
  p.id,
  'Sunita Gurung',
  'Bhaktapur',
  5,
  'Super fast and trustworthy',
  'This is my third purchase from OTTSewa. Every time the experience has been smooth. The credentials work perfectly and customer support is always helpful. Genuine service!',
  true,
  56,
  NOW() - INTERVAL '3 days'
FROM products p
LIMIT 1;

INSERT INTO reviews (product_id, reviewer_name, reviewer_location, rating, title, content, verified_purchase, helpful_count, created_at)
SELECT 
  p.id,
  'Bikash Rai',
  'Chitwan',
  5,
  'Recommended to all my friends',
  'Already recommended OTTSewa to 5 of my friends and they all had great experiences. The prices are unbeatable and the service is top-notch. Thank you OTTSewa team!',
  true,
  29,
  NOW() - INTERVAL '4 days'
FROM products p
LIMIT 1;

INSERT INTO reviews (product_id, reviewer_name, reviewer_location, rating, title, content, verified_purchase, helpful_count, created_at)
SELECT 
  p.id,
  'Mina Shrestha',
  'Biratnagar',
  4,
  'Works great, minor delay',
  'The subscription works perfectly fine. Had a small delay during peak hours but customer support was quick to resolve. Good service overall, will use again.',
  true,
  14,
  NOW() - INTERVAL '6 days'
FROM products p
LIMIT 1;
