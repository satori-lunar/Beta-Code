-- Insert "Energy in Motion" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "Energy in Motion" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000012'::uuid;

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
  '00000000-0000-0000-0000-000000000012'::uuid,
  'Energy in Motion',
  'Ignite your energy with aerobic interval training that keeps your heart pumping and your body moving. Using styles like Tabata and other high-energy intervals, this class blends bursts of effort with moments of recovery to boost endurance, burn calories, and elevate your mood. Expect a fun, sweat-filled session that leaves you recharged and ready for the day. Join us every Friday at 9:00 AM ET.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  53,
  'Exercise',
  'beginner',
  ARRAY['energy', 'exercise', 'fitness', 'cardio', 'tabata', 'intervals', 'aerobic', 'endurance']
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
  ('Day 1: 9/5/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210657/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 2: 9/12/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210658/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 3: 9/19/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210659/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 4: 9/26/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210660/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 5: 10/3/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210661/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 6: 10/17/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210662/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 7: 10/24/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210663/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 8: 10/31/25 HALLOWEEN EDITION', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210664/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio', 'halloween'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 9: 11/7/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210665/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 10: 11/14/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210666/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Day 11: 11/21/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210667/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 12: 11/28/25: Thanksgiving Edition', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210668/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio', 'thanksgiving'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 13: 12/5/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210669/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 14: 12/12/25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210670/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 15', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210671/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 16', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210672/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 17', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210673/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 18', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210674/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 19', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210675/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 20', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210676/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 21', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210677/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 22', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210678/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 23', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210679/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 24', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210680/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 25', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210681/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 26', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210682/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 27', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210683/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 28', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210684/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 29', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210685/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 30', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210686/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 31', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210687/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 32', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210688/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 33', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210689/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 34', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210690/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 35', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210691/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 36', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210692/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 37', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210693/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 38', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210694/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 39', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210695/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 40', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210696/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 41', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210697/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 42', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210698/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 43', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210699/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 44', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210700/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 45', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210701/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 46', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210702/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 47', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210703/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 48', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210704/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 49', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210705/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 50', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210706/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 51', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210707/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 52', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210708/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 53', 'Energy in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/energy-in-motion-fridays-9am-et/sessions/10210709/details', 'Exercise', 0, ARRAY['energy', 'exercise', 'cardio'], '00000000-0000-0000-0000-000000000012'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000012'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000012'::uuid
GROUP BY c.id, c.title;
