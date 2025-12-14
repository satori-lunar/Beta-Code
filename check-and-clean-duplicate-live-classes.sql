-- Check for duplicate live classes and clean them up
-- Run this in Supabase SQL Editor

-- Step 1: Check for duplicates (same title + scheduled_at)
SELECT 
  title,
  scheduled_at,
  COUNT(*) as duplicate_count,
  array_agg(id ORDER BY created_at) as ids,
  array_agg(created_at ORDER BY created_at) as created_dates
FROM public.live_classes
GROUP BY title, scheduled_at
HAVING COUNT(*) > 1
ORDER BY title, scheduled_at;

-- Step 2: Delete duplicates, keeping only the oldest one (first created)
-- This will keep the first occurrence and delete all others
DELETE FROM public.live_classes
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (PARTITION BY title, scheduled_at ORDER BY created_at ASC) as rn
    FROM public.live_classes
  ) t
  WHERE rn > 1
);

-- Step 3: Verify the cleanup - should show no duplicates
SELECT 
  title,
  scheduled_at,
  COUNT(*) as count
FROM public.live_classes
GROUP BY title, scheduled_at
HAVING COUNT(*) > 1;

-- Step 4: Show classes grouped by weekday to verify
SELECT 
  TO_CHAR(scheduled_at, 'Day') as weekday,
  title,
  TO_CHAR(scheduled_at, 'HH24:MI') as time,
  COUNT(*) as count
FROM public.live_classes
GROUP BY weekday, title, time
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
  time;
