-- Add admin policies for weight_entries, habits, habit_completions, and class_reminders
-- This allows admins to view all user data in the admin dashboard

-- First, ensure the role column exists in users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin'));

-- Admin policy for weight_entries
DROP POLICY IF EXISTS "Admins can view all weight entries" ON public.weight_entries;
CREATE POLICY "Admins can view all weight entries"
  ON public.weight_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admin policy for habits
DROP POLICY IF EXISTS "Admins can view all habits" ON public.habits;
CREATE POLICY "Admins can view all habits"
  ON public.habits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admin policy for habit_completions
DROP POLICY IF EXISTS "Admins can view all habit completions" ON public.habit_completions;
CREATE POLICY "Admins can view all habit completions"
  ON public.habit_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admin policy for class_reminders
DROP POLICY IF EXISTS "Admins can view all class reminders" ON public.class_reminders;
CREATE POLICY "Admins can view all class reminders"
  ON public.class_reminders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

