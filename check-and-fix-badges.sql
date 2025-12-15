-- ============================================================================
-- CHECK AND FIX EXISTING BADGES
-- ============================================================================
-- This script checks your existing badges and updates/adds the correct ones
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Step 1: Check what badges you currently have
SELECT name, description, icon, category, earned_date
FROM user_badges
ORDER BY earned_date DESC;

-- Step 2: Update "Dear Diary" badge to "Journaling Beginner" (if it exists)
UPDATE user_badges
SET
  name = 'Journaling Beginner',
  icon = 'star',
  category = 'journal'
WHERE name = 'Dear Diary';

-- Step 3: Update "First Habit" to "First Steps" (if it exists)
UPDATE user_badges
SET
  name = 'First Steps',
  icon = 'target',
  category = 'habit'
WHERE name = 'First Habit';

-- Step 4: Update old streak badge names (if they exist)
UPDATE user_badges
SET
  name = 'Week Warrior',
  description = 'Maintain a 7-day streak',
  icon = 'flame'
WHERE name IN ('7 Day Streak', '7-Day Streak');

UPDATE user_badges
SET
  name = 'Consistency King',
  description = 'Maintain a 30-day streak',
  icon = 'trophy'
WHERE name IN ('30 Day Streak', '30-Day Streak');

-- Step 5: Manually award "Journaling Beginner" badge if you wrote a journal entry but don't have the badge
-- (Replace 'YOUR_USER_ID' with your actual user ID from auth.users table)
INSERT INTO user_badges (user_id, name, description, icon, category, earned_date)
SELECT
  'YOUR_USER_ID',
  'Journaling Beginner',
  'Write your first journal entry',
  'star',
  'journal',
  CURRENT_DATE
WHERE NOT EXISTS (
  SELECT 1 FROM user_badges
  WHERE user_id = 'YOUR_USER_ID'
  AND name IN ('Journaling Beginner', 'Dear Diary')
)
AND EXISTS (
  SELECT 1 FROM journal_entries
  WHERE user_id = 'YOUR_USER_ID'
);

-- Step 6: Verify the final badge list
SELECT name, description, icon, category, earned_date
FROM user_badges
ORDER BY earned_date DESC;
