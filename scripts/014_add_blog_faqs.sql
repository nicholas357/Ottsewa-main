-- Add FAQs column to blogs table
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN blogs.faqs IS 'Array of FAQ objects with question and answer fields: [{question: string, answer: string}]';
