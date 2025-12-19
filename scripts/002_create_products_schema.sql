-- =====================================================
-- COMPREHENSIVE PRODUCTS DATABASE SCHEMA
-- Supports: Games, Gift Cards, Subscriptions, Software
-- =====================================================

-- Drop existing products table and recreate with full schema
-- Note: This will delete existing data. Run only on fresh setup or backup first.

-- =====================================================
-- 1. CATEGORIES TABLE
-- =====================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text, -- icon name or URL
  parent_id uuid references public.categories(id) on delete set null,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for categories
alter table public.categories enable row level security;

-- Anyone can view active categories
create policy "categories_select_all"
on public.categories for select
using (is_active = true);

-- Only admins can manage categories
create policy "categories_admin_all"
on public.categories for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 2. PLATFORMS TABLE
-- =====================================================
create table if not exists public.platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS for platforms
alter table public.platforms enable row level security;

create policy "platforms_select_all"
on public.platforms for select
using (is_active = true);

create policy "platforms_admin_all"
on public.platforms for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 3. ENHANCED PRODUCTS TABLE
-- =====================================================
-- First, drop existing products table constraints if needed
-- alter table public.orders drop constraint if exists orders_product_id_fkey;

-- Recreate products table with comprehensive fields
drop table if exists public.products cascade;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  
  -- Basic Info
  title text not null,
  slug text not null unique,
  description text,
  short_description text,
  
  -- Product Type: 'game', 'giftcard', 'subscription', 'software'
  product_type text not null check (product_type in ('game', 'giftcard', 'subscription', 'software')),
  
  -- Category & Platform
  category_id uuid references public.categories(id) on delete set null,
  
  -- Pricing
  base_price numeric(10,2) not null default 0,
  original_price numeric(10,2), -- for showing discounts
  currency text default 'NPR',
  
  -- Discounts & Offers
  discount_percent integer default 0 check (discount_percent >= 0 and discount_percent <= 100),
  cashback_percent integer default 0 check (cashback_percent >= 0 and cashback_percent <= 100),
  
  -- Media
  image_url text,
  thumbnail_url text,
  gallery_images jsonb default '[]'::jsonb, -- array of image URLs
  video_url text,
  
  -- Inventory
  stock integer default 0,
  is_digital boolean default true,
  is_preorder boolean default false,
  release_date date,
  
  -- SEO & Display
  meta_title text,
  meta_description text,
  tags text[] default '{}',
  
  -- Status
  is_active boolean default true,
  is_featured boolean default false,
  is_bestseller boolean default false,
  is_new boolean default false,
  
  -- Region
  region text default 'Global',
  regions_available text[] default '{Global}',
  
  -- Ratings & Reviews
  average_rating numeric(2,1) default 0 check (average_rating >= 0 and average_rating <= 5),
  review_count integer default 0,
  
  -- Additional Info
  publisher text,
  developer text,
  
  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for products
alter table public.products enable row level security;

-- Anyone can view active products
create policy "products_select_all"
on public.products for select
using (is_active = true);

-- Only admins can manage products
create policy "products_admin_insert"
on public.products for insert
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "products_admin_update"
on public.products for update
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "products_admin_delete"
on public.products for delete
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 4. PRODUCT PLATFORMS (Many-to-Many)
-- =====================================================
create table if not exists public.product_platforms (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  platform_id uuid not null references public.platforms(id) on delete cascade,
  price_modifier numeric(10,2) default 0, -- additional price for this platform
  is_available boolean default true,
  created_at timestamp with time zone default now(),
  unique(product_id, platform_id)
);

-- Enable RLS
alter table public.product_platforms enable row level security;

create policy "product_platforms_select_all"
on public.product_platforms for select
using (true);

create policy "product_platforms_admin_all"
on public.product_platforms for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 5. GAME EDITIONS TABLE
-- =====================================================
create table if not exists public.game_editions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null, -- 'Standard', 'Deluxe', 'Ultimate', etc.
  slug text not null,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  description text,
  includes text[] default '{}', -- array of what's included
  image_url text,
  is_default boolean default false,
  is_available boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(product_id, slug)
);

-- Enable RLS
alter table public.game_editions enable row level security;

create policy "game_editions_select_all"
on public.game_editions for select
using (is_available = true);

create policy "game_editions_admin_all"
on public.game_editions for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 6. GIFT CARD DENOMINATIONS TABLE
-- =====================================================
create table if not exists public.gift_card_denominations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  value numeric(10,2) not null, -- face value (e.g., 200, 500, 1000)
  price numeric(10,2) not null, -- actual price (can be different from value)
  currency text default 'NPR',
  bonus_value numeric(10,2) default 0, -- bonus amount if any
  is_popular boolean default false,
  is_available boolean default true,
  stock integer default 0,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  unique(product_id, value)
);

-- Enable RLS
alter table public.gift_card_denominations enable row level security;

create policy "gift_card_denominations_select_all"
on public.gift_card_denominations for select
using (is_available = true);

create policy "gift_card_denominations_admin_all"
on public.gift_card_denominations for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 7. SUBSCRIPTION PLANS TABLE
-- =====================================================
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null, -- 'Basic', 'Standard', 'Premium'
  slug text not null,
  monthly_price numeric(10,2) not null,
  description text,
  features text[] default '{}', -- array of features included
  max_devices integer default 1,
  max_users integer default 1,
  quality text, -- e.g., 'HD', '4K', etc.
  is_popular boolean default false,
  is_available boolean default true,
  color text, -- for UI styling
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(product_id, slug)
);

-- Enable RLS
alter table public.subscription_plans enable row level security;

create policy "subscription_plans_select_all"
on public.subscription_plans for select
using (is_available = true);

create policy "subscription_plans_admin_all"
on public.subscription_plans for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 8. SUBSCRIPTION DURATIONS TABLE
-- =====================================================
create table if not exists public.subscription_durations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  months integer not null, -- 1, 3, 6, 12
  label text not null, -- '1 Month', '3 Months', etc.
  discount_percent integer default 0,
  is_popular boolean default false,
  is_available boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  unique(product_id, months)
);

-- Enable RLS
alter table public.subscription_durations enable row level security;

create policy "subscription_durations_select_all"
on public.subscription_durations for select
using (is_available = true);

create policy "subscription_durations_admin_all"
on public.subscription_durations for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 9. SOFTWARE LICENSE TYPES TABLE
-- =====================================================
create table if not exists public.software_license_types (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null, -- 'Single User', 'Family', 'Business'
  slug text not null,
  price numeric(10,2) not null,
  max_devices integer default 1,
  max_users integer default 1,
  description text,
  features text[] default '{}',
  is_popular boolean default false,
  is_available boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(product_id, slug)
);

-- Enable RLS
alter table public.software_license_types enable row level security;

create policy "software_license_types_select_all"
on public.software_license_types for select
using (is_available = true);

create policy "software_license_types_admin_all"
on public.software_license_types for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 10. SOFTWARE LICENSE DURATIONS TABLE
-- =====================================================
create table if not exists public.software_license_durations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  duration_type text not null check (duration_type in ('1year', '2year', '3year', 'lifetime')),
  label text not null, -- '1 Year', '2 Years', 'Lifetime'
  price_multiplier numeric(3,2) default 1.0, -- multiply base price
  discount_percent integer default 0,
  is_popular boolean default false,
  is_available boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  unique(product_id, duration_type)
);

-- Enable RLS
alter table public.software_license_durations enable row level security;

create policy "software_license_durations_select_all"
on public.software_license_durations for select
using (is_available = true);

create policy "software_license_durations_admin_all"
on public.software_license_durations for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 11. PRODUCT KEYS/CODES TABLE (Inventory)
-- =====================================================
create table if not exists public.product_keys (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  edition_id uuid references public.game_editions(id) on delete set null,
  denomination_id uuid references public.gift_card_denominations(id) on delete set null,
  plan_id uuid references public.subscription_plans(id) on delete set null,
  license_type_id uuid references public.software_license_types(id) on delete set null,
  platform_id uuid references public.platforms(id) on delete set null,
  
  code text not null, -- the actual key/code
  is_used boolean default false,
  used_at timestamp with time zone,
  used_by uuid references auth.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  
  -- Validity
  expires_at timestamp with time zone,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.product_keys enable row level security;

-- Only admins can view/manage keys
create policy "product_keys_admin_all"
on public.product_keys for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Users can view their own purchased keys
create policy "product_keys_select_own"
on public.product_keys for select
using (used_by = auth.uid());

-- =====================================================
-- 12. REVIEWS TABLE
-- =====================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  content text,
  
  is_verified_purchase boolean default false,
  is_approved boolean default false,
  is_featured boolean default false,
  
  helpful_count integer default 0,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(product_id, user_id) -- one review per user per product
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Anyone can view approved reviews
create policy "reviews_select_approved"
on public.reviews for select
using (is_approved = true);

-- Users can insert their own reviews
create policy "reviews_insert_own"
on public.reviews for insert
with check (auth.uid() = user_id);

-- Users can update their own reviews
create policy "reviews_update_own"
on public.reviews for update
using (auth.uid() = user_id);

-- Admins can manage all reviews
create policy "reviews_admin_all"
on public.reviews for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =====================================================
-- 13. WISHLIST TABLE
-- =====================================================
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- Enable RLS
alter table public.wishlist enable row level security;

-- Users can manage their own wishlist
create policy "wishlist_select_own"
on public.wishlist for select
using (auth.uid() = user_id);

create policy "wishlist_insert_own"
on public.wishlist for insert
with check (auth.uid() = user_id);

create policy "wishlist_delete_own"
on public.wishlist for delete
using (auth.uid() = user_id);

-- =====================================================
-- 14. UPDATE ORDERS TABLE TO REFERENCE NEW STRUCTURE
-- =====================================================
alter table public.orders 
add column if not exists edition_id uuid references public.game_editions(id) on delete set null,
add column if not exists denomination_id uuid references public.gift_card_denominations(id) on delete set null,
add column if not exists plan_id uuid references public.subscription_plans(id) on delete set null,
add column if not exists duration_months integer,
add column if not exists license_type_id uuid references public.software_license_types(id) on delete set null,
add column if not exists license_duration text,
add column if not exists platform_id uuid references public.platforms(id) on delete set null,
add column if not exists quantity integer default 1,
add column if not exists unit_price numeric(10,2),
add column if not exists discount_amount numeric(10,2) default 0,
add column if not exists payment_proof_url text,
add column if not exists notes text,
add column if not exists updated_at timestamp with time zone default now();

-- =====================================================
-- 15. INDEXES FOR PERFORMANCE
-- =====================================================
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_type on public.products(product_type);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_featured on public.products(is_featured);

create index if not exists idx_game_editions_product on public.game_editions(product_id);
create index if not exists idx_gift_card_denominations_product on public.gift_card_denominations(product_id);
create index if not exists idx_subscription_plans_product on public.subscription_plans(product_id);
create index if not exists idx_subscription_durations_product on public.subscription_durations(product_id);
create index if not exists idx_software_license_types_product on public.software_license_types(product_id);
create index if not exists idx_software_license_durations_product on public.software_license_durations(product_id);

create index if not exists idx_product_keys_product on public.product_keys(product_id);
create index if not exists idx_product_keys_unused on public.product_keys(product_id, is_used) where is_used = false;

create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_reviews_user on public.reviews(user_id);

create index if not exists idx_wishlist_user on public.wishlist(user_id);
create index if not exists idx_wishlist_product on public.wishlist(product_id);

-- =====================================================
-- 16. FUNCTIONS FOR AUTO-UPDATING TIMESTAMPS
-- =====================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply triggers to all tables with updated_at
create trigger update_products_updated_at
  before update on public.products
  for each row execute function update_updated_at_column();

create trigger update_categories_updated_at
  before update on public.categories
  for each row execute function update_updated_at_column();

create trigger update_game_editions_updated_at
  before update on public.game_editions
  for each row execute function update_updated_at_column();

create trigger update_subscription_plans_updated_at
  before update on public.subscription_plans
  for each row execute function update_updated_at_column();

create trigger update_software_license_types_updated_at
  before update on public.software_license_types
  for each row execute function update_updated_at_column();

create trigger update_reviews_updated_at
  before update on public.reviews
  for each row execute function update_updated_at_column();

create trigger update_product_keys_updated_at
  before update on public.product_keys
  for each row execute function update_updated_at_column();

create trigger update_orders_updated_at
  before update on public.orders
  for each row execute function update_updated_at_column();

-- =====================================================
-- 17. FUNCTION TO UPDATE PRODUCT RATING
-- =====================================================
create or replace function update_product_rating()
returns trigger as $$
begin
  update public.products
  set 
    average_rating = (
      select coalesce(avg(rating)::numeric(2,1), 0)
      from public.reviews
      where product_id = coalesce(new.product_id, old.product_id)
      and is_approved = true
    ),
    review_count = (
      select count(*)
      from public.reviews
      where product_id = coalesce(new.product_id, old.product_id)
      and is_approved = true
    )
  where id = coalesce(new.product_id, old.product_id);
  
  return coalesce(new, old);
end;
$$ language plpgsql;

create trigger update_product_rating_on_review
  after insert or update or delete on public.reviews
  for each row execute function update_product_rating();
