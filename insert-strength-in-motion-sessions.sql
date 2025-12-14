-- Insert "Strength in Motion" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "Strength in Motion" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000011'::uuid;

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
  '00000000-0000-0000-0000-000000000011'::uuid,
  'Strength in Motion',
  'Build strength and confidence as you move with purpose. This class uses a mix of bodyweight and weights-based exercises designed to challenge your muscles, improve posture, and increase stability. Whether you''re new to strength training or ready to push a little further, you''ll leave feeling strong, steady, and empowered. Join us every Tuesday at 9:00 AM ET.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  53,
  'Exercise',
  'beginner',
  ARRAY['strength', 'exercise', 'fitness', 'weights', 'bodyweight', 'posture', 'stability']
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
  ('Session 1: 9/2/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210604/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 2: 9/9/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210605/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 3: 9/17/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210606/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 4: 9/23/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210607/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Day 5: 9/30/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210608/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Day 6: 10/7/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210609/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Day 7: 10/14/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210610/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 8: 10/21/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210611/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 9: 10/28/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210612/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Day 10: 11/4/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210613/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Day 11: 11/11/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210614/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Day 12: 11/18/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210615/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 13: 11/25/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210616/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 14: 12/2/25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210617/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 15', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210618/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 16', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210619/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 17', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210620/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 18', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210621/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 19', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210622/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 20', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210623/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 21', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210624/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 22', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210625/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 23', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210626/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 24', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210627/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 25', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210628/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 26', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210629/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 27', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210630/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 28', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210631/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 29', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210632/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 30', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210633/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 31', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210634/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 32', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210635/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 33', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210636/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 34', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210637/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 35', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210638/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 36', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210639/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 37', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210640/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 38', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210641/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 39', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210642/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 40', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210643/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 41', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210644/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 42', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210645/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 43', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210646/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 44', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210647/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 45', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210648/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 46', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210649/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 47', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210650/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 48', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210651/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 49', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210652/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 50', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210653/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 51', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210654/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 52', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210655/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true),
  ('Session 53', 'Strength in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/strength-in-motion-tuesdays-9am-et/sessions/10210656/details', 'Exercise', 0, ARRAY['strength', 'exercise'], '00000000-0000-0000-0000-000000000011'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000011'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000011'::uuid
GROUP BY c.id, c.title;
