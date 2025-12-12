-- Batch update session titles
-- Replace the titles below with the actual titles extracted from each session page
-- Run this in Supabase SQL Editor after collecting all titles

UPDATE public.recorded_sessions 
SET title = CASE 
  WHEN video_url LIKE '%766599%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766600%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766601%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766602%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766603%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766604%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766605%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766606%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766607%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766608%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766609%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766610%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766611%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766612%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766613%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766614%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766615%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766616%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766617%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766618%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766619%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766620%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766621%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766622%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766623%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766624%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766625%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766626%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766627%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766628%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766629%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766630%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766631%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766632%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766633%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766634%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766635%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766636%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766637%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766638%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766639%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766640%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766641%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766642%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766643%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766644%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766645%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766646%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766647%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766648%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766649%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766650%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766651%' THEN 'Plan My Week - Weekly Work Session'
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
LIMIT 10;
