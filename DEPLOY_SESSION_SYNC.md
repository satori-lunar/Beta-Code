# Deploy Session Sync Function - Quick Guide

## Step 1: Deploy the Function

You need to deploy the `sync-kajabi-sessions` function to Supabase first.

### Option A: Via Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq
2. Navigate to **Edge Functions** in the left sidebar
3. Click **"Create Function"** or **"New Function"**
4. Name it: `sync-kajabi-sessions`
5. Copy the entire code from `supabase/functions/sync-kajabi-sessions/index.ts`
6. Paste it into the code editor
7. Click **"Deploy"**

### Option B: Via CLI

If you have Supabase CLI installed:

```bash
supabase functions deploy sync-kajabi-sessions
```

## Step 2: Test the Sync

Once deployed, run:

```powershell
powershell -ExecutionPolicy Bypass -File "sync-sessions-from-urls.ps1"
```

This will sync all 53 sessions to your Supabase database!

## What Happens

The function will:
- ✅ Create a `recorded_sessions` entry for each URL
- ✅ Use the session ID from the URL as the title (e.g., "Session 766599")
- ✅ Set default values for description, instructor, duration, etc.
- ✅ Mark them as `synced_from_kajabi = true`
- ✅ Skip duplicates if you run it again

## After Syncing

Check your database:

```sql
SELECT 
  id,
  title,
  video_url,
  synced_from_kajabi,
  created_at
FROM recorded_sessions 
WHERE synced_from_kajabi = true 
ORDER BY created_at DESC 
LIMIT 10;
```

You should see all 53 sessions!
