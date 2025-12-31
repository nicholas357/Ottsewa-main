-- Add recommended_order column to products table for controlling homepage recommended section order
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS recommended_order integer DEFAULT null;

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS idx_products_recommended_order ON public.products(recommended_order) WHERE recommended_order IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN public.products.recommended_order IS 'Order position in homepage recommended section. NULL means not in recommended, lower numbers appear first.';
