# How to Extract Wisdom Rising Session Data

## Method 1: Using Browser Developer Tools (Recommended)

### Step 1: Open Developer Tools
1. Navigate to the Wisdom Rising class page in your browser
2. Press `F12` (or right-click → Inspect) to open Developer Tools
3. Go to the **Network** tab

### Step 2: Capture Network Requests
1. In the Network tab, filter by **XHR** or **Fetch**
2. Navigate through the Wisdom Rising sessions (click on different sessions)
3. Look for API calls that return session data (usually JSON responses)
4. Click on a request → **Response** tab to see the data

### Step 3: Extract Session Information
For each session, you need:
- **Session ID/Number** (usually in the URL like `/sessions/123456`)
- **Session URL** (full URL to the session)
- **Session Title** (if available)
- **Description** (if available)

### Step 4: Use the Console Script
1. Open the **Console** tab in Developer Tools
2. Copy and paste the code from `extract-wisdom-rising-data.js`
3. Press Enter to run it
4. Navigate through sessions to capture data
5. Type `window._wisdomRisingData` in the console to see captured data

## Method 2: Manual Extraction from Page Source

### Step 1: View Page Source
1. Right-click on the Wisdom Rising page → **View Page Source**
2. Search for "session" or session IDs
3. Look for JSON data embedded in `<script>` tags

### Step 2: Extract URLs
1. Look for links containing "wisdom-rising" and "sessions"
2. Extract the session numbers from URLs
3. Note the URL pattern (e.g., `https://.../sessions/123456/details`)

## Method 3: Using Supabase SQL Editor

If sessions are already in your database but not linked to a course:

```sql
-- Find any existing Wisdom Rising sessions
SELECT * FROM public.recorded_sessions 
WHERE title ILIKE '%wisdom%rising%' 
   OR video_url ILIKE '%wisdom%rising%'
   OR category ILIKE '%wisdom%';
```

## What Information You Need

For each session, collect:
1. **Session ID/Number** - Usually a number in the URL
2. **Full URL** - Complete link to the session page
3. **Title** - Session title (if different from default)
4. **Date** - When the session was recorded (optional, can use CURRENT_DATE)
5. **Duration** - Length in minutes (usually 60)
6. **Total Count** - How many sessions total

## Next Steps

Once you have the data:
1. Open `insert-wisdom-rising-sessions.sql`
2. Replace the placeholder course ID with a new UUID
3. Update course details (description, duration, session count, category, tags)
4. Replace the placeholder session data with your extracted sessions
5. Run the SQL in Supabase SQL Editor

## Quick Reference

- **Generate UUID**: `SELECT gen_random_uuid();` in Supabase SQL Editor
- **Check existing courses**: Run `inspect-plan-your-week-structure.sql`
- **Verify after insert**: The SQL file includes verification queries at the end
