-- ============================================
-- INSERT "TIME MANAGEMENT REPLAY" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Time Management Replay" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000004'::uuid;

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
) VALUES (
  '00000000-0000-0000-0000-000000000004'::uuid,
  'Time Management Replay',
  'Masterclass replay sessions focused on effective time management strategies, productivity techniques, and organizational skills.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Productivity',
  'beginner',
  ARRAY['time management', 'productivity', 'organization', 'planning', 'efficiency']
);

-- Step 2: Insert all 53 sessions linked to the course
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
) VALUES
  ('Time Management Masterclass Replay', 'Time Management Masterclass Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456690/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 1', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456638/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 3', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456639/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 4', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456640/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 5', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456641/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 6', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456642/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 7', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456643/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 8', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456644/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 9', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456645/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 10', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456646/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 11', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456647/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 12', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456648/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 13', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456649/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 14', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456650/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 15', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456651/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 16', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456652/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 17', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456653/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 18', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456654/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 19', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456655/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 20', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456656/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 21', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456657/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 22', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456658/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 23', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456659/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 24', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456660/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 25', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456661/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 26', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456662/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 27', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456663/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 28', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456664/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 29', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456665/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 30', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456666/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 31', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456667/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 32', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456668/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 33', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456669/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 34', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456670/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 35', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456671/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 36', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456672/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 37', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456673/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 38', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456674/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 39', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456675/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 40', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456676/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 41', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456677/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 42', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456678/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 43', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456679/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 44', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456680/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 45', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456681/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 46', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456682/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 47', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456683/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 48', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456684/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 49', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456685/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 50', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456686/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 51', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456687/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 52', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456688/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 53', 'Time Management Replay - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/time-management-replay/sessions/10456689/details', 'Productivity', 0, ARRAY['time management', 'productivity'], '00000000-0000-0000-0000-000000000004'::uuid, true);

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count,
  MIN(rs.recorded_at) as first_session_date,
  MAX(rs.recorded_at) as last_session_date
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000004'::uuid
GROUP BY c.id, c.title, c.sessions;

-- Step 4: View sample sessions to verify
SELECT 
  rs.title,
  rs.video_url,
  rs.recorded_at,
  rs.duration
FROM public.recorded_sessions rs
WHERE rs.course_id = '00000000-0000-0000-0000-000000000004'::uuid
ORDER BY rs.recorded_at DESC
LIMIT 10;
