-- Add admin policy for user_badges table
-- This allows admins to view all user badges in the admin dashboard

-- Ensure the role column exists in users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin'));

-- Ensure is_admin function exists (from migration 029)
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Admins can view all badges" ON public.user_badges;

-- Create a policy that allows admins to view all badges
-- AND allows users to view their own badges
-- Uses the security definer function to avoid recursion
CREATE POLICY "Admins can view all badges, users can view own"
ON public.user_badges
FOR SELECT
USING (
  -- Admins can see everyone (using function that bypasses RLS)
  public.is_admin()
  OR
  -- Users can see themselves
  auth.uid() = user_id
);

-- Add comment
COMMENT ON POLICY "Admins can view all badges, users can view own" ON public.user_badges IS 
'Allows admins to view all user badges and users to view their own badges. Uses SECURITY DEFINER function to avoid infinite recursion.';

