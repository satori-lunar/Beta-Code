-- Insert "Instinctive Meditation" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "Instinctive Meditation" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000008'::uuid;

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
  '00000000-0000-0000-0000-000000000008'::uuid,
  'Instinctive Meditation',
  'Reclaim Your Inner Calm with Coach Tobey (Offered 2x/month). Instinctive Meditation is a radically refreshing approach that works with your thoughts, emotions, and energy—rather than asking you to shut them down. In this class, you''ll learn how to meditate in ways that feel natural, engaging, and even pleasurable. Join us every Wednesday at 7:00 PM ET.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  53,
  'Meditation',
  'beginner',
  ARRAY['meditation', 'mindfulness', 'calm', 'wellness', 'instinctive', 'coaching']
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
  ('Instinctive Meditation, Night One', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526783/details', 'Meditation', 0, ARRAY['meditation', 'instinctive', 'night one'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Instinctive Meditation, Night 2', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526784/details', 'Meditation', 0, ARRAY['meditation', 'instinctive', 'night 2'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Instinctive Meditation, Night 3', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526785/details', 'Meditation', 0, ARRAY['meditation', 'instinctive', 'night 3'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Instinctive Meditation, Night 4', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526786/details', 'Meditation', 0, ARRAY['meditation', 'instinctive', 'night 4'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('9/17', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526787/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('October 8th', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526788/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('October 15th', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526789/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Instinctive Meditation 11/20', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526790/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Nov 26 Meditation - Fire', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526791/details', 'Meditation', 0, ARRAY['meditation', 'instinctive', 'fire'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Dec 10th Meditation - Air & Wind', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526792/details', 'Meditation', 0, ARRAY['meditation', 'instinctive', 'air', 'wind'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 11', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526793/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 12', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526794/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 13', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526795/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 14', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526796/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 15', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526797/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 16', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526798/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 17', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526799/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 18', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526800/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 19', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526801/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 20', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526802/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 21', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526803/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 22', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526804/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 23', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526805/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 24', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526806/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 25', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526807/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 26', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526808/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 27', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526809/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 28', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526810/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 29', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526811/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 30', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526812/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 31', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526813/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 32', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526814/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 33', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526815/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 34', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526816/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 35', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526817/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 36', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526818/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 37', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526819/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 38', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526820/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 39', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526821/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 40', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526822/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 41', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526823/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 42', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526824/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 43', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526825/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 44', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526826/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 45', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526827/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 46', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526828/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 47', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526829/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 48', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526830/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 49', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526831/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 50', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526832/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 51', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526833/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 52', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526834/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 53', 'Instinctive Meditation - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/instinctive-meditation-wednesdays-7pm-et/sessions/5526835/details', 'Meditation', 0, ARRAY['meditation', 'instinctive'], '00000000-0000-0000-0000-000000000008'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000008'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000008'::uuid
GROUP BY c.id, c.title;
