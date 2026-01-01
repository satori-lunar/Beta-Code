# Testing Email Reminders

This guide will help you test the email reminder system to ensure everything is working correctly.

## Prerequisites

Before testing, make sure you have:
- ✅ Both Edge Functions deployed (`send-class-reminder` and `send-email-reminders`)
- ✅ Resend API key set in Supabase secrets
- ✅ Domain `mybirchandstonecoaching.com` verified in Resend
- ✅ Cron job set up (or ready to test manually)

## Test 1: Test Individual Reminder Function

### Step 1: Get Test Data

1. **Get a user ID**:
   - Go to Supabase Dashboard → **Table Editor** → `users`
   - Copy a user's `id` and `email`

2. **Get a live class ID**:
   - Go to Supabase Dashboard → **Table Editor** → `live_classes`
   - Copy a class `id` and note the `scheduled_at` time

### Step 2: Create a Test Reminder

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this SQL (replace with your actual values):

```sql
-- Create a test reminder (15 minutes before class)
INSERT INTO public.class_reminders (
  user_id,
  live_class_id,
  notification_type,
  reminder_minutes_before,
  scheduled_reminder_time,
  sent
)
VALUES (
  'YOUR_USER_ID',  -- Replace with actual user ID
  'YOUR_CLASS_ID', -- Replace with actual class ID
  'email',
  15,
  NOW() + INTERVAL '1 minute',  -- Set reminder to trigger in 1 minute
  false
)
RETURNING *;
```

3. Note the `id` of the reminder you just created

### Step 3: Test the Function Directly

1. Go to Supabase Dashboard → **Edge Functions** → `send-class-reminder`
2. Click **Invoke** button
3. Use this test payload (replace with your values):

```json
{
  "reminderId": "REMINDER_ID_FROM_STEP_2",
  "userId": "YOUR_USER_ID",
  "classTitle": "Test Yoga Class",
  "scheduledAt": "2024-12-20T10:00:00Z",
  "reminderMinutes": 15,
  "userEmail": "your-email@example.com"
}
```

4. Click **Invoke**
5. Check the **Logs** tab for results
6. Check your email inbox for the reminder email

## Test 2: Test Automatic Reminder System

### Step 1: Create a Due Reminder

Create a reminder that should trigger immediately:

```sql
-- Create a reminder that's already due
INSERT INTO public.class_reminders (
  user_id,
  live_class_id,
  notification_type,
  reminder_minutes_before,
  scheduled_reminder_time,
  sent
)
VALUES (
  'YOUR_USER_ID',
  'YOUR_CLASS_ID',
  'email',
  15,
  NOW() - INTERVAL '1 minute',  -- Already past due
  false
)
RETURNING *;
```

### Step 2: Test the Cron Function

1. Go to Supabase Dashboard → **Edge Functions** → `send-email-reminders`
2. Click **Invoke** button
3. Leave the body empty: `{}`
4. Click **Invoke**
5. Check the **Logs** tab - you should see:
   - Number of reminders found
   - Emails sent
   - Any errors

### Step 3: Verify Results

1. **Check the database**:
   ```sql
   SELECT * FROM public.class_reminders 
   WHERE sent = true 
   ORDER BY updated_at DESC 
   LIMIT 5;
   ```

2. **Check notifications**:
   ```sql
   SELECT * FROM public.notifications 
   WHERE type = 'reminder' 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

3. **Check your email inbox** - you should have received the reminder email

## Test 3: Test with Real Class Schedule

### Step 1: Set Up a Real Reminder

1. Go to your app and navigate to the Classes page
2. Find a class that's scheduled for the future
3. Click to set a reminder (15 minutes before)
4. Make sure email reminder is selected

### Step 2: Verify Reminder Was Created

```sql
SELECT 
  cr.id,
  cr.scheduled_reminder_time,
  cr.sent,
  lc.title as class_title,
  lc.scheduled_at as class_time,
  u.email as user_email
FROM public.class_reminders cr
JOIN public.live_classes lc ON cr.live_class_id = lc.id
JOIN public.users u ON cr.user_id = u.id
WHERE cr.sent = false
ORDER BY cr.scheduled_reminder_time ASC;
```

### Step 3: Wait for Reminder Time (or Manually Trigger)

**Option A: Wait for the actual time**
- Wait until the `scheduled_reminder_time` arrives
- The cron job should automatically send the email

**Option B: Manually trigger (for testing)**
- Update the reminder to trigger now:
  ```sql
  UPDATE public.class_reminders
  SET scheduled_reminder_time = NOW() - INTERVAL '1 minute'
  WHERE id = 'YOUR_REMINDER_ID';
  ```
- Then invoke the `send-email-reminders` function

## Test 4: Verify Email Content

When you receive a test email, verify:

- ✅ **From address**: `noreply@mybirchandstonecoaching.com`
- ✅ **Subject**: "Reminder: [Class Name] starts in [X] minutes"
- ✅ **Class title** is correct
- ✅ **Class time** is formatted correctly
- ✅ **Time until class** is correct (15 or 5 minutes)
- ✅ **"Join the Class" button** links to `/classes`
- ✅ **Email design** looks good (gradient header, proper formatting)

## Test 5: Test Multiple Reminders

### Create Multiple Test Reminders

```sql
-- Create 3 reminders for different users/classes
INSERT INTO public.class_reminders (
  user_id,
  live_class_id,
  notification_type,
  reminder_minutes_before,
  scheduled_reminder_time,
  sent
)
SELECT 
  u.id,
  lc.id,
  'email',
  15,
  NOW() - INTERVAL '1 minute',
  false
FROM public.users u
CROSS JOIN public.live_classes lc
WHERE u.email IS NOT NULL
LIMIT 3;
```

### Test Batch Processing

1. Invoke `send-email-reminders` function
2. Check logs - should process all 3 reminders
3. Verify all 3 emails were sent
4. Check database - all 3 should be marked as `sent = true`

## Troubleshooting Tests

### Issue: "No due reminders to send"

**Check:**
```sql
-- Verify reminders exist and are due
SELECT 
  id,
  scheduled_reminder_time,
  NOW() as current_time,
  (scheduled_reminder_time <= NOW()) as is_due,
  sent
FROM public.class_reminders
WHERE notification_type = 'email'
  AND sent = false;
```

**Fix:** Make sure `scheduled_reminder_time <= NOW()` and `sent = false`

### Issue: "User email not found"

**Check:**
```sql
-- Verify user has email
SELECT id, email, name 
FROM public.users 
WHERE id = 'YOUR_USER_ID';
```

**Fix:** Make sure the user has a valid email address

### Issue: "Resend API error"

**Check:**
- Go to Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**
- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard to verify API key is active

### Issue: "Email not received"

**Check:**
1. **Spam folder** - Check your spam/junk folder
2. **Resend logs** - Go to Resend Dashboard → **Logs** to see delivery status
3. **Edge Function logs** - Check Supabase Edge Function logs for errors
4. **Domain verification** - Make sure `mybirchandstonecoaching.com` is verified in Resend

### Issue: "Cron job not running"

**Check:**
1. Verify cron job is set up and enabled
2. Check cron job logs in Supabase Dashboard
3. Manually invoke `send-email-reminders` to test the function works
4. If using external cron, verify the service is calling the function

## Expected Results

After successful testing, you should see:

1. ✅ **Emails sent** - Check your inbox
2. ✅ **Reminders marked as sent** - `sent = true` in database
3. ✅ **Notifications created** - New entries in `notifications` table
4. ✅ **No errors in logs** - Edge Function logs show success
5. ✅ **Proper email formatting** - HTML email looks good

## Next Steps After Testing

Once testing is successful:

1. ✅ Set up the cron job to run every minute (if not already done)
2. ✅ Monitor the first few real reminders
3. ✅ Check Resend dashboard for delivery rates
4. ✅ Set up monitoring/alerts for failed emails (optional)

## Quick Test Checklist

- [ ] Test individual reminder function with test data
- [ ] Test automatic reminder system with due reminders
- [ ] Test with real class schedule from app
- [ ] Verify email content and formatting
- [ ] Test multiple reminders at once
- [ ] Verify emails are received
- [ ] Check database - reminders marked as sent
- [ ] Check notifications table - entries created
- [ ] Verify no errors in logs

## Need Help?

If tests fail:
1. Check Edge Function logs for error messages
2. Verify all secrets are set correctly
3. Check Resend dashboard for API issues
4. Verify domain is verified in Resend
5. Check database - ensure reminders are created correctly

