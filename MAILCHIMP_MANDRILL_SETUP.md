# Mailchimp Mandrill (Transactional) Setup Guide

This guide explains how to connect and configure Mailchimp Transactional (Mandrill) for class reminder emails.

## Overview

The reminder system uses Mailchimp Transactional (Mandrill) to send automated email reminders to users. Mandrill provides:
- High deliverability rates
- Email tracking (opens, clicks)
- Webhook support for delivery status
- Detailed analytics
- Domain verification for better sender reputation

## Step 1: Set Up Mailchimp Transactional Account

1. **Access Mailchimp Transactional**
   - Go to [mailchimp.com](https://mailchimp.com) and log in
   - Navigate to **Account** → **Extras** → **Transactional** (or go directly to [mandrillapp.com](https://mandrillapp.com))
   - If you don't have Mandrill enabled, you may need to upgrade your Mailchimp plan or contact support

2. **Get Your API Key**
   - In Mandrill dashboard, go to **Settings** → **SMTP & API Info**
   - Click **Add API Key** or use an existing one
   - Give it a name (e.g., "Class Reminders Production")
   - Copy the API key (starts with something like `md-...`)

## Step 2: Verify Your Sending Domain

1. **Add Domain in Mandrill**
   - Go to **Settings** → **Sending Domains**
   - Click **Add Domain**
   - Enter: `mybirchandstonecoaching.com`
   - Click **Add Domain**

2. **Add DNS Records**
   - Mandrill will provide DNS records (SPF, DKIM)
   - Add these records to your domain's DNS settings:
     - **SPF Record**: `v=spf1 include:spf.mandrillapp.com ?all`
     - **DKIM Records**: Mandrill will provide specific DKIM keys
   - Wait for verification (usually 5-15 minutes)

3. **Verify Domain Status**
   - Check that domain shows as "Verified" in Mandrill dashboard
   - Green checkmark = ready to send

## Step 3: Configure Supabase Environment Variables

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **Project Settings** → **Edge Functions** → **Secrets**

2. **Add Required Secrets**
   ```
   MAILCHIMP_TRANSACTIONAL_API_KEY=md-your-api-key-here
   MAILCHIMP_FROM_EMAIL=noreply@mybirchandstonecoaching.com
   MAILCHIMP_FROM_NAME=Birch & Stone
   APP_URL=https://www.mybirchandstonecoaching.com
   ```

3. **Optional: Add Test Email**
   ```
   TEST_EMAIL=your-email@example.com
   ```
   (Used for testing the connection)

## Step 4: Test the Connection

### Option A: Use the Test Function

1. **Deploy the test function** (if not already deployed):
   ```bash
   supabase functions deploy test-mandrill-connection --project-ref YOUR_PROJECT_REF
   ```

2. **Call the test function**:
   ```bash
   curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/test-mandrill-connection \
     -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
     -H "Content-Type: application/json"
   ```

3. **Check the response**:
   - Should show `success: true`
   - Shows user info, sending domains, and test email result (if TEST_EMAIL is set)

### Option B: Test via Supabase Dashboard

1. Go to **Edge Functions** → **test-mandrill-connection**
2. Click **Invoke** with service role key
3. Check the response for connection status

## Step 5: Deploy Edge Functions

Make sure both reminder functions are deployed:

```bash
# Deploy the cron job function
supabase functions deploy send-email-reminders --project-ref YOUR_PROJECT_REF

# Deploy the individual reminder function
supabase functions deploy send-class-reminder --project-ref YOUR_PROJECT_REF
```

## Step 6: Set Up Cron Job

See `EMAIL_REMINDER_SETUP.md` for detailed cron job setup instructions.

## Features Enabled

The integration includes:

✅ **Email Tracking**
- Open tracking enabled
- Click tracking enabled
- Automatic text version generation

✅ **Tags & Organization**
- Emails tagged with `class-reminder`, `automated`, `weekly-recurring`
- Easy filtering in Mandrill dashboard

✅ **Metadata**
- Reminder ID, Class ID, User ID included
- Useful for webhooks and analytics

✅ **Error Handling**
- Detailed error logging
- Rejection reason tracking
- Message ID for tracking

## Monitoring & Analytics

### View Email Activity in Mandrill

1. Go to **Mandrill Dashboard** → **Activity**
2. Filter by tags: `class-reminder`
3. See:
   - Sent emails
   - Opens
   - Clicks
   - Bounces
   - Rejections

### Check Logs in Supabase

1. Go to **Edge Functions** → **Logs**
2. Look for:
   - `✅ Mandrill email sent successfully`
   - `❌ Error sending email via Mandrill`
   - `Mandrill API error`

## Troubleshooting

### API Key Issues

**Error**: `MAILCHIMP_TRANSACTIONAL_API_KEY environment variable is not set`
- **Fix**: Add the secret in Supabase Dashboard → Edge Functions → Secrets

**Error**: `Invalid API key`
- **Fix**: Verify the API key in Mandrill dashboard
- **Fix**: Make sure you copied the full key (starts with `md-`)

### Domain Verification Issues

**Error**: `Domain not verified`
- **Fix**: Check domain status in Mandrill → Settings → Sending Domains
- **Fix**: Verify DNS records are correctly added
- **Fix**: Wait a few minutes for DNS propagation

### Email Delivery Issues

**Status**: `rejected` or `invalid`
- **Check**: Mandrill dashboard → Activity for rejection reason
- **Common reasons**:
  - Domain not verified
  - Invalid recipient email
  - Rate limiting
  - Spam filters

### Test the Connection

Use the `test-mandrill-connection` function to verify:
- API key is valid
- Domain is verified
- Configuration is correct
- Test email can be sent

## Webhooks (Optional)

To track email events (opens, clicks, bounces), set up webhooks in Mandrill:

1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/mandrill-webhook`
3. Select events: `send`, `open`, `click`, `bounce`, `reject`
4. (You'll need to create the webhook handler function)

## Best Practices

1. **Monitor Quota**: Check your hourly/daily sending limits in Mandrill
2. **Watch Reputation**: Maintain good sender reputation (low bounce rate)
3. **Use Tags**: Tag emails for easy filtering and analytics
4. **Track Opens/Clicks**: Use tracking data to improve email content
5. **Handle Bounces**: Set up bounce handling to maintain list health

## Support

- **Mandrill Documentation**: https://mailchimp.com/developer/transactional/
- **API Reference**: https://mailchimp.com/developer/transactional/api/
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions

