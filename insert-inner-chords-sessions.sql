-- Insert "Inner Chords" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "Inner Chords" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000013'::uuid;

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
  '00000000-0000-0000-0000-000000000013'::uuid,
  'Inner Chords',
  'A unique space where music and poetry meet reflection. This class helps you access feelings you may not otherwise know how to reach. Come ready to journal, listen, and let the notes guide you into deeper awareness. Ride into your day with company as you tune in — this hour offers a mix of calm, uplift, and transformative energy. Because this class meets at the start of your morning, we''ll steer toward emotions that energize and ground you: peace, clarity, connection, and lightness. Think of it as a reset for your inner world — helping you feel better on purpose before the day begins. Join us every Tuesday at 8:00 AM ET.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  53,
  'Meditation',
  'beginner',
  ARRAY['inner chords', 'music', 'poetry', 'reflection', 'journaling', 'awareness', 'mindfulness', 'morning']
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
  ('Inner Chords- How The Arts Connects Us 9-2-25', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235486/details', 'Meditation', 0, ARRAY['inner chords', 'music', 'arts', 'connection'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Art As Connection/Let''s Listen Together', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235487/details', 'Meditation', 0, ARRAY['inner chords', 'art', 'connection', 'listening'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('The Self Portrait', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235488/details', 'Meditation', 0, ARRAY['inner chords', 'self portrait', 'reflection'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Sept. 23- Tears Speak', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235489/details', 'Meditation', 0, ARRAY['inner chords', 'emotions', 'tears'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('The Seasons', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235490/details', 'Meditation', 0, ARRAY['inner chords', 'seasons', 'nature'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('The Sound Of Silence', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235491/details', 'Meditation', 0, ARRAY['inner chords', 'silence', 'stillness'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('The Art Of Passing It On', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235492/details', 'Meditation', 0, ARRAY['inner chords', 'art', 'legacy'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('The Art of Improvisation', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235493/details', 'Meditation', 0, ARRAY['inner chords', 'improvisation', 'creativity'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('11-11 Let It Be', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235494/details', 'Meditation', 0, ARRAY['inner chords', 'acceptance', 'letting go'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('11-18 The Bridge', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235495/details', 'Meditation', 0, ARRAY['inner chords', 'connection', 'bridge'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('11-25 Brave', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235496/details', 'Meditation', 0, ARRAY['inner chords', 'bravery', 'courage'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('12-2 Bravery Pt. 2- Both Sides Now', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235497/details', 'Meditation', 0, ARRAY['inner chords', 'bravery', 'perspective'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('12-9 Our Musical Map', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235498/details', 'Meditation', 0, ARRAY['inner chords', 'music', 'mapping'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 14', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235499/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 15', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235500/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 16', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235501/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 17', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235502/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 18', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235503/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 19', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235504/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 20', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235505/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 21', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235506/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 22', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235507/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 23', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235508/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 24', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235509/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 25', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235510/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 26', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235511/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 27', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235512/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 28', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235513/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 29', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235514/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 30', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235515/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 31', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235516/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 32', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235517/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 33', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235518/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 34', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235519/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 35', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235520/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 36', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235521/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 37', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235522/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 38', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235523/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 39', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235524/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 40', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235525/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 41', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235526/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 42', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235527/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 43', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235528/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 44', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235529/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 45', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235530/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 46', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235531/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 47', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235532/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 48', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235533/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 49', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235534/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 50', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235535/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 51', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235536/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 52', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235537/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true),
  ('Session 53', 'Inner Chords - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/inner-chords-tuesdays-8am-et/sessions/10235538/details', 'Meditation', 0, ARRAY['inner chords'], '00000000-0000-0000-0000-000000000013'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000013'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000013'::uuid
GROUP BY c.id, c.title;
