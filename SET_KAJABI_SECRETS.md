# Set Kajabi API Secrets in Supabase

## Your Credentials

- **API Key**: `zThg3LJbBrPS9L7BtFpzBzgm`
- **API Secret**: `PxVd7iZBQ2UPymvyJ4XLaL4A`

## Step-by-Step Instructions

### Method 1: Via Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/settings/functions
2. Scroll down to the **Secrets** section
3. Click **Add new secret** or edit existing ones
4. Add these three secrets:

**Secret 1:**
- **Name**: `KAJABI_API_KEY`
- **Value**: `zThg3LJbBrPS9L7BtFpzBzgm`
- ⚠️ **Important**: Copy exactly, no extra spaces before or after

**Secret 2:**
- **Name**: `KAJABI_API_SECRET`
- **Value**: `PxVd7iZBQ2UPymvyJ4XLaL4A`
- ⚠️ **Important**: Copy exactly, no extra spaces before or after

**Secret 3 (Optional):**
- **Name**: `KAJABI_DOMAIN`
- **Value**: Your Kajabi domain (e.g., `yourcompany.kajabi.com`)

5. Click **Save** for each secret

### Method 2: Via Supabase CLI

If you have Supabase CLI installed:

```bash
supabase secrets set KAJABI_API_KEY=zThg3LJbBrPS9L7BtFpzBzgm
supabase secrets set KAJABI_API_SECRET=PxVd7iZBQ2UPymvyJ4XLaL4A
supabase secrets set KAJABI_DOMAIN=your-kajabi-domain.com
```

## Verify Secrets Are Set

After setting the secrets:

1. Go to Edge Functions → `sync-kajabi-products`
2. Click **Invoke**
3. Check the logs - you should see:
   - `Using credentials: API_KEY from environment, API_SECRET from environment`
   - `Successfully authenticated with Kajabi`

If you still see "from default", the secrets aren't being read correctly.

## Common Issues

### Extra Spaces
Make sure there are NO spaces before or after the values when copying:
- ❌ Wrong: ` zThg3LJbBrPS9L7BtFpzBzgm ` (has spaces)
- ✅ Correct: `zThg3LJbBrPS9L7BtFpzBzgm` (no spaces)

### Secret Names Must Match Exactly
- ✅ `KAJABI_API_KEY` (all caps, underscores)
- ❌ `kajabi_api_key` (wrong case)
- ❌ `KAJABI-API-KEY` (wrong separator)

### Function Needs Redeploy
After setting secrets, you may need to:
1. Edit the function (just open and save)
2. Or wait a few minutes for secrets to propagate

## Test After Setting Secrets

1. Invoke the function
2. Check logs for:
   - ✅ "Using credentials: API_KEY from environment"
   - ✅ "Successfully authenticated with Kajabi"
   - ❌ If still "from default" → secrets not set correctly
