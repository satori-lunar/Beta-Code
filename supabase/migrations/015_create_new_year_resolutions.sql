-- Create new_year_resolutions table
-- This table stores user New Year's resolutions with milestones and reflections

CREATE TABLE IF NOT EXISTS public.new_year_resolutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL, -- e.g., 2025
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- Custom categories allowed
  why_important TEXT, -- Why this matters to them
  milestones JSONB DEFAULT '[]'::jsonb, -- Array of milestone objects
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  target_date DATE, -- Optional target date
  reflections JSONB DEFAULT '[]'::jsonb, -- Array of reflection entries
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, year, title) -- One resolution per title per year
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_new_year_resolutions_user_id ON public.new_year_resolutions(user_id);
CREATE INDEX IF NOT EXISTS idx_new_year_resolutions_year ON public.new_year_resolutions(year);
CREATE INDEX IF NOT EXISTS idx_new_year_resolutions_status ON public.new_year_resolutions(status);
CREATE INDEX IF NOT EXISTS idx_new_year_resolutions_user_year ON public.new_year_resolutions(user_id, year);

-- Enable Row Level Security
ALTER TABLE public.new_year_resolutions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own resolutions"
  ON public.new_year_resolutions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resolutions"
  ON public.new_year_resolutions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resolutions"
  ON public.new_year_resolutions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resolutions"
  ON public.new_year_resolutions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_new_year_resolutions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_new_year_resolutions_updated_at
  BEFORE UPDATE ON public.new_year_resolutions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_new_year_resolutions_updated_at();

