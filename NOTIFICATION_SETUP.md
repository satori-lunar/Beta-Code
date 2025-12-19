# Notification System Setup Guide

This guide explains how to set up the scheduled notification system for habits, journaling, mental health exercises, and goals.

## What Was Added

1. **Database Migration** (`010_notification_preferences.sql`):
   - Creates `notification_preferences` table for user notification settings
   - Automatically creates default preferences when users sign up
   - Stores preferences for habit, journal, mental health, and goal reminders

2. **Edge Function** (`generate-reminders`):
   - Checks all users' notification preferences
   - Creates reminder notifications at scheduled times
   - Prevents duplicate notifications on the same day

3. **Settings UI**:
   - Updated Settings page with notification preference controls
   - Users can enable/disable reminders and set custom times
   - Supports daily and weekly goal reminders

## Setup Steps

### 1. Run the Database Migration

In your Supabase Dashboard:
1. Go to **SQL Editor**
2. Open and run `supabase/migrations/010_notification_preferences.sql`
3. Verify the `notification_preferences` table was created

### 2. Deploy the Edge Function

**Option A: Via Supabase Dashboard**
1. Go to **Edge Functions** → **Create a new function**
2. Name it `generate-reminders`
3. Copy the code from `supabase/functions/generate-reminders/index.ts`
4. Paste and click **Deploy**

**Option B: Via Supabase CLI** (if you have it set up)
```bash
supabase functions deploy generate-reminders
```

### 3. Set Up a Cron Job

The Edge Function needs to be called periodically (every hour) to check for users who need reminders.

**Option A: Using Supabase Cron (Recommended)**
1. Go to **Database** → **Cron Jobs** in Supabase Dashboard
2. Create a new cron job:
   - **Name**: `generate-reminders-hourly`
   - **Schedule**: `0 * * * *` (every hour at minute 0)
   - **Command**: 
     ```sql
     SELECT net.http_post(
       url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-reminders',
       headers := jsonb_build_object(
         'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
         'Content-Type', 'application/json'
       ),
       body := '{}'::jsonb
     );
     ```
   - Replace `YOUR_PROJECT_REF` with your actual Supabase project reference

**Option B: Using External Cron Service (e.g., cron-job.org, EasyCron)**
1. Create a new cron job that runs every hour
2. Set the URL to: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-reminders`
3. Add header: `Authorization: Bearer YOUR_SERVICE_ROLE_KEY`
4. Method: POST
5. Body: `{}`

**Option C: Using GitHub Actions** (if your repo is on GitHub)
Create `.github/workflows/notifications.yml`:
```yaml
name: Generate Reminders
on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch: # Allow manual trigger

jobs:
  generate-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Call Edge Function
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{}' \
            https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-reminders
```

## How It Works

1. **User Preferences**: Users configure their notification preferences in Settings
   - Enable/disable reminders for habits, journaling, mental health, goals
   - Set custom reminder times
   - Choose goal reminder frequency (daily/weekly)

2. **Scheduled Checks**: The cron job calls the Edge Function every hour

3. **Notification Generation**: The Edge Function:
   - Checks all users' preferences
   - For each user, checks if it's time for their reminders
   - Verifies if the user needs a reminder (e.g., incomplete habits, no journal entry)
   - Creates a notification if needed (only once per day per type)

4. **User Experience**: Users see notifications in their notification center with links to relevant pages

## Notification Types

- **Habit Reminders**: Reminds users about incomplete habits for the day
- **Journal Reminders**: Reminds users to write in their journal
- **Mental Health Reminders**: Encourages mindfulness and mental health exercises
- **Goal Reminders**: Reminds users about their active goals (daily or weekly)
- **Achievement Notifications**: Automatically created when users earn badges
- **Streak Reminders**: Reminds users to maintain their streaks

## Testing

To test the system manually:
1. Set up a user's notification preferences in Settings
2. Call the Edge Function directly:
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
     -H "Content-Type: application/json" \
     -d '{}' \
     https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-reminders
   ```
3. Check the user's notifications in the app

## Troubleshooting

- **No notifications appearing**: 
  - Check that the cron job is running
  - Verify the Edge Function is deployed
  - Check Edge Function logs in Supabase Dashboard
  - Ensure user has notification preferences set

- **Duplicate notifications**:
  - The function checks for existing notifications on the same day
  - If duplicates appear, check the notification creation logic

- **Wrong times**:
  - Verify timezone settings in Supabase
  - Check that reminder times are stored correctly in the database
