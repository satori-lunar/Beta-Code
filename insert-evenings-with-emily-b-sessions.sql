-- ============================================
-- INSERT "EVENINGS WITH EMILY B" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Evenings with Emily B" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000021'::uuid;

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
  '00000000-0000-0000-0000-000000000021'::uuid,
  'Evenings with Emily B',
  'Evening sessions focused on personal growth, reflection, and community connection. Join us every Thursday at 7:30 PM ET for meaningful conversations and supportive guidance.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Wellness',
  'beginner',
  ARRAY['wellness', 'evening', 'community', 'personal-growth', 'thursday', 'reflection']
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
  ('Session 1', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604479/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 2', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604480/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 3', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604481/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 4', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604482/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 5', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604483/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 6', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604484/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 7', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604485/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 8', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604486/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 9', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604487/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 10', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604488/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 11', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604489/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 12', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604490/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 13', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604491/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 14', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604492/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 15', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604493/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 16', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604494/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 17', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604495/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 18', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604496/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 19', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604497/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 20', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604498/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 21', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604499/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 22', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604500/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 23', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604501/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 24', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604502/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 25', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604503/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 26', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604504/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 27', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604505/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 28', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604506/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 29', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604507/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 30', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604508/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 31', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604509/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 32', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604510/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 33', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604511/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 34', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604512/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 35', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604513/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 36', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604514/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 37', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604515/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 38', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604516/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 39', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604517/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 40', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604518/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 41', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604519/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 42', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604520/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 43', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604521/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 44', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604522/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 45', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604523/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 46', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604524/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 47', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604525/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 48', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604526/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 49', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604527/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 50', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604528/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 51', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604529/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 52', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604530/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true),
  ('Session 53', 'Evenings with Emily B - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/evenings-with-emily-b-thursday-7-30pm-et/sessions/10604531/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000021'::uuid, true);

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count,
  MIN(rs.recorded_at) as first_session_date,
  MAX(rs.recorded_at) as last_session_date
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000021'::uuid
GROUP BY c.id, c.title, c.sessions;

-- Step 4: View sample sessions to verify
SELECT 
  rs.title,
  rs.video_url,
  rs.recorded_at,
  rs.duration
FROM public.recorded_sessions rs
WHERE rs.course_id = '00000000-0000-0000-0000-000000000021'::uuid
ORDER BY rs.recorded_at DESC
LIMIT 10;
