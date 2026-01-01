-- ============================================
-- INSERT "2-BITE TUESDAY AT 10PM ET" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "2-Bite Tuesday at 10pm ET" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000007'::uuid;
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
  '2-Bite Tuesday at 10pm ET',
  '2-Bite Tuesdays is a gentle, eye-opening workshop that helps you pause long enough to actually taste your food—and your life. In this class, we explore the simple practice of taking just two intentional bites before you decide what comes next. Those two bites become a moment of awareness, a moment of connection, and a moment of truth. Inside the calm, grounded energy of birch & stone, you''ll learn how the first two bites can: reveal whether you''re hungry or just seeking comfort help you notice taste, texture, and satisfaction slow down emotional or automatic eating shift you from "snacking on autopilot" to "eating with intention" reconnect you with your body without rules or restriction. This practice isn''t about eating less—it''s about knowing yourself more. Come curious, come open, come as you are. Let two small bites be the beginning of a much bigger change.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Nutrition',
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
  ('Two-Bite Tuesday 11-25-25', 'Food noise gets louder when stress, celebration, routine disruptions, and emotions all collide — especially during the holidays. Today we''ll learn how to quiet that noise, listen to our bodies, and stay connected to what matters.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577220/details', 'Nutrition', 0, ARRAY['nutrition', 'wellness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Two-Bite Tuesday 12-2-25', 'Today we''re exploring simple, seasonal snacks-just two bites at a time- to help us discover new favorites without overeating.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577168/details', 'Nutrition', 0, ARRAY['nutrition', 'wellness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Two-Bite Tuesday 12-9-25', 'Micro-Habits That Move the Needle

Tonight we''re exploring the power of micro-habits—tiny steps that are small enough to do on a hard day, and consistent enough to create real change.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577169/details', 'Nutrition', 0, ARRAY['nutrition', 'wellness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Two-Bite Tuesday 12-16-25', 'When Two Bites Are Enough — and When They''re Not

Honoring Flexibility & Self-Trust
Many of us have learned strategies like pausing, tasting, or stopping early — and sometimes those tools are incredibly helpful. Other times, they can feel confusing, frustrating, or even shaming when our bodies are asking for something more. We''ll talk about honoring satisfaction, recognizing hunger cues — both physical and emotional — and giving ourselves permission to respond with flexibility instead of judgment. The goal isn''t to eat less; the goal is to eat enough in a way that supports your health, your energy, and your peace of mind.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577170/details', 'Nutrition', 0, ARRAY['nutrition', 'wellness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Two-Bite Tuesday 12-23-2025', 'Two Bite Tuesday
 Gentle Structure Without Rigidity

Many of us crave structure because it feels grounding and resist it because it can feel controlling. Today is about finding the middle path: structure that supports you, not structure that traps you.
In Two Bite Tuesday language, structure isn''t about doing everything or doing it perfectly. It''s about starting small — like taking two bites — just enough to create steadiness without overwhelm. Gentle structure gives us something to lean on, not something to rebel against.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577171/details', 'Nutrition', 0, ARRAY['nutrition', 'wellness'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 6', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577172/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 7', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577173/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 8', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577174/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 9', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577175/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 10', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577176/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 11', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577177/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 12', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577178/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 13', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577179/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 14', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577180/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 15', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577181/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 16', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577182/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 17', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577183/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 18', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577184/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 19', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577185/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 20', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577186/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 21', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577187/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 22', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577188/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 23', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577189/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 24', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577190/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 25', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577191/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 26', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577192/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 27', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577193/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 28', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577194/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 29', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577195/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 30', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577196/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 31', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577197/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 32', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577198/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 33', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577199/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 34', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577200/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 35', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577201/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 36', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577202/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 37', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577203/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 38', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577204/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 39', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577205/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 40', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577206/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 41', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577207/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 42', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577208/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 43', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577209/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 44', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577210/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 45', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577211/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 46', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577212/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 47', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577213/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 48', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577214/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 49', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577215/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 50', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577216/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 51', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577217/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 52', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577218/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true),
  ('Session 53', '', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/2-bite-tuesday-at-10pm-et/sessions/10577219/details', 'Nutrition', 0, ARRAY['nutrition'], '00000000-0000-0000-0000-000000000007'::uuid, true);

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
