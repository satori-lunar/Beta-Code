-- ============================================
-- CLEANUP OLD CARE WITHOUT COLLAPSE ENTRIES
-- ============================================
-- Run this in Supabase SQL Editor to remove old/incorrect entries

-- Step 1: Delete any old live classes with incorrect titles
DELETE FROM public.live_classes
WHERE title LIKE '%Care without Collapse%'
  AND title NOT IN ('Care without Collapse - Saturday 12:00pm ET');

-- Step 2: Delete any old courses with incorrect titles or UUIDs
DELETE FROM public.recorded_sessions
WHERE course_id IN (
  SELECT id FROM public.courses
  WHERE title LIKE '%Care without Collapse%'
    AND id NOT IN ('00000000-0000-0000-0000-000000000009') -- Keep only the correct recorded sessions course
);

DELETE FROM public.courses
WHERE title LIKE '%Care without Collapse%'
  AND id NOT IN ('00000000-0000-0000-0000-000000000009'); -- Keep only the correct recorded sessions course

-- Step 3: Verify cleanup
SELECT 'Live Classes:' as type, COUNT(*) as count FROM public.live_classes WHERE title LIKE '%Care without Collapse%'
UNION ALL
SELECT 'Courses:', COUNT(*) FROM public.courses WHERE title LIKE '%Care without Collapse%'
UNION ALL
SELECT 'Recorded Sessions:', COUNT(*) FROM public.recorded_sessions rs
JOIN public.courses c ON c.id = rs.course_id
WHERE c.title LIKE '%Care without Collapse%';

-- Step 4: Show remaining entries
SELECT 'Remaining Live Classes:' as info;
SELECT id, title, scheduled_at FROM public.live_classes WHERE title LIKE '%Care without Collapse%' ORDER BY scheduled_at;

SELECT 'Remaining Courses:' as info;
SELECT id, title FROM public.courses WHERE title LIKE '%Care without Collapse%' ORDER BY title;
