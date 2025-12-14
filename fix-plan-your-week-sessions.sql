-- Fix "Plan Your Week" course sessions
-- This script will work regardless of the course UUID
-- Run this in Supabase SQL Editor

-- Step 1: Find the course ID (run this first to see the UUID)
-- SELECT id, title FROM public.courses WHERE title = 'Plan Your Week';

-- Step 2: Delete existing sessions for Plan Your Week (replace UUID if different)
DELETE FROM public.recorded_sessions 
WHERE course_id IN (
  SELECT id FROM public.courses WHERE title = 'Plan Your Week'
);

-- Step 3: Insert all 53 sessions (this will find the course by title)
-- First, ensure the course exists
INSERT INTO public.courses (
  id,
  title,
  description,
  instructor,
  duration,
  sessions,
  category,
  level,
  tags
)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Plan Your Week',
  'Weekly planning sessions to help you organize and structure your week effectively. Join us every Sunday at 7:30 AM ET.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  53,
  'Planning',
  'beginner',
  ARRAY['planning', 'productivity', 'weekly', 'organization']
WHERE NOT EXISTS (
  SELECT 1 FROM public.courses WHERE title = 'Plan Your Week'
);

-- Step 4: Insert sessions using the course ID from the database
INSERT INTO public.recorded_sessions (
  title,
  description,
  instructor,
  recorded_at,
  duration,
  video_url,
  category,
  views,
  tags,
  course_id,
  synced_from_kajabi
)
SELECT 
  session_data.title,
  session_data.description,
  session_data.instructor,
  session_data.recorded_at,
  session_data.duration,
  session_data.video_url,
  session_data.category,
  session_data.views,
  session_data.tags,
  c.id as course_id,
  session_data.synced_from_kajabi
FROM public.courses c
CROSS JOIN (VALUES
  ('Session 766599', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766599/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766600', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766600/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766601', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766601/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766602', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766602/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766603', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766603/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766604', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766604/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766605', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766605/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766606', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766606/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766607', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766607/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766608', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766608/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766609', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766609/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766610', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766610/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766611', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766611/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766612', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766612/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766613', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766613/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766614', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766614/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766615', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766615/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766616', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766616/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766617', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766617/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766618', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766618/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766619', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766619/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766620', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766620/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766621', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766621/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766622', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766622/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766623', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766623/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766624', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766624/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766625', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766625/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766626', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766626/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766627', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766627/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766628', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766628/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766629', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766629/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766630', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766630/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766631', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766631/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766632', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766632/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766633', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766633/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766634', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766634/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766635', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766635/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766636', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766636/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766637', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766637/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766638', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766638/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766639', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766639/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766640', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766640/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766641', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766641/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766642', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766642/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766643', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766643/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766644', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766644/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766645', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766645/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766646', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766646/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766647', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766647/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766648', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766648/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766649', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766649/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766650', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766650/details', 'Planning', 0, ARRAY['planning', 'weekly'], true),
  ('Session 766651', 'Plan Your Week - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766651/details', 'Planning', 0, ARRAY['planning', 'weekly'], true)
) AS session_data(title, description, instructor, recorded_at, duration, video_url, category, views, tags, synced_from_kajabi)
WHERE c.title = 'Plan Your Week';

-- Step 5: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.title = 'Plan Your Week'
GROUP BY c.id, c.title, c.sessions;
