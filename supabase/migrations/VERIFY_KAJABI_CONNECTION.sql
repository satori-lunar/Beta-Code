-- Kajabi Connection Verification SQL Script
-- Run this in Supabase SQL Editor to verify database setup for Kajabi integration

-- ============================================================================
-- STEP 1: Check if required tables exist
-- ============================================================================
SELECT 
  'Step 1: Table Existence Check' as verification_step,
  table_name,
  CASE 
    WHEN table_name IN ('users', 'recorded_sessions') 
    THEN '✅ EXISTS' 
    ELSE '❌ MISSING' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'recorded_sessions')
ORDER BY table_name;

-- ============================================================================
-- STEP 2: Verify Kajabi columns exist on recorded_sessions table
-- ============================================================================
SELECT 
  'Step 2: recorded_sessions Kajabi Columns' as verification_step,
  column_name, 
  data_type, 
  is_nullable,
  CASE 
    WHEN column_name IN ('kajabi_product_id', 'kajabi_offering_id', 'synced_from_kajabi')
    THEN '✅ FOUND'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'recorded_sessions' 
AND column_name IN ('kajabi_product_id', 'kajabi_offering_id', 'synced_from_kajabi')
ORDER BY column_name;

-- Count how many Kajabi columns are found
SELECT 
  'Step 2 Summary' as verification_step,
  COUNT(*) as columns_found,
  CASE 
    WHEN COUNT(*) = 3 THEN '✅ All 3 Kajabi columns exist'
    WHEN COUNT(*) > 0 THEN '⚠️  Some columns missing'
    ELSE '❌ No Kajabi columns found - Run migration 005_add_kajabi_fields.sql'
  END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'recorded_sessions' 
AND column_name IN ('kajabi_product_id', 'kajabi_offering_id', 'synced_from_kajabi');

-- ============================================================================
-- STEP 3: Verify Kajabi columns exist on users table
-- ============================================================================
SELECT 
  'Step 3: users Kajabi Columns' as verification_step,
  column_name, 
  data_type, 
  is_nullable,
  CASE 
    WHEN column_name IN ('kajabi_contact_id', 'kajabi_tags', 'synced_from_kajabi')
    THEN '✅ FOUND'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name IN ('kajabi_contact_id', 'kajabi_tags', 'synced_from_kajabi')
ORDER BY column_name;

-- Count how many Kajabi columns are found
SELECT 
  'Step 3 Summary' as verification_step,
  COUNT(*) as columns_found,
  CASE 
    WHEN COUNT(*) = 3 THEN '✅ All 3 Kajabi columns exist'
    WHEN COUNT(*) > 0 THEN '⚠️  Some columns missing'
    ELSE '❌ No Kajabi columns found - Run migration 005_add_kajabi_fields.sql'
  END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name IN ('kajabi_contact_id', 'kajabi_tags', 'synced_from_kajabi');

-- ============================================================================
-- STEP 4: Check indexes for Kajabi columns
-- ============================================================================
SELECT 
  'Step 4: Kajabi Indexes' as verification_step,
  tablename,
  indexname,
  CASE 
    WHEN indexname LIKE '%kajabi%' THEN '✅ FOUND'
    ELSE '❌ MISSING'
  END as status
FROM pg_indexes
WHERE schemaname = 'public'
AND (
  indexname LIKE '%kajabi%'
  OR indexdef LIKE '%kajabi%'
)
ORDER BY tablename, indexname;

-- ============================================================================
-- STEP 5: Check for synced data (if sync has been run)
-- ============================================================================
SELECT 
  'Step 5: Synced Products Count' as verification_step,
  COUNT(*) as synced_products_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Found synced products from Kajabi'
    ELSE '⚠️  No products synced yet (OK if sync has not been run)'
  END as status
FROM recorded_sessions 
WHERE synced_from_kajabi = true;

SELECT 
  'Step 5: Synced Users Count' as verification_step,
  COUNT(*) as synced_users_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Found synced users from Kajabi'
    ELSE '⚠️  No users synced yet (OK if sync has not been run)'
  END as status
FROM users 
WHERE synced_from_kajabi = true;

-- ============================================================================
-- STEP 6: List all Kajabi-related columns (comprehensive check)
-- ============================================================================
SELECT 
  'Step 6: All Kajabi Columns' as verification_step,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND (
  (table_name = 'recorded_sessions' AND column_name LIKE '%kajabi%')
  OR
  (table_name = 'users' AND column_name LIKE '%kajabi%')
)
ORDER BY table_name, column_name;

-- ============================================================================
-- FINAL SUMMARY
-- ============================================================================
SELECT 
  'FINAL SUMMARY' as verification_step,
  'Database Setup Status' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'recorded_sessions' 
      AND column_name = 'kajabi_product_id'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'kajabi_contact_id'
    ) THEN '✅ Database is ready for Kajabi sync'
    ELSE '❌ Database setup incomplete - Run migrations first'
  END as overall_status;
