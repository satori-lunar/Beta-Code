-- ============================================
-- INSERT "HATHA YOGA" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Hatha Yoga" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000003'::uuid;

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
  '00000000-0000-0000-0000-000000000003'::uuid,
  'Hatha Yoga with Meghan',
  'Gentle Hatha Yoga classes with Meghan. Join us every Monday and Thursday at 4:00 PM ET for mindful movement, flexibility, and relaxation.',
  'Birch & Stone Coaching',
  '45-60 minutes per session',
  53,
  'Yoga',
  'beginner',
  ARRAY['yoga', 'hatha', 'mindfulness', 'flexibility', 'movement', 'wellness']
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
  ('Oct 6', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442468/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Oct 9', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442416/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Oct 13', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442417/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Oct 16 Yoga', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442418/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Oct 20 Yoga', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442419/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Oct 23rd Yoga', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442420/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Oct 27th Yoga', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442421/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Nov 3rd', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442422/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Nov 6th', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442423/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('November 10th', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442424/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('November 13th', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442425/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('November 17th', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442426/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('November 20th', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442427/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('November 24th', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442428/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 15', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442429/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 16', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442430/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 17', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442431/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 18', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442432/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 19', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442433/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 20', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442434/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 21', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442435/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 22', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442436/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 23', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442437/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 24', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442438/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 25', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442439/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 26', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442440/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 27', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442441/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 28', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442442/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 29', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442443/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 30', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442444/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 31', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442445/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 32', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442446/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 33', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442447/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 34', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442448/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 35', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442449/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 36', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442450/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 37', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442451/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 38', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442452/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 39', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442453/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 40', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442454/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 41', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442455/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 42', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442456/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 43', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442457/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 44', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442458/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 45', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442459/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 46', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442460/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 47', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442461/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 48', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442462/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 49', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442463/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 50', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442464/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 51', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442465/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 52', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442466/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true),
  ('Session 53', 'Hatha Yoga with Meghan - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/hatha-yoga-with-meghan-mon-thurs-4pm-et/sessions/10442467/details', 'Yoga', 0, ARRAY['yoga', 'hatha'], '00000000-0000-0000-0000-000000000003'::uuid, true);

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count,
  MIN(rs.recorded_at) as first_session_date,
  MAX(rs.recorded_at) as last_session_date
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000003'::uuid
GROUP BY c.id, c.title, c.sessions;

-- Step 4: View sample sessions to verify
SELECT 
  rs.title,
  rs.video_url,
  rs.recorded_at,
  rs.duration
FROM public.recorded_sessions rs
WHERE rs.course_id = '00000000-0000-0000-0000-000000000003'::uuid
ORDER BY rs.recorded_at DESC
LIMIT 10;
