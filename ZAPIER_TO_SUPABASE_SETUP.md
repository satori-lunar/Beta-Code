# Zapier to Supabase Integration Setup

This guide shows you how to sync Kajabi products (that have URLs) to Supabase using Zapier as a bridge.

## Overview

Since you can't use the Public API directly, we'll use:
1. **Zapier** (which you already have connected to Kajabi)
2. **Supabase Edge Function** (webhook endpoint to receive data)

## Step 1: Deploy the Supabase Webhook Function

1. **Deploy the Edge Function:**
   ```bash
   # From your project root
   supabase functions deploy receive-kajabi-webhook
   ```

   Or via Supabase Dashboard:
   - Go to **Edge Functions** > **Create Function**
   - Name: `receive-kajabi-webhook`
   - Copy the code from `supabase/functions/receive-kajabi-webhook/index.ts`

2. **Get the Function URL:**
   - After deployment, you'll get a URL like:
   - `https://[your-project].supabase.co/functions/v1/receive-kajabi-webhook`
   - Copy this URL - you'll need it for Zapier

3. **Set Function Secrets (if needed):**
   - The function uses `SUPABASE_URL` and `SUPABASE_ANON_KEY` which are automatically available
   - No additional secrets needed!

## Step 2: Set Up Zapier Workflow

### Option A: Trigger on New/Updated Products (Recommended)

1. **Create a New Zap:**
   - Go to [Zapier.com](https://zapier.com) > **Create Zap**

2. **Set Trigger:**
   - **App:** Kajabi
   - **Trigger Event:** "New Product" or "Product Updated"
   - **Account:** Connect your Kajabi account (use your existing connection)
   - **Test:** Make sure it finds products

3. **Add Filter (Important!):**
   - Click **+** to add a step
   - **App:** Filter by Zapier
   - **Event:** "Only continue if..."
   - **Condition:** 
     - Field: `URL` (or `url` or `product_url`)
     - Condition: "is not empty"
   - This ensures only products with URLs are synced

4. **Add Action:**
   - **App:** Webhooks by Zapier
   - **Event:** "POST"
   - **URL:** Your Supabase function URL:
     ```
     https://[your-project].supabase.co/functions/v1/receive-kajabi-webhook
     ```
   - **Method:** POST
   - **Data Pass-Through:** No
   - **Headers:** 
     - Add header: `Content-Type` = `application/json`
   - **Payload Type:** JSON
   - **Data:** Map the following fields:
     ```json
     {
       "product": {
         "id": "[Kajabi Product ID]",
         "name": "[Kajabi Product Name]",
         "description": "[Kajabi Product Description]",
         "url": "[Kajabi Product URL]",
         "hero_image_url": "[Kajabi Product Hero Image]",
         "thumbnail_url": "[Kajabi Product Thumbnail]"
       }
     }
     ```

5. **Test the Zap:**
   - Click "Test" to send a sample product
   - Check Supabase to see if it appears in `recorded_sessions` table

### Option B: Scheduled Sync (For Existing Products)

If you want to sync existing products or run on a schedule:

1. **Create a New Zap:**
   - **Trigger:** Schedule by Zapier
   - **Trigger Event:** "Every Day" or "Every Hour"
   
2. **Add Action:**
   - **App:** Kajabi
   - **Action Event:** "Find Products" or "List Products"
   - This will get all products

3. **Add Filter:**
   - Filter to only products with URLs (same as Option A)

4. **Add Action (Loop):**
   - **App:** Webhooks by Zapier
   - Send each product to the Supabase webhook
   - Use "Create Many" or loop through products

## Step 3: Test the Integration

1. **Test with a Single Product:**
   - In Zapier, click "Test" on your Zap
   - Check the Supabase function logs:
     - Go to Supabase Dashboard > Edge Functions > `receive-kajabi-webhook` > Logs
   - Verify the product appears in `recorded_sessions` table:
     ```sql
     SELECT * FROM recorded_sessions 
     WHERE synced_from_kajabi = true 
     ORDER BY created_at DESC 
     LIMIT 5;
     ```

2. **Verify Data:**
   - Check that:
     - `video_url` is populated (the product URL)
     - `kajabi_product_id` matches the Kajabi product ID
     - `synced_from_kajabi` is `true`

## Step 4: Handle Offerings (Optional)

If your Kajabi products have multiple offerings (sessions), you can:

1. **Modify the Zap:**
   - Add a step to fetch offerings for each product
   - Loop through offerings and send each one to the webhook

2. **The webhook will:**
   - Create a separate `recorded_sessions` entry for each offering
   - Link them via `kajabi_product_id` and `kajabi_offering_id`

## Troubleshooting

### Products Not Syncing

1. **Check Zapier Logs:**
   - Go to your Zap > "Task History"
   - See if the webhook call succeeded

2. **Check Supabase Function Logs:**
   - Edge Functions > `receive-kajabi-webhook` > Logs
   - Look for errors

3. **Common Issues:**
   - **No URL:** Products without URLs are skipped (by design)
   - **Authentication:** Make sure Supabase anon key is correct
   - **Payload Format:** Check that Zapier is sending data in the expected format

### Function Not Receiving Data

1. **Test the Function Directly:**
   ```bash
   curl -X POST https://[your-project].supabase.co/functions/v1/receive-kajabi-webhook \
     -H "Content-Type: application/json" \
     -d '{
       "product": {
         "id": "test-123",
         "name": "Test Product",
         "url": "https://example.com/product"
       }
     }'
   ```

2. **Check CORS:**
   - The function includes CORS headers
   - If issues persist, check Zapier's webhook settings

## Benefits of This Approach

✅ **Uses your existing Zapier connection** (no need for Public API keys)  
✅ **Automatic syncing** when products are created/updated  
✅ **Filters for products with URLs** automatically  
✅ **No manual work** - fully automated  
✅ **Can sync on schedule** for existing products  

## Next Steps

1. Deploy the Edge Function
2. Set up the Zapier Zap
3. Test with one product
4. Turn on the Zap
5. Monitor the sync in Supabase

Your products with URLs will now automatically appear in the `recorded_sessions` table!
