-- Set up first admin user
-- Run this after the user account exists for elliotmccormick@satori-lunar.com

-- First, ensure the user exists in the users table
-- This will be created automatically when they sign up, but we can also create it manually if needed
INSERT INTO public.users (id, email, name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  'admin'
FROM auth.users au
WHERE au.email = 'elliotmccormick@satori-lunar.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, public.users.name);

-- Add to admin_users table
INSERT INTO public.admin_users (user_id, email, assigned_by)
SELECT 
  id,
  email,
  id -- Self-assigned for first admin
FROM public.users
WHERE email = 'elliotmccormick@satori-lunar.com'
ON CONFLICT (user_id) DO NOTHING;

-- Verify the admin was set up
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  au.assigned_at
FROM public.users u
LEFT JOIN public.admin_users au ON u.id = au.user_id
WHERE u.email = 'elliotmccormick@satori-lunar.com';
