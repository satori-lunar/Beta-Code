-- ============================================
-- INSERT "WHAT WENT WELL" COURSE AND ALL 53 RECORDED SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "What Went Well" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000012'::uuid;
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
  'What Went Well - Saturdays 3:00pm ET',
  'This is not a "review what you messed up" class. It''s a practice in seeing yourself clearly and kindly. Flow (simple, repeatable) Where did I show up this week — even imperfectly? What felt easier than it used to? What did I follow through on? What am I proud of that no one else saw? This trains the brain to: notice progress reduce all-or-nothing thinking carry confidence into the weekend.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Positive Psychology',
  'beginner',
  ARRAY['what went well', 'positive psychology', 'reflection', 'gratitude', 'progress', 'confidence', 'self-kindness', 'coaching']
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
  ('Session 1', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723139/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 2', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723140/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 3', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723141/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 4', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723142/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 5', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723143/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 6', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723144/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 7', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723145/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 8', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723146/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 9', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723147/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 10', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723148/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 11', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723149/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 12', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723150/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 13', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723151/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 14', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723152/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 15', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723153/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 16', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723154/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 17', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723155/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 18', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723156/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 19', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723157/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 20', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723158/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 21', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723159/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 22', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723160/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 23', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723161/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 24', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723162/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 25', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723163/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 26', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723164/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 27', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723165/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 28', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723166/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 29', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723167/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 30', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723168/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 31', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723169/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 32', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723170/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 33', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723171/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 34', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723172/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 35', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723173/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 36', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723174/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 37', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723175/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 38', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723176/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 39', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723177/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 40', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723178/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 41', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723179/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 42', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723180/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 43', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723181/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 44', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723182/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 45', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723183/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 46', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723184/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 47', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723185/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 48', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723186/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 49', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723187/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 50', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723188/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 51', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723189/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 52', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723190/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true),
  ('Session 53', 'What Went Well - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/what-went-well-saturday-3pm-et/sessions/10723191/details', 'Positive Psychology', 0, ARRAY['what went well', 'positive psychology', 'reflection'], '00000000-0000-0000-0000-000000000012'::uuid, true);

-- Step 3: Verify the course and sessions were inserted correctly
SELECT
  'Course Created:' as status,
  title,
  instructor,
  sessions,
  category
FROM public.courses
WHERE id = '00000000-0000-0000-0000-000000000012'::uuid;

SELECT
  'Sessions Created:' as status,
  COUNT(*) as total_sessions
FROM public.recorded_sessions
WHERE course_id = '00000000-0000-0000-0000-000000000012'::uuid;
