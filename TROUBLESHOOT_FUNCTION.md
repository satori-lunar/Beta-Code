# Troubleshooting Kajabi Function Invocation

If the function doesn't work when you invoke it, follow these steps:

## Quick Diagnostic Steps

### 1. Check if Function is Deployed

**Via Dashboard:**
1. Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/functions
2. Look for `sync-kajabi-products` in the list
3. If it's **missing** → Deploy it first (see DEPLOY_KAJABI_FUNCTION.md)

**Via Terminal:**
```bash
# Test if function exists
curl -I https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-products \
  -H "Authorization: Bearer sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3"
```

### 2. Common Error Messages & Solutions

#### Error: 404 Not Found
**Problem:** Function is not deployed

**Solution:**
1. Go to Supabase Dashboard → Edge Functions
2. Click "Create a new function"
3. Name it: `sync-kajabi-products`
4. Copy code from `supabase/functions/sync-kajabi-products/index.ts`
5. Deploy

#### Error: 401 Unauthorized or 403 Forbidden
**Problem:** Wrong API key or authentication issue

**Solution:**
- Make sure you're using the correct anon key:
  ```
  sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3
  ```
- Check the Authorization header format:
  ```
  Authorization: Bearer sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3
  ```

#### Error: 500 Internal Server Error
**Problem:** Function is deployed but has runtime errors

**Common Causes:**
1. **Missing Environment Secrets**
   - Go to Project Settings → Edge Functions → Secrets
   - Add: `KAJABI_API_KEY`, `KAJABI_API_SECRET`, `KAJABI_DOMAIN`

2. **Database Errors**
   - Run migrations: `001_initial_schema.sql` and `005_add_kajabi_fields.sql`
   - Or run: `CREATE_MISSING_TABLES.sql`

3. **Kajabi API Authentication Failed**
   - Check Kajabi API credentials are correct
   - Verify Kajabi API access is enabled in your Kajabi account

**Solution:**
1. Check function logs in Supabase Dashboard
2. Look for specific error messages
3. Fix the underlying issue

#### Error: Connection Timeout
**Problem:** Network issue or function taking too long

**Solution:**
- The sync can take time if there are many products/contacts
- Check function logs to see progress
- Try again after a few minutes

### 3. Test Commands

#### Windows PowerShell:
```powershell
# Run the test script
.\test-kajabi-function.ps1

# Or manually:
$response = Invoke-WebRequest -Uri "https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-products" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3"
    "Content-Type" = "application/json"
  }
$response.Content
```

#### Mac/Linux:
```bash
# Run the test script
chmod +x test-kajabi-function.sh
./test-kajabi-function.sh

# Or manually:
curl -X POST https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-products \
  -H "Authorization: Bearer sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3" \
  -H "Content-Type: application/json" \
  -v
```

### 4. Check Function Logs

**Best way to debug:**

1. Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/functions/sync-kajabi-products
2. Click on the **Logs** tab
3. Invoke the function (click "Invoke" button)
4. Watch the logs in real-time

**What to look for:**
- ✅ "Successfully authenticated with Kajabi" → Good!
- ✅ "Found X products from Kajabi" → Good!
- ❌ "Kajabi auth failed" → Check API credentials
- ❌ "relation does not exist" → Run database migrations
- ❌ "permission denied" → Check RLS policies

### 5. Verify Environment Secrets

1. Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/settings/functions
2. Scroll to **Secrets** section
3. Verify these are set:
   - `KAJABI_API_KEY` = `zThg3LJbBrPS9L7BtFpzBzgm`
   - `KAJABI_API_SECRET` = `PxVd7iZBQ2UPymvyJ4XLaL4A`
   - `KAJABI_DOMAIN` = (your domain, optional)

### 6. Verify Database Setup

Run the verification SQL:
1. Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/sql/new
2. Copy contents of `supabase/migrations/VERIFY_KAJABI_CONNECTION.sql`
3. Run it to check database setup

### 7. Alternative: Use Dashboard Invoke

If terminal doesn't work, use the dashboard:

1. Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/functions
2. Click on `sync-kajabi-products`
3. Click **Invoke** button
4. Check **Logs** tab for results

This is often easier and shows logs immediately.

## Still Not Working?

Share these details:
1. **Error message** (exact text)
2. **HTTP status code** (404, 500, etc.)
3. **Function logs** (from Supabase Dashboard)
4. **What command you ran** (exact curl/command)

Then we can help debug further!
