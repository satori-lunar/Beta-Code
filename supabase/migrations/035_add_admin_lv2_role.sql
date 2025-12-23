-- Add admin_lv2 role support
-- admin_lv2 has all admin permissions except viewing weight logs

-- Update role constraint to include admin_lv2
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('member', 'admin', 'admin_lv2'));

-- Update is_admin() function to return true for both admin and admin_lv2
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

-- Create a new function to check if user is a full admin (not lv2)
-- This is used for weight_entries access
CREATE OR REPLACE FUNCTION public.is_full_admin()
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_full_admin() TO authenticated;

-- Update weight_entries policy to only allow full admins (not admin_lv2)
DROP POLICY IF EXISTS "Admins can view all weight entries" ON public.weight_entries;

-- Only update if table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'weight_entries'
  ) THEN
    EXECUTE '
      CREATE POLICY "Full admins can view all weight entries"
        ON public.weight_entries FOR SELECT
        USING (
          public.is_full_admin() -- Only full admins, not admin_lv2
        )';
  END IF;
END $$;

-- Add comment
COMMENT ON FUNCTION public.is_admin() IS 'Returns true if user is admin or admin_lv2';
COMMENT ON FUNCTION public.is_full_admin() IS 'Returns true only if user is admin (not admin_lv2). Used for weight_entries access.';

