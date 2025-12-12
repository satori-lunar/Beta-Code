# Fix: "column course_id does not exist" Error

## Quick Fix

The `recorded_sessions` table exists but is missing the `course_id` column. Run this:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste **ALL** code from `ADD_COURSE_ID_COLUMN.sql`
3. Click **Run**

This will add the `course_id` column to your existing `recorded_sessions` table.

## Then Continue

After adding the column:

1. Still in **SQL Editor**
2. Copy and paste **ALL** code from `insert-plan-your-week-sessions.sql`
3. Click **Run**

## Complete Setup Order

If you're starting fresh:

1. ✅ Run `CREATE_ALL_TABLES.sql` (creates all tables)
2. ✅ Run `ADD_COURSE_ID_COLUMN.sql` (adds course_id if missing)
3. ✅ Run `insert-plan-your-week-sessions.sql` (inserts course and sessions)

## Verify

After running, check:

```sql
-- Check if course_id column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'recorded_sessions' 
AND column_name = 'course_id';
```

Should show: `course_id | uuid`
