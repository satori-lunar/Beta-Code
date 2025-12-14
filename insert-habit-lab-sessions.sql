-- ============================================
-- INSERT "HABIT LAB" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Habit Lab" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000010'::uuid;

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
  '00000000-0000-0000-0000-000000000010'::uuid,
  'Habit Lab',
  'Weekly sessions focused on building and maintaining healthy habits through practical strategies and compassionate support. Join us every Friday at 8:00 AM ET for habit-building guidance and community connection.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Wellness',
  'beginner',
  ARRAY['wellness', 'habits', 'productivity', 'self-improvement', 'friday', 'morning']
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
  ('Session 1. 12-5 A Gentle Launch', 'Resources: The 4 Self Compassion Permissions, Habit Lab Resource Starter Pack.pdf. The Making of a Habit: Origin Story: Why did this become automatic? Who taught you? Cues & Rituals: What triggers it now? What other routine supports it? Identity: "I am someone who..." Reward: (what do I get out of this? What''s the buy in?) Tie in to your why?? What is the 4 quadrants of the habit tracker? (in the handouts) G.R.O.W habit tracker…… Instead of checking off a box that said I did it, I didnt do it.. This tracker allows you to see your growth from a deeper level.. Not BLACK AND WHITE /ALL OR NOTHING.. EVERY STEP COUNTS. Goal (intention), Ritual (action), Ongoing (follow-through), Wrapped Up (completion). Some questions to get you thinking…. What habit do you want to grow this month? What habit is calling for a tweak or adjustment? What habit needs support, not willpower? Where can you add ease or remove friction?', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604555/details', 'Wellness', 0, ARRAY['wellness', 'habits'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 2, 12-12 Activate', 'Resources: The 4 Self Compassion Permissions, Habit Lab Resource Starter Pack.pdf, habit lab session 2..pdf. What''s one habit you noticed this week, or one you''d like to work on? What are some of your "I am someone who ___________"? Now you would like to be able to say? "I would like to become ___________"? (Drinks water before coffee, eats protein with every meal, walks daily, stops scrolling at 6 pm…) Poll: Question: When the week feels a little messy — habits don''t go as planned, tracking isn''t perfect, or you go over your points/calories — how do you usually respond?" Answers: I start over on Monday, I skip tracking, I keep going, even if it''s messy, I look for the tiny wins. Where did you see signs of growth or consistency? and Where did you feel resistance or find it tough to stay consistent? What small doable step will you focus on right now? Quote: "Your beliefs become your thoughts, your thoughts become your words, your words become your actions, your actions become your habits, your habits become your values, your values become your destiny."- Mahatma Gandhi', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604556/details', 'Wellness', 0, ARRAY['wellness', 'habits'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 3', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604557/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 4', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604558/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 5', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604559/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 6', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604560/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 7', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604561/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 8', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604562/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 9', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604563/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 10', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604564/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 11', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604565/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 12', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604566/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 13', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604567/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 14', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604568/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 15', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604569/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 16', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604570/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 17', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604571/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 18', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604572/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 19', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604573/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 20', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604574/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 21', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604575/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 22', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604576/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 23', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604577/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 24', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604578/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 25', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604579/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 26', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604580/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 27', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604581/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 28', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604582/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 29', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604583/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 30', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604584/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 31', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604585/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 32', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604586/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 33', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604587/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 34', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604588/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 35', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604589/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 36', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604590/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 37', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604591/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 38', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604592/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 39', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604593/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 40', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604594/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 41', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604595/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 42', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604596/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 43', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604597/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 44', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604598/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 45', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604599/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 46', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604600/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 47', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604601/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 48', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604602/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 49', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604603/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 50', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604604/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 51', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604605/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 52', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604606/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true),
  ('Session 53', 'Habit Lab - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/the-habit-lab-fri-8am-et/sessions/10604607/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000010'::uuid, true);

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count,
  MIN(rs.recorded_at) as first_session_date,
  MAX(rs.recorded_at) as last_session_date
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000010'::uuid
GROUP BY c.id, c.title, c.sessions;

-- Step 4: View sample sessions to verify
SELECT 
  rs.title,
  rs.video_url,
  rs.recorded_at,
  rs.duration
FROM public.recorded_sessions rs
WHERE rs.course_id = '00000000-0000-0000-0000-000000000010'::uuid
ORDER BY rs.recorded_at DESC
LIMIT 10;
