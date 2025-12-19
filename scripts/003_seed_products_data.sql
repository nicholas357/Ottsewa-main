-- =====================================================
-- SEED DATA FOR PRODUCTS
-- =====================================================

-- Insert Platforms
insert into public.platforms (name, slug, icon, sort_order) values
  ('PC', 'pc', 'monitor', 1),
  ('PlayStation', 'playstation', 'gamepad', 2),
  ('Xbox', 'xbox', 'gamepad', 3),
  ('Nintendo Switch', 'nintendo', 'gamepad', 4),
  ('Mobile', 'mobile', 'smartphone', 5)
on conflict (slug) do nothing;

-- Insert Categories
insert into public.categories (name, slug, description, icon, sort_order) values
  ('Games', 'games', 'Video games for all platforms', 'gamepad-2', 1),
  ('Gift Cards', 'gift-cards', 'Digital gift cards and vouchers', 'credit-card', 2),
  ('Subscriptions', 'subscriptions', 'Gaming and streaming subscriptions', 'package', 3),
  ('Software', 'software', 'Software licenses and tools', 'monitor', 4),
  ('In-Game Items', 'in-game-items', 'Virtual currency and in-game items', 'coins', 5),
  ('DLC', 'dlc', 'Downloadable content and expansions', 'download', 6)
on conflict (slug) do nothing;

-- Insert Sample Game Product
insert into public.products (
  title, slug, description, short_description, product_type,
  category_id, base_price, original_price, currency,
  discount_percent, cashback_percent, image_url,
  is_active, is_featured, is_bestseller, is_new,
  publisher, developer, tags, average_rating, review_count
) values (
  'Elden Ring',
  'elden-ring',
  'Elden Ring is an action role-playing game developed by FromSoftware and published by Bandai Namco Entertainment. The game was directed by Hidetaka Miyazaki and made in collaboration with fantasy novelist George R. R. Martin.',
  'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.',
  'game',
  (select id from public.categories where slug = 'games'),
  5999.00, 7999.00, 'NPR',
  25, 5,
  '/placeholder.svg?height=400&width=300',
  true, true, true, false,
  'Bandai Namco Entertainment', 'FromSoftware',
  array['action', 'rpg', 'open-world', 'souls-like'],
  4.8, 1250
) on conflict (slug) do nothing;

-- Insert Game Editions for Elden Ring
insert into public.game_editions (product_id, name, slug, price, original_price, includes, is_default, sort_order) values
  ((select id from public.products where slug = 'elden-ring'), 'Standard Edition', 'standard', 5999.00, 7999.00, array['Base Game'], true, 1),
  ((select id from public.products where slug = 'elden-ring'), 'Deluxe Edition', 'deluxe', 7499.00, 9499.00, array['Base Game', 'Digital Artbook', 'Original Soundtrack'], false, 2),
  ((select id from public.products where slug = 'elden-ring'), 'Shadow of the Erdtree Edition', 'ultimate', 9999.00, 12999.00, array['Base Game', 'Shadow of the Erdtree DLC', 'Digital Artbook', 'Original Soundtrack', 'Bonus Armor Set'], false, 3)
on conflict (product_id, slug) do nothing;

-- Insert Sample Gift Card Product
insert into public.products (
  title, slug, description, short_description, product_type,
  category_id, base_price, currency,
  image_url, is_active, is_featured,
  tags
) values (
  'Steam Wallet Gift Card',
  'steam-wallet-gift-card',
  'Add funds to your Steam Wallet to purchase games, software, and other items on Steam.',
  'Top up your Steam Wallet instantly.',
  'giftcard',
  (select id from public.categories where slug = 'gift-cards'),
  0, 'NPR',
  '/placeholder.svg?height=400&width=300',
  true, true,
  array['steam', 'gift-card', 'gaming', 'wallet']
) on conflict (slug) do nothing;

-- Insert Gift Card Denominations
insert into public.gift_card_denominations (product_id, value, price, is_popular, stock, sort_order) values
  ((select id from public.products where slug = 'steam-wallet-gift-card'), 500, 500, false, 100, 1),
  ((select id from public.products where slug = 'steam-wallet-gift-card'), 1000, 1000, true, 100, 2),
  ((select id from public.products where slug = 'steam-wallet-gift-card'), 2000, 2000, false, 100, 3),
  ((select id from public.products where slug = 'steam-wallet-gift-card'), 5000, 5000, true, 50, 4),
  ((select id from public.products where slug = 'steam-wallet-gift-card'), 10000, 10000, false, 25, 5)
on conflict (product_id, value) do nothing;

-- Insert Sample Subscription Product
insert into public.products (
  title, slug, description, short_description, product_type,
  category_id, base_price, currency,
  image_url, is_active, is_featured,
  tags
) values (
  'Netflix Subscription',
  'netflix-subscription',
  'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV. Plans starting from basic to premium with 4K UHD.',
  'Unlimited movies and TV shows streaming.',
  'subscription',
  (select id from public.categories where slug = 'subscriptions'),
  499, 'NPR',
  '/placeholder.svg?height=400&width=300',
  true, true,
  array['streaming', 'netflix', 'movies', 'tv-shows']
) on conflict (slug) do nothing;

-- Insert Subscription Plans
insert into public.subscription_plans (product_id, name, slug, monthly_price, features, max_devices, quality, is_popular, color, sort_order) values
  ((select id from public.products where slug = 'netflix-subscription'), 'Basic', 'basic', 499, array['1 screen at a time', 'HD available', 'Watch on phone and tablet'], 1, 'HD', false, 'zinc', 1),
  ((select id from public.products where slug = 'netflix-subscription'), 'Standard', 'standard', 899, array['2 screens at a time', 'Full HD available', 'Watch on any device', 'Download on 2 devices'], 2, 'Full HD', true, 'amber', 2),
  ((select id from public.products where slug = 'netflix-subscription'), 'Premium', 'premium', 1299, array['4 screens at a time', '4K UHD + HDR', 'Watch on any device', 'Download on 6 devices', 'Netflix Spatial Audio'], 4, '4K UHD', false, 'zinc', 3)
on conflict (product_id, slug) do nothing;

-- Insert Subscription Durations
insert into public.subscription_durations (product_id, months, label, discount_percent, is_popular, sort_order) values
  ((select id from public.products where slug = 'netflix-subscription'), 1, '1 Month', 0, false, 1),
  ((select id from public.products where slug = 'netflix-subscription'), 3, '3 Months', 10, false, 2),
  ((select id from public.products where slug = 'netflix-subscription'), 6, '6 Months', 15, true, 3),
  ((select id from public.products where slug = 'netflix-subscription'), 12, '12 Months', 25, false, 4)
on conflict (product_id, months) do nothing;

-- Insert Sample Software Product
insert into public.products (
  title, slug, description, short_description, product_type,
  category_id, base_price, currency,
  image_url, is_active, is_featured,
  publisher, tags
) values (
  'Microsoft Office 365',
  'microsoft-office-365',
  'Get premium versions of Word, Excel, PowerPoint, Outlook, and more. Includes 1TB of OneDrive cloud storage.',
  'Premium Office apps with cloud storage.',
  'software',
  (select id from public.categories where slug = 'software'),
  4999, 'NPR',
  '/placeholder.svg?height=400&width=300',
  true, true,
  'Microsoft',
  array['office', 'productivity', 'microsoft', 'word', 'excel']
) on conflict (slug) do nothing;

-- Insert Software License Types
insert into public.software_license_types (product_id, name, slug, price, max_devices, max_users, features, is_popular, sort_order) values
  ((select id from public.products where slug = 'microsoft-office-365'), 'Personal', 'personal', 4999, 1, 1, array['1 user', '1 device', '1TB OneDrive', 'Premium Office apps'], false, 1),
  ((select id from public.products where slug = 'microsoft-office-365'), 'Family', 'family', 7999, 5, 6, array['Up to 6 users', '5 devices per user', '1TB OneDrive per user', 'Premium Office apps', 'Family Safety features'], true, 2),
  ((select id from public.products where slug = 'microsoft-office-365'), 'Business', 'business', 14999, 25, 25, array['Up to 25 users', 'Unlimited devices', '1TB OneDrive per user', 'Premium Office apps', 'Business email', 'Microsoft Teams', 'Admin controls'], false, 3)
on conflict (product_id, slug) do nothing;

-- Insert Software License Durations
insert into public.software_license_durations (product_id, duration_type, label, price_multiplier, discount_percent, is_popular, sort_order) values
  ((select id from public.products where slug = 'microsoft-office-365'), '1year', '1 Year', 1.0, 0, false, 1),
  ((select id from public.products where slug = 'microsoft-office-365'), '2year', '2 Years', 1.8, 10, true, 2),
  ((select id from public.products where slug = 'microsoft-office-365'), 'lifetime', 'Lifetime', 3.0, 25, false, 3)
on conflict (product_id, duration_type) do nothing;

-- Link products to platforms
insert into public.product_platforms (product_id, platform_id) values
  ((select id from public.products where slug = 'elden-ring'), (select id from public.platforms where slug = 'pc')),
  ((select id from public.products where slug = 'elden-ring'), (select id from public.platforms where slug = 'playstation')),
  ((select id from public.products where slug = 'elden-ring'), (select id from public.platforms where slug = 'xbox'))
on conflict (product_id, platform_id) do nothing;
