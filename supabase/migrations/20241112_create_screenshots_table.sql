-- Create screenshots table to store captured screenshots and extracted data
CREATE TABLE IF NOT EXISTS public.screenshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  screenshot_data TEXT NOT NULL, -- Base64 encoded image data
  page_title TEXT,
  meta_description TEXT,
  body_text TEXT,
  headings JSONB DEFAULT '[]'::jsonb,
  links JSONB DEFAULT '[]'::jsonb,
  word_count INTEGER DEFAULT 0,
  char_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_screenshots_user_id ON public.screenshots(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_screenshots_created_at ON public.screenshots(created_at DESC);

-- Create index on url for searching
CREATE INDEX IF NOT EXISTS idx_screenshots_url ON public.screenshots(url);

-- Enable Row Level Security
ALTER TABLE public.screenshots ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only read their own screenshots
CREATE POLICY "Users can view their own screenshots"
  ON public.screenshots
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can only insert their own screenshots
CREATE POLICY "Users can insert their own screenshots"
  ON public.screenshots
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can only update their own screenshots
CREATE POLICY "Users can update their own screenshots"
  ON public.screenshots
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can only delete their own screenshots
CREATE POLICY "Users can delete their own screenshots"
  ON public.screenshots
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_screenshots_updated_at
  BEFORE UPDATE ON public.screenshots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE public.screenshots IS 'Stores website screenshots and extracted content data';

