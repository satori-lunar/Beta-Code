-- Fix admin_lv2 access to habits and class_reminders
-- Update policies to use is_admin() function which includes both admin and admin_lv2

-- Ensure is_admin function exists and includes admin_lv2 (from migration 035)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.users
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role IN ('admin', 'admin_lv2'), FALSE);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Update habits policy to use is_admin() function
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'habits'
  ) THEN
    -- Drop existing admin policy
    DROP POLICY IF EXISTS "Admins can view all habits" ON public.habits;
    
    -- Create new policy using is_admin() function
    CREATE POLICY "Admins can view all habits, users can view own"
      ON public.habits FOR SELECT
      USING (
        public.is_admin() -- Includes both admin and admin_lv2
        OR
        auth.uid() = user_id -- Users can see their own
      );
  END IF;
END $$;

-- Update habit_completions policy to use is_admin() function
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'habit_completions'
  ) THEN
    -- Drop existing admin policy
    DROP POLICY IF EXISTS "Admins can view all habit completions" ON public.habit_completions;
    
    -- Create new policy using is_admin() function
    CREATE POLICY "Admins can view all habit completions, users can view own"
      ON public.habit_completions FOR SELECT
      USING (
        public.is_admin() -- Includes both admin and admin_lv2
        OR
        auth.uid() = user_id -- Users can see their own
      );
  END IF;
END $$;

-- Update class_reminders policy to use is_admin() function
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'class_reminders'
  ) THEN
    -- Drop existing admin policy
    DROP POLICY IF EXISTS "Admins can view all class reminders" ON public.class_reminders;
    
    -- Create new policy using is_admin() function
    CREATE POLICY "Admins can view all class reminders, users can view own"
      ON public.class_reminders FOR SELECT
      USING (
        public.is_admin() -- Includes both admin and admin_lv2
        OR
        auth.uid() = user_id -- Users can see their own
      );
  END IF;
END $$;

-- Add comments
COMMENT ON POLICY "Admins can view all habits, users can view own" ON public.habits IS 
'Allows admins and admin_lv2 to view all habits, and users to view their own. Uses is_admin() function.';

COMMENT ON POLICY "Admins can view all habit completions, users can view own" ON public.habit_completions IS 
'Allows admins and admin_lv2 to view all habit completions, and users to view their own. Uses is_admin() function.';

COMMENT ON POLICY "Admins can view all class reminders, users can view own" ON public.class_reminders IS 
'Allows admins and admin_lv2 to view all class reminders, and users to view their own. Uses is_admin() function.';

