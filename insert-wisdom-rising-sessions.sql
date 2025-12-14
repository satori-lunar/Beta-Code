-- ============================================
-- INSERT "WISDOM RISING" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Wisdom Rising" course
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
  'Wisdom Rising',
  'Weekly coaching sessions focused on navigating midlife transitions, menopause, and personal growth. Join us every Tuesday at 4:00 PM ET for support, education, and community.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Wisdom',
  'beginner',
  ARRAY['wisdom', 'menopause', 'midlife', 'wellness', 'coaching', 'community']
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
  ('WISDOM RISING | CLASS 1: 10/7: The Beginning of Midlife Power', 'Theme: Arriving in This Season of Change. Opening Reflection Question: What part of yourself are you ready to reconnect with in this new season of life? TEACHING: The Menopause Toolkit: Core Components of our work together in Wisdom Rising: Nutrition & Metabolism, Movement & Strength, Stress & Sleep, Mindset & Emotional Health, Connection & Community.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390304/details', 'Wisdom', 0, ARRAY['wisdom', 'midlife', 'menopause'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('WISDOM RISING | Class 2: Finding Rest in the Mess-October 14th', 'Wisdom Rising | Class 2: Finding Rest in the Mess', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390252/details', 'Wisdom', 0, ARRAY['wisdom', 'rest', 'midlife'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Wisdom Rising | Class Three: Energy & Renewal', 'Theme: Reclaiming your energy — learning to work with your body''s rhythms in midlife. Opening Reflection: Where do you feel most energized or depleted right now? Key Teaching: Energy in Midlife. The Three Pillars of Energy Renewal: Movement for Restoration, Nourishment for Stability, Recovery for Resilience.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390253/details', 'Wisdom', 0, ARRAY['wisdom', 'energy', 'renewal'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Wisdom Rising | Class Four — Strength', 'Theme: Building strength of body, mind, and spirit in midlife. Why Strength Matters: Muscle & Mood, Bones & Balance, Metabolism & Longevity. Your Strength Practice (this week): Choose one small act of strength and repeat it twice.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390254/details', 'Wisdom', 0, ARRAY['wisdom', 'strength', 'fitness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('WISDOM RISING | CLASS 5: 11/4: Nourishment', 'Theme: Feeding Vitality Through Pleasure & Connection. Nourishment isn''t just food. It''s everything we take in — what we eat, how we rest, who we spend time with, what we allow ourselves to feel. Midlife metabolism changes. Pleasure is medicine. Connection sustains us.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390255/details', 'Wisdom', 0, ARRAY['wisdom', 'nourishment', 'nutrition'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Wisdom Rising | Session 6: Symptoms Chat and What do we want to Discuss in this Group??', 'Grounding Breathing Practice Session. Menopause Symptoms and Experiences. Menopause Experiences and Symptom Diversity. Menopause Symptoms and Coping Strategies. Discussion on various menopause symptoms and experiences, including anxiety, migraines, and incontinence.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390256/details', 'Wisdom', 0, ARRAY['wisdom', 'symptoms', 'discussion'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Wisdom Rising | Session 7: Resources and Topics Discussion', 'Menopause Education and Support Group. Menopause Research and Resource Discussion. Menopause Books and Bone Health. Menopause Health and Aging Concerns. Discussion on various health issues related to menopause and aging, including sleep disturbances, osteopenia, and pelvic floor health.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390257/details', 'Wisdom', 0, ARRAY['wisdom', 'resources', 'education'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Wisdom Rising | Session 8: Mind & Body Connection: Yoga Nidra', 'Wisdom Rising | Session 8: Mind & Body Connection: Yoga Nidra', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390258/details', 'Wisdom', 0, ARRAY['wisdom', 'yoga', 'mindfulness'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Wisdom Rising | Session 9: 12/2 The Pelvic Floor', 'Pelvic Floor Health for Women. Pelvic Floor Health and Function. Pelvic Floor Health Awareness Discussion. Discussion on pelvic floor anatomy and issues, including incontinence and pelvic floor exercises.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390259/details', 'Wisdom', 0, ARRAY['wisdom', 'pelvic', 'health'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Wisdom Rising | Session 10: Non-Pharmacological Hormone Health', 'Grounding Exercise for Presence. Hormone Health and Pelvic Floor. Hormone Therapy Doctor Discussion Challenges. Menopause Supplement Discussion Group. Discussion on various supplements and alternative treatments for menopause and midlife symptoms.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390260/details', 'Wisdom', 0, ARRAY['wisdom', 'hormones', 'supplements'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 11', 'Wisdom Rising | Session 11', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390261/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 12', 'Wisdom Rising | Session 12', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390262/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 13', 'Wisdom Rising | Session 13', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390263/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 14', 'Wisdom Rising | Session 14', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390264/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 15', 'Wisdom Rising | Session 15', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390265/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 16', 'Wisdom Rising | Session 16', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390266/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 17', 'Wisdom Rising | Session 17', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390267/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 18', 'Wisdom Rising | Session 18', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390268/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 19', 'Wisdom Rising | Session 19', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390269/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 20', 'Wisdom Rising | Session 20', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390270/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 21', 'Wisdom Rising | Session 21', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390271/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 22', 'Wisdom Rising | Session 22', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390272/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 23', 'Wisdom Rising | Session 23', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390273/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 24', 'Wisdom Rising | Session 24', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390274/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 25', 'Wisdom Rising | Session 25', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390275/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 26', 'Wisdom Rising | Session 26', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390276/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 27', 'Wisdom Rising | Session 27', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390277/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 28', 'Wisdom Rising | Session 28', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390278/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 29', 'Wisdom Rising | Session 29', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390279/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 30', 'Wisdom Rising | Session 30', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390280/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 31', 'Wisdom Rising | Session 31', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390281/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 32', 'Wisdom Rising | Session 32', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390282/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 33', 'Wisdom Rising | Session 33', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390283/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 34', 'Wisdom Rising | Session 34', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390284/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 35', 'Wisdom Rising | Session 35', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390285/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 36', 'Wisdom Rising | Session 36', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390286/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 37', 'Wisdom Rising | Session 37', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390287/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 38', 'Wisdom Rising | Session 38', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390288/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 39', 'Wisdom Rising | Session 39', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390289/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 40', 'Wisdom Rising | Session 40', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390290/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 41', 'Wisdom Rising | Session 41', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390291/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 42', 'Wisdom Rising | Session 42', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390292/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 43', 'Wisdom Rising | Session 43', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390293/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 44', 'Wisdom Rising | Session 44', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390294/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 45', 'Wisdom Rising | Session 45', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390295/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 46', 'Wisdom Rising | Session 46', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390296/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 47', 'Wisdom Rising | Session 47', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390297/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 48', 'Wisdom Rising | Session 48', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390298/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 49', 'Wisdom Rising | Session 49', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390299/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 50', 'Wisdom Rising | Session 50', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390300/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 51', 'Wisdom Rising | Session 51', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390301/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 52', 'Wisdom Rising | Session 52', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390302/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true),
  ('Session 53', 'Wisdom Rising | Session 53', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/wisdom-rising-tuesdays-4pm-et/sessions/10390303/details', 'Wisdom', 0, ARRAY['wisdom'], '00000000-0000-0000-0000-000000000002'::uuid, true);

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count,
  MIN(rs.recorded_at) as first_session_date,
  MAX(rs.recorded_at) as last_session_date
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000002'::uuid
GROUP BY c.id, c.title, c.sessions;

-- Step 4: View sample sessions to verify
SELECT 
  rs.title,
  rs.video_url,
  rs.recorded_at,
  rs.duration
FROM public.recorded_sessions rs
WHERE rs.course_id = '00000000-0000-0000-0000-000000000002'::uuid
ORDER BY rs.recorded_at DESC
LIMIT 10;
