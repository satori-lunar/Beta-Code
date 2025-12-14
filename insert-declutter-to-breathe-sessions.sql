-- Insert "Declutter to Breathe" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "Declutter to Breathe" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000010'::uuid;

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
  '00000000-0000-0000-0000-000000000010'::uuid,
  'Declutter to Breathe',
  '4-week decluttering workshop offered by Coach Emily B and Coach Rebecca.',
  'Coach Emily B and Coach Rebecca',
  '60 minutes per session',
  53,
  'Workshop',
  'beginner',
  ARRAY['declutter', 'workshop', 'organization', 'breathing', 'mindfulness']
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
  ('Week 1 - August 8th 11am ET', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955157/details', 'Workshop', 0, ARRAY['declutter', 'week1'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Week 2, August 15 11am ET', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955158/details', 'Workshop', 0, ARRAY['declutter', 'week2'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Week 3 - August 22nd 11am ET', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955159/details', 'Workshop', 0, ARRAY['declutter', 'week3'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Week 4 - August 29th 11am ET', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955160/details', 'Workshop', 0, ARRAY['declutter', 'week4'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 5', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955161/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 6', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955162/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 7', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955163/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 8', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955164/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 9', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955165/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 10', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955166/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 11', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955167/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 12', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955168/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 13', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955169/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 14', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955170/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 15', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955171/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 16', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955172/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 17', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955173/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 18', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955174/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 19', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955175/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 20', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955176/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 21', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955177/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 22', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955178/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 23', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955179/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 24', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955180/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 25', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955181/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 26', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955182/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 27', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955183/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 28', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955184/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 29', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955185/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 30', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955186/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 31', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955187/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 32', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955188/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 33', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955189/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 34', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955190/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 35', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955191/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 36', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955192/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 37', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955193/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 38', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955194/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 39', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955195/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 40', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955196/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 41', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955197/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 42', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955198/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 43', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955199/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 44', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955200/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 45', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955201/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 46', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955202/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 47', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955203/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 48', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955204/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 49', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955205/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 50', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955206/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 51', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955207/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 52', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955208/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 53', 'Declutter to Breathe - Session Recording', 'Coach Emily B and Coach Rebecca', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/declutter-to-breathe-3/sessions/9955209/details', 'Workshop', 0, ARRAY['declutter'], '00000000-0000-0000-0000-000000000010'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000010'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000010'::uuid
GROUP BY c.id, c.title;
