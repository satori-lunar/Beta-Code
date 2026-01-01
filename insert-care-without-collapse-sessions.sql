-- ============================================
-- INSERT "CARE WITHOUT COLLAPSE" LIVE CLASS FOR SATURDAY 12:00PM ET
-- ============================================
-- Run this in Supabase SQL Editor

-- Insert Care without Collapse live class
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
  'Care without Collapse w/Coach Dani',
  'When you''re caring for someone else—an aging parent, a partner, a child, a family member—it can quietly take over your whole nervous system.',
  'Coach Dani',
  '2024-12-28 12:00:00-05'::timestamptz, -- Saturdays at 12:00 PM ET
  45,
  NULL, -- Zoom link to be added when available
  'shield', -- Icon representing protection/support for caregivers
  'Caregiving Support'
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
WHERE title LIKE '%Care without Collapse%'
ORDER BY scheduled_at DESC;
