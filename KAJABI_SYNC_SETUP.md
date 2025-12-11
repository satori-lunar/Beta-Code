# Kajabi to Supabase Sync Setup Guide

This guide explains how to set up the sync between Kajabi and Supabase to import products (replays) and contacts (mastermind members).

## Overview

The sync performs two main tasks:
1. **Products Sync**: Imports Kajabi products (replays) into the `recorded_sessions` table
2. **Contacts Sync**: Imports Kajabi contacts with the "mastermind" tag as users in Supabase

## Prerequisites

1. Supabase project set up
2. Kajabi API credentials:
   - API Key: `zThg3LJbBrPS9L7BtFpzBzgm`
   - API Secret: `PxVd7iZBQ2UPymvyJ4XLaL4A`
3. Supabase CLI installed (optional, for local development)

## Step 1: Run Database Migration

Run the migration to add Kajabi tracking fields:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/migrations/005_add_kajabi_fields.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy and paste the contents of `supabase/migrations/005_add_kajabi_fields.sql`
3. Run the migration

## Step 2: Set Up Environment Variables

Set the Kajabi API credentials as Supabase Edge Function secrets:

### Via Supabase Dashboard:
1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Add the following secrets:
   - `KAJABI_API_KEY` = `zThg3LJbBrPS9L7BtFpzBzgm`
   - `KAJABI_API_SECRET` = `PxVd7iZBQ2UPymvyJ4XLaL4A`
   - `KAJABI_DOMAIN` = `your-kajabi-domain.com` (optional, for generating video URLs)

### Via Supabase CLI:
```bash
supabase secrets set KAJABI_API_KEY=zThg3LJbBrPS9L7BtFpzBzgm
supabase secrets set KAJABI_API_SECRET=PxVd7iZBQ2UPymvyJ4XLaL4A
supabase secrets set KAJABI_DOMAIN=your-kajabi-domain.com
```

## Step 3: Deploy the Edge Function

### Via Supabase CLI:
```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project ref from Supabase dashboard URL)
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy sync-kajabi-products
```

### Via Supabase Dashboard:
1. Go to **Edge Functions**
2. Click **Create a new function**
3. Name it `sync-kajabi-products`
4. Copy the contents of `supabase/functions/sync-kajabi-products/index.ts`
5. Deploy

## Step 4: Run the Sync

### Manual Trigger:

**Via HTTP Request:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/sync-kajabi-products \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

**Via Supabase Dashboard:**
1. Go to **Edge Functions** → **sync-kajabi-products**
2. Click **Invoke**
3. Check the logs for results

### Automated Sync (Cron Job):

Set up a daily sync using Supabase Cron (requires pg_cron extension):

```sql
-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily sync at 2 AM
SELECT cron.schedule(
  'sync-kajabi-daily',
  '0 2 * * *', -- Run daily at 2 AM
  $$
  SELECT
    net.http_post(
      url:='https://your-project.supabase.co/functions/v1/sync-kajabi-products',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) AS request_id;
  $$
);
```

**Note:** Replace `YOUR_ANON_KEY` with your actual Supabase anon key (found in Project Settings → API).

## Step 5: Verify the Sync

### Check Products:
```sql
SELECT COUNT(*) FROM recorded_sessions WHERE synced_from_kajabi = true;
```

### Check Contacts:
```sql
SELECT COUNT(*) FROM users WHERE synced_from_kajabi = true;
```

### View Synced Products:
```sql
SELECT title, kajabi_product_id, kajabi_offering_id, synced_from_kajabi 
FROM recorded_sessions 
WHERE synced_from_kajabi = true;
```

### View Synced Users:
```sql
SELECT email, name, kajabi_contact_id, kajabi_tags 
FROM users 
WHERE synced_from_kajabi = true;
```

## How It Works

### Products Sync:
1. Authenticates with Kajabi API using OAuth
2. Fetches all products from Kajabi
3. Filters for replay/digital products
4. For each product:
   - Fetches offerings (individual videos/sessions)
   - Creates a `recorded_session` entry for each offering
   - If no offerings, creates one entry for the product itself
5. Updates existing entries or creates new ones based on `kajabi_product_id` and `kajabi_offering_id`

### Contacts Sync:
1. Authenticates with Kajabi API
2. Fetches all contacts
3. Filters for contacts with "mastermind" tag
4. For each mastermind contact:
   - Checks if user exists by email
   - If exists: Updates user profile with Kajabi data
   - If new: Creates auth user and profile in Supabase
5. New users will need to set their password via password reset email

## Customization

### Adjusting Product Filter:
Edit `supabase/functions/sync-kajabi-products/index.ts` to change which products are synced:

```typescript
// Current filter (line ~70):
const isReplay = product.name?.toLowerCase().includes('replay') || 
               product.product_type === 'digital_product' ||
               product.product_type === 'course'
```

### Adjusting Contact Filter:
Edit the tag filter (line ~220):

```typescript
// Current filter:
const mastermindContacts = allContacts.filter(contact => {
  const tags = contact.tags || []
  return tags.some((tag: string) => 
    tag.toLowerCase().includes('mastermind')
  )
})
```

### Customizing Video URLs:
Update the URL construction based on your Kajabi domain structure (around line ~130 and ~180).

## Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Verify API key and secret are correct
   - Check that Kajabi API access is enabled in your Kajabi account

2. **No Products Synced**
   - Check Kajabi API response structure (may differ)
   - Verify product filter matches your product types
   - Check function logs for errors

3. **No Contacts Synced**
   - Verify contacts have the "mastermind" tag in Kajabi
   - Check tag matching logic (case-insensitive)
   - Verify email addresses are present

4. **Users Not Created**
   - Check RLS policies allow inserts
   - Verify auth.users table is accessible
   - Check function logs for permission errors

### Viewing Logs:
- Supabase Dashboard → Edge Functions → sync-kajabi-products → Logs
- Or via CLI: `supabase functions logs sync-kajabi-products`

## Security Notes

⚠️ **Important**: The API credentials are currently hardcoded in the function as defaults. For production:
1. Always use Supabase secrets (environment variables)
2. Never commit API keys to version control
3. Restrict the function to admin users only (add auth check)
4. Consider adding webhook signature verification if Kajabi supports it

## Next Steps

1. Set up automated syncing via cron
2. Add email notifications for new synced users
3. Implement incremental sync (only sync changed items)
4. Add error alerting for failed syncs

