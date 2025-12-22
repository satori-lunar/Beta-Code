-- Insert Test Class for Email Reminder Testing
-- This creates a test class on January 22nd at 1:00 AM Eastern Time
-- Run this in Supabase SQL Editor

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
  '2025-01-22 01:00:00-05'::timestamptz, -- January 22, 2025 at 1:00 AM Eastern Time
  60, -- 60 minutes duration
  NULL, -- No zoom link for test
  'Testing'
)
RETURNING *;

-- Verify the test class was created
SELECT 
  id,
  title,
  scheduled_at,
  TO_CHAR(scheduled_at, 'Day, Month DD, YYYY HH:MI AM') as formatted_time,
  duration,
  category
FROM public.live_classes
WHERE title = 'Test Class'
ORDER BY created_at DESC
LIMIT 1;

