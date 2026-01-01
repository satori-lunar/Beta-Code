-- ============================================
-- INSERT "VISION & VIBES" LIVE CLASS FOR SATURDAY 7:30AM ET
-- ============================================
-- Run this in Supabase SQL Editor
-- This creates a live class with the sunrise icon representing morning mindfulness

-- Delete any existing live classes with this title to avoid duplicates
DELETE FROM public.live_classes WHERE title = 'Vision & Vibes w/Coach Emily M Saturday 7:30 am, Join Live!';

-- Insert the Vision & Vibes live class for Saturday at 7:30am ET
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
  'Vision & Vibes w/Coach Emily M Saturday 7:30 am, Join Live!',
  'Vision & Vibes is a calm, grounding workshop designed to help you ease into your day with intention instead of urgency. This is not about goals, pressure, or fixing yourself before the day begins. It''s about creating a quiet moment to check in, soften your nervous system, and reconnect with what matters—today and in the season ahead.',
  'Coach Emily M',
  '2026-01-11 07:30:00-05'::timestamptz, -- Saturday, January 11, 2026, 7:30 AM ET
  45,
  NULL, -- Zoom link to be added when available
  'sunrise', -- Icon representing morning mindfulness and intention-setting
  'Morning Mindfulness'
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
WHERE title = 'Vision & Vibes w/Coach Emily M Saturday 7:30 am, Join Live!'
ORDER BY scheduled_at DESC;
