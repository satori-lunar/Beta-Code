-- ============================================
-- INSERT "VISION & VIBES" COURSE AND ALL 53 RECORDED SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Vision & Vibes" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000010'::uuid;
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
  'Vision & Vibes - Saturdays 7:30am ET',
  'Vision & Vibes is a calm, grounding workshop designed to help you ease into your day with intention instead of urgency. This is not about goals, pressure, or fixing yourself before the day begins. It''s about creating a quiet moment to check in, soften your nervous system, and reconnect with what matters—today and in the season ahead.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Morning Mindfulness',
  'beginner',
  ARRAY['vision and vibes', 'morning routine', 'mindfulness', 'grounding', 'intention', 'daily practice', 'coaching']
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
  ('Session 1', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723031/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 2', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723032/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 3', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723033/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 4', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723034/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 5', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723035/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 6', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723036/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 7', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723037/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 8', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723038/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 9', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723039/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 10', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723040/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 11', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723041/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 12', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723042/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 13', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723043/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 14', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723044/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 15', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723045/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 16', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723046/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 17', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723047/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 18', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723048/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 19', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723049/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 20', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723050/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 21', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723051/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 22', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723052/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 23', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723053/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 24', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723054/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 25', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723055/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 26', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723056/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 27', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723057/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 28', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723058/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 29', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723059/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 30', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723060/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 31', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723061/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 32', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723062/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 33', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723063/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 34', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723064/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 35', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723065/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 36', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723066/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 37', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723067/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 38', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723068/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 39', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723069/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 40', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723070/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 41', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723071/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 42', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723072/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 43', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723073/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 44', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723074/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 45', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723075/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 46', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723076/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 47', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723077/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 48', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723078/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 49', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723079/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 50', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723080/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 51', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723081/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 52', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723082/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 53', 'Vision & Vibes - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/vision-vibes-saturday-7-30am-et/sessions/10723083/details', 'Morning Mindfulness', 0, ARRAY['vision and vibes', 'morning routine', 'mindfulness'], '00000000-0000-0000-0000-000000000010'::uuid, true);

-- Step 3: Verify the data
SELECT
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000010'::uuid
GROUP BY c.id, c.title, c.sessions;
