-- Insert "Rooted Weight Health" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Rooted Weight Health" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000002'::uuid;

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
  '00000000-0000-0000-0000-000000000002'::uuid,
  'Rooted Weight Health',
  'A comprehensive coaching program focused on sustainable weight health, building trust with yourself, and developing healthy patterns. Join us Sundays at 8:30 AM ET and Thursdays at 6:00 AM ET.',
  'Birch & Stone Coaching',
  '60 minutes per session',
  53,
  'Weight Health',
  'intermediate',
  ARRAY['weight health', 'coaching', 'sustainability', 'wellness', 'mindset']
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
  ('Building a Framework for Sustainable Weight Health', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761819/details', 'Weight Health', 0, ARRAY['weight health', 'framework', 'sustainability'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Building Trust with Yourself', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761820/details', 'Weight Health', 0, ARRAY['weight health', 'trust', 'self-awareness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Finding a Power Thought', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761821/details', 'Weight Health', 0, ARRAY['weight health', 'mindset', 'power thoughts'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Getting Back "On Track"', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761822/details', 'Weight Health', 0, ARRAY['weight health', 'accountability', 'consistency'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Sustainability', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761823/details', 'Weight Health', 0, ARRAY['weight health', 'sustainability', 'long-term'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Story Vs. Fact', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761824/details', 'Weight Health', 0, ARRAY['weight health', 'mindset', 'perspective'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Feelings', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761825/details', 'Weight Health', 0, ARRAY['weight health', 'emotions', 'awareness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Fear of Regain', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761826/details', 'Weight Health', 0, ARRAY['weight health', 'fear', 'mindset'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Open Coaching', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761827/details', 'Weight Health', 0, ARRAY['weight health', 'coaching', 'open session'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Bridge Thoughts', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761828/details', 'Weight Health', 0, ARRAY['weight health', 'mindset', 'thought work'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Judgment vs. Fascination', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761829/details', 'Weight Health', 0, ARRAY['weight health', 'mindset', 'awareness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Balanced Summer Wellness', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761830/details', 'Weight Health', 0, ARRAY['weight health', 'wellness', 'balance'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Clean vs. Dirty Pain', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761831/details', 'Weight Health', 0, ARRAY['weight health', 'emotions', 'pain'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Comfort vs Capacity 7/8', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761832/details', 'Weight Health', 0, ARRAY['weight health', 'growth', 'capacity'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Practicing Makes Patterns', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761833/details', 'Weight Health', 0, ARRAY['weight health', 'habits', 'patterns'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Fixed vs. Growth - 1 of 2', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761834/details', 'Weight Health', 0, ARRAY['weight health', 'mindset', 'growth'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('When you say "I can''t"', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761835/details', 'Weight Health', 0, ARRAY['weight health', 'mindset', 'limiting beliefs'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Fixed vs. Growth 2 of 2', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761836/details', 'Weight Health', 0, ARRAY['weight health', 'mindset', 'growth'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Avoiding Burnout', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761837/details', 'Weight Health', 0, ARRAY['weight health', 'wellness', 'self-care'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Momentum and Friction', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761838/details', 'Weight Health', 0, ARRAY['weight health', 'momentum', 'progress'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Uncovering Friction with the Model', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761839/details', 'Weight Health', 0, ARRAY['weight health', 'coaching model', 'awareness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Steady Your Weight Loss', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761840/details', 'Weight Health', 0, ARRAY['weight health', 'weight loss', 'consistency'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Identity 9/11/25', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761841/details', 'Weight Health', 0, ARRAY['weight health', 'identity', 'self-concept'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('When to Eat and What? 9/14', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761842/details', 'Weight Health', 0, ARRAY['weight health', 'nutrition', 'eating'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Emotional Childhood vs Emotional Adulthood Revisited', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761843/details', 'Weight Health', 0, ARRAY['weight health', 'emotions', 'maturity'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Secret Eating 9/21', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761844/details', 'Weight Health', 0, ARRAY['weight health', 'eating patterns', 'awareness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Secret Eating Part 2', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761845/details', 'Weight Health', 0, ARRAY['weight health', 'eating patterns', 'awareness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Food Rules', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761846/details', 'Weight Health', 0, ARRAY['weight health', 'nutrition', 'rules'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Trust in Your Body', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761847/details', 'Weight Health', 0, ARRAY['weight health', 'trust', 'body awareness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('The Daily Path, Oct 5', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761848/details', 'Weight Health', 0, ARRAY['weight health', 'daily practice', 'routines'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Daily Path Cont''d', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761849/details', 'Weight Health', 0, ARRAY['weight health', 'daily practice', 'routines'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Sleep and Napping', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761850/details', 'Weight Health', 0, ARRAY['weight health', 'sleep', 'rest'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Information, Intuition, Coaching', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761851/details', 'Weight Health', 0, ARRAY['weight health', 'coaching', 'intuition'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Weight Health - Open Coaching', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761852/details', 'Weight Health', 0, ARRAY['weight health', 'coaching', 'open session'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Candy, Cravings and Control', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761853/details', 'Weight Health', 0, ARRAY['weight health', 'cravings', 'control'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Candy Plan!', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761854/details', 'Weight Health', 0, ARRAY['weight health', 'planning', 'cravings'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Well Being vs. False Pleasure', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761855/details', 'Weight Health', 0, ARRAY['weight health', 'wellness', 'pleasure'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('11-9 Emotional Eating', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761856/details', 'Weight Health', 0, ARRAY['weight health', 'emotional eating', 'awareness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('11-13 Protect Your Peace', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761857/details', 'Weight Health', 0, ARRAY['weight health', 'wellness', 'peace'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Rooted Weight Health - Acceptance 11/16', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761858/details', 'Weight Health', 0, ARRAY['weight health', 'acceptance', 'mindset'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Acceptance Weight Health', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761859/details', 'Weight Health', 0, ARRAY['weight health', 'acceptance', 'mindset'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Holiday Rooted Weight Health 11/23', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761860/details', 'Weight Health', 0, ARRAY['weight health', 'holidays', 'wellness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Nov 30 Follow Through', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761861/details', 'Weight Health', 0, ARRAY['weight health', 'accountability', 'follow through'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('12/4 Follow Through', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761862/details', 'Weight Health', 0, ARRAY['weight health', 'accountability', 'follow through'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('12-6 The Kitchen Energy', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761863/details', 'Weight Health', 0, ARRAY['weight health', 'environment', 'energy'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Dec 11, No Shame in Bumpers', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761864/details', 'Weight Health', 0, ARRAY['weight health', 'mindset', 'self-compassion'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 47', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761865/details', 'Weight Health', 0, ARRAY['weight health'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 48', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761866/details', 'Weight Health', 0, ARRAY['weight health'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 49', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761867/details', 'Weight Health', 0, ARRAY['weight health'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 50', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761868/details', 'Weight Health', 0, ARRAY['weight health'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 51', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761869/details', 'Weight Health', 0, ARRAY['weight health'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 52', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761870/details', 'Weight Health', 0, ARRAY['weight health'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 53', 'Rooted Weight Health - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/rooted-weight-health-sundays-830am-et-thursdays-6am-et/sessions/761871/details', 'Weight Health', 0, ARRAY['weight health'], '00000000-0000-0000-0000-000000000002'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000002'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000002'::uuid
GROUP BY c.id, c.title;
