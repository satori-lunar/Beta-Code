-- Add admin policies for weight_entries, habits, habit_completions, and class_reminders
-- This allows admins to view all user data in the admin dashboard

-- First, ensure the role column exists in users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin'));

-- Admin policy for weight_entries (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'weight_entries'
  ) THEN
    DROP POLICY IF EXISTS "Admins can view all weight entries" ON public.weight_entries;
    EXECUTE '
      CREATE POLICY "Admins can view all weight entries"
        ON public.weight_entries FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = ''admin''
          )
        )';
  END IF;
END $$;

-- Admin policy for habits (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'habits'
  ) THEN
    DROP POLICY IF EXISTS "Admins can view all habits" ON public.habits;
    EXECUTE '
      CREATE POLICY "Admins can view all habits"
        ON public.habits FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = ''admin''
          )
        )';
  END IF;
END $$;

-- Admin policy for habit_completions (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'habit_completions'
  ) THEN
    DROP POLICY IF EXISTS "Admins can view all habit completions" ON public.habit_completions;
    EXECUTE '
      CREATE POLICY "Admins can view all habit completions"
        ON public.habit_completions FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = ''admin''
          )
        )';
  END IF;
END $$;

-- Admin policy for class_reminders (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'class_reminders'
  ) THEN
    DROP POLICY IF EXISTS "Admins can view all class reminders" ON public.class_reminders;
    EXECUTE '
      CREATE POLICY "Admins can view all class reminders"
        ON public.class_reminders FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = ''admin''
          )
        )';
  END IF;
END $$;

