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
    -- Drop existing admin policy (if it exists)
    BEGIN
      EXECUTE 'DROP POLICY IF EXISTS "Admins can view all habits" ON public.habits';
    EXCEPTION WHEN OTHERS THEN
      NULL; -- Ignore errors
    END;
    
    -- Drop the new policy name if it exists (in case migration was partially run)
    BEGIN
      EXECUTE 'DROP POLICY IF EXISTS "Admins can view all habits, users can view own" ON public.habits';
    EXCEPTION WHEN OTHERS THEN
      NULL; -- Ignore errors
    END;
    
    -- Create new policy using is_admin() function
    BEGIN
      EXECUTE '
        CREATE POLICY "Admins can view all habits, users can view own"
          ON public.habits FOR SELECT
          USING (
            public.is_admin() -- Includes both admin and admin_lv2
            OR
            auth.uid() = user_id -- Users can see their own
          )';
    EXCEPTION WHEN duplicate_object THEN
      NULL; -- Policy already exists, that's OK
    END;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore all errors if table doesn't exist
END $$;

-- Update habit_completions policy to use is_admin() function
-- Only if table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'habit_completions'
  ) THEN
    -- Drop existing admin policy (if it exists)
    BEGIN
      EXECUTE 'DROP POLICY IF EXISTS "Admins can view all habit completions" ON public.habit_completions';
    EXCEPTION WHEN OTHERS THEN
      NULL; -- Ignore errors
    END;
    
    -- Drop the new policy name if it exists (in case migration was partially run)
    BEGIN
      EXECUTE 'DROP POLICY IF EXISTS "Admins can view all habit completions, users can view own" ON public.habit_completions';
    EXCEPTION WHEN OTHERS THEN
      NULL; -- Ignore errors
    END;
    
    -- Create new policy using is_admin() function
    BEGIN
      EXECUTE '
        CREATE POLICY "Admins can view all habit completions, users can view own"
          ON public.habit_completions FOR SELECT
          USING (
            public.is_admin() -- Includes both admin and admin_lv2
            OR
            auth.uid() = user_id -- Users can see their own
          )';
    EXCEPTION WHEN duplicate_object THEN
      NULL; -- Policy already exists, that's OK
    END;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore all errors if table doesn't exist
END $$;

-- Update class_reminders policy to use is_admin() function
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'class_reminders'
  ) THEN
    -- Drop existing admin policy (if it exists)
    BEGIN
      EXECUTE 'DROP POLICY IF EXISTS "Admins can view all class reminders" ON public.class_reminders';
    EXCEPTION WHEN OTHERS THEN
      NULL; -- Ignore errors
    END;
    
    -- Drop the new policy name if it exists (in case migration was partially run)
    BEGIN
      EXECUTE 'DROP POLICY IF EXISTS "Admins can view all class reminders, users can view own" ON public.class_reminders';
    EXCEPTION WHEN OTHERS THEN
      NULL; -- Ignore errors
    END;
    
    -- Create new policy using is_admin() function
    BEGIN
      EXECUTE '
        CREATE POLICY "Admins can view all class reminders, users can view own"
          ON public.class_reminders FOR SELECT
          USING (
            public.is_admin() -- Includes both admin and admin_lv2
            OR
            auth.uid() = user_id -- Users can see their own
          )';
    EXCEPTION WHEN duplicate_object THEN
      NULL; -- Policy already exists, that's OK
    END;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore all errors if table doesn't exist
END $$;

-- Add comments (only if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'habits') THEN
    EXECUTE 'COMMENT ON POLICY "Admins can view all habits, users can view own" ON public.habits IS ''Allows admins and admin_lv2 to view all habits, and users to view their own. Uses is_admin() function.''';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'habit_completions') THEN
    EXECUTE 'COMMENT ON POLICY "Admins can view all habit completions, users can view own" ON public.habit_completions IS ''Allows admins and admin_lv2 to view all habit completions, and users to view their own. Uses is_admin() function.''';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'class_reminders') THEN
    EXECUTE 'COMMENT ON POLICY "Admins can view all class reminders, users can view own" ON public.class_reminders IS ''Allows admins and admin_lv2 to view all class reminders, and users to view their own. Uses is_admin() function.''';
  END IF;
END $$;

