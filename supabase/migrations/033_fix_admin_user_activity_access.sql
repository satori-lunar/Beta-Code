-- Fix admin access to user_activity table
-- Use the same SECURITY DEFINER function approach to avoid infinite recursion

-- Drop existing admin policy if it exists
DROP POLICY IF EXISTS "Admins can view all activity" ON public.user_activity;

-- Create or replace the is_admin function if it doesn't exist (from migration 029)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to run with the privileges of the function owner (postgres), bypassing RLS
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Create a policy that allows admins (using the security definer function) to view all activity
-- AND allows users to view their own activity
CREATE POLICY "Admins can view all activity, users can view own"
ON public.user_activity
FOR SELECT
USING (
  public.is_admin() -- Admins can see everyone (bypasses RLS on users table itself)
  OR
  auth.uid() = user_id -- Users can see themselves
);

-- Add comment
COMMENT ON POLICY "Admins can view all activity, users can view own" ON public.user_activity IS 
'Allows admins to view all user activity and users to view their own activity. Uses SECURITY DEFINER function to avoid infinite recursion.';

