# Zapier Quick Start - Copy & Paste Setup

Use this as a quick reference while setting up your Zap.

## Your Supabase Webhook URL

```
https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/receive-kajabi-webhook
```

## Zap Configuration Summary

**Trigger:** Kajabi → "New Product" or "Product Updated"  
**Filter:** Filter by Zapier → URL is not empty  
**Action:** Webhooks by Zapier → POST

## Webhook Configuration

**URL:** (paste the URL above)  
**Method:** POST  
**Headers:** `Content-Type: application/json`  
**Payload Type:** JSON

## JSON Payload (Copy This)

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

**Important:** Replace each `[Kajabi Product ...]` placeholder by clicking on it and selecting the actual field from your Kajabi trigger.

## Alternative Simple Format

If the nested format doesn't work, try this:

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

## Testing Checklist

- [ ] Trigger finds products
- [ ] Filter works (only products with URLs)
- [ ] Webhook test succeeds
- [ ] Product appears in Supabase `recorded_sessions` table
- [ ] Function logs show success

## Verify in Supabase

Run this SQL to check synced products:

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

## Common Field Names in Kajabi

When mapping fields, look for:
- **ID:** `ID`, `id`, `Product ID`
- **Name:** `Name`, `name`, `Product Name`
- **URL:** `URL`, `url`, `permalink`, `Product URL`
- **Description:** `Description`, `description`
- **Image:** `Hero Image`, `hero_image_url`, `Image`, `thumbnail_url`

---

**Need help?** Check `ZAPIER_SETUP_STEP_BY_STEP.md` for detailed instructions.
