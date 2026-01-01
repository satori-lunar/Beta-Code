-- Insert "Just Begin" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "Just Begin" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000009'::uuid;

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
  '00000000-0000-0000-0000-000000000009'::uuid,
  'Just Begin - Mondays 5:30pm ET',
  'In this gentle, guided class, you''ll learn how to recognize your thoughts, understand your emotions, and begin practicing the tools that help you grow stronger roots. Whether you''re brand new to coaching or simply looking for a refresher in the model, this is a safe, supportive space to ask questions, explore your inner landscape, and build confidence one practice at a time. Together, we''ll revisit and relearn the model, deepen our understanding, and most importantly — connect in community. Come hang out, grow alongside others, and nurture the resilience that helps you thrive.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  52,
  'Coaching Fundamentals',
  'beginner',
  ARRAY['just begin', 'coaching', 'beginner', 'model', 'community', 'growth', 'resilience']
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
  ('Just Begin - Find your way around, the model, coaching', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955049/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'model', 'coaching', 'introduction'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Coaching and Feelings', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955050/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'coaching', 'feelings'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Just Begin 8/17', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955051/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Practice with the Model!', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955052/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'model', 'practice'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Just Begin 8/31', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955053/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Just Begin 9/15 - Intro Coaching', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955054/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'intro', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Just Begin 9/22 Momentum', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955055/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'momentum'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Just Begin 9/29', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955056/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Slow Progress', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955057/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'progress'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Housekeeping/Gratitude for the Day', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955058/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'gratitude', 'housekeeping'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Balancing Compassion and Authority', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955059/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'compassion', 'authority'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Curiosity over Cravings', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955060/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'curiosity', 'cravings'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Q & A and Beginning of Month Reflection 11/3', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955061/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'Q&A', 'reflection'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('11-10 Getting to Know You!', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955062/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'community', 'connection'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Just Begin - Acceptance 11/17', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955063/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'acceptance'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('11/24 Tour of birch & stone', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955064/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'tour', 'community'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Dec 1, Follow Through', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955065/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'follow through', 'accountability'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('12-8 Members Supporting Members!', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955066/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'community', 'support'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('December 15th - Building a Support System', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955067/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'support system', 'community'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('12/22 App Tour & Known Glitches and Questions Noted', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955068/details', 'Coaching Fundamentals', 0, ARRAY['just begin', 'app tour', 'technical'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 21', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955069/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 22', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955070/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 23', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955071/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 24', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955072/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 25', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955073/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 26', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955074/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 27', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955075/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 28', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955076/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 29', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955077/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 30', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955078/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 31', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955079/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 32', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955080/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 33', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955081/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 34', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955082/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 35', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955083/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 36', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955084/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 37', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955086/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 39', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955088/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 40', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955089/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 41', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955090/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 42', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955091/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 43', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955092/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 44', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955093/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 45', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955094/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 46', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955095/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 47', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955096/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 48', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955097/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 49', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955098/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 50', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955099/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 51', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955100/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 52', 'Just Begin - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955101/details', 'Coaching Fundamentals', 0, ARRAY['just begin'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 53', 'Seedlings - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/seedlings-mondays-5-30pm-et/sessions/9955102/details', 'Coaching Fundamentals', 0, ARRAY['seedlings'], '00000000-0000-0000-0000-000000000009'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000009'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000009'::uuid
GROUP BY c.id, c.title;
