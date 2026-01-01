# Deploy Email Reminder Edge Functions

This guide will help you deploy the two Edge Functions needed for email reminders:
1. `send-class-reminder` - Sends individual reminder emails
2. `send-email-reminders` - Cron job function that checks for due reminders

## Method 1: Deploy via Supabase Dashboard (Easiest)

### Step 1: Access Your Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar

### Step 2: Deploy `send-class-reminder`

1. Click **"Create a new function"** button
2. **Function name**: Enter `send-class-reminder`
3. **Copy the code**: Open `supabase/functions/send-class-reminder/index.ts` and copy ALL contents
4. **Paste** into the editor
5. Click **Deploy**
6. Wait for deployment to complete (you'll see a success message)

### Step 3: Deploy `send-email-reminders`

1. Click **"Create a new function"** button again
2. **Function name**: Enter `send-email-reminders`
3. **Copy the code**: Open `supabase/functions/send-email-reminders/index.ts` and copy ALL contents
4. **Paste** into the editor
5. Click **Deploy**
6. Wait for deployment to complete

### Step 4: Set Environment Secrets

1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Add these secrets (if not already set):

```
RESEND_API_KEY=re_your_api_key_here
APP_URL=https://your-app-domain.com
```

Replace:
- `re_your_api_key_here` with your actual Resend API key
- `https://your-app-domain.com` with your actual app URL

## Method 2: Deploy via Supabase CLI (Recommended for Development)

### Prerequisites

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```
   This will open your browser to authenticate.

3. **Link your project**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   Replace `YOUR_PROJECT_REF` with your actual project reference (found in your Supabase dashboard URL).

### Deploy the Functions

1. **Navigate to your project directory**:
   ```bash
   cd "C:\Users\jenni\New Beta Code\Beta-Code"
   ```

2. **Deploy `send-class-reminder`**:
   ```bash
   supabase functions deploy send-class-reminder
   ```

3. **Deploy `send-email-reminders`**:
   ```bash
   supabase functions deploy send-email-reminders
   ```

### Set Environment Secrets (CLI)

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
supabase secrets set APP_URL=https://your-app-domain.com
```

## Verify Deployment

### Check in Dashboard

1. Go to **Edge Functions** in your Supabase Dashboard
2. You should see both functions listed:
   - `send-class-reminder`
   - `send-email-reminders`
3. Both should show status as "Active" or "Deployed"

### Test the Functions

**Test `send-class-reminder`**:
1. Go to Edge Functions → `send-class-reminder`
2. Click **Invoke** button
3. Use this test payload:
   ```json
   {
     "reminderId": "test-id",
     "userId": "your-user-id",
     "classTitle": "Test Class",
     "scheduledAt": "2024-12-20T10:00:00Z",
     "reminderMinutes": 15,
     "userEmail": "your-email@example.com"
   }
   ```
4. Check the **Logs** tab for results

**Test `send-email-reminders`**:
1. Go to Edge Functions → `send-email-reminders`
2. Click **Invoke** button
3. Check the **Logs** tab - it should process any due reminders

## Troubleshooting

### "Function not found" after deployment
- Wait a minute for propagation
- Refresh the page
- Check the function name is exactly correct (lowercase, with hyphens)

### "Deployment failed"
- Check for syntax errors in the code
- Make sure you copied the ENTIRE code (including imports)
- Check the function logs for error messages
- Verify your Supabase CLI is up to date: `npm install -g supabase@latest`

### "RESEND_API_KEY not set"
- Make sure you've set the secrets in Project Settings → Edge Functions → Secrets
- If using CLI, verify secrets with: `supabase secrets list`

### "Unauthorized" errors
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is available (it's automatically set)
- Check that you're using the service role key when calling the function

### CLI Issues on Windows

If you get errors with PowerShell, try using Command Prompt instead:

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```bash
   cd "C:\Users\jenni\New Beta Code\Beta-Code"
   ```
4. Run the CLI commands from there

## Next Steps

After deploying the functions:

1. **Set up the cron job** to call `send-email-reminders` every minute:
   - Use Supabase Dashboard → Database → Cron Jobs
   - Or use an external cron service (cron-job.org, EasyCron, etc.)

2. **Verify your Resend domain** is set up:
   - Go to Resend Dashboard → Domains
   - Make sure `mybirchandstonecoaching.com` is verified

3. **Test with a real reminder**:
   - Set a reminder for a class in your app
   - Wait for the reminder time
   - Check your email inbox

## Function URLs

After deployment, your functions will be available at:

- `send-class-reminder`: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-class-reminder`
- `send-email-reminders`: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email-reminders`

Replace `YOUR_PROJECT_REF` with your actual project reference.

