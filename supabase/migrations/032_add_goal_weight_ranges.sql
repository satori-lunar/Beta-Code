-- Add goal weight range columns to user_profiles table
-- This allows users to set a range for their goal weight instead of just a specific number

DO $$ 
BEGIN
  -- Add ultimate_goal_weight_min column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'ultimate_goal_weight_min'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN ultimate_goal_weight_min DECIMAL(5,2);
  END IF;

  -- Add ultimate_goal_weight_max column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'ultimate_goal_weight_max'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN ultimate_goal_weight_max DECIMAL(5,2);
  END IF;

  -- Add weekly_goal_weight_min column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'weekly_goal_weight_min'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN weekly_goal_weight_min DECIMAL(5,2);
  END IF;

  -- Add weekly_goal_weight_max column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'weekly_goal_weight_max'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN weekly_goal_weight_max DECIMAL(5,2);
  END IF;
END $$;

-- Add comments to explain the columns
COMMENT ON COLUMN public.user_profiles.ultimate_goal_weight_min IS 'Minimum weight for ultimate goal range (optional, use with ultimate_goal_weight_max for range)';
COMMENT ON COLUMN public.user_profiles.ultimate_goal_weight_max IS 'Maximum weight for ultimate goal range (optional, use with ultimate_goal_weight_min for range)';
COMMENT ON COLUMN public.user_profiles.weekly_goal_weight_min IS 'Minimum weight for weekly goal range (optional, use with weekly_goal_weight_max for range)';
COMMENT ON COLUMN public.user_profiles.weekly_goal_weight_max IS 'Maximum weight for weekly goal range (optional, use with weekly_goal_weight_min for range)';

