# Simple Setup - Just 2 Steps!

## Step 1: Run Complete Setup (One Time)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy **ALL** code from `COMPLETE_SETUP.sql`
3. Paste and click **Run**

This creates all tables and adds the `course_id` column properly.

## Step 2: Insert Course and Sessions

1. Still in **SQL Editor**
2. Copy **ALL** code from `insert-plan-your-week-sessions.sql`
3. Paste and click **Run**

Done! ✅

## Verify

Run this query:

```sql
SELECT 
  c.title as course,
  COUNT(rs.id) as session_count
FROM public.courses c
LEFT JOIN public.recorded_sessions rs ON rs.course_id = c.id
WHERE c.title = 'Plan Your Week'
GROUP BY c.id, c.title;
```

Should show: **1 course** with **53 sessions**!

## If You Get Errors

### "relation courses does not exist"
- Make sure you ran `COMPLETE_SETUP.sql` first

### "column course_id does not exist"  
- Make sure you ran `COMPLETE_SETUP.sql` first (it adds the column)

### "duplicate key value"
- The course already exists. Delete it first:
  ```sql
  DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;
  DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;
  ```
- Then run `insert-plan-your-week-sessions.sql` again
