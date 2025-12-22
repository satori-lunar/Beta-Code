-- Ensure role column exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' 
CHECK (role IN ('member', 'admin'));

-- Set the admin user
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'elliotmccormick@satori-lunar.com';

-- Create a security definer function to check if current user is admin
-- This bypasses RLS to avoid infinite recursion
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
  
  RETURN COALESCE(user_role = 'admin', FALSE);
END;
$$;

-- Drop existing policies on users table that might conflict
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users, users can view own" ON public.users;

-- Create a policy that allows admins to view all users
-- AND allows users to view their own profile
-- Uses the security definer function to avoid recursion
CREATE POLICY "Admins can view all users, users can view own"
ON public.users
FOR SELECT
USING (
  -- Admins can see everyone (using function that bypasses RLS)
  public.is_admin()
  OR
  -- Users can see themselves
  auth.uid() = id
);

-- Grant necessary permissions
GRANT SELECT ON public.users TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

