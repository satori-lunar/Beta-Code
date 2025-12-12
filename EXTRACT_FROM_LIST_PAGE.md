# Extract All Session Titles from List Page

Perfect! You can extract all 53 titles at once from the sessions list page.

## Step 1: Go to the Sessions List Page

1. Log into your Kajabi account
2. Navigate to: https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions
3. Make sure you can see all the session links

## Step 2: Extract All Titles

1. **Open Browser Console** (F12 → Console tab)
2. **Copy and paste** the script from `extract-all-titles-from-list.js`
3. **Press Enter**

The script will:
- ✅ Extract all 53 session titles at once
- ✅ Match them with session IDs
- ✅ Generate batch SQL UPDATE statement
- ✅ Copy it to your clipboard automatically
- ✅ Highlight all session links on the page (green outline)

## Step 3: Update Database

1. Go to **Supabase Dashboard** → **SQL Editor**
2. **Paste the SQL** (already copied to clipboard)
3. **Click Run**

Done! All 53 sessions will be updated with their correct titles.

## What You'll See

The script outputs:
- List of all sessions with titles
- Individual SQL statements (if you want to run them one by one)
- **Batch SQL** (single statement to update all at once) ← This is what you want!
- JSON data for reference

## Alternative: Use Pre-Generated SQL

I've also created `update-all-session-titles.sql` with all 53 titles already extracted from your HTML. You can:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the contents of `update-all-session-titles.sql`
3. Paste and **Run**

This will update all sessions immediately!

## Titles Extracted

From your HTML, I extracted:
- Session 766599: "Plan My Week - Weekly Work Session"
- Session 766600: "Plan Your Week - Monday Hour One Calendaring "Study Hall""
- Session 766601: "Plan Your Week 8/31"
- ... and all 53 sessions!

The SQL file is ready to use right now! 🎉
