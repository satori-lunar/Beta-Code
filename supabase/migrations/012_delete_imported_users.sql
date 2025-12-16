-- Migration: Delete imported users who don't have passwords
-- WARNING: This will permanently delete users from Supabase Auth
-- Only run this if you want to remove users who were imported without passwords
-- 
-- To use this:
-- 1. First, identify which users you want to delete (check auth.users table)
-- 2. Update the WHERE clause below to match the users you want to delete
-- 3. Run this migration in your Supabase SQL editor
--
-- Example: Delete users imported on a specific date
-- DELETE FROM auth.users 
-- WHERE created_at >= '2024-01-01' AND created_at < '2024-01-02';

-- Example: Delete users by email pattern (be careful!)
-- DELETE FROM auth.users 
-- WHERE email LIKE '%@example.com';

-- Example: Delete specific users by email
-- DELETE FROM auth.users 
-- WHERE email IN ('user1@example.com', 'user2@example.com');

-- IMPORTANT: This will also cascade delete related data in:
-- - user_profiles
-- - user_logins  
-- - activity_log
-- - habits
-- - journal_entries
-- - nutrition_entries
-- - weight_entries
-- - calendar_events
-- - user_favorite_sessions
-- - session_completions
-- - class_reminders
-- - user_badges
-- - user_pathway_progress
-- - pathway_achievements
-- - notifications
-- - dashboard_settings
-- - Any other tables with foreign keys to auth.users(id)

-- Uncomment and modify the DELETE statement below to actually delete users:
-- DELETE FROM auth.users 
-- WHERE [YOUR CONDITION HERE];

-- To see which users would be affected first, run a SELECT:
-- SELECT id, email, created_at, email_confirmed_at, last_sign_in_at
-- FROM auth.users
-- WHERE [YOUR CONDITION HERE];
