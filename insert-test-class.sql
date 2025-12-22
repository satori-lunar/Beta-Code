-- Delete Test Class from database
-- Run this in Supabase SQL Editor to remove the test class

DELETE FROM public.live_classes WHERE title = 'Test Class';

-- Verify the test class was deleted (should return no rows)
SELECT 
  id,
  title,
  scheduled_at
FROM public.live_classes
WHERE title = 'Test Class';
