# Email Setup Guide for Class Reminders

This guide will help you set up email sending for class reminders using Resend.

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

## Step 2: Get Your API Key

1. Once logged in, go to **API Keys** in the dashboard
2. Click **Create API Key**
3. Give it a name (e.g., "Class Reminders")
4. Copy the API key (you'll only see it once!)

## Step 3: Add Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `birchandstone.com`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually a few minutes)

**Note:** For testing, you can use Resend's default domain, but it's limited and emails may go to spam.

## Step 4: Set Environment Variables in Supabase

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

## Step 5: Update the "From" Email Address

In `supabase/functions/send-class-reminder/index.ts`, update the default `fromEmail`:

```typescript
async function sendEmailWithResend(
  to: string,
  subject: string,
  htmlBody: string,
  fromEmail: string = 'noreply@yourdomain.com' // ← Change this
) {
```

Or set it as an environment variable:

```typescript
fromEmail: string = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@yourdomain.com'
```

## Step 6: Deploy the Edge Function

```bash
# Make sure you're in the project root
cd supabase/functions/send-class-reminder

# Deploy to Supabase
supabase functions deploy send-class-reminder
```

Or use the Supabase CLI from the project root:

```bash
supabase functions deploy send-class-reminder --project-ref your-project-ref
```

## Step 7: Test the Integration

1. Set a reminder for a class in your app
2. Wait for the reminder time (or manually trigger it)
3. Check your email inbox
4. Check the Supabase Edge Function logs for any errors

## Alternative Email Services

If you prefer a different email service, here are alternatives:

### SendGrid

```typescript
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    personalizations: [{
      to: [{ email: to }],
    }],
    from: { email: fromEmail },
    subject: subject,
    content: [{
      type: 'text/html',
      value: htmlBody,
    }],
  }),
})
```

### AWS SES

Requires AWS SDK setup. More complex but very reliable for high volume.

### Mailgun

Similar to Resend, good alternative with similar pricing.

## Troubleshooting

### Emails not sending

1. **Check API key**: Make sure `RESEND_API_KEY` is set correctly in Supabase secrets
2. **Check logs**: Go to Supabase Dashboard → Edge Functions → Logs
3. **Verify domain**: If using custom domain, ensure DNS records are correct
4. **Check spam folder**: Test emails might go to spam initially

### Rate Limits

- Resend free tier: 100 emails/day
- Upgrade plan if you need more volume

### Email Formatting Issues

- The HTML template is in the Edge Function code
- Modify the `htmlBody` variable to customize the email design

## Security Notes

- ✅ Never commit API keys to git
- ✅ Always use environment variables/secrets
- ✅ Rotate API keys periodically
- ✅ Use domain verification for production

## Next Steps

1. Set up domain verification for better deliverability
2. Customize the email template to match your brand
3. Add unsubscribe links if needed
4. Set up email analytics to track open rates
