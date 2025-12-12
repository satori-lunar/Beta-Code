# Extract Session Headings Guide

This guide shows you how to extract H1 and H2 headings from each session page to get better titles.

## Step 1: Open a Session Page

1. Log into your Kajabi account
2. Navigate to a session page, for example:
   - https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766599/details

## Step 2: Open Browser Console

- **Windows:** Press `F12` or `Ctrl + Shift + I`
- **Mac:** Press `Cmd + Option + I`
- Click on the **Console** tab

## Step 3: Run the Extraction Script

1. Copy the entire script from `extract-session-headings.js`
2. Paste it into the console
3. Press **Enter**

You'll see output like:
```json
{
  "url": "https://...",
  "session_id": "766599",
  "h1": "Week 1: Introduction to Planning",
  "h2s": ["Getting Started", "Setting Goals"],
  "suggested_title": "Week 1: Introduction to Planning"
}
```

## Step 4: Copy the Suggested Title

The script will:
- Extract the H1 heading (main title)
- Extract all H2 headings (subheadings)
- Suggest the best title (usually the H1)
- Copy the result to your clipboard

## Step 5: Update Database

### Option A: Update One Session at a Time

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run:
```sql
UPDATE public.recorded_sessions 
SET title = 'Week 1: Introduction to Planning'
WHERE video_url = 'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766599/details';
```

### Option B: Batch Update Multiple Sessions

After extracting headings from multiple sessions, you can batch update:

```sql
UPDATE public.recorded_sessions 
SET title = CASE 
  WHEN video_url LIKE '%766599%' THEN 'Week 1: Introduction to Planning'
  WHEN video_url LIKE '%766600%' THEN 'Week 2: Setting Goals'
  WHEN video_url LIKE '%766601%' THEN 'Week 3: Time Management'
  -- Add more as needed
  ELSE title
END
WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;
```

## Tips

- The H1 heading is usually the best title
- If H1 is missing, the first H2 is used
- If both are missing, the page title is used
- You can manually edit the suggested title if needed

## Quick Workflow

1. Visit session page → Open console → Run script → Copy title
2. Go to Supabase SQL Editor → Update that session
3. Repeat for all 53 sessions

Or collect all titles first, then batch update them all at once!
