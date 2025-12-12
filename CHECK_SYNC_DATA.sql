-- Check Kajabi Sync Results
-- Run these queries in Supabase SQL Editor one at a time

-- 1. Count synced products
SELECT COUNT(*) as synced_products 
FROM recorded_sessions 
WHERE synced_from_kajabi = true;

-- 2. View synced products (if any)
SELECT 
  id,
  title,
  kajabi_product_id,
  kajabi_offering_id,
  video_url,
  synced_from_kajabi,
  created_at
FROM recorded_sessions 
WHERE synced_from_kajabi = true 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Count synced users
SELECT COUNT(*) as synced_users 
FROM users 
WHERE synced_from_kajabi = true;

-- 4. View synced users (if any)
SELECT 
  id,
  email,
  name,
  kajabi_contact_id,
  kajabi_tags,
  synced_from_kajabi,
  created_at
FROM users 
WHERE synced_from_kajabi = true 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Check ALL recorded_sessions (to see if table exists and has data)
SELECT COUNT(*) as total_recorded_sessions 
FROM recorded_sessions;

-- 6. Check ALL users (to see if table exists and has data)
SELECT COUNT(*) as total_users 
FROM users;

-- 7. Check recent recorded_sessions (last 10, regardless of sync status)
SELECT 
  id,
  title,
  kajabi_product_id,
  synced_from_kajabi,
  created_at
FROM recorded_sessions 
ORDER BY created_at DESC 
LIMIT 10;

-- 8. Check recent users (last 10, regardless of sync status)
SELECT 
  id,
  email,
  name,
  kajabi_contact_id,
  synced_from_kajabi,
  created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
