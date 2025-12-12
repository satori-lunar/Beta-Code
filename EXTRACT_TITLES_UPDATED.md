# Extract Session Titles - Updated Guide

## What This Does

The script now **automatically finds the title span** on each session page - you don't need to know what the title text is beforehand. It will:

1. Look for spans with meaningful text (10-100 characters, multiple words)
2. Check spans with title-related classes/IDs
3. Fall back to H1, H2, or page title if no span is found
4. Highlight the found element on the page so you can verify it's correct

## How to Use

### For Each Session (53 total):

1. **Visit the session URL** (while logged into Kajabi)
   - Example: https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766599/details

2. **Open Browser Console** (F12 → Console tab)

3. **Copy and paste** the script from `extract-session-title.js`

4. **Press Enter**

5. **Verify the highlighted element** - The script will:
   - Find the title span automatically
   - Highlight it in green on the page
   - Show the extracted title in the console
   - Copy SQL UPDATE to clipboard

6. **Update the database:**
   - Go to Supabase → SQL Editor
   - Paste the SQL (already copied)
   - Run it

## What the Script Finds

The script looks for:
- ✅ Spans with 10-100 characters
- ✅ Spans with multiple words
- ✅ Spans with "title", "heading", or "name" in class/id
- ✅ Falls back to H1, H2, or page title if needed

## Example Output

```
✅ Extracted title:
Title: Plan My Week - Weekly Work Session
Found in: span

📍 Found title span element:
[HTMLSpanElement]
✅ Highlighted the span element on the page (green outline)

✅ Copied SQL UPDATE statement to clipboard!
```

## Batch Collection

If you want to collect all titles first, then batch update:

1. Visit each session page
2. Run the script
3. Note the title (or copy the JSON output)
4. After collecting all 53, update `update-session-titles-batch.sql`
5. Run the batch update once

## Tips

- The green highlight shows you exactly which element was found
- If the wrong element is highlighted, you can manually inspect the page
- The script shows "Other potential titles" if multiple candidates are found
- You can adjust the script if needed for your specific page structure
