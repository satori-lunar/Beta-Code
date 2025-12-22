# Email Reminder Setup Guide

This guide explains how to set up automatic email reminders for class reminders using the `mybirchandstonecoaching.com` domain.

## Overview

The system automatically sends email reminders to users who have selected email reminders for classes. Emails are sent at the time specified in the reminder (e.g., 15 minutes before class).

## Components

1. **Edge Function: `send-email-reminders`** - Checks for due reminders and sends emails
2. **Edge Function: `send-class-reminder`** - Sends individual reminder emails (updated domain)
3. **Database Table: `class_reminders`** - Stores user reminders with scheduled times

## Setup Steps

### 1. Configure Resend Domain

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain: `mybirchandstonecoaching.com`
3. Add the DNS records provided by Resend to your domain's DNS settings
4. Wait for domain verification (usually a few minutes)

### 2. Set Environment Variables in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
3. Add the following secrets:

   ```
   RESEND_API_KEY=re_your_api_key_here
   APP_URL=https://your-app-domain.com
   ```

   Replace:
   - `re_your_api_key_here` with your actual Resend API key
   - `https://your-app-domain.com` with your actual app URL

### 3. Deploy Edge Functions

Deploy both Edge Functions to Supabase:

```bash
# Deploy the cron job function
supabase functions deploy send-email-reminders --project-ref your-project-ref

# Deploy the individual reminder function (if not already deployed)
supabase functions deploy send-class-reminder --project-ref your-project-ref
```

### 4. Set Up Cron Job

You have two options for scheduling the email reminder checks:

#### Option A: Supabase Cron Jobs (Recommended)

1. Go to Supabase Dashboard → **Database** → **Cron Jobs**
2. Click **Create Cron Job**
3. Configure:
   - **Name**: `send-email-reminders`
   - **Schedule**: `* * * * *` (every minute)
   - **Command**: 
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
   - Replace `YOUR_PROJECT_REF` and `YOUR_SERVICE_ROLE_KEY` with your actual values

#### Option B: External Cron Service

Use a service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com):

1. Create a new cron job
2. Set schedule to run every minute: `* * * * *`
3. Set URL to: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email-reminders`
4. Add header: `Authorization: Bearer YOUR_SERVICE_ROLE_KEY`
5. Method: POST

### 5. Verify Email Domain

The email will be sent from: `noreply@mybirchandstonecoaching.com`

Make sure this domain is verified in Resend before sending production emails.

## How It Works

1. **User Sets Reminder**: When a user sets an email reminder for a class, a record is created in `class_reminders` with:
   - `notification_type`: `'email'`
   - `scheduled_reminder_time`: The exact time the reminder should be sent
   - `sent`: `false`

2. **Cron Job Runs**: Every minute, the `send-email-reminders` function:
   - Finds all reminders where `scheduled_reminder_time <= now()` and `sent = false`
   - For each reminder:
     - Fetches user email and class details
     - Sends email via Resend
     - Creates a notification in the database
     - Marks reminder as `sent = true`

3. **Email Content**: The email includes:
   - Class title
   - Time until class starts (e.g., "15 minutes")
   - Formatted class time
   - Link to join the class

## Testing

1. Set a test reminder for a class (15 minutes before)
2. Wait for the reminder time
3. Check your email inbox
4. Check Supabase Edge Function logs for any errors

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key**: Verify `RESEND_API_KEY` is set correctly
2. **Check Domain Verification**: Ensure `mybirchandstonecoaching.com` is verified in Resend
3. **Check Cron Job**: Verify the cron job is running (check Supabase logs)
4. **Check Reminders**: Query `class_reminders` table to see if reminders are being created
5. **Check Logs**: Go to Supabase Dashboard → Edge Functions → Logs

### Common Issues

- **Domain not verified**: Emails won't send until domain is verified in Resend
- **Cron job not running**: Check if cron job is enabled and scheduled correctly
- **No reminders found**: Verify reminders are being created with correct `scheduled_reminder_time`
- **Email in spam**: Check Resend deliverability settings and SPF/DKIM records

## Timezone Handling

The email shows the class time in the user's local timezone. The `scheduled_reminder_time` in the database should be calculated based on:
- The class time (stored in Eastern Time)
- The user's selected timezone preference
- The reminder offset (e.g., 15 minutes before)

The system automatically formats the class time in the email based on the user's timezone.

## Security Notes

- ✅ Never commit API keys to git
- ✅ Always use environment variables/secrets
- ✅ Service role key should only be used server-side
- ✅ Domain verification required for production emails

