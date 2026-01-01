-- Create meals table if it doesn't exist
-- This table stores individual meals linked to nutrition entries

-- Drop the table if it exists with wrong schema (will recreate with correct schema)
DROP TABLE IF EXISTS public.meals CASCADE;

CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nutrition_entry_id UUID NOT NULL REFERENCES public.nutrition_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  name TEXT NOT NULL,
  calories INTEGER, -- Allow null since calories are optional
  protein INTEGER DEFAULT 0,
  carbs INTEGER DEFAULT 0,
  fat INTEGER DEFAULT 0,
  time TEXT NOT NULL, -- Using TEXT for time to store HH:MM format
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_nutrition_entry_id ON public.meals(nutrition_entry_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON public.meals(created_at);

-- Enable RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meals
-- Users can view their own meals
CREATE POLICY "Users can view their own meals"
  ON public.meals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own meals
CREATE POLICY "Users can insert their own meals"
  ON public.meals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own meals
CREATE POLICY "Users can update their own meals"
  ON public.meals
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own meals
CREATE POLICY "Users can delete their own meals"
  ON public.meals
  FOR DELETE
  USING (auth.uid() = user_id);

