-- ============================================
-- INSERT "WHAT WENT WELL" LIVE CLASS FOR SATURDAY 3:00PM ET
-- ============================================
-- Run this in Supabase SQL Editor
-- This creates a live class with the check-circle icon representing positive reflection

-- Delete any existing live classes with this title to avoid duplicates
DELETE FROM public.live_classes WHERE title = 'What Went Well w/Coach Dani';

-- Insert the What Went Well live class for Saturday at 3:00pm ET
INSERT INTO public.live_classes (
  title,
  description,
  instructor,
  scheduled_at,
  duration,
  zoom_link,
  thumbnail_url,
  category
) VALUES (
  'What Went Well w/Coach Dani',
  'This is not a "review what you messed up" class. It''s a practice in seeing yourself clearly and kindly.',
  'Coach Dani',
  '2026-01-03 15:00:00-05'::timestamptz, -- Saturday, January 3, 2026, 3:00 PM ET
  45,
  NULL, -- Zoom link to be added when available
  'check-circle', -- Icon representing positive reflection and success
  'Positive Psychology'
);

-- Step 2: Verify the live class data
SELECT
  title,
  instructor,
  scheduled_at,
  duration,
  category,
  thumbnail_url
FROM public.live_classes
WHERE title = 'What Went Well w/Coach Dani'
ORDER BY scheduled_at DESC;
