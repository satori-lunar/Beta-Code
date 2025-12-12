# Check Kajabi Sync Results

After running the sync function, follow these steps to verify the results:

## Step 1: Check Function Logs

The logs should show something like:

✅ **Success indicators:**
- "Successfully authenticated with Kajabi"
- "Found X products from Kajabi"
- "Found X contacts with mastermind tag"
- "Created user for contact [email]"
- Final summary with counts

❌ **Error indicators:**
- "Kajabi auth failed" → Check API credentials
- "relation does not exist" → Run database migrations
- "permission denied" → Check RLS policies

## Step 2: Check Database for Synced Products

Run this in Supabase SQL Editor:

```sql
-- Count synced products
SELECT COUNT(*) as total_synced_products
FROM recorded_sessions 
WHERE synced_from_kajabi = true;

-- View synced products
SELECT 
  id,
  title,
  kajabi_product_id,
  kajabi_offering_id,
  video_url,
  synced_from_kajabi,
  created_at
FROM recorded_sessions 
WHERE synced_from_kajabi = true
ORDER BY created_at DESC
LIMIT 20;
```

## Step 3: Check Database for Synced Users

Run this in Supabase SQL Editor:

```sql
-- Count synced users
SELECT COUNT(*) as total_synced_users
FROM users 
WHERE synced_from_kajabi = true;

-- View synced users
SELECT 
  id,
  email,
  name,
  kajabi_contact_id,
  kajabi_tags,
  synced_from_kajabi,
  created_at
FROM users 
WHERE synced_from_kajabi = true
ORDER BY created_at DESC
LIMIT 20;
```

## Step 4: Verify in Your App

### Check Recorded Sessions

1. Go to your app's **Classes** or **Courses** page
2. Look for sessions that were synced from Kajabi
3. They should have titles, descriptions, and video URLs

### Check Users

1. Go to your app's user management (if you have one)
2. Users synced from Kajabi should have:
   - Email addresses
   - Names from Kajabi
   - `kajabi_contact_id` in their profile
   - `kajabi_tags` array

## Step 5: Understand the Sync Results

The function returns a summary like:

```json
{
  "success": true,
  "results": {
    "products": {
      "synced": 5,      // New products created
      "updated": 2,     // Existing products updated
      "errors": 0,      // Errors encountered
      "total": 7        // Total processed
    },
    "contacts": {
      "synced": 10,     // New users created
      "updated": 3,     // Existing users updated
      "errors": 0,      // Errors encountered
      "total": 13       // Total processed
    }
  }
}
```

## What to Do Next

### If Sync Was Successful:

1. ✅ **Products are synced** → Check your Classes/Courses page
2. ✅ **Users are synced** → They can now log in (will need to set password)
3. ✅ **Set up automated sync** (optional):
   - See `KAJABI_SYNC_SETUP.md` for cron job setup
   - Or manually run sync when needed

### If Sync Had Errors:

1. **Check the specific error** in logs
2. **Common fixes:**
   - Database errors → Run migrations
   - Auth errors → Check Kajabi API credentials
   - Permission errors → Check RLS policies
3. **Re-run the sync** after fixing issues

### For New Users:

Users synced from Kajabi will need to:
1. Receive a password reset email (function sends this automatically)
2. Set their password
3. Then they can log in normally

## Troubleshooting

### No Products Synced

**Possible reasons:**
- No products match the filter (name contains "replay" or type is "digital_product"/"course")
- Kajabi API returned no products
- Products don't have offerings

**Check:**
```sql
-- See what products exist in Kajabi (check function logs)
-- Adjust filter in function if needed
```

### No Users Synced

**Possible reasons:**
- No contacts have "mastermind" tag in Kajabi
- Contacts don't have email addresses
- Tag matching is case-sensitive

**Check:**
- Verify contacts have "mastermind" tag in Kajabi
- Check function logs for "Found X contacts with mastermind tag"

### Users Can't Log In

**Solution:**
- Function sends password reset email automatically
- Users need to check their email and set password
- Or manually send password reset from Supabase Dashboard

## Next Steps

1. ✅ Verify data is in database (run SQL queries above)
2. ✅ Check your app shows the synced content
3. ✅ Set up automated sync (optional)
4. ✅ Customize sync filters if needed (edit function code)
