-- Add goal_weight to user_profiles table
-- This allows users to set a target weight goal

-- Add goal_weight column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'goal_weight'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN goal_weight DECIMAL(5,2),
    ADD COLUMN goal_weight_unit TEXT DEFAULT 'lbs' CHECK (goal_weight_unit IN ('kg', 'lbs'));
  END IF;
END $$;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_goal_weight ON public.user_profiles(goal_weight) WHERE goal_weight IS NOT NULL;
