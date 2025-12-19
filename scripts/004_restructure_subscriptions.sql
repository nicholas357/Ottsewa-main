-- Restructure subscription_durations to link to plans instead of products
-- Drop the old subscription_durations table and create a new one linked to plans
drop table if exists public.subscription_durations cascade;

-- Create new subscription_durations table linked to plans
create table if not exists public.subscription_durations (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.subscription_plans(id) on delete cascade,
  months integer not null, -- 1, 3, 6, 12
  label text not null, -- '1 Month', '3 Months', etc.
  price numeric(10,2) not null, -- Actual price for this duration
  discount_percent integer default 0,
  is_popular boolean default false,
  is_available boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(plan_id, months)
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

-- Remove monthly_price from subscription_plans as it's now in durations
alter table public.subscription_plans drop column if exists monthly_price;

-- Add indexes for better performance
create index if not exists idx_subscription_durations_plan_id on public.subscription_durations(plan_id);
create index if not exists idx_subscription_durations_is_available on public.subscription_durations(is_available);

-- Fixed function name from update_updated_at() to update_updated_at_column()
create trigger subscription_durations_updated_at
before update on public.subscription_durations
for each row
execute function update_updated_at_column();
