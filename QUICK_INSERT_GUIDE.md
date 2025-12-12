# Quick Guide: Insert "Plan Your Week" Course and Sessions

## Option 1: Using SQL (Fastest - Recommended)

### Step 1: Run Migration First

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/006_add_course_to_sessions.sql`
3. Click **Run**

This adds the `course_id` field to link sessions to courses.

### Step 2: Insert Course and Sessions

1. Still in **SQL Editor**
2. Copy and paste the contents of `insert-plan-your-week-sessions.sql`
3. Click **Run**

Done! All 53 sessions are now in your database under "Plan Your Week" course.

## Option 2: Using Edge Function

1. **Deploy the function:**
   ```bash
   supabase functions deploy insert-plan-your-week
   ```

2. **Call the function:**
   - Open: `https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/insert-plan-your-week`
   - Or use curl/PowerShell to POST to it

## What Gets Created

✅ **1 Course**: "Plan Your Week"
- 53 sessions
- Category: Planning
- Level: Beginner

✅ **53 Sessions**: All linked to the course
- Each has its Kajabi URL
- Ready for users to favorite and mark as completed

## Verify It Worked

Run this in SQL Editor:

```sql
-- Check the course
SELECT * FROM public.courses WHERE title = 'Plan Your Week';

-- Count sessions
SELECT COUNT(*) as session_count 
FROM public.recorded_sessions 
WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;
```

Should show 1 course and 53 sessions!

## User Features Now Available

- ✅ Users see "Plan Your Week" as a course
- ✅ Clicking it shows all 53 sessions
- ✅ Users can favorite sessions (existing `user_favorite_sessions` table)
- ✅ Users can mark sessions as completed (new `user_session_completions` table)
