-- ============================================
-- INSERT "NIGHTTIME NURTURING" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Nighttime Nurturing" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000006'::uuid;

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
  '00000000-0000-0000-0000-000000000006'::uuid,
  'Nighttime Nurturing- Fridays @ 11pm ET',
  'Nighttime Nurturing is a cozy, calming evening workshop designed to support you when the day winds down… and the urges, emotions, and habits often wind up. If evenings are when you snack, scroll, graze, wander the pantry, or feel yourself slipping into old routines, this class is your soft landing place. Each session offers: gentle coaching around nighttime snacking, overeating, and emotional urges practices for comfort, grounding, and emotional regulation simple tools to unwind without using food to soothe cozy rituals that cue rest, not cravings a warm, supportive community to end your day with intention Nighttime Nurturing is where you learn to care for yourself after hours—with warmth, honesty, and zero shame. It''s the quiet shift that changes everything about your nights… and your tomorrow.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Wellness',
  'beginner',
  ARRAY['wellness', 'self-care', 'mindfulness', 'emotional', 'nurturing', 'evening']
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
  (' Nighttime Nurturing 11-21-25', 'Tonight we''re exploring how unhelpful thoughts shape our behavior—and how to shift into kinder, more effective self-talk.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577133/details', 'Wellness', 0, ARRAY['wellness', 'self-care'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Nighttime Nurturing 11-28-25', 'Tonight we want to understand why disruptions happen, how to respond without guilt, and how to rebuild momentum with compassion, clarity and simple, actionable strategies.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577081/details', 'Wellness', 0, ARRAY['wellness', 'self-care'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Nighttime Nurturing 12-5-25', 'Letting Go of What''s Heavy Before the Holidays. Releasing emotional clutter, mental overwhelm, perfectionism, guilt, and all the "shoulds" we carry into December.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577082/details', 'Wellness', 0, ARRAY['wellness', 'self-care'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Nighttime Nurturing 12-12-25', 'Navigating Holiday & End-of-Year Chaos With Intention 12-12-25. As we move into the holiday season and the final weeks of the year, many of us feel the familiar pull of pressure, expectations, and emotional noise. Today is about slowing that noise down. We''ll explore why this season feels chaotic, what patterns it brings up for many of us, and how to create small, steady anchors that help us stay grounded.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577083/details', 'Wellness', 0, ARRAY['wellness', 'self-care'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Nighttime Nurturing 12-19-25', 'Reclaiming Joy During a Busy Season. Busy seasons can pull us away from ourselves. The days fill quickly, the pace quickens, and joy can begin to feel distant—or unnecessary. At Birch & Stone, we believe joy isn''t something to earn once life slows down. It''s something we return to, again and again, even in the middle of full, imperfect days. This time together isn''t about doing more. It''s about softening, noticing, and creating just enough space to remember what steadies you.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577084/details', 'Wellness', 0, ARRAY['wellness', 'self-care'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 6', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577085/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 7', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577086/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 8', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577087/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 9', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577088/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 10', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577089/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 11', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577090/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 12', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577091/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 13', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577092/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 14', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577093/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 15', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577094/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 16', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577095/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 17', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577096/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 18', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577097/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 19', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577098/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 20', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577099/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 21', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577100/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 22', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577101/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 23', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577102/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 24', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577103/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 25', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577104/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 26', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577105/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 27', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577106/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 28', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577107/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 29', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577108/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 30', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577109/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 31', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577110/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 32', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577111/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 33', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577112/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 34', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577113/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 35', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577114/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 36', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577115/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 37', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577116/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 38', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577117/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 39', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577118/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 40', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577119/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 41', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577120/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 42', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577121/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 43', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577122/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 44', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577123/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 45', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577124/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 46', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577125/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 47', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577126/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 48', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577127/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 49', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577128/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 50', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577129/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 51', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577130/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 52', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577131/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 53', 'Nighttime Nurturing - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/nighttime-nurturing-fridays-11pm-et/sessions/10577132/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000006'::uuid, true);

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count,
  MIN(rs.recorded_at) as first_session_date,
  MAX(rs.recorded_at) as last_session_date
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000006'::uuid
GROUP BY c.id, c.title, c.sessions;

-- Step 4: View sample sessions to verify
SELECT 
  rs.title,
  rs.video_url,
  rs.recorded_at,
  rs.duration
FROM public.recorded_sessions rs
WHERE rs.course_id = '00000000-0000-0000-0000-000000000006'::uuid
ORDER BY rs.recorded_at DESC
LIMIT 10;
