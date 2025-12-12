# Sync Kajabi Recorded Sessions to Supabase

This guide shows you how to sync recorded sessions from your Kajabi group page to Supabase.

## Overview

Since the sessions page requires login, we have two options:
1. **Manual URL Import** - Provide the session URLs and sync them
2. **API Extraction** - Use Kajabi API (if authentication works)

## Step 1: Deploy the Session Sync Function

1. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy sync-kajabi-sessions
   ```

   Or via Supabase Dashboard:
   - Go to **Edge Functions** > **Create Function**
   - Name: `sync-kajabi-sessions`
   - Copy the code from `supabase/functions/sync-kajabi-sessions/index.ts`

2. **Get your function URL:**
   ```
   https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-sessions
   ```

## Step 2: Get Session URLs

Since the page requires login, you'll need to:

1. **Log into your Kajabi account**
2. **Navigate to:** https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions
3. **Copy the URLs** for each recorded session
   - Right-click on each session link
   - Copy the URL
   - Or use browser DevTools to extract all links

## Step 3: Sync Sessions

### Option A: Simple URL List

Send a POST request with just the URLs:

```json
{
  "session_urls": [
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/session-1",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/session-2",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/session-3"
  ]
}
```

### Option B: Full Session Data

Provide complete session information:

```json
{
  "sessions": [
    {
      "url": "https://www.birchandstonecoaching.com/coaching/groups/.../sessions/session-1",
      "title": "Week 1 - Planning Your Week",
      "description": "Learn how to plan your week effectively",
      "recorded_at": "2024-01-15",
      "duration": 60,
      "thumbnail_url": "https://...",
      "category": "Planning",
      "tags": ["planning", "productivity"]
    },
    {
      "url": "https://www.birchandstonecoaching.com/coaching/groups/.../sessions/session-2",
      "title": "Week 2 - Time Management",
      "description": "Master your time management skills",
      "recorded_at": "2024-01-22",
      "duration": 60
    }
  ]
}
```

## Step 4: Test the Sync

### Using PowerShell

```powershell
$functionUrl = "https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-sessions"
$payload = @{
    session_urls = @(
        "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/session-1",
        "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/session-2"
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri $functionUrl -Method Post -ContentType "application/json" -Body $payload
```

### Using curl

```bash
curl -X POST https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "session_urls": [
      "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/session-1",
      "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/session-2"
    ]
  }'
```

## Step 5: Extract Session URLs Automatically

Since the page requires login, you can:

### Option 1: Browser Extension/Bookmarklet

Create a bookmarklet to extract all session links from the page:

```javascript
javascript:(function(){
  const links = Array.from(document.querySelectorAll('a[href*="/sessions/"]'));
  const urls = links.map(a => a.href).filter((v, i, a) => a.indexOf(v) === i);
  console.log('Session URLs:', urls);
  navigator.clipboard.writeText(JSON.stringify(urls));
  alert('Copied ' + urls.length + ' session URLs to clipboard!');
})();
```

### Option 2: Browser Console

1. Open the sessions page (while logged in)
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run this script:

```javascript
// Extract all session links
const sessionLinks = Array.from(document.querySelectorAll('a[href*="/sessions/"]'));
const sessionUrls = [...new Set(sessionLinks.map(link => link.href))];
console.log('Found', sessionUrls.length, 'sessions:');
sessionUrls.forEach((url, i) => console.log(`${i+1}. ${url}`));

// Copy to clipboard as JSON
const json = JSON.stringify(sessionUrls, null, 2);
navigator.clipboard.writeText(json);
console.log('\n✅ Copied to clipboard!');
```

5. Paste the URLs into the sync function

## Step 6: Verify in Supabase

Check that sessions were synced:

```sql
SELECT 
  id,
  title,
  video_url,
  recorded_at,
  duration,
  synced_from_kajabi,
  created_at
FROM recorded_sessions 
WHERE synced_from_kajabi = true 
ORDER BY recorded_at DESC 
LIMIT 20;
```

## Alternative: Automated Extraction Script

If you want to automate this, I can create a script that:
1. Uses your Kajabi credentials to authenticate
2. Fetches the group/sessions via API
3. Extracts all session URLs
4. Syncs them to Supabase automatically

Would you like me to create that?

## Next Steps

1. ✅ Deploy the function
2. ✅ Get session URLs from the page (while logged in)
3. ✅ Send them to the sync function
4. ✅ Verify in Supabase
5. ✅ Set up a schedule to sync new sessions periodically
