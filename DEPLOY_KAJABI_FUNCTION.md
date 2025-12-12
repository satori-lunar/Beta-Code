# Deploy Kajabi Sync Function to Supabase

This guide will help you deploy the `sync-kajabi-products` Edge Function to your Supabase project.

## Prerequisites

1. Supabase project: `qbsrmbxuwacpqquorqaq`
2. Supabase CLI installed (optional but recommended)
3. Kajabi API credentials:
   - API Key: `zThg3LJbBrPS9L7BtFpzBzgm`
   - API Secret: `PxVd7iZBQ2UPymvyJ4XLaL4A`

## Method 1: Deploy via Supabase Dashboard (Easiest)

### Step 1: Access Edge Functions

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq
2. Navigate to **Edge Functions** in the left sidebar
3. Click **Create a new function**

### Step 2: Create the Function

1. **Function name**: Enter `sync-kajabi-products`
2. **Copy the code**: Open `supabase/functions/sync-kajabi-products/index.ts` and copy all contents
3. **Paste** into the editor
4. Click **Deploy**

### Step 3: Set Environment Secrets

1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Add these secrets:

```
KAJABI_API_KEY=zThg3LJbBrPS9L7BtFpzBzgm
KAJABI_API_SECRET=PxVd7iZBQ2UPymvyJ4XLaL4A
KAJABI_DOMAIN=your-kajabi-domain.com
```

**Note**: Replace `your-kajabi-domain.com` with your actual Kajabi domain (e.g., `yourcompany.kajabi.com`)

### Step 4: Test the Function

1. Go back to **Edge Functions** → **sync-kajabi-products**
2. Click **Invoke** button
3. Check the **Logs** tab for output
4. You should see authentication and sync progress

## Method 2: Deploy via Supabase CLI (Recommended for Development)

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### Step 3: Link Your Project

```bash
supabase link --project-ref qbsrmbxuwacpqquorqaq
```

### Step 4: Set Secrets

```bash
supabase secrets set KAJABI_API_KEY=zThg3LJbBrPS9L7BtFpzBzgm
supabase secrets set KAJABI_API_SECRET=PxVd7iZBQ2UPymvyJ4XLaL4A
supabase secrets set KAJABI_DOMAIN=your-kajabi-domain.com
```

### Step 5: Deploy the Function

```bash
supabase functions deploy sync-kajabi-products
```

### Step 6: Test the Function

```bash
curl -X POST https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-products \
  -H "Authorization: Bearer sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3" \
  -H "Content-Type: application/json"
```

## Verify Deployment

### Check Function Status

1. Go to Supabase Dashboard → Edge Functions
2. You should see `sync-kajabi-products` listed
3. Status should show as "Active"

### Test Function Execution

Run the verification script:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase/migrations/VERIFY_KAJABI_CONNECTION.sql`
3. Run the queries to see database setup status

### Check Function Logs

1. Go to Edge Functions → sync-kajabi-products → Logs
2. Invoke the function
3. Check logs for:
   - ✅ "Successfully authenticated with Kajabi"
   - ✅ "Found X products from Kajabi"
   - ✅ "Found X contacts with mastermind tag"
   - ✅ Sync results

## Troubleshooting

### Function Not Found (404)

- **Issue**: Function returns 404 when invoked
- **Solution**: Make sure the function is deployed. Check Edge Functions list in dashboard.

### Authentication Failed

- **Issue**: "Kajabi auth failed" in logs
- **Solution**: 
  1. Verify API credentials are correct
  2. Check secrets are set in Supabase Dashboard
  3. Verify Kajabi API access is enabled in your Kajabi account

### Database Errors

- **Issue**: "relation does not exist" or "column does not exist"
- **Solution**: 
  1. Run migration `001_initial_schema.sql` first
  2. Then run `005_add_kajabi_fields.sql`
  3. Or run `CREATE_MISSING_TABLES.sql` which includes both

### Permission Errors

- **Issue**: "permission denied" or RLS errors
- **Solution**: 
  1. The function uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS
  2. Make sure the function has access to service role key
  3. Check RLS policies allow inserts/updates

## Next Steps

After successful deployment:

1. **Set up automated sync** (optional):
   - Use Supabase Cron to run daily
   - See `KAJABI_SYNC_SETUP.md` for cron setup

2. **Monitor sync results**:
   - Check `recorded_sessions` table for synced products
   - Check `users` table for synced contacts

3. **Customize sync**:
   - Edit function to change product filters
   - Adjust contact tag filters
   - Modify video URL generation

## Function Endpoint

Once deployed, your function will be available at:

```
https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-products
```

## Security Notes

⚠️ **Important**:
- The function uses service role key (bypasses RLS) - this is intentional for syncing
- Consider adding authentication to restrict who can invoke the function
- Never expose service role key in client-side code
- API credentials are stored as Supabase secrets (encrypted)
