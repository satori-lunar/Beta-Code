-- Insert "Tangled: Challenging Relationships" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "Tangled: Challenging Relationships" course
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
  'Tangled: Challenging Relationships',
  'Tangled is a space for exploring the complexity of human relationships - whether with parents, partners, children, friends or colleagues. Many of us find ourselves caught in dynamics that leave us questioning our worth, doubting our voice, or losing sight of who we are.  This class helps you gently untangle those knots.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  53,
  'Relationships',
  'intermediate',
  ARRAY['relationships', 'boundaries', 'empathy', 'communication', 'self-worth', 'coaching']
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
  ('What is Narcissism?', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526721/details', 'Relationships', 0, ARRAY['relationships', 'narcissism', 'awareness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('The Empath', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526722/details', 'Relationships', 0, ARRAY['relationships', 'empath', 'empathy'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Creating Sustainable Habits through Chaos', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526723/details', 'Relationships', 0, ARRAY['relationships', 'habits', 'chaos'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Wanted vs. Needed', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526724/details', 'Relationships', 0, ARRAY['relationships', 'wanted', 'needed'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Emotional Gravity', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526725/details', 'Relationships', 0, ARRAY['relationships', 'emotions', 'gravity'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Emotional Orbit', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526726/details', 'Relationships', 0, ARRAY['relationships', 'emotions', 'orbit'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Boundaries', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526727/details', 'Relationships', 0, ARRAY['relationships', 'boundaries'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Moving through Confusion', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526728/details', 'Relationships', 0, ARRAY['relationships', 'confusion', 'clarity'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Emotional Childhood', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526729/details', 'Relationships', 0, ARRAY['relationships', 'emotional childhood'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Emotional Childhood cont''d', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526730/details', 'Relationships', 0, ARRAY['relationships', 'emotional childhood'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Needs beneath the love language', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526731/details', 'Relationships', 0, ARRAY['relationships', 'needs', 'love language'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Defensiveness', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526732/details', 'Relationships', 0, ARRAY['relationships', 'defensiveness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('From Defensiveness to Self-Protection', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526733/details', 'Relationships', 0, ARRAY['relationships', 'defensiveness', 'self-protection'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('The Empath', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526734/details', 'Relationships', 0, ARRAY['relationships', 'empath', 'empathy'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Well Being vs False Pleasure 11/6', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526735/details', 'Relationships', 0, ARRAY['relationships', 'wellbeing', 'pleasure'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('11-13 Care Without Carrying', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526736/details', 'Relationships', 0, ARRAY['relationships', 'care', 'boundaries'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Acceptance 11/20', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526737/details', 'Relationships', 0, ARRAY['relationships', 'acceptance'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('12/4 Follow Through', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526738/details', 'Relationships', 0, ARRAY['relationships', 'follow through', 'accountability'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Dec 11 - Not Who You Thought They Were', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526739/details', 'Relationships', 0, ARRAY['relationships', 'expectations', 'reality'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('12/18 Stop Explaining Yourself', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526740/details', 'Relationships', 0, ARRAY['relationships', 'boundaries', 'self-advocacy'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 21', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526741/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 22', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526742/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 23', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526743/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 24', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526744/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 25', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526745/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 26', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526746/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 27', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526747/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 28', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526748/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 29', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526749/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 30', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526750/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 31', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526751/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 32', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526752/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 33', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526753/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 34', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526754/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 35', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526755/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 36', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526756/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 37', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526757/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 38', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526758/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 39', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526759/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 40', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526760/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 41', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526761/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 42', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526762/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 43', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526763/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 44', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526764/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 45', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526765/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 46', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526766/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 47', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526767/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 48', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526768/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 49', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526769/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 50', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526770/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 51', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526771/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 52', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526772/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 53', 'Tangled: Challenging Relationships - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/tangled-challenging-relationships-thursdays-1-30pm-et/sessions/5526773/details', 'Relationships', 0, ARRAY['relationships'], '00000000-0000-0000-0000-000000000007'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000007'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000007'::uuid
GROUP BY c.id, c.title;
