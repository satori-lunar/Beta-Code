-- Update session titles with better names
-- Run this after extracting headings from session pages
-- Replace the titles below with actual headings from your sessions

-- Example: Update a session title
-- UPDATE public.recorded_sessions 
-- SET title = 'Week 1: Introduction to Planning'
-- WHERE video_url = 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766599/details';

-- To update all sessions, you'll need to:
-- 1. Visit each session page in your browser (while logged in)
-- 2. Open browser console (F12)
-- 3. Run the extract-session-headings.js script
-- 4. Copy the suggested_title
-- 5. Update the SQL below with the actual titles
-- 6. Run this script

-- Template for updating sessions:
/*
UPDATE public.recorded_sessions 
SET title = 'YOUR_TITLE_HERE'
WHERE video_url = 'YOUR_URL_HERE';
*/

-- After extracting headings, you can batch update like this:
-- UPDATE public.recorded_sessions 
-- SET title = CASE 
--   WHEN video_url LIKE '%766599%' THEN 'Week 1: Introduction to Planning'
--   WHEN video_url LIKE '%766600%' THEN 'Week 2: Setting Goals'
--   WHEN video_url LIKE '%766601%' THEN 'Week 3: Time Management'
--   -- Add more cases as needed
--   ELSE title
-- END
-- WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;
