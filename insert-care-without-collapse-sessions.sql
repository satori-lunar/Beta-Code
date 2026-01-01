-- ============================================
-- INSERT "CARE WITHOUT COLLAPSE" LIVE CLASS FOR SATURDAY 12:00PM ET
-- ============================================
-- Run this in Supabase SQL Editor

-- Insert the Care without Collapse live class for Saturday at 12:00pm ET
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
  'Care without Collapse - Saturday 12:00pm ET',
  'When you''re caring for someone else—an aging parent, a partner, a child, a family member—it can quietly take over your whole nervous system. You stay strong. You show up. You keep going. And somewhere along the way, you start to disappear. Care Without Collapse is a supportive space for caregivers who want relief without guilt and steadiness without burning out. This class isn''t about doing more or fixing everything. It''s about learning how to care with ground under you. Together, we''ll: Name the invisible weight caregivers carry Untangle responsibility from self-erasure Learn how to stay emotionally present without collapsing under it Practice small, realistic ways to support yourself while you support others You don''t need to have the right words. You don''t need a plan. You just need a place where you are also held. Come as you are. Leave steadier.',
  'Birch & Stone Coaching',
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
WHERE title = 'Care without Collapse - Saturday 12:00pm ET'
ORDER BY scheduled_at DESC;
