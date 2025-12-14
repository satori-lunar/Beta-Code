-- ============================================
-- INSERT "2-BITE TUESDAYS" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "2-Bite Tuesdays" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000007'::uuid;

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
  '00000000-0000-0000-0000-000000000007'::uuid,
  '2-Bite Tuesdays',
  'Weekly sessions focused on mindful eating, nutrition, and building healthy habits. Join us every Tuesday at 10:00 PM ET for practical strategies and gentle guidance on your wellness journey.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Wellness',
  'beginner',
  ARRAY['nutrition', 'wellness', 'mindful-eating', 'habits', 'tuesday', 'evening']
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
  ('November 25th', 'Food noise gets louder when stress, celebration, routine disruptions, and emotions all collide — especially during the holidays. Today we''ll learn how to quiet that noise, listen to our bodies, and stay connected to what matters.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577220/details', 'Wellness', 0, ARRAY['nutrition', 'wellness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('December 2nd', 'Today we''re exploring simple, seasonal snacks-just two bites at a time- to help us discover new favorites without overeating.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577168/details', 'Wellness', 0, ARRAY['nutrition', 'wellness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 3', 'Micro-Habits That Move the Needle. Tonight we''re exploring the power of micro-habits—tiny steps that are small enough to do on a hard day, and consistent enough to create real change.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577169/details', 'Wellness', 0, ARRAY['nutrition', 'wellness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 4', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577170/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 5', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577171/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 6', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577172/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 7', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577173/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 8', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577174/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 9', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577175/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 10', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577176/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 11', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577177/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 12', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577178/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 13', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577179/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 14', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577180/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 15', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577181/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 16', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577182/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 17', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577183/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 18', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577184/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 19', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577185/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 20', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577186/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 21', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577187/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 22', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577188/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 23', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577189/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 24', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577190/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 25', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577191/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 26', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577192/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 27', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577193/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 28', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577194/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 29', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577195/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 30', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577196/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 31', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577197/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 32', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577198/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 33', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577199/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 34', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577200/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 35', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577201/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 36', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577202/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 37', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577203/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 38', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577204/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 39', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577205/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 40', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577206/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 41', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577207/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 42', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577208/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 43', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577209/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 44', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577210/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 45', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577211/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 46', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577212/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 47', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577213/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 48', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577214/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 49', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577215/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 50', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577216/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 51', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577217/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 52', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577218/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 53', '2-Bite Tuesdays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577219/details', 'Wellness', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true);

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count,
  MIN(rs.recorded_at) as first_session_date,
  MAX(rs.recorded_at) as last_session_date
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000007'::uuid
GROUP BY c.id, c.title, c.sessions;

-- Step 4: View sample sessions to verify
SELECT 
  rs.title,
  rs.video_url,
  rs.recorded_at,
  rs.duration
FROM public.recorded_sessions rs
WHERE rs.course_id = '00000000-0000-0000-0000-000000000007'::uuid
ORDER BY rs.recorded_at DESC
LIMIT 10;
