# User Activity Tracking Guide

This guide explains how user activities are tracked and organized in Supabase.

## Overview

All user actions in the dashboard are automatically tracked in the `user_activity` table, making it easy to see what users are doing in a visible and organized way.

## Tracked Activities

The following activities are automatically tracked:

1. **Video Views** - When users click on recorded class videos
2. **Favorites** - When users add or remove favorites from sessions
3. **Reminders** - When users set or cancel reminders for live classes
4. **Journal Entries** - When users create or update journal entries
5. **Weight Logs** - When users log their weight
6. **Logins** - When users sign in

## Viewing Activities in Supabase

### Option 1: Use the Detailed View (Recommended)

The easiest way to view activities is using the `user_activity_detailed` view:

1. Go to Supabase Dashboard → Table Editor
2. Select the view: `user_activity_detailed`
3. This view shows:
   - User email and name
   - Activity type with human-readable labels
   - Activity description (e.g., "Viewed video: Yoga Class")
   - Entity title (e.g., class name, journal entry title)
   - Formatted timestamp
   - All metadata

### Option 2: Use the Base Table

1. Go to Supabase Dashboard → Table Editor
2. Select the table: `user_activity`
3. You'll see all raw activity data

## Activity Data Structure

Each activity record includes:

- **user_id** - The user who performed the action
- **activity_type** - Type of activity (see list below)
- **activity_description** - Human-readable description
- **entity_type** - Type of entity (e.g., 'recorded_session', 'journal_entry')
- **entity_id** - ID of the specific entity
- **entity_title** - Title/name of the entity
- **metadata** - Additional JSON data (varies by activity type)
- **created_at** - When the activity occurred

## Activity Types

- `video_view` - User viewed a recorded session
- `favorite_added` - User added a session to favorites
- `favorite_removed` - User removed a session from favorites
- `reminder_set` - User set a reminder for a live class
- `reminder_cancelled` - User cancelled a reminder
- `login` - User logged in
- `weight_logged` - User logged their weight
- `journal_entry_created` - User created a journal entry
- `journal_entry_updated` - User updated a journal entry
- `habit_completed` - User completed a habit
- `session_completed` - User marked a session as completed

## Example Queries

### View all activities for a specific user
```sql
SELECT * FROM user_activity_detailed 
WHERE user_email = 'user@example.com'
ORDER BY created_at DESC;
```

### View all video views
```sql
SELECT * FROM user_activity_detailed 
WHERE activity_type = 'video_view'
ORDER BY created_at DESC;
```

### View all journal entries created today
```sql
SELECT * FROM user_activity_detailed 
WHERE activity_type = 'journal_entry_created'
AND DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### Count activities by type
```sql
SELECT activity_type, COUNT(*) as count
FROM user_activity
GROUP BY activity_type
ORDER BY count DESC;
```

## Organization Tips

1. **Use the detailed view** - It's much easier to read than the base table
2. **Filter by activity type** - Use the activity_type column to filter
3. **Sort by date** - Activities are sorted by most recent first
4. **Use entity_title** - This makes it easy to see what specific item was acted upon
5. **Check metadata** - Additional details are stored in the metadata JSON column

## Privacy & Security

- Users can only see their own activities
- Admins can see all activities
- All activities are protected by Row Level Security (RLS)

## Migration

To set up the enhanced activity tracking, run the migration:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/migrations/011_enhance_activity_tracking.sql
```

This migration:
- Adds new activity types
- Adds helpful columns (activity_description, entity_title)
- Creates the organized view
- Adds indexes for better performance
