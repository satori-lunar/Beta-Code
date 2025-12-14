# Admin Dashboard Setup Guide

## Overview

The admin dashboard provides real-time analytics and insights into user activity, including:
- User management
- Video view tracking
- Favorite tracking
- Email reminder management
- Weight log analytics
- User streaks
- Login activity

## Database Setup

### Step 1: Run Admin Roles Migration

Run the migration in Supabase SQL Editor:

```sql
-- File: supabase/migrations/010_admin_roles_and_activity_tracking.sql
```

This creates:
- `role` column in `users` table
- `admin_users` table for tracking admin assignments
- `user_activity` table for activity tracking
- `video_views` table for video analytics
- `user_logins` table for login tracking

### Step 2: Set Up First Admin

After the user `elliotmccormick@satori-lunar.com` signs up, run:

```sql
-- File: supabase/migrations/011_set_first_admin.sql
```

Or manually:

```sql
-- Update user role
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'elliotmccormick@satori-lunar.com';

-- Add to admin_users table
INSERT INTO public.admin_users (user_id, email, assigned_by)
SELECT 
  id,
  email,
  id
FROM public.users
WHERE email = 'elliotmccormick@satori-lunar.com'
ON CONFLICT (user_id) DO NOTHING;
```

## Email Domain Information

**Current Email Domain:** `noreply@birchandstone.com`

This is configured in:
- `supabase/functions/send-class-reminder/index.ts` (line 14)
- Can be changed by updating the `fromEmail` parameter or setting `RESEND_FROM_EMAIL` environment variable in Supabase

## Admin Dashboard Features

### Overview Tab
- Total users count
- Video views count
- Favorites count
- Reminders set count

### Users Tab
- List of all users
- User roles (member/admin)
- Streaks
- Join dates

### Video Views Tab
- Shows when users click video URLs
- Tracks which sessions are viewed
- Shows user email and view timestamp

### Reminders Tab
- Shows all email reminders set by users
- Displays reminder time (5 or 15 minutes before)
- Shows reminder status (sent/pending)
- Shows email domain being used

### Weight Logs Tab
- All user weight entries
- User information
- Date and weight values

### Streaks Tab
- User streaks sorted by highest
- Shows user email and streak count

### Logins Tab
- Login activity tracking
- User information
- Login timestamps
- IP addresses (if available)

## Activity Tracking

The system automatically tracks:
- **Video Views**: When users click video URLs
- **Favorites**: When users add/remove favorites
- **Reminders**: When users set email reminders
- **Logins**: When users sign in
- **Weight Logs**: When users log weight (already tracked)
- **Habit Completions**: When users complete habits (already tracked)

## Accessing Admin Dashboard

1. Sign in as an admin user
2. Navigate to `/admin` or click "Admin" in the sidebar (only visible to admins)
3. View analytics across all tabs

## Adding More Admins

To add additional admins, run:

```sql
-- Update user role
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'newadmin@example.com';

-- Add to admin_users table
INSERT INTO public.admin_users (user_id, email, assigned_by)
SELECT 
  u.id,
  u.email,
  (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1) -- Current admin
FROM public.users u
WHERE u.email = 'newadmin@example.com'
ON CONFLICT (user_id) DO NOTHING;
```

## Security

- Admin routes are protected by `useIsAdmin` hook
- RLS policies ensure only admins can view all user data
- Regular users can only see their own data
- Admin dashboard shows "Access Denied" for non-admin users

