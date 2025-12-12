-- Batch update all 53 session titles
-- This was generated from the sessions list page
-- Run this in Supabase SQL Editor

UPDATE public.recorded_sessions 
SET title = CASE 
  WHEN video_url LIKE '%766599%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766600%' THEN 'Plan Your Week - Monday Hour One Calendaring "Study Hall"'
  WHEN video_url LIKE '%766601%' THEN 'Plan Your Week 8/31'
  WHEN video_url LIKE '%766602%' THEN '9/21'
  WHEN video_url LIKE '%766603%' THEN 'Plan Your Week - Explained in more depth'
  WHEN video_url LIKE '%766604%' THEN 'Oct 5th Planning Session'
  WHEN video_url LIKE '%766605%' THEN 'Creating Your Google Calendar'
  WHEN video_url LIKE '%766606%' THEN 'Plan Your Week 10/19'
  WHEN video_url LIKE '%766607%' THEN 'Plan Your Week 10/26'
  WHEN video_url LIKE '%766608%' THEN 'The Twist - Energy Check w/Your Plan!'
  WHEN video_url LIKE '%766609%' THEN '11-9 Plan Your Week'
  WHEN video_url LIKE '%766610%' THEN 'Plan Your Week 11/16'
  WHEN video_url LIKE '%766611%' THEN 'Plan Your Week 11/23'
  WHEN video_url LIKE '%766612%' THEN 'Nov 30, Follow Through'
  WHEN video_url LIKE '%766613%' THEN '12-7 Plan'
  WHEN video_url LIKE '%766614%' THEN 'Session 16'
  WHEN video_url LIKE '%766615%' THEN 'Session 17'
  WHEN video_url LIKE '%766616%' THEN 'Session 18'
  WHEN video_url LIKE '%766617%' THEN 'Session 19'
  WHEN video_url LIKE '%766618%' THEN 'Session 20'
  WHEN video_url LIKE '%766619%' THEN 'Session 21'
  WHEN video_url LIKE '%766620%' THEN 'Session 22'
  WHEN video_url LIKE '%766621%' THEN 'Session 23'
  WHEN video_url LIKE '%766622%' THEN 'Session 24'
  WHEN video_url LIKE '%766623%' THEN 'Session 25'
  WHEN video_url LIKE '%766624%' THEN 'Session 26'
  WHEN video_url LIKE '%766625%' THEN 'Session 27'
  WHEN video_url LIKE '%766626%' THEN 'Session 28'
  WHEN video_url LIKE '%766627%' THEN 'Session 29'
  WHEN video_url LIKE '%766628%' THEN 'Session 30'
  WHEN video_url LIKE '%766629%' THEN 'Session 31'
  WHEN video_url LIKE '%766630%' THEN 'Session 32'
  WHEN video_url LIKE '%766631%' THEN 'Session 33'
  WHEN video_url LIKE '%766632%' THEN 'Session 34'
  WHEN video_url LIKE '%766633%' THEN 'Session 35'
  WHEN video_url LIKE '%766634%' THEN 'Session 36'
  WHEN video_url LIKE '%766635%' THEN 'Session 37'
  WHEN video_url LIKE '%766636%' THEN 'Session 38'
  WHEN video_url LIKE '%766637%' THEN 'Session 39'
  WHEN video_url LIKE '%766638%' THEN 'Session 40'
  WHEN video_url LIKE '%766639%' THEN 'Session 41'
  WHEN video_url LIKE '%766640%' THEN 'Session 42'
  WHEN video_url LIKE '%766641%' THEN 'Session 43'
  WHEN video_url LIKE '%766642%' THEN 'Session 44'
  WHEN video_url LIKE '%766643%' THEN 'Session 45'
  WHEN video_url LIKE '%766644%' THEN 'Session 46'
  WHEN video_url LIKE '%766645%' THEN 'Session 47'
  WHEN video_url LIKE '%766646%' THEN 'Session 48'
  WHEN video_url LIKE '%766647%' THEN 'Session 49'
  WHEN video_url LIKE '%766648%' THEN 'Session 50'
  WHEN video_url LIKE '%766649%' THEN 'Session 51'
  WHEN video_url LIKE '%766650%' THEN 'Session 52'
  WHEN video_url LIKE '%766651%' THEN 'Session 53'
  ELSE title
END
WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;

-- Verify the update
SELECT 
  id,
  title,
  video_url
FROM public.recorded_sessions 
WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid
ORDER BY title
LIMIT 20;
