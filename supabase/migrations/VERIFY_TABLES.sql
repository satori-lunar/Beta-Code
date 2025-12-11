-- Verification Queries for Database Tables
-- Run these in Supabase SQL Editor to verify tables were created successfully

-- 1. Check if the main tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('users', 'recorded_sessions', 'live_classes', 'user_favorite_sessions') 
    THEN '✓ Required' 
    ELSE 'Optional' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'recorded_sessions', 'live_classes', 'user_favorite_sessions')
ORDER BY table_name;

-- 2. Check all tables in the public schema (full list)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 3. Verify Kajabi tracking columns exist on recorded_sessions
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'recorded_sessions' 
AND column_name IN ('kajabi_product_id', 'kajabi_offering_id', 'synced_from_kajabi')
ORDER BY column_name;

-- 4. Verify Kajabi tracking columns exist on users
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name IN ('kajabi_contact_id', 'kajabi_tags', 'synced_from_kajabi')
ORDER BY column_name;

-- 5. Check RLS (Row Level Security) is enabled
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'recorded_sessions', 'live_classes', 'user_favorite_sessions')
ORDER BY tablename;

-- 6. Check if policies exist for the tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'recorded_sessions', 'live_classes', 'user_favorite_sessions')
ORDER BY tablename, policyname;

