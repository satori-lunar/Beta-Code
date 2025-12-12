# Setup Instructions: Plan Your Week Course

## Step 1: Create All Tables (Run First!)

The `courses` table doesn't exist yet. Run this **FIRST**:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste **ALL** code from `CREATE_ALL_TABLES.sql`
3. Click **Run**

This creates:
- ✅ `users` table
- ✅ `courses` table  
- ✅ `recorded_sessions` table (with `course_id` field)
- ✅ `user_favorite_sessions` table
- ✅ `user_session_completions` table
- ✅ All indexes and RLS policies

## Step 2: Insert Course and Sessions

After Step 1 completes successfully:

1. Still in **SQL Editor**
2. Copy and paste **ALL** code from `insert-plan-your-week-sessions.sql`
3. Click **Run**

This creates:
- ✅ "Plan Your Week" course
- ✅ All 53 sessions linked to that course

## Verify It Worked

Run this query:

```sql
-- Check course exists
SELECT * FROM public.courses WHERE title = 'Plan Your Week';

-- Count sessions
SELECT COUNT(*) as session_count 
FROM public.recorded_sessions 
WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;
```

Should show: **1 course** and **53 sessions**!

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran `CREATE_ALL_TABLES.sql` FIRST
- Check that all tables were created in the Supabase Dashboard → Table Editor

### Error: "duplicate key value"
- The course or sessions already exist
- You can delete them first:
  ```sql
  DELETE FROM public.recorded_sessions WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;
  DELETE FROM public.courses WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;
  ```
- Then run `insert-plan-your-week-sessions.sql` again

## What You Get

✅ **1 Course**: "Plan Your Week" with 53 sessions  
✅ **53 Sessions**: All with their Kajabi URLs  
✅ **User Features**: Favorite and mark sessions as completed
