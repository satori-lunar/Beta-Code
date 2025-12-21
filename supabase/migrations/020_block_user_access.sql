-- Block User Access
-- Adds ability to block users from accessing the app

-- Add blocked field to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;

-- Add blocked_reason field (optional, for admin notes)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS blocked_reason TEXT;

-- Add blocked_at timestamp
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ;

-- Create index for faster blocked user lookups
CREATE INDEX IF NOT EXISTS idx_users_is_blocked ON public.users(is_blocked) WHERE is_blocked = TRUE;

-- Block the specific user by email
UPDATE public.users
SET 
  is_blocked = TRUE,
  blocked_at = NOW(),
  blocked_reason = 'Access blocked by administrator'
WHERE email = 'beckyr4health@gmail.com';

-- Also block in auth.users if possible (this requires admin access)
-- Note: This will need to be run manually in Supabase Dashboard or via admin API
-- UPDATE auth.users
-- SET banned_until = '2099-12-31'::timestamp
-- WHERE email = 'beckyr4health@gmail.com';

-- Add comment
COMMENT ON COLUMN public.users.is_blocked IS 'Whether the user is blocked from accessing the app';
COMMENT ON COLUMN public.users.blocked_reason IS 'Reason for blocking the user (admin notes)';
COMMENT ON COLUMN public.users.blocked_at IS 'Timestamp when the user was blocked';

