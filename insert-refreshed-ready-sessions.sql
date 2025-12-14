-- ============================================
-- INSERT "REFRESHED AND READY" COURSE AND ALL 53 SESSIONS
-- ============================================
-- Run this in Supabase SQL Editor

-- Step 1: Create the "Refreshed and Ready" course
-- First, delete if exists to avoid conflicts
DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000008'::uuid;

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
  '00000000-0000-0000-0000-000000000008'::uuid,
  'Refreshed and Ready',
  'Morning sessions focused on starting your day with intention, clarity, and purpose. Join us every Wednesday at 6:30 AM ET for energizing conversations and practical strategies to begin your day refreshed and ready.',
  'Birch & Stone Coaching',
  '45 minutes per session',
  53,
  'Wellness',
  'beginner',
  ARRAY['wellness', 'morning', 'productivity', 'mindfulness', 'intention', 'wednesday']
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
  ('Follow Through - Dec 3rd', 'Choose Your Thought for Today: "I can take today one step at a time." "I follow through by staying present, not perfect." "I am capable of doing what today actually requires." "My energy is enough for what matters." "Small follow-through counts." ONE CLEAR NEXT STEP (show your brain evidence right away to support your thinking): Drink water before coffee. Put your shoes on and walk for 5 minutes. Tidy one small corner before diving into the day. Closing Quote: "Begin the day with yourself — and the rest becomes easier to follow."', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604426/details', 'Wellness', 0, ARRAY['wellness', 'productivity'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Part One - Update Leftover Thinking - Dec 10th', 'Journal Prompt: Take a minute to write: 1. My first waking thought was… 2. One word in that thought that stands out is… 3. This thought makes my day feel… 4. A more supportive thought for today is… 5. With this new thought, I want to show up as someone who… Practice Prompt: Choose your supporting sentence for the day and use it once, on purpose: before email, before an appointment, before making food, before your most important task. Pause for a moment, repeat your sentence, and take one small action from it. Closing Quote: "You can''t always choose your first thought of the day, but you can choose the one you carry with you."', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604427/details', 'Wellness', 0, ARRAY['wellness', 'mindfulness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('December 10th, Part Two', 'Part one of the recording ended abruptly when Zoom booted me. Here is the remainder of the class.', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604428/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 4', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604429/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 5', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604430/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 6', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604431/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 7', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604432/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 8', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604433/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 9', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604434/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 10', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604435/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 11', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604436/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 12', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604437/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 13', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604438/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 14', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604439/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 15', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604440/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 16', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604441/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 17', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604442/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 18', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604443/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 19', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604444/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 20', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604445/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 21', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604446/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 22', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604447/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 23', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604448/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 24', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604449/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 25', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604450/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 26', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604451/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 27', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604452/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 28', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604453/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 29', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604454/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 30', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604455/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 31', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604456/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 32', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604457/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 33', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604458/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 34', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604459/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 35', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604460/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 36', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604461/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 37', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604462/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 38', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604463/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 39', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604464/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 40', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604465/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 41', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604466/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 42', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604467/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 43', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604468/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 44', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604469/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 45', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604470/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 46', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604471/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 47', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604472/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 48', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604473/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 49', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604474/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 50', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604475/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 51', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604476/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 52', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604477/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true),
  ('Session 53', 'Refreshed and Ready - Session Recording', 'Birch & Stone Coaching', CURRENT_DATE, 45, 'https://www.birchandstonecoaching.com/coaching/groups/refreshed-ready-weds-6-30am-et/sessions/10604478/details', 'Wellness', 0, ARRAY['wellness'], '00000000-0000-0000-0000-000000000008'::uuid, true);

-- Step 3: Verify the data
SELECT 
  c.title as course_title,
  c.sessions as expected_sessions,
  COUNT(rs.id) as actual_session_count,
  MIN(rs.recorded_at) as first_session_date,
  MAX(rs.recorded_at) as last_session_date
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.id = '00000000-0000-0000-0000-000000000008'::uuid
GROUP BY c.id, c.title, c.sessions;

-- Step 4: View sample sessions to verify
SELECT 
  rs.title,
  rs.video_url,
  rs.recorded_at,
  rs.duration
FROM public.recorded_sessions rs
WHERE rs.course_id = '00000000-0000-0000-0000-000000000008'::uuid
ORDER BY rs.recorded_at DESC
LIMIT 10;
