# Zapier Setup - Step by Step Guide

Follow these exact steps to set up your Zapier workflow to sync Kajabi products to Supabase.

## Prerequisites

1. ✅ Your Kajabi account is already connected to Zapier
2. ✅ You have deployed the Supabase Edge Function `receive-kajabi-webhook`
3. ✅ You have your Supabase function URL ready

**Your Supabase Function URL:**
```
https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/receive-kajabi-webhook
```

---

## Step 1: Create a New Zap

1. Go to [zapier.com](https://zapier.com) and log in
2. Click **"Create Zap"** (top right or in the dashboard)
3. Name your Zap: "Kajabi Products → Supabase"

---

## Step 2: Set Up the Trigger (Kajabi)

1. **Search for "Kajabi"** in the trigger app search box
2. **Select "Kajabi"** as your trigger app
3. **Choose Trigger Event:**
   - If you want to sync when products are created/updated: Select **"New Product"** or **"Product Updated"**
   - If you want to sync all existing products: We'll use a different approach (see Step 2B)

### Step 2A: For New/Updated Products (Recommended)

1. **Select "New Product"** as the trigger event
2. **Click "Continue"**
3. **Select your Kajabi account** (the one you already have connected)
4. **Click "Test"** to verify it finds products
5. You should see sample product data - **note the field names** (we'll need them later)

### Step 2B: For Existing Products (One-Time Sync)

If you want to sync all existing products:

1. **Select "Schedule by Zapier"** as the trigger app instead
2. **Choose "Every Day"** or **"Every Hour"** (you can turn it off after syncing)
3. **Continue** to the next step
4. Then add Kajabi as an **Action** (not trigger) - see Step 3B below

---

## Step 3: Add Filter (Only Products with URLs)

**This is important!** We only want to sync products that have URLs.

1. Click **"+"** to add a new step
2. Search for **"Filter by Zapier"**
3. Select **"Filter by Zapier"** app
4. **Choose Event:** "Only continue if..."
5. **Click "Continue"**

### Configure the Filter:

**Condition 1:**
- **Field:** Look for `URL` or `url` or `product_url` or `Product URL` in the dropdown
  - If you don't see it, try typing "url" in the search box
  - Common field names: `URL`, `url`, `Product URL`, `product_url`, `permalink`
- **Condition:** "is not empty" or "is not blank"
- **Value:** (leave empty)

**Click "Continue"** and test the filter.

---

## Step 4: Add Webhook Action (Send to Supabase)

1. Click **"+"** to add another step
2. Search for **"Webhooks by Zapier"**
3. Select **"Webhooks by Zapier"**
4. **Choose Event:** "POST"
5. **Click "Continue"**

### Configure the Webhook:

**URL:**
```
https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/receive-kajabi-webhook
```

**Method:** POST

**Data Pass-Through:** No

**Headers:**
Click "Add Header" and add:
- **Key:** `Content-Type`
- **Value:** `application/json`

**Payload Type:** JSON

**Data (JSON):**

This is the most important part. You need to map the Kajabi product fields. Use this structure:

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

### How to Map Fields in Zapier:

In the JSON data field, you'll see placeholders like `[Kajabi Product ID]`. Click on each placeholder and select the corresponding field from your Kajabi trigger:

1. **`[Kajabi Product ID]`** → Click and select: `ID` or `Product ID` or `id`
2. **`[Kajabi Product Name]`** → Click and select: `Name` or `Product Name` or `name`
3. **`[Kajabi Product Description]`** → Click and select: `Description` or `description`
4. **`[Kajabi Product URL]`** → Click and select: `URL` or `url` or `Product URL` or `permalink`
5. **`[Kajabi Product Hero Image]`** → Click and select: `Hero Image` or `hero_image_url` or `Image`
6. **`[Kajabi Product Thumbnail]`** → Click and select: `Thumbnail` or `thumbnail_url` or `Thumbnail Image`

**Note:** Field names in Kajabi may vary. If you don't see a field:
- Try the test step first to see what fields are available
- Use the field name exactly as it appears in the test data
- Some fields might be optional (like hero_image_url) - that's okay

### Alternative: Simple Payload Format

If the nested format doesn't work, try this simpler format:

```json
{
  "id": "[Kajabi Product ID]",
  "name": "[Kajabi Product Name]",
  "description": "[Kajabi Product Description]",
  "url": "[Kajabi Product URL]",
  "hero_image_url": "[Kajabi Product Hero Image]",
  "thumbnail_url": "[Kajabi Product Thumbnail]"
}
```

---

## Step 5: Test Your Zap

1. **Click "Test"** on the webhook step
2. **Check the results:**
   - Look for a success message
   - Note the response from Supabase

3. **Verify in Supabase:**
   - Go to your Supabase Dashboard
   - Navigate to **Table Editor** > `recorded_sessions`
   - Look for a new entry with `synced_from_kajabi = true`
   - Or run this SQL:
     ```sql
     SELECT * FROM recorded_sessions 
     WHERE synced_from_kajabi = true 
     ORDER BY created_at DESC 
     LIMIT 5;
     ```

4. **Check Function Logs:**
   - Go to Supabase Dashboard > **Edge Functions** > `receive-kajabi-webhook` > **Logs**
   - You should see the webhook payload and any errors

---

## Step 6: Turn On Your Zap

Once testing is successful:

1. **Click "Publish"** or **"Turn Zap On"**
2. Your Zap is now active!

---

## Alternative: Sync All Existing Products

If you want to sync all existing products (not just new ones):

### Option A: Use Schedule Trigger

1. **Trigger:** Schedule by Zapier → "Every Day"
2. **Action 1:** Kajabi → "Find Products" or "List Products"
3. **Filter:** Filter by Zapier → Only products with URLs
4. **Action 2:** Webhooks by Zapier → POST to your Supabase function
   - Use "Create Many" or loop through products

### Option B: Manual One-Time Sync

1. Create a Zap with:
   - **Trigger:** Manual (or Schedule → "Once")
   - **Action:** Kajabi → "Find Products"
   - **Filter:** Products with URLs
   - **Action:** Webhooks → POST each product

2. Run it once, then turn it off

---

## Troubleshooting

### Zapier Can't Find Product Fields

1. **Test the trigger first** - this shows you what fields are available
2. **Look for these common field names:**
   - ID: `id`, `ID`, `Product ID`
   - Name: `name`, `Name`, `Product Name`
   - URL: `url`, `URL`, `permalink`, `Product URL`
   - Description: `description`, `Description`
   - Images: `hero_image_url`, `thumbnail_url`, `image`, `Image`

### Webhook Returns Error

1. **Check the function URL** - make sure it's correct
2. **Check Supabase function logs** for error details
3. **Verify the payload format** - the function expects JSON with a `product` object

### Products Not Appearing in Supabase

1. **Check if products have URLs** - products without URLs are skipped
2. **Check function logs** for any errors
3. **Verify the database** - make sure `recorded_sessions` table exists
4. **Check RLS policies** - make sure the function can insert data

### Function Logs Show "No product data found"

This means the payload format is wrong. Try:
1. Use the simpler payload format (without nested `product` object)
2. Check what Zapier is actually sending in the webhook test
3. Adjust the payload to match what the function expects

---

## Quick Reference: Field Mapping

| Function Expects | Zapier Field Name (Common) |
|----------------|---------------------------|
| `product.id` | `ID`, `id`, `Product ID` |
| `product.name` | `Name`, `name`, `Product Name` |
| `product.description` | `Description`, `description` |
| `product.url` | `URL`, `url`, `permalink`, `Product URL` |
| `product.hero_image_url` | `Hero Image`, `hero_image_url`, `Image` |
| `product.thumbnail_url` | `Thumbnail`, `thumbnail_url` |

---

## Next Steps

1. ✅ Set up the Zap following the steps above
2. ✅ Test with one product
3. ✅ Verify it appears in Supabase
4. ✅ Turn on the Zap
5. ✅ Monitor the sync (check Supabase periodically)

Your products with URLs will now automatically sync to Supabase! 🎉
