-- Insert "Grief & Growth" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Grief & Growth" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000015'::uuid;
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000015'::uuid;

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
  '00000000-0000-0000-0000-000000000015'::uuid,
  'Grief & Growth',
  'A supportive coaching program for navigating grief and finding growth through loss. Join us every Wednesday at 10:00 AM ET.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  45,
  'Grief & Growth',
  'intermediate',
  ARRAY['grief', 'growth', 'loss', 'healing', 'coaching', 'support']
);

-- Step 2: Insert all 45 sessions linked to the course
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
  ('Feeling Sadness, 7/2', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763277/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'sadness', 'emotions'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('It''s the Thought That Hurts the Most', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763278/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'thoughts', 'pain'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Subtle Change/ Quiet Grief', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763279/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'subtle', 'quiet'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Grief as Fertile Ground', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763280/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'fertility', 'transformation'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Processing Pain', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763281/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'pain', 'processing'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Uninvited vs Invited Growth', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763282/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'invited', 'uninvited'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Grief & Growth are Companions', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763283/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'companions', 'relationship'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Grief as Foundation', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763284/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'foundation', 'base'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Reflection', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763285/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'reflection', 'introspection'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('3 Circles of Attention', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763286/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'attention', 'focus'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Growth is not meant to replace grief', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763287/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'coexistence', 'acceptance'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Subtle Growth', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763288/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'subtle', 'gradual'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Trust in Life and Self after Loss', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763289/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'trust', 'loss'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('When Your Body Loses Trust, Part 1 10/15', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763290/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'body', 'trust'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('When the body loses trust, Part 2', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763291/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'body', 'trust'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Response to a Reading', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763292/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'reading', 'response'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('False Pleasure vs Well Being 11/5', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763293/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'pleasure', 'wellbeing'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('11-12 Hope In A Small Glimmer', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763294/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'hope', 'glimmer'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Grief and Growth, Acceptance, 11/19/25', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763295/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'acceptance'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Thanksgiving Grief & Growth 11/26', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763296/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'thanksgiving', 'holidays'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('12-3 The 5 Stepping Stones', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763297/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'stepping stones', 'process'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('12-10 Just for now...I will _____________.', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763298/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'present moment', 'intention'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('12-17 Grief in our Bodies', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763299/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'body', 'somatic'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('12-24 A Love Letter To Yourself', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763300/details', 'Grief & Growth', 0, ARRAY['grief', 'growth', 'self-love', 'compassion'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 36', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763301/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 37', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763302/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 38', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763303/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 39', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763304/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 40', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763305/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 41', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763306/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 42', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763307/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 43', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763308/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 44', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763309/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 45', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763310/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 46', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763311/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 47', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763312/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 48', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763313/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 49', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763314/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 50', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763315/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 51', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763316/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 52', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763317/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true),
  ('Session 53', 'Grief & Growth - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/grief-growth-wednesdays-10am-et/sessions/763318/details', 'Grief & Growth', 0, ARRAY['grief', 'growth'], '00000000-0000-0000-0000-000000000015'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000015'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000015'::uuid
GROUP BY c.id, c.title;
