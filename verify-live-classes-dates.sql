-- Verify all live class dates match their intended weekdays
-- Run this in Supabase SQL Editor

SELECT 
  title,
  scheduled_at,
  TO_CHAR(scheduled_at, 'Day') as actual_weekday,
  TO_CHAR(scheduled_at, 'HH24:MI') as time,
  CASE 
    WHEN title = 'Plan Your Week' AND TO_CHAR(scheduled_at, 'Day') = 'Sunday   ' THEN '✓ Correct'
    WHEN title = 'Rooted Weight Health' AND TO_CHAR(scheduled_at, 'Day') = 'Sunday   ' AND TO_CHAR(scheduled_at, 'HH24:MI') = '08:30' THEN '✓ Correct'
    WHEN title = 'Rooted Weight Health' AND TO_CHAR(scheduled_at, 'Day') = 'Thursday ' AND TO_CHAR(scheduled_at, 'HH24:MI') = '06:00' THEN '✓ Correct'
    WHEN title = 'The Heart of Nourishment' AND TO_CHAR(scheduled_at, 'Day') = 'Monday   ' THEN '✓ Correct'
    WHEN title = 'Foundations in Motion' AND TO_CHAR(scheduled_at, 'Day') = 'Monday   ' THEN '✓ Correct'
    WHEN title = 'Hatha Yoga' AND TO_CHAR(scheduled_at, 'Day') = 'Monday   ' AND TO_CHAR(scheduled_at, 'HH24:MI') = '16:00' THEN '✓ Correct'
    WHEN title = 'Hatha Yoga' AND TO_CHAR(scheduled_at, 'Day') = 'Thursday ' AND TO_CHAR(scheduled_at, 'HH24:MI') = '16:00' THEN '✓ Correct'
    WHEN title = 'Seedlings' AND TO_CHAR(scheduled_at, 'Day') = 'Monday   ' THEN '✓ Correct'
    WHEN title = 'Inner Chords' AND TO_CHAR(scheduled_at, 'Day') = 'Tuesday  ' THEN '✓ Correct'
    WHEN title = 'Strength in Motion' AND TO_CHAR(scheduled_at, 'Day') = 'Tuesday  ' THEN '✓ Correct'
    WHEN title = 'The Reflecting Pool' AND TO_CHAR(scheduled_at, 'Day') = 'Tuesday  ' THEN '✓ Correct'
    WHEN title = 'Wisdom Rising' AND TO_CHAR(scheduled_at, 'Day') = 'Tuesday  ' THEN '✓ Correct'
    WHEN title = '2-Bite Tuesdays' AND TO_CHAR(scheduled_at, 'Day') = 'Tuesday  ' THEN '✓ Correct'
    WHEN title = 'Refreshed & Ready' AND TO_CHAR(scheduled_at, 'Day') = 'Wednesday' THEN '✓ Correct'
    WHEN title = 'Grief & Growth' AND TO_CHAR(scheduled_at, 'Day') = 'Wednesday' THEN '✓ Correct'
    WHEN title = 'Instinctive Meditation' AND TO_CHAR(scheduled_at, 'Day') = 'Wednesday' THEN '✓ Correct'
    WHEN title = 'Tangled: Challenging Relationships' AND TO_CHAR(scheduled_at, 'Day') = 'Thursday ' THEN '✓ Correct'
    WHEN title = 'Evenings with Emily B' AND TO_CHAR(scheduled_at, 'Day') = 'Thursday ' THEN '✓ Correct'
    WHEN title = 'The Habit Lab' AND TO_CHAR(scheduled_at, 'Day') = 'Friday   ' THEN '✓ Correct'
    WHEN title = 'Energy in Motion' AND TO_CHAR(scheduled_at, 'Day') = 'Friday   ' THEN '✓ Correct'
    WHEN title = 'Nighttime Nurturing' AND TO_CHAR(scheduled_at, 'Day') = 'Friday   ' THEN '✓ Correct'
    ELSE '⚠ Check'
  END as status
FROM public.live_classes
ORDER BY 
  CASE TO_CHAR(scheduled_at, 'Day')
    WHEN 'Sunday   ' THEN 1
    WHEN 'Monday   ' THEN 2
    WHEN 'Tuesday  ' THEN 3
    WHEN 'Wednesday' THEN 4
    WHEN 'Thursday ' THEN 5
    WHEN 'Friday   ' THEN 6
    WHEN 'Saturday ' THEN 7
  END,
  scheduled_at;

-- Count classes per weekday
SELECT 
  TO_CHAR(scheduled_at, 'Day') as weekday,
  COUNT(*) as class_count
FROM public.live_classes
GROUP BY weekday
ORDER BY 
  CASE weekday
    WHEN 'Sunday   ' THEN 1
    WHEN 'Monday   ' THEN 2
    WHEN 'Tuesday  ' THEN 3
    WHEN 'Wednesday' THEN 4
    WHEN 'Thursday ' THEN 5
    WHEN 'Friday   ' THEN 6
    WHEN 'Saturday ' THEN 7
  END;
