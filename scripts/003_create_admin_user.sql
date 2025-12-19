-- Update a specific user to admin role (run this after creating your admin account)
-- Replace 'admin@example.com' with your actual admin email
-- This script is for manual admin promotion

-- To promote a user to admin, run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- For now, we'll create a function that can be called to promote users
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin', updated_at = NOW()
  WHERE email = user_email;
END;
$$;
