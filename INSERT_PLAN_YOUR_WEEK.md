# Insert "Plan Your Week" Course and Sessions

This guide shows you how to insert the "Plan Your Week" course with all 53 sessions directly into Supabase.

## Step 1: Run the Migration

First, add the `course_id` field to `recorded_sessions`:

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/006_add_course_to_sessions.sql`
3. Click **Run**

This will:
- Add `course_id` column to `recorded_sessions`
- Create `user_session_completions` table for tracking completed sessions
- Set up proper indexes and RLS policies

## Step 2: Insert the Course and Sessions

1. In Supabase Dashboard → **SQL Editor**
2. Copy and paste the contents of `insert-plan-your-week-sessions.sql`
3. Click **Run**

This will:
- Create the "Plan Your Week" course
- Insert all 53 sessions linked to that course
- Each session will have its URL from Kajabi

## Step 3: Verify

Run this query to verify everything was inserted:

```sql
-- Check the course
SELECT * FROM public.courses 
WHERE title = 'Plan Your Week';

-- Check sessions linked to the course
SELECT 
  rs.id,
  rs.title,
  rs.video_url,
  rs.course_id,
  c.title as course_title
FROM public.recorded_sessions rs
JOIN public.courses c ON c.id = rs.course_id
WHERE c.title = 'Plan Your Week'
ORDER BY rs.title
LIMIT 10;
```

## What This Creates

1. **One Course**: "Plan Your Week"
   - 53 sessions total
   - Category: Planning
   - Level: Beginner

2. **53 Sessions**: All linked to the course
   - Each has its Kajabi URL
   - Can be favorited (via `user_favorite_sessions`)
   - Can be marked as completed (via `user_session_completions`)

## User Features

Users can now:
- ✅ See "Plan Your Week" as a course
- ✅ Click on it to see all 53 sessions
- ✅ Favorite sessions (using existing `user_favorite_sessions` table)
- ✅ Mark sessions as completed (using new `user_session_completions` table)

## Next Steps

After inserting, you may want to:
1. Update session titles with actual dates/topics (if you have that info)
2. Add thumbnails to the course
3. Update descriptions for each session
4. Set actual `recorded_at` dates for each session

## Query Examples

### Get all sessions for "Plan Your Week"
```sql
SELECT * FROM public.recorded_sessions 
WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid
ORDER BY recorded_at DESC;
```

### Get user's favorite sessions from this course
```sql
SELECT rs.* 
FROM public.recorded_sessions rs
JOIN public.user_favorite_sessions ufs ON ufs.session_id = rs.id
WHERE rs.course_id = '00000000-0000-0000-0000-000000000001'::uuid
  AND ufs.user_id = 'USER_ID_HERE';
```

### Get user's completed sessions from this course
```sql
SELECT rs.* 
FROM public.recorded_sessions rs
JOIN public.user_session_completions usc ON usc.session_id = rs.id
WHERE rs.course_id = '00000000-0000-0000-0000-000000000001'::uuid
  AND usc.user_id = 'USER_ID_HERE';
```
