-- Insert "Made 2 Move: Group Exercise Replays" course and all sessions
-- Run this in Supabase SQL Editor

-- Step 1: Create "Made 2 Move: Group Exercise Replays" course
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
  'Made 2 Move: Group Exercise Replays',
  'Group exercise for all fitness levels. Seated and standing options and modifications for range of motion and intensity given throughout workout. Come as you are!',
  'Birch & Stone Coaching',
  '60 minutes per session',
  46,
  'Fitness',
  'beginner',
  ARRAY['exercise', 'fitness', 'group workout', 'movement', 'all levels', 'seated', 'standing']
);

-- Step 2: Insert all 46 sessions linked to the course
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
  ('Week 1, Day 1', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796532/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 1'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 1, Day 2', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796533/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 1'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 2, Day 1', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796534/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 2'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 2, Day 2', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796535/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 2'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 3, Day 1', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796536/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 3'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 3, Day 2', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796537/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 3'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 4, Day 1', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796538/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 4'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 4, Day 2', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796539/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 4'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 5, Day 1', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796540/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 5'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 6, Day 1', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796541/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 6'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 6, Day 2', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796542/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 6'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 7, Day 1', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796543/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 7'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 7, Day 2', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796544/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 7'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 8, Day 1', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796545/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 8'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 8, Day 2', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796546/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 8'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 9, Day 1', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796547/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 9'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 9, Day 2', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796548/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 9'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 10 Day 1 (8/5/25)', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796549/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 10'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 10: Day 2 (8/8/25)', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796550/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 10'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 11: Day 1 (8/12/25)', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796551/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 11'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 11: Day 2 (8/15/25)', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796552/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 11'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 12: Day 1 (8/19/25)', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796553/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 12'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 12: Day 2 (8/22/25)', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796554/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 12'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 13: Day 1 (8/26/25)', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796555/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 13'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Week 13: Day 2 (8/29/25)', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796556/details', 'Fitness', 0, ARRAY['exercise', 'fitness', 'week 13'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 26', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796557/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 27', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796558/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 28', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796559/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 29', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796560/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 30', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796561/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 31', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796562/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 32', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796563/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 33', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796564/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 34', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796565/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 35', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796566/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 36', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796567/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 37', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796568/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 38', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796569/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 39', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796570/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 40', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796571/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 41', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796572/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 42', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796573/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 43', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796574/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 44', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796575/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 45', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796576/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true),
  ('Session 46', 'Made 2 Move: Group Exercise Replays - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 60, 'https://www.birchandstonecoaching.com/coaching/groups/made-2-move-group-exercise-replays/sessions/796577/details', 'Fitness', 0, ARRAY['exercise', 'fitness'], '00000000-0000-0000-0000-000000000006'::uuid, true);

-- Delete any existing sessions for this course first (optional - comment out if you want to keep existing)
-- DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000006'::uuid;

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000006'::uuid
GROUP BY c.id, c.title;
