-- ============================================
-- CLEANUP GRIEF & GROWTH DUPLICATES
-- ============================================
-- Run this in Supabase SQL Editor
-- This script identifies and removes duplicate Grief & Growth entries

-- Step 1: Check all Grief & Growth courses
SELECT
  id,
  title,
  instructor,
  sessions,
  category
FROM public.courses
WHERE title LIKE '%Grief & Growth%';

-- Step 2: Check Grief & Growth sessions
SELECT
  c.title as course_title,
  c.id as course_id,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.title LIKE '%Grief & Growth%'
GROUP BY c.id, c.title;

-- Step 3: DELETE THE OLDER DUPLICATE (UNCOMMENT AND MODIFY BASED ON RESULTS ABOVE)
-- Replace 'OLDER_COURSE_ID_HERE' with the ID of the course you want to delete
-- DELETE FROM public.recorded_sessions WHERE course_id = 'OLDER_COURSE_ID_HERE';
-- DELETE FROM public.courses WHERE id = 'OLDER_COURSE_ID_HERE';

-- Step 4: Verify cleanup
SELECT 'AFTER CLEANUP - Courses:' as status, title, id FROM public.courses WHERE title LIKE '%Grief & Growth%';
SELECT 'AFTER CLEANUP - Sessions:' as status, COUNT(*) as total_sessions FROM public.recorded_sessions rs JOIN public.courses c ON rs.course_id = c.id WHERE c.title LIKE '%Grief & Growth%';
