-- Diagnostic query to check Plan Your Week course and sessions
-- Run this in Supabase SQL Editor first to see what's in the database

-- Check if the course exists and what its ID is
SELECT 
  id,
  title,
  sessions as expected_sessions,
  created_at
FROM public.courses 
WHERE title = 'Plan Your Week';

-- Check how many sessions exist for Plan Your Week course
SELECT 
  c.id as course_id,
  c.title as course_title,
  COUNT(rs.id) as actual_session_count,
  c.sessions as expected_sessions
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.title = 'Plan Your Week'
GROUP BY c.id, c.title, c.sessions;

-- Check if sessions exist with the expected course_id
SELECT COUNT(*) as session_count
FROM public.recorded_sessions
WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;

-- Check if there are any sessions with "Plan Your Week" in the title but different course_id
SELECT 
  rs.id,
  rs.title,
  rs.course_id,
  c.title as course_title
FROM public.recorded_sessions rs
LEFT JOIN public.courses c ON c.id = rs.course_id
WHERE rs.title LIKE '%Plan Your Week%' OR rs.title LIKE '%Session 766%'
ORDER BY rs.title;
