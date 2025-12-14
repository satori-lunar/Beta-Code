-- ============================================
-- INSERT "FOUNDATIONS IN MOTION" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Foundations in Motion" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000005'::uuid;

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
  '00000000-0000-0000-0000-000000000005'::uuid,
  'Foundations in Motion',
  'Movement and mobility classes focused on functional fitness, balance, strength, and reactivity training. Join us every Monday at 10:30 AM ET.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Fitness',
  'beginner',
  ARRAY['fitness', 'mobility', 'balance', 'strength', 'functional', 'movement']
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
  ('Mobility 10/20/25', 'Exercises included: Angles + Rows, T-Twists + Twisted Triangles, Bird-Dog + Reverse Crunches', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465106/details', 'Fitness', 0, ARRAY['fitness', 'mobility'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Functional Outcome Measures 10/27/25', 'See "Resources" tab for functional outcome measure norms', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465054/details', 'Fitness', 0, ARRAY['fitness', 'functional'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Balance Education 11/3/25', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465055/details', 'Fitness', 0, ARRAY['fitness', 'balance'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Balance Practices 11/10/25', 'Check out the resource tab of this replay to find: 1. Balance Education and Practice Info Document, 2. 7 balance practices handout', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465056/details', 'Fitness', 0, ARRAY['fitness', 'balance'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Dynamic Balance Practices: 11/17/25', 'Check out the Resource tab for Balance Education and Practice Information Document', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465057/details', 'Fitness', 0, ARRAY['fitness', 'balance'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Strength & Balance Integration 11/24/25', 'Strength and balance are inseparable. Your center of gravity (COG) doesn''t stay still, it moves every time you stand up, reach, lean, or turn. These exercises strengthen your stabilizers - the muscles that catch your center of gravity when your body moves suddenly. Think of them as the anchors that keep you upright. Exercises: Sit to stands, Heel Raises (calf raises) & Toe Raises, Hip Abductions, Kickstand Hold and weight shifting.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465058/details', 'Fitness', 0, ARRAY['fitness', 'strength', 'balance'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Body''s Reactivity 12/1/25', 'Why our reactions change - and how we can train them to stay sharp. As we get older, the body''s ability to sense, decide, and respond naturally changes. Aging does influence reaction time BUT, reactivity is a highly trainable skill at any age. Exercises in today''s class: Direction Reaction Cues, Step, step, step and pause, Clock Yourself App', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465059/details', 'Fitness', 0, ARRAY['fitness', 'reactivity'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 8', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465060/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 9', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465061/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 10', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465062/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 11', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465063/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 12', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465064/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 13', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465065/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 14', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465066/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 15', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465067/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 16', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465068/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 17', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465069/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 18', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465070/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 19', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465071/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 20', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465072/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 21', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465073/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 22', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465074/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 23', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465075/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 24', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465076/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 25', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465077/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 26', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465078/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 27', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465079/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 28', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465080/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 29', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465081/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 30', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465082/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 31', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465083/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 32', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465084/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 33', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465085/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 34', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465086/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 35', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465087/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 36', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465088/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 37', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465089/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 38', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465090/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 39', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465091/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 40', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465092/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 41', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465093/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 42', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465094/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 43', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465095/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 44', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465096/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 45', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465097/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 46', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465098/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 47', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465099/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 48', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465100/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 49', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465101/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 50', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465102/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 51', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465103/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 52', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465104/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 53', 'Foundations in Motion - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/foundations-in-motion-mondays-10-30am-et/sessions/10465105/details', 'Fitness', 0, ARRAY['fitness'], '00000000-0000-0000-0000-000000000005'::uuid, true);

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count,
  MIN(rs.recorded_at) as first_session_date,
  MAX(rs.recorded_at) as last_session_date
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000005'::uuid
GROUP BY c.id, c.title, c.sessions;

-- Step 4: View sample sessions to verify
SELECT 
  rs.title,
  rs.video_url,
  rs.recorded_at,
  rs.duration
FROM public.recorded_sessions rs
WHERE rs.course_id = '00000000-0000-0000-0000-000000000005'::uuid
ORDER BY rs.recorded_at DESC
LIMIT 10;
