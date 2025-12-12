# Fix Kajabi Authentication Error (401 Invalid Credentials)

## Problem
You're getting: `Kajabi auth failed: 401 - {"error":"Invalid client credentials"}`

This means the API key and/or secret are incorrect or invalid.

## Solution: Update Your Kajabi API Credentials

### Step 1: Get Your Correct Kajabi API Credentials

1. Log into your Kajabi account
2. Go to **Settings** → **Integrations** → **API**
3. Find your API credentials:
   - **API Key** (also called Client ID)
   - **API Secret** (also called Client Secret)

**Important:** The credentials in the code (`zThg3LJbBrPS9L7BtFpzBzgm` and `PxVd7iZBQ2UPymvyJ4XLaL4A`) appear to be incorrect or expired.

### Step 2: Update Supabase Edge Function Secrets

1. Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/settings/functions
2. Scroll to **Secrets** section
3. Update or add these secrets with your **actual** Kajabi credentials:

```
KAJABI_API_KEY=your-actual-api-key-from-kajabi
KAJABI_API_SECRET=your-actual-api-secret-from-kajabi
KAJABI_DOMAIN=your-kajabi-domain.com (optional)
```

### Step 3: Verify Secrets Are Set

After updating, the function will use environment secrets instead of the default values.

### Step 4: Test Again

1. Go to Edge Functions → `sync-kajabi-products`
2. Click **Invoke**
3. Check logs - you should see:
   - "Using credentials: API_KEY from environment, API_SECRET from environment"
   - "Successfully authenticated with Kajabi"

## If You Don't Have Kajabi API Access

If you don't have API credentials in Kajabi:

1. **Check if API access is enabled** in your Kajabi account
2. **Contact Kajabi support** to enable API access
3. **Generate new API credentials** if needed

## Alternative: Update Default Credentials in Code

If you can't use Supabase secrets, you can update the default values in the function code:

1. Open `supabase/functions/sync-kajabi-products/index.ts`
2. Find these lines (around line 55-56):
   ```typescript
   const kajabiApiKey = Deno.env.get('KAJABI_API_KEY') ?? 'zThg3LJbBrPS9L7BtFpzBzgm'
   const kajabiApiSecret = Deno.env.get('KAJABI_API_SECRET') ?? 'PxVd7iZBQ2UPymvyJ4XLaL4A'
   ```
3. Replace the default values (after `??`) with your actual credentials
4. Redeploy the function

**⚠️ Warning:** Don't commit API secrets to version control! Use Supabase secrets instead.

## Check Function Logs

After updating credentials, the function logs will show:
- Whether it's using environment secrets or defaults
- The length of the credentials (to verify they're set)
- More detailed error messages if authentication still fails

## Next Steps

1. ✅ Get your actual Kajabi API credentials
2. ✅ Update Supabase Edge Function secrets
3. ✅ Test the function again
4. ✅ Check logs for successful authentication
