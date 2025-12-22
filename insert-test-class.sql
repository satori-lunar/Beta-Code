-- Test Class helper script
-- Run this in Supabase SQL Editor to reset and insert a test class

-- 1) Clean up any existing Test Class to avoid duplicates

DELETE FROM public.live_classes WHERE title = 'Test Class';

-- 2) Insert a new Test Class
--   Time: 4:15 AM Eastern
--   Date: Monday, December 22, 2025

INSERT INTO public.live_classes (
  title,
  description,
  instructor,
  scheduled_at,
  duration,
  zoom_link,
  category
)
VALUES (
  'Test Class',
  'This is a test class for testing email reminders. You can set a reminder for this class to test the email notification system.',
  'Test Instructor',
  '2025-12-22 04:15:00-05'::timestamptz, -- Monday, December 22, 2025 at 4:15 AM Eastern Time
  60, -- 60 minutes duration
  NULL, -- No zoom link for test
  'Testing'
);

-- 3) Verify the test class was created correctly
SELECT 
  id,
  title,
  scheduled_at,
  TO_CHAR(scheduled_at, 'Day') AS weekday,
  TO_CHAR(scheduled_at, 'HH24:MI') AS time_et
FROM public.live_classes
WHERE title = 'Test Class'
ORDER BY created_at DESC
LIMIT 1;
