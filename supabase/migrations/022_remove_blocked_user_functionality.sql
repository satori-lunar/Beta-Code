-- Remove Blocked User Functionality
-- Removes all blocked user columns and unblocks all users

-- First, unblock all users
UPDATE public.users
SET 
  is_blocked = FALSE,
  blocked_reason = NULL,
  blocked_at = NULL
WHERE is_blocked = TRUE;

-- Drop the index
DROP INDEX IF EXISTS idx_users_is_blocked;

-- Remove the columns
ALTER TABLE public.users 
DROP COLUMN IF EXISTS is_blocked;

ALTER TABLE public.users 
DROP COLUMN IF EXISTS blocked_reason;

ALTER TABLE public.users 
DROP COLUMN IF EXISTS blocked_at;

