# Fix Recordings Tab - Show Courses First

## What Was Fixed

1. ✅ **Category filter hidden when viewing sessions** - The "All" category filter is now hidden when you're viewing sessions for a course
2. ✅ **Only courses show initially** - When you click "Recordings" tab, you only see courses (like "Plan Your Week")
3. ✅ **Sessions only show after clicking a course** - Sessions only appear after you click on a specific course
4. ✅ **Search works correctly** - Search placeholder changes based on what you're viewing (courses vs sessions)
5. ✅ **State resets properly** - When switching tabs, the course selection resets

## How It Works Now

### Step 1: Click "Recordings" Tab
- Shows only **courses** (e.g., "Plan Your Week")
- Category filter shows (but only filters courses)
- Search says "Search courses..."

### Step 2: Click a Course
- Shows only **sessions for that course**
- Category filter is **hidden**
- Search says "Search sessions..."
- "Back to Courses" button appears

### Step 3: Click a Session
- Opens the session URL in a new tab

## If You Still See All Sessions

If you're still seeing all sessions when clicking "Recordings":

1. **Clear browser cache** - Old code might be cached
2. **Hard refresh** - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. **Check browser console** - Look for any errors (F12 → Console)
4. **Verify database** - Make sure sessions have `course_id` set:
   ```sql
   SELECT id, title, course_id 
   FROM public.recorded_sessions 
   WHERE course_id IS NULL;
   ```
   If any sessions have `course_id = NULL`, they won't show under a course

## Verification

To verify it's working:
1. Go to Classes → Recordings tab
2. You should see **only courses** (not sessions)
3. Click "Plan Your Week" course
4. You should see **only sessions for that course**
5. Category filter should be **hidden** when viewing sessions
