# Alternative Email Reminder Setup Guide

This guide provides **simpler, more reliable alternatives** to the pg_cron approach for email reminders.

## Why This Approach?

The previous setup used `pg_cron`, which may not be available in all Supabase projects. This guide provides three reliable alternatives that will work in any Supabase project.

## Option 1: Supabase Cron Jobs (Recommended - Easiest)

Supabase has a built-in Cron Jobs feature that's more reliable than pg_cron.

### Setup Steps:

1. **Go to Supabase Dashboard**
   - Navigate to: **Database** → **Cron Jobs**
   - Click **Create Cron Job**

2. **Configure the Cron Job:**
   - **Name**: `send-email-reminders`
   - **Schedule**: `* * * * *` (every minute)
   - **Command**: Use one of these options:

   **Option A: Direct HTTP Call (Recommended)**
   ```sql
   SELECT net.http_post(
     url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email-reminders',
     headers := jsonb_build_object(
       'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY',
       'Content-Type', 'application/json'
     ),
     body := '{}'::jsonb
   );
   ```

   **Option B: Using the Helper Function**
   ```sql
   SELECT public.trigger_email_reminders_simple();
   ```
   (Note: You'll need to set `app.settings.supabase_url` and `app.settings.service_role_key` first)

3. **Replace Placeholders:**
   - `YOUR_PROJECT_REF`: Your Supabase project reference (found in project settings)
   - `YOUR_SERVICE_ROLE_KEY`: Your service role key (found in Project Settings → API → service_role key)

4. **Enable the Cron Job**
   - Toggle the switch to enable it
   - The job will run every minute automatically

### How to Find Your Project Ref and Service Role Key:

1. **Project Ref**: 
   - Go to **Project Settings** → **General**
   - Look for "Reference ID" or check your project URL: `https://YOUR_PROJECT_REF.supabase.co`

2. **Service Role Key**:
   - Go to **Project Settings** → **API**
   - Find the "service_role" key (⚠️ Keep this secret!)
   - Copy it (it starts with `eyJ...`)

---

## Option 2: External Cron Service (Most Reliable)

Use a free external cron service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com).

### Setup with cron-job.org:

1. **Create Account**: Sign up at [cron-job.org](https://cron-job.org) (free)

2. **Create New Cron Job**:
   - Click **"Create cronjob"**
   - **Title**: `Email Reminders`
   - **Address (URL)**: 
     ```
     https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email-reminders
     ```
   - **Schedule**: Every minute (`* * * * *`)
   - **Request Method**: `POST`
   - **Request Headers**: Add header:
     ```
     Authorization: Bearer YOUR_SERVICE_ROLE_KEY
     Content-Type: application/json
     ```
   - **Request Body**: `{}`

3. **Save and Enable**
   - The cron job will run every minute
   - You can view execution logs in the dashboard

### Advantages:
- ✅ Works with any Supabase project
- ✅ Free tier available
- ✅ Execution logs and monitoring
- ✅ Email notifications if job fails
- ✅ No database extensions needed

---

## Option 3: Manual Testing Function

For testing purposes, you can manually trigger reminders using this SQL:

```sql
-- Test the email reminder function
SELECT public.trigger_email_reminders_simple();
```

Or call the Edge Function directly:

```sql
SELECT net.http_post(
  url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email-reminders',
  headers := jsonb_build_object(
    'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY',
    'Content-Type', 'application/json'
  ),
  body := '{}'::jsonb
);
```

---

## Verification Steps

1. **Check Reminders Exist**:
   ```sql
   SELECT 
     id,
     user_id,
     scheduled_reminder_time,
     sent,
     notification_type
   FROM public.class_reminders
   WHERE notification_type = 'email'
     AND sent = false
     AND scheduled_reminder_time <= NOW()
   ORDER BY scheduled_reminder_time;
   ```

2. **Check Edge Function Logs**:
   - Go to **Edge Functions** → **send-email-reminders** → **Logs**
   - Look for execution logs and any errors

3. **Test Manually**:
   - Create a test reminder for 1 minute in the future
   - Wait 2 minutes
   - Check your email inbox
   - Check the `class_reminders` table to see if `sent` changed to `true`

---

## Troubleshooting

### Issue: Cron Job Not Running

**Solution**: 
- Check if the cron job is enabled in Supabase Dashboard
- Verify the schedule is correct (`* * * * *` for every minute)
- Check the cron job logs for errors

### Issue: "net.http_post" Function Not Found

**Solution**: 
- The `http` extension may not be enabled
- Run: `CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;`
- Or use Option 2 (External Cron Service) instead

### Issue: 401 Unauthorized

**Solution**:
- Verify your service role key is correct
- Make sure the Authorization header is formatted correctly: `Bearer YOUR_KEY`
- Check that the key hasn't been rotated

### Issue: No Reminders Being Sent

**Solution**:
1. Check if reminders exist in the database:
   ```sql
   SELECT COUNT(*) FROM public.class_reminders 
   WHERE notification_type = 'email' AND sent = false;
   ```

2. Check if `scheduled_reminder_time` is in the past:
   ```sql
   SELECT * FROM public.class_reminders 
   WHERE scheduled_reminder_time <= NOW() AND sent = false;
   ```

3. Check Edge Function logs for errors
4. Verify `RESEND_API_KEY` is set in Edge Function secrets
5. Verify email domain is verified in Resend

---

## Recommended Setup

**For Production**: Use **Option 2 (External Cron Service)** - it's the most reliable and provides monitoring.

**For Development**: Use **Option 1 (Supabase Cron Jobs)** - it's simpler and integrated.

**For Testing**: Use **Option 3 (Manual Function)** - call it directly from SQL editor.

---

## Next Steps

1. Choose one of the options above
2. Set up the cron job
3. Create a test reminder
4. Verify emails are being sent
5. Monitor the logs for the first few days

If you need help, check the Edge Function logs in Supabase Dashboard → Edge Functions → Logs.

