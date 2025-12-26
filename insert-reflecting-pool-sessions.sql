-- Insert "The Reflecting Pool" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "The Reflecting Pool" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000004'::uuid;

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
  '00000000-0000-0000-0000-000000000004'::uuid,
  'The Reflecting Pool',
  'Explore why we do what we do. This class examines thought patterns, emotional habits, and the psychology of personal growth. Insightful, structured, and thought-provoking. Uncover patterns of human behavior that contribute to your success and your struggle. Join us every Tuesday at 10:00 AM ET.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  53,
  'Personal Growth',
  'intermediate',
  ARRAY['reflection', 'personal growth', 'psychology', 'behavior', 'self-awareness', 'coaching']
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
  ('All About Me - Authenticity', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764301/details', 'Personal Growth', 0, ARRAY['reflection', 'authenticity', 'self-awareness'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Who Am I?', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764302/details', 'Personal Growth', 0, ARRAY['reflection', 'identity', 'self-discovery'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Decision Making', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764303/details', 'Personal Growth', 0, ARRAY['reflection', 'decisions', 'choices'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Belonging', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764304/details', 'Personal Growth', 0, ARRAY['reflection', 'belonging', 'connection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('People Pleasing - Saying "No"', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764305/details', 'Personal Growth', 0, ARRAY['reflection', 'people pleasing', 'boundaries'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('People Pleasing-Setting Boundaries', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764306/details', 'Personal Growth', 0, ARRAY['reflection', 'people pleasing', 'boundaries'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Requests VS. Boundaries', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764307/details', 'Personal Growth', 0, ARRAY['reflection', 'boundaries', 'requests'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Expressing Personal Needs', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764308/details', 'Personal Growth', 0, ARRAY['reflection', 'needs', 'communication'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('People-Pleasing Wrap Up', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764309/details', 'Personal Growth', 0, ARRAY['reflection', 'people pleasing', 'summary'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Observing Human Behavior', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764310/details', 'Personal Growth', 0, ARRAY['reflection', 'behavior', 'observation'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Strong vs. Weak Character', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764311/details', 'Personal Growth', 0, ARRAY['reflection', 'character', 'strength'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Inner Integrity', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764312/details', 'Personal Growth', 0, ARRAY['reflection', 'integrity', 'values'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Future Image', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764313/details', 'Personal Growth', 0, ARRAY['reflection', 'future', 'vision'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Live Coaching! :) 7/3', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764314/details', 'Personal Growth', 0, ARRAY['reflection', 'live coaching'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Environments that Support the Hard', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764315/details', 'Personal Growth', 0, ARRAY['reflection', 'environment', 'support'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('The Invisible Contract', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764316/details', 'Personal Growth', 0, ARRAY['reflection', 'contracts', 'agreements'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Allowing an Urge', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764317/details', 'Personal Growth', 0, ARRAY['reflection', 'urges', 'allowing'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Open Coaching and Hedonic Adaptation', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764318/details', 'Personal Growth', 0, ARRAY['reflection', 'hedonic adaptation', 'coaching'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('What''s my focus now?', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764319/details', 'Personal Growth', 0, ARRAY['reflection', 'focus', 'attention'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Awareness to Action', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764320/details', 'Personal Growth', 0, ARRAY['reflection', 'awareness', 'action'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Mental Footing', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764321/details', 'Personal Growth', 0, ARRAY['reflection', 'grounding', 'stability'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Staying Grounded through Schedule Change', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764322/details', 'Personal Growth', 0, ARRAY['reflection', 'grounding', 'change'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Overwhelm and its Ripple - 9-2-25', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764323/details', 'Personal Growth', 0, ARRAY['reflection', 'overwhelm', 'ripple effect'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('R.A.I.N as an anchoring technique', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764324/details', 'Personal Growth', 0, ARRAY['reflection', 'RAIN', 'anchoring'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('2 Arrows', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764325/details', 'Personal Growth', 0, ARRAY['reflection', 'arrows', 'pain'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('False Stories', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764326/details', 'Personal Growth', 0, ARRAY['reflection', 'stories', 'narrative'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Holding On, Letting Go', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764327/details', 'Personal Growth', 0, ARRAY['reflection', 'letting go', 'attachment'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Resilience and Flow', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764328/details', 'Personal Growth', 0, ARRAY['reflection', 'resilience', 'flow'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('The Sponge and The Mirror', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764329/details', 'Personal Growth', 0, ARRAY['reflection', 'sponge', 'mirror'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('From Limitation To What''s Possible', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764330/details', 'Personal Growth', 0, ARRAY['reflection', 'limitation', 'possibility'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('11-11 Making Space For What I Need', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764331/details', 'Personal Growth', 0, ARRAY['reflection', 'space', 'needs'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('11-18 Reclaiming Your Wisdom', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764332/details', 'Personal Growth', 0, ARRAY['reflection', 'wisdom', 'reclaiming'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('11-25 From Autopilot to Intention', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764333/details', 'Personal Growth', 0, ARRAY['reflection', 'autopilot', 'intention'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('12-2 The Year Of________________', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764334/details', 'Personal Growth', 0, ARRAY['reflection', 'year', 'intention'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('12-9 Your Bridge', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764335/details', 'Personal Growth', 0, ARRAY['reflection', 'bridge', 'transition'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('12-16 Turning The Handle', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764336/details', 'Personal Growth', 0, ARRAY['reflection', 'turning', 'handle'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('12-23 Traditions, Expectations, and Choice', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764337/details', 'Personal Growth', 0, ARRAY['reflection', 'traditions', 'expectations', 'choice'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 38', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764338/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 39', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764339/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 40', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764340/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 41', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764341/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 42', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764342/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 43', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764343/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 44', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764344/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 45', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764345/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 46', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764346/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 47', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764347/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 48', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764348/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 49', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764349/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 50', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764350/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 51', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764351/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 52', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764352/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true),
  ('Session 53', 'The Reflecting Pool - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-reflecting-pool-tuesdays-10am-et/sessions/764353/details', 'Personal Growth', 0, ARRAY['reflection'], '00000000-0000-0000-0000-000000000004'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000004'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000004'::uuid
GROUP BY c.id, c.title;
