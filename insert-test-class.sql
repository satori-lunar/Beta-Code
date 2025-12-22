-- Insert Test Class for Email Reminder Testing
-- This creates a test class on Monday, December 22 at 1:05 AM Eastern Time
-- Run this in Supabase SQL Editor

-- First, delete any existing "Test Class" to avoid duplicates
DELETE FROM public.live_classes WHERE title = 'Test Class';

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
  '2025-12-22 01:30:00-05'::timestamptz, -- Monday, December 22, 2025 at 1:30 AM Eastern Time
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
  TO_CHAR(scheduled_at, 'Day') as day_of_week,
  duration,
  category
FROM public.live_classes
WHERE title = 'Test Class'
ORDER BY created_at DESC
LIMIT 1;

-- Check all live classes to see what's in the database
SELECT 
  title,
  scheduled_at,
  TO_CHAR(scheduled_at, 'Day, Month DD, YYYY HH:MI AM') as formatted_time
FROM public.live_classes
ORDER BY scheduled_at DESC
LIMIT 10;

