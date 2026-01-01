-- ============================================
-- INSERT "CARE WITHOUT COLLAPSE" COURSE AND ALL 53 RECORDED SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Care without Collapse" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000009'::uuid;
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
  'Care without Collapse',
  'When you''re caring for someone else—an aging parent, a partner, a child, a family member—it can quietly take over your whole nervous system. You stay strong. You show up. You keep going. And somewhere along the way, you start to disappear. Care Without Collapse is a supportive space for caregivers who want relief without guilt and steadiness without burning out. This class isn''t about doing more or fixing everything. It''s about learning how to care with ground under you. Together, we''ll: Name the invisible weight caregivers carry Untangle responsibility from self-erasure Learn how to stay emotionally present without collapsing under it Practice small, realistic ways to support yourself while you support others You don''t need to have the right words. You don''t need a plan. You just need a place where you are also held. Come as you are. Leave steadier.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Caregiving Support',
  'intermediate',
  ARRAY['caregiving', 'care without collapse', 'support', 'emotional health', 'boundaries', 'self-care', 'coaching']
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
  ('Session 1', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723084/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 2', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723085/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 3', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723086/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 4', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723087/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 5', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723088/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 6', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723089/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 7', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723090/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 8', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723091/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 9', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723092/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 10', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723093/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 11', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723094/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 12', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723095/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 13', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723096/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 14', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723097/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 15', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723098/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 16', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723099/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 17', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723100/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 18', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723101/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 19', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723102/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 20', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723103/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 21', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723104/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 22', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723105/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 23', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723106/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 24', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723107/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 25', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723108/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 26', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723109/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 27', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723110/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 28', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723111/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 29', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723112/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 30', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723113/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 31', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723114/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 32', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723115/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 33', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723116/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 34', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723117/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 35', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723118/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 36', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723119/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 37', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723120/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 38', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723121/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 39', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723122/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 40', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723123/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 41', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723124/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 42', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723125/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 43', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723126/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 44', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723127/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 45', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723128/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 46', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723129/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 47', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723130/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 48', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723131/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 49', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723132/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 50', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723133/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 51', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723134/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 52', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723135/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true),
  ('Session 53', 'Care without Collapse - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/care-without-collapse-saturday-12-00pm-et/sessions/10723136/details', 'Caregiving Support', 0, ARRAY['caregiving', 'support', 'coaching'], '00000000-0000-0000-0000-000000000009'::uuid, true);

-- Step 3: Verify the data
SELECT
  c.title as course_title,
  COUNT(rs.id) as session_count,
  c.sessions as expected_sessions
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000009'::uuid
GROUP BY c.id, c.title, c.sessions;
