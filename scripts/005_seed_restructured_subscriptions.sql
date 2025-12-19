-- Clear existing subscription data
delete from public.subscription_durations;
delete from public.subscription_plans;

-- Get product IDs for Netflix and Spotify (if they exist)
do $$
declare
  netflix_id uuid;
  spotify_id uuid;
  netflix_basic_id uuid;
  netflix_standard_id uuid;
  netflix_premium_id uuid;
  spotify_individual_id uuid;
  spotify_duo_id uuid;
  spotify_family_id uuid;
begin
  -- Get Netflix product
  select id into netflix_id from public.products where slug = 'netflix-subscription' limit 1;
  
  -- Get Spotify product
  select id into spotify_id from public.products where slug = 'spotify-premium' limit 1;
  
  -- Insert Netflix plans if product exists
  if netflix_id is not null then
    -- Netflix Basic Plan
    insert into public.subscription_plans (product_id, name, slug, description, features, max_devices, max_users, quality, is_popular, is_available, color, sort_order)
    values (
      netflix_id,
      'Basic',
      'basic',
      'Perfect for individuals',
      array['HD quality', '1 device at a time', 'Download on 1 device', 'All content available'],
      1,
      1,
      'HD',
      false,
      true,
      '#e50914',
      1
    )
    returning id into netflix_basic_id;
    
    -- Add durations for Netflix Basic
    insert into public.subscription_durations (plan_id, months, label, price, discount_percent, is_popular, is_available, sort_order)
    values
      (netflix_basic_id, 1, '1 Month', 9.99, 0, false, true, 1),
      (netflix_basic_id, 3, '3 Months', 27.99, 7, false, true, 2),
      (netflix_basic_id, 6, '6 Months', 53.99, 10, true, true, 3),
      (netflix_basic_id, 12, '12 Months', 99.99, 17, false, true, 4);
    
    -- Netflix Standard Plan
    insert into public.subscription_plans (product_id, name, slug, description, features, max_devices, max_users, quality, is_popular, is_available, color, sort_order)
    values (
      netflix_id,
      'Standard',
      'standard',
      'Great for couples and small families',
      array['Full HD quality', '2 devices at a time', 'Download on 2 devices', 'All content available'],
      2,
      2,
      'Full HD',
      true,
      true,
      '#e50914',
      2
    )
    returning id into netflix_standard_id;
    
    -- Add durations for Netflix Standard
    insert into public.subscription_durations (plan_id, months, label, price, discount_percent, is_popular, is_available, sort_order)
    values
      (netflix_standard_id, 1, '1 Month', 15.49, 0, false, true, 1),
      (netflix_standard_id, 3, '3 Months', 43.99, 5, false, true, 2),
      (netflix_standard_id, 6, '6 Months', 83.99, 10, true, true, 3),
      (netflix_standard_id, 12, '12 Months', 149.99, 19, false, true, 4);
    
    -- Netflix Premium Plan
    insert into public.subscription_plans (product_id, name, slug, description, features, max_devices, max_users, quality, is_popular, is_available, color, sort_order)
    values (
      netflix_id,
      'Premium',
      'premium',
      'Best for larger families',
      array['4K + HDR quality', '4 devices at a time', 'Download on 4 devices', 'All content available', 'Spatial audio'],
      4,
      4,
      '4K + HDR',
      false,
      true,
      '#e50914',
      3
    )
    returning id into netflix_premium_id;
    
    -- Add durations for Netflix Premium
    insert into public.subscription_durations (plan_id, months, label, price, discount_percent, is_popular, is_available, sort_order)
    values
      (netflix_premium_id, 1, '1 Month', 19.99, 0, false, true, 1),
      (netflix_premium_id, 3, '3 Months', 56.99, 5, false, true, 2),
      (netflix_premium_id, 6, '6 Months', 107.99, 10, true, true, 3),
      (netflix_premium_id, 12, '12 Months', 199.99, 17, false, true, 4);
  end if;
  
  -- Insert Spotify plans if product exists
  if spotify_id is not null then
    -- Spotify Individual Plan
    insert into public.subscription_plans (product_id, name, slug, description, features, max_devices, max_users, quality, is_popular, is_available, color, sort_order)
    values (
      spotify_id,
      'Individual',
      'individual',
      'For one person',
      array['Ad-free music', 'Offline listening', 'Play anywhere', 'High quality audio'],
      5,
      1,
      'High',
      false,
      true,
      '#1DB954',
      1
    )
    returning id into spotify_individual_id;
    
    -- Add durations for Spotify Individual
    insert into public.subscription_durations (plan_id, months, label, price, discount_percent, is_popular, is_available, sort_order)
    values
      (spotify_individual_id, 1, '1 Month', 10.99, 0, false, true, 1),
      (spotify_individual_id, 3, '3 Months', 31.99, 3, false, true, 2),
      (spotify_individual_id, 6, '6 Months', 59.99, 9, true, true, 3),
      (spotify_individual_id, 12, '12 Months', 109.99, 17, false, true, 4);
    
    -- Spotify Duo Plan
    insert into public.subscription_plans (product_id, name, slug, description, features, max_devices, max_users, quality, is_popular, is_available, color, sort_order)
    values (
      spotify_id,
      'Duo',
      'duo',
      'For two people living together',
      array['2 Premium accounts', 'Ad-free music', 'Offline listening', 'Duo Mix playlist'],
      10,
      2,
      'High',
      true,
      true,
      '#1DB954',
      2
    )
    returning id into spotify_duo_id;
    
    -- Add durations for Spotify Duo
    insert into public.subscription_durations (plan_id, months, label, price, discount_percent, is_popular, is_available, sort_order)
    values
      (spotify_duo_id, 1, '1 Month', 14.99, 0, false, true, 1),
      (spotify_duo_id, 3, '3 Months', 42.99, 4, false, true, 2),
      (spotify_duo_id, 6, '6 Months', 80.99, 10, true, true, 3),
      (spotify_duo_id, 12, '12 Months', 149.99, 17, false, true, 4);
    
    -- Spotify Family Plan
    insert into public.subscription_plans (product_id, name, slug, description, features, max_devices, max_users, quality, is_popular, is_available, color, sort_order)
    values (
      spotify_id,
      'Family',
      'family',
      'For up to 6 people',
      array['Up to 6 Premium accounts', 'Ad-free music', 'Offline listening', 'Family Mix playlist', 'Parental controls'],
      30,
      6,
      'High',
      false,
      true,
      '#1DB954',
      3
    )
    returning id into spotify_family_id;
    
    -- Add durations for Spotify Family
    insert into public.subscription_durations (plan_id, months, label, price, discount_percent, is_popular, is_available, sort_order)
    values
      (spotify_family_id, 1, '1 Month', 16.99, 0, false, true, 1),
      (spotify_family_id, 3, '3 Months', 48.99, 4, false, true, 2),
      (spotify_family_id, 6, '6 Months', 91.99, 10, true, true, 3),
      (spotify_family_id, 12, '12 Months', 169.99, 17, false, true, 4);
  end if;
  
end $$;
