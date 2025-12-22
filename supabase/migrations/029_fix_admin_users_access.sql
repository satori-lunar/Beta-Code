-- Ensure role column exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' 
CHECK (role IN ('member', 'admin'));

-- Set the admin user
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'elliotmccormick@satori-lunar.com';

-- Drop existing policies on users table that might conflict
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can view all users" ON public.users;

-- Create a policy that allows admins to view all users
-- AND allows users to view their own profile
CREATE POLICY "Admins can view all users, users can view own"
ON public.users
FOR SELECT
USING (
  -- Admins can see everyone
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
  OR
  -- Users can see themselves
  auth.uid() = id
);

-- Grant necessary permissions
GRANT SELECT ON public.users TO authenticated;

