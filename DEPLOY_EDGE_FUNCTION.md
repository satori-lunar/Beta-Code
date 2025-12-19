# Deploy Passwordless Auth Edge Function

The passwordless authentication feature requires a Supabase Edge Function to be deployed. Follow these steps:

## Quick Deploy (Supabase CLI)

### Prerequisites
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

### Deploy Steps

1. **Link your project** (replace `YOUR_PROJECT_REF` with your actual project reference):
   ```bash
   supabase link --project-ref qbsrmbxuwacpqquorqaq
   ```
   
   Your project ref is: `qbsrmbxuwacpqquorqaq`

2. **Deploy the function**:
   ```bash
   supabase functions deploy passwordless-auth
   ```

3. **Verify deployment**:
   - Go to your Supabase Dashboard
   - Navigate to Edge Functions
   - You should see `passwordless-auth` listed

## Alternative: Deploy via Dashboard

If you don't have the CLI:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `qbsrmbxuwacpqquorqaq`
3. Navigate to **Edge Functions** in the left sidebar
4. Click **Create a new function**
5. Name it: `passwordless-auth`
6. Copy the entire contents from `supabase/functions/passwordless-auth/index.ts`
7. Paste into the function editor
8. Click **Deploy**

## Verify It's Working

After deployment, the function will be available at:
```
https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/passwordless-auth
```

Try signing in with an email - it should work without errors.

## Troubleshooting

### Function not found (404)
- Make sure the function name is exactly `passwordless-auth`
- Check that it's deployed (green status in dashboard)

### CORS errors
- The function includes CORS headers, so this shouldn't happen
- If it does, check the function code includes the CORS headers

### Authentication errors
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in your Supabase project
- This is automatically available when deployed via CLI

## Need Help?

If deployment fails:
1. Check Supabase CLI version: `supabase --version`
2. Verify you're logged in: `supabase projects list`
3. Check function logs in Supabase Dashboard > Edge Functions > passwordless-auth > Logs
