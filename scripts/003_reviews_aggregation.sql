-- =====================================================
-- REVIEWS AGGREGATION & RATING SCHEMA
-- Completes the review system with aggregated ratings
-- =====================================================

-- =====================================================
-- 1. ADD REVIEW AGGREGATION VIEW
-- =====================================================
-- This view aggregates ratings and review counts for each product
create or replace view public.product_review_aggregates as
select
  product_id,
  count(*) as total_reviews,
  round(avg(rating::numeric), 1) as average_rating,
  count(case when rating = 5 then 1 end) as five_star_count,
  count(case when rating = 4 then 1 end) as four_star_count,
  count(case when rating = 3 then 1 end) as three_star_count,
  count(case when rating = 2 then 1 end) as two_star_count,
  count(case when rating = 1 then 1 end) as one_star_count,
  count(case when is_verified_purchase then 1 end) as verified_purchase_count,
  count(case when is_featured then 1 end) as featured_count,
  max(created_at) as latest_review_date
from public.reviews
where is_approved = true
group by product_id;

-- =====================================================
-- 2. ADD HELPFUL VOTES TABLE
-- =====================================================
-- Track which users found reviews helpful
create table if not exists public.review_helpful_votes (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_helpful boolean not null default true,
  created_at timestamp with time zone default now(),
  unique(review_id, user_id) -- one vote per user per review
);

-- Enable RLS
alter table public.review_helpful_votes enable row level security;

-- Users can view all helpful votes
create policy "review_helpful_votes_select_all"
on public.review_helpful_votes for select
using (true);

-- Users can insert their own votes
create policy "review_helpful_votes_insert_own"
on public.review_helpful_votes for insert
with check (auth.uid() = user_id);

-- Users can update their own votes
create policy "review_helpful_votes_update_own"
on public.review_helpful_votes for update
using (auth.uid() = user_id);

-- =====================================================
-- 3. FUNCTION TO UPDATE PRODUCT RATINGS
-- =====================================================
-- This function updates the products table with aggregated rating data
create or replace function public.update_product_rating()
returns trigger as $$
begin
  update public.products
  set
    average_rating = coalesce(
      (select avg(rating::numeric) 
       from public.reviews 
       where product_id = new.product_id 
       and is_approved = true),
      0
    ),
    review_count = coalesce(
      (select count(*) 
       from public.reviews 
       where product_id = new.product_id 
       and is_approved = true),
      0
    ),
    updated_at = now()
  where id = new.product_id;
  
  return new;
end;
$$ language plpgsql;

-- =====================================================
-- 4. TRIGGER TO UPDATE RATINGS ON REVIEW CHANGES
-- =====================================================
-- This trigger fires whenever a review is inserted, updated, or deleted
drop trigger if exists trigger_update_product_rating on public.reviews;

create trigger trigger_update_product_rating
after insert or update or delete on public.reviews
for each row
execute function public.update_product_rating();

-- =====================================================
-- 5. FUNCTION TO UPDATE HELPFUL COUNT
-- =====================================================
-- This function updates the helpful count on review helpful votes
create or replace function public.update_review_helpful_count()
returns trigger as $$
begin
  update public.reviews
  set helpful_count = (
    select count(*) 
    from public.review_helpful_votes 
    where review_id = new.review_id 
    and is_helpful = true
  )
  where id = new.review_id;
  
  return new;
end;
$$ language plpgsql;

-- =====================================================
-- 6. TRIGGER FOR HELPFUL VOTE CHANGES
-- =====================================================
drop trigger if exists trigger_update_review_helpful on public.review_helpful_votes;

create trigger trigger_update_review_helpful
after insert or update or delete on public.review_helpful_votes
for each row
execute function public.update_review_helpful_count();

-- =====================================================
-- 7. UPDATE REVIEW TABLE COMMENT
-- =====================================================
comment on table public.reviews is 'Stores individual customer reviews with verified purchase status, approval workflow, and helpful vote tracking. Ratings are automatically aggregated to the products table.';

comment on column public.reviews.id is 'Unique review identifier';
comment on column public.reviews.product_id is 'References the product being reviewed';
comment on column public.reviews.user_id is 'References the user who created the review';
comment on column public.reviews.order_id is 'References the order that may verify the purchase';
comment on column public.reviews.rating is 'Rating from 1-5 stars';
comment on column public.reviews.title is 'Short review title/headline';
comment on column public.reviews.content is 'Full review content/description';
comment on column public.reviews.is_verified_purchase is 'Indicates if review is from verified purchase';
comment on column public.reviews.is_approved is 'Indicates if review is approved by moderator';
comment on column public.reviews.is_featured is 'Indicates if review is featured on product page';
comment on column public.reviews.helpful_count is 'Number of users who found review helpful (updated automatically)';

-- =====================================================
-- 8. UPDATE PRODUCTS TABLE COMMENTS
-- =====================================================
comment on column public.products.average_rating is 'Automatically calculated average of all approved reviews (0-5)';
comment on column public.products.review_count is 'Automatically calculated count of approved reviews for this product';

-- =====================================================
-- 9. INITIAL DATA UPDATE
-- =====================================================
-- Update all products with current aggregated ratings
update public.products p
set
  average_rating = coalesce(
    (select avg(rating::numeric) 
     from public.reviews r 
     where r.product_id = p.id 
     and r.is_approved = true),
    0
  ),
  review_count = coalesce(
    (select count(*) 
     from public.reviews r 
     where r.product_id = p.id 
     and r.is_approved = true),
    0
  )
where true;
