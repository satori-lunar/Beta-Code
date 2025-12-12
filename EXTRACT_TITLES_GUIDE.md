# Extract Session Titles Guide

This guide shows you how to extract the actual session titles from each session page and update them in the database.

## Step 1: Visit Each Session Page

1. Log into your Kajabi account
2. Visit each session URL, for example:
   - https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766599/details
   - https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766600/details
   - ... and so on for all 53 sessions

## Step 2: Extract Title from Each Page

For each session page:

1. **Open Browser Console** (F12 → Console tab)
2. **Copy and paste** the script from `extract-session-title.js`
3. **Press Enter**
4. The script will:
   - Find the `<span>` element with the title
   - Extract the text (e.g., "Plan My Week - Weekly Work Session")
   - Highlight the element on the page (green outline)
   - Copy a SQL UPDATE statement to your clipboard

## Step 3: Update Database

### Option A: Update One at a Time

After extracting each title, the SQL is already copied to your clipboard. Just:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Paste the SQL (Ctrl+V)
3. Click **Run**
4. Repeat for each session

### Option B: Batch Update (Recommended)

1. **Collect all titles first:**
   - Visit each session page
   - Run the extraction script
   - Copy the title to a list (or use the JSON output)

2. **Create a batch SQL update:**
   - Use the template in `update-session-titles-batch.sql`
   - Replace the titles with your extracted ones
   - Run it once to update all sessions

## Example Output

When you run the script, you'll see:

```
✅ Extracted title:
Title: Plan My Week - Weekly Work Session

📋 Full result:
{
  "url": "https://...",
  "session_id": "766599",
  "extracted_title": "Plan My Week - Weekly Work Session",
  "title_span": "Plan My Week - Weekly Work Session",
  ...
}

✅ Copied SQL UPDATE statement to clipboard!
```

## Quick Workflow

1. Visit session page → Open console → Run script → Copy SQL
2. Go to Supabase → Paste SQL → Run
3. Repeat for all 53 sessions

Or collect all titles first, then batch update!

## Batch Update Template

After collecting all titles, you can use this template:

```sql
UPDATE public.recorded_sessions 
SET title = CASE 
  WHEN video_url LIKE '%766599%' THEN 'Plan My Week - Weekly Work Session'
  WHEN video_url LIKE '%766600%' THEN 'Your Title Here'
  WHEN video_url LIKE '%766601%' THEN 'Your Title Here'
  -- Add all 53 sessions
  ELSE title
END
WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;
```

## Tips

- The script looks for spans containing "Plan My Week" or "Weekly Work Session"
- If not found, it falls back to H1, H2, or page title
- The found element will be highlighted in green on the page
- SQL is automatically escaped to handle apostrophes
