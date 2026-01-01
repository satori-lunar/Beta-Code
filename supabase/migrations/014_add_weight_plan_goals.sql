-- Add weight plan goal fields to user_profiles table
-- This allows users to set ultimate goal, weekly goal, and new year resolution

DO $$ 
BEGIN
  -- Add ultimate_goal_weight column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'ultimate_goal_weight'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN ultimate_goal_weight DECIMAL(5,2);
  END IF;

  -- Add weekly_goal_weight column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'weekly_goal_weight'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN weekly_goal_weight DECIMAL(5,2);
  END IF;

  -- Add new_year_resolution_weight column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'new_year_resolution_weight'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN new_year_resolution_weight DECIMAL(5,2);
  END IF;
END $$;

