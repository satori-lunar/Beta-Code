-- Add admin policy for users table so admins can view all users
-- This is needed for the admin dashboard to show all 182 users

-- First, ensure the role column exists in users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin'));

-- Admin policy for users table (admins can view all users)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
    EXECUTE '
      CREATE POLICY "Admins can view all users"
        ON public.users FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid() 
            AND u.role = ''admin''
          )
        )';
  END IF;
END $$;

