-- Insert "The Heart of Nourishment" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "The Heart of Nourishment" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000005'::uuid;

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
  '00000000-0000-0000-0000-000000000005'::uuid,
  'The Heart of Nourishment',
  'Nourishment is more than food — it''s what feeds your body, mind, heart, and spirit. In this reflective and creative workshop, you''ll be guided through visualization and self-discovery to explore what true nourishment means to you. You''ll create your own "nourishment menu" and reconnect with intention and compassion for your well-being. Join us every Monday at 9:00 AM ET.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  48,
  'Nourishment',
  'intermediate',
  ARRAY['nourishment', 'self-care', 'compassion', 'wellness', 'mindfulness', 'coaching']
);

-- Step 2: Insert all 48 sessions linked to the course
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
  ('Open Conversation about Compassion', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791910/details', 'Nourishment', 0, ARRAY['nourishment', 'compassion', 'conversation'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Compassion During the Unexpected', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791911/details', 'Nourishment', 0, ARRAY['nourishment', 'compassion', 'unexpected'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Buffering vs. True Care', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791912/details', 'Nourishment', 0, ARRAY['nourishment', 'buffering', 'care'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('July 1 Compassion During the Unknown', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791913/details', 'Nourishment', 0, ARRAY['nourishment', 'compassion', 'unknown'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Blame vs Responsibility 7/8', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791914/details', 'Nourishment', 0, ARRAY['nourishment', 'blame', 'responsibility'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Internal Support', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791915/details', 'Nourishment', 0, ARRAY['nourishment', 'support', 'internal'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('What Calms You', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791916/details', 'Nourishment', 0, ARRAY['nourishment', 'calm', 'peace'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Giving Grace or Delaying Action?', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791917/details', 'Nourishment', 0, ARRAY['nourishment', 'grace', 'action'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('The Heart of Nourishment- 8/11/25', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791918/details', 'Nourishment', 0, ARRAY['nourishment', 'heart'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Fuel+Joy=Food as Nourishment', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791919/details', 'Nourishment', 0, ARRAY['nourishment', 'food', 'joy'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('The Power of Words: Speaking to Lift, not weigh down.', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791920/details', 'Nourishment', 0, ARRAY['nourishment', 'words', 'communication'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Permission To Rest: A Labor Day of Self Nourishment 9-1-25', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791921/details', 'Nourishment', 0, ARRAY['nourishment', 'rest', 'self-care'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('The Gift of Joy', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791922/details', 'Nourishment', 0, ARRAY['nourishment', 'joy', 'gift'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('The Heart Of The Matter Journal Sequence', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791923/details', 'Nourishment', 0, ARRAY['nourishment', 'journal', 'reflection'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session Sept 22- The Wake Up Call.. An invitation to reflect.', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791924/details', 'Nourishment', 0, ARRAY['nourishment', 'wake up', 'reflection'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Body Trust/Hunger and Fullness Cues', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791925/details', 'Nourishment', 0, ARRAY['nourishment', 'body trust', 'hunger'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('The Curious Spark', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791926/details', 'Nourishment', 0, ARRAY['nourishment', 'curiosity', 'spark'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('The Grateful Heart', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791927/details', 'Nourishment', 0, ARRAY['nourishment', 'gratitude', 'heart'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('The Art Of Receiving', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791928/details', 'Nourishment', 0, ARRAY['nourishment', 'receiving', 'art'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('11-10 Coming Home to Yourself', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791929/details', 'Nourishment', 0, ARRAY['nourishment', 'home', 'self'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('11-17 Small Hinges Swing Big Doors', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791930/details', 'Nourishment', 0, ARRAY['nourishment', 'change', 'impact'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('11-24 I Am Becoming', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791931/details', 'Nourishment', 0, ARRAY['nourishment', 'becoming', 'growth'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('12-1 The Season of Accepting', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791932/details', 'Nourishment', 0, ARRAY['nourishment', 'accepting', 'season'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('12-8 Confetti and Your Mirror', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791933/details', 'Nourishment', 0, ARRAY['nourishment', 'confetti', 'mirror'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('12-15 Wins as Self Compassion', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791934/details', 'Nourishment', 0, ARRAY['nourishment', 'wins', 'self-compassion'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('12-22 Thank you for....', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791935/details', 'Nourishment', 0, ARRAY['nourishment', 'gratitude', 'thanks'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 32', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791936/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 33', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791937/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 34', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791938/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 35', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791939/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 36', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791940/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 37', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791941/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 38', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791942/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 39', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791943/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 40', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791944/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 41', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791945/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 42', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791946/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 43', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791947/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 44', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791948/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 45', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791949/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 46', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791950/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 47', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791951/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true),
  ('Session 48', 'The Heart of Nourishment - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/the-heart-of-nourishment-mondays-9am-et/sessions/791952/details', 'Nourishment', 0, ARRAY['nourishment'], '00000000-0000-0000-0000-000000000005'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000005'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000005'::uuid
GROUP BY c.id, c.title;
