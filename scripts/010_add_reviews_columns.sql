-- Migration: Add missing columns to reviews table if they don't exist
-- Run this script to ensure all required review columns exist

-- Add user_id column first if it doesn't exist (required for reviews)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.reviews ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add is_verified_purchase column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'is_verified_purchase'
  ) THEN
    ALTER TABLE public.reviews ADD COLUMN is_verified_purchase boolean DEFAULT false;
  END IF;
END $$;

-- Add is_approved column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE public.reviews ADD COLUMN is_approved boolean DEFAULT false;
  END IF;
END $$;

-- Add is_featured column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE public.reviews ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- Add helpful_count column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'helpful_count'
  ) THEN
    ALTER TABLE public.reviews ADD COLUMN helpful_count integer DEFAULT 0;
  END IF;
END $$;

-- Add title column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'title'
  ) THEN
    ALTER TABLE public.reviews ADD COLUMN title text;
  END IF;
END $$;

-- Add order_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'order_id'
  ) THEN
    ALTER TABLE public.reviews ADD COLUMN order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Update RLS policies for reviews if needed
-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "reviews_select_approved" ON public.reviews;
DROP POLICY IF EXISTS "reviews_select_all" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
DROP POLICY IF EXISTS "reviews_admin_all" ON public.reviews;

-- Recreate policies
-- Anyone can view approved reviews
CREATE POLICY "reviews_select_approved"
ON public.reviews FOR SELECT
USING (is_approved = true);

-- Users can insert their own reviews
CREATE POLICY "reviews_insert_own"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "reviews_update_own"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can manage all reviews
CREATE POLICY "reviews_admin_all"
ON public.reviews FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
