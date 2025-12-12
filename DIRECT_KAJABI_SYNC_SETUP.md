# Direct Kajabi Sync Setup (No Zapier Needed)

This solution uses your Account Details API credentials directly to sync products from Kajabi to Supabase.

## What You Need

- ✅ Your Kajabi **API Key** (from Settings > Account Details > API Credentials)
- ✅ Your Kajabi **API Secret** (from Settings > Account Details > API Credentials)
- ✅ Supabase project with `recorded_sessions` table

## Step 1: Deploy the Edge Function

1. **Deploy the function:**
   ```bash
   supabase functions deploy sync-kajabi-direct
   ```

   Or via Supabase Dashboard:
   - Go to **Edge Functions** > **Create Function**
   - Name: `sync-kajabi-direct`
   - Copy the code from `supabase/functions/sync-kajabi-direct/index.ts`

2. **Get your function URL:**
   ```
   https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-direct
   ```

## Step 2: Set Your API Credentials

1. **Go to Supabase Dashboard:**
   - Navigate to **Edge Functions** > **Secrets**

2. **Add these secrets:**
   - **Name:** `KAJABI_API_KEY`
   - **Value:** Your Kajabi API Key (from Account Details)
   
   - **Name:** `KAJABI_API_SECRET`
   - **Value:** Your Kajabi API Secret (from Account Details)

3. **Save the secrets**

## Step 3: Test the Function

### Option A: Test via Browser/curl

Open this URL in your browser or use curl:
```
https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-direct
```

Or use curl:
```bash
curl https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-direct
```

### Option B: Test via PowerShell

Run the test script:
```powershell
powershell -ExecutionPolicy Bypass -File "test-direct-sync.ps1"
```

## Step 4: Set Up Automatic Syncing

You have several options to run this automatically:

### Option A: Use Zapier Schedule (Simplest)

Even though Zapier doesn't have Kajabi triggers, you can use Zapier to call the function on a schedule:

1. **Create a Zap:**
   - **Trigger:** Schedule by Zapier → "Every Day" or "Every Hour"
   - **Action:** Webhooks by Zapier → POST
   - **URL:** `https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-direct`
   - **Method:** POST
   - **Headers:** `Content-Type: application/json`

2. **Turn on the Zap** - it will call your function automatically!

### Option B: Use Supabase Cron Jobs (pg_cron)

If you have database access, you can set up a cron job:

```sql
-- Install pg_cron extension (if not already installed)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the function to run daily at 2 AM
SELECT cron.schedule(
  'sync-kajabi-products',
  '0 2 * * *', -- Daily at 2 AM
  $$
  SELECT net.http_post(
    url := 'https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-direct',
    headers := '{"Content-Type": "application/json"}'::jsonb
  ) AS request_id;
  $$
);
```

### Option C: Manual Trigger

Just call the function URL whenever you want to sync:
- Bookmark the URL
- Use a browser extension to refresh it
- Call it from your app

## Step 5: Verify the Sync

Check your Supabase database:

```sql
SELECT 
  id,
  title,
  video_url,
  kajabi_product_id,
  synced_from_kajabi,
  created_at
FROM recorded_sessions 
WHERE synced_from_kajabi = true 
ORDER BY created_at DESC 
LIMIT 10;
```

## What This Function Does

1. ✅ Authenticates with Kajabi using your Account Details API credentials
2. ✅ Fetches all products from Kajabi
3. ✅ **Filters for products with URLs** (only syncs those)
4. ✅ Fetches offerings for each product (if available)
5. ✅ Creates/updates `recorded_sessions` entries in Supabase
6. ✅ Returns a summary of what was synced

## Response Format

When you call the function, you'll get a response like:

```json
{
  "success": true,
  "message": "Kajabi products synced successfully",
  "results": {
    "total": 50,
    "withUrls": 35,
    "synced": 10,
    "updated": 25,
    "errors": 0,
    "skipped": 15
  }
}
```

## Troubleshooting

### "Missing KAJABI_API_KEY or KAJABI_API_SECRET"

- Make sure you set the secrets in Supabase Dashboard
- Go to Edge Functions > Secrets
- Add both `KAJABI_API_KEY` and `KAJABI_API_SECRET`

### "Kajabi authentication failed: 401"

- Double-check your API Key and Secret
- Make sure there are no extra spaces when copying
- Verify the credentials in Kajabi Dashboard > Settings > Account Details

### "Failed to fetch products: 401"

- The access token might have expired (rare)
- Try calling the function again
- Check function logs for more details

### Products Not Syncing

- **Check if products have URLs** - only products with URLs are synced
- **Check function logs** in Supabase Dashboard
- **Verify the database** - make sure `recorded_sessions` table exists

## Benefits

✅ **No Zapier needed** - works directly with your credentials  
✅ **Automatic filtering** - only syncs products with URLs  
✅ **Handles offerings** - creates separate entries for each offering  
✅ **Idempotent** - safe to run multiple times (updates existing, creates new)  
✅ **Flexible scheduling** - run manually or on a schedule  

## Next Steps

1. ✅ Deploy the function
2. ✅ Set your API credentials as secrets
3. ✅ Test the function
4. ✅ Set up automatic syncing (Zapier schedule or cron)
5. ✅ Monitor the sync results

Your products with URLs will now sync to Supabase automatically! 🎉
