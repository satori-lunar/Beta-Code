-- ============================================
-- CLEANUP GRIEF & GROWTH DUPLICATES
-- ============================================
-- Run this in Supabase SQL Editor
-- This script identifies and removes duplicate Grief & Growth entries

-- Step 1: Check all Grief & Growth entries
SELECT
  'Courses' as table_name,
  id,
  title,
  created_at,
  updated_at
FROM public.courses
WHERE title LIKE '%Grief & Growth%'
ORDER BY created_at;

-- Step 2: Check Grief & Growth sessions
SELECT
  'Sessions' as table_name,
  rs.id,
  rs.title,
  rs.course_id,
  c.title as course_title,
  rs.created_at
FROM public.recorded_sessions rs
JOIN public.courses c ON rs.course_id = c.id
WHERE c.title LIKE '%Grief & Growth%'
ORDER BY rs.created_at;

-- Step 3: Delete the older Grief & Growth course (adjust ID based on results above)
-- UNCOMMENT AND MODIFY THE LINE BELOW AFTER CHECKING WHICH ONE TO DELETE
-- DELETE FROM public.recorded_sessions WHERE course_id = 'OLDER_UUID_HERE';
-- DELETE FROM public.courses WHERE id = 'OLDER_UUID_HERE';

-- Step 4: Verify cleanup
SELECT
  'Remaining Courses' as status,
  title,
  id,
  created_at
FROM public.courses
WHERE title LIKE '%Grief & Growth%';

SELECT
  'Remaining Sessions' as status,
  COUNT(*) as session_count,
  c.title as course_title
FROM public.recorded_sessions rs
JOIN public.courses c ON rs.course_id = c.id
WHERE c.title LIKE '%Grief & Growth%'
GROUP BY c.title, c.id;
