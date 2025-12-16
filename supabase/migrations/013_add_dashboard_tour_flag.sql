-- Add has_completed_dashboard_tour flag to user_profiles
-- Safe to run multiple times

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'has_completed_dashboard_tour'
  ) THEN
    ALTER TABLE public.user_profiles
    ADD COLUMN has_completed_dashboard_tour BOOLEAN;
  END IF;
END $$;

