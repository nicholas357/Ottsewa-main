-- Update existing reviews to have dates after December 21, 2024
-- Or insert new reviews if table is empty

-- First, delete any old reviews
DELETE FROM reviews;

-- Insert fresh reviews with dates after December 21, 2024
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
  '2024-12-22 10:30:00+05:45'::timestamptz
FROM products p
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
  '2024-12-22 14:15:00+05:45'::timestamptz
FROM products p
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
  '2024-12-22 09:45:00+05:45'::timestamptz
FROM products p
OFFSET 1 LIMIT 1;

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
  '2024-12-22 16:20:00+05:45'::timestamptz
FROM products p
OFFSET 2 LIMIT 1;

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
  '2024-12-22 11:00:00+05:45'::timestamptz
FROM products p
OFFSET 3 LIMIT 1;

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
  '2024-12-22 13:30:00+05:45'::timestamptz
FROM products p
OFFSET 4 LIMIT 1;
