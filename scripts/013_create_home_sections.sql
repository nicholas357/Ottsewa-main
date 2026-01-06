-- =====================================================
-- HOME SECTIONS TABLE
-- Stores products assigned to specific home page sections
-- =====================================================

-- Create home_sections table
CREATE TABLE IF NOT EXISTS public.home_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type text NOT NULL CHECK (section_type IN ('games', 'game_currency', 'featured', 'new_arrivals')),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(section_type, product_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_home_sections_type ON public.home_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_home_sections_product ON public.home_sections(product_id);
CREATE INDEX IF NOT EXISTS idx_home_sections_active ON public.home_sections(is_active);

-- Enable RLS
ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;

-- Anyone can view active sections
CREATE POLICY "home_sections_select_all"
ON public.home_sections FOR SELECT
USING (is_active = true);

-- Only admins can manage sections
CREATE POLICY "home_sections_admin_all"
ON public.home_sections FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_home_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS home_sections_updated_at ON public.home_sections;
CREATE TRIGGER home_sections_updated_at
  BEFORE UPDATE ON public.home_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_home_sections_updated_at();
