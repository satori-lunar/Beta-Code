-- Add admin policies for weight_entries, habits, habit_completions, and class_reminders
-- This allows admins to view all user data in the admin dashboard

-- Admin policy for weight_entries
CREATE POLICY IF NOT EXISTS "Admins can view all weight entries"
  ON public.weight_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admin policy for habits
CREATE POLICY IF NOT EXISTS "Admins can view all habits"
  ON public.habits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admin policy for habit_completions
CREATE POLICY IF NOT EXISTS "Admins can view all habit completions"
  ON public.habit_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admin policy for class_reminders
CREATE POLICY IF NOT EXISTS "Admins can view all class reminders"
  ON public.class_reminders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

