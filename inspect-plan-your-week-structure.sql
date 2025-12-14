-- ============================================
-- INSPECT "PLAN YOUR WEEK" STRUCTURE
-- ============================================
-- Run these queries in Supabase SQL Editor to understand the structure
-- Then use this as a template for "Wisdom Rising"

-- 1. View the "Plan Your Week" course details
SELECT 
  id,
  title,
  description,
  instructor,
  duration,
  sessions,
  category,
  level,
  tags,
  created_at
FROM public.courses 
WHERE title ILIKE '%plan your week%'
ORDER BY created_at DESC;

-- 2. View all sessions for "Plan Your Week"
SELECT 
  rs.id,
  rs.title,
  rs.description,
  rs.instructor,
  rs.recorded_at,
  rs.duration,
  rs.video_url,
  rs.category,
  rs.views,
  rs.tags,
  rs.course_id,
  rs.synced_from_kajabi,
  c.title as course_title
FROM public.recorded_sessions rs
LEFT JOIN public.courses c ON c.id = rs.course_id
WHERE c.title ILIKE '%plan your week%'
ORDER BY rs.recorded_at DESC, rs.title;

-- 3. Count sessions per course
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count,
  MIN(rs.recorded_at) as first_session,
  MAX(rs.recorded_at) as last_session
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.title ILIKE '%plan your week%'
GROUP BY c.id, c.title;

-- 4. Get sample session URL pattern
SELECT 
  title,
  video_url,
  SUBSTRING(video_url FROM 'sessions/(\d+)') as session_number
FROM public.recorded_sessions
WHERE course_id IN (
  SELECT id FROM public.courses WHERE title ILIKE '%plan your week%'
)
LIMIT 5;

-- 5. Check table structure for recorded_sessions
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'recorded_sessions'
ORDER BY ordinal_position;

-- 6. Check table structure for courses
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'courses'
ORDER BY ordinal_position;
