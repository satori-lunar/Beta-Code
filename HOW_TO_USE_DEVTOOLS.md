# How to Use Browser DevTools Console

## Quick Guide: Extract Session URLs

### Step 1: Open the Sessions Page
1. Log into your Kajabi account
2. Navigate to: https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions
3. Make sure you can see the list of recorded sessions

### Step 2: Open DevTools

**Windows:**
- Press `F12`
- Or press `Ctrl + Shift + I`
- Or right-click → "Inspect"

**Mac:**
- Press `Cmd + Option + I`
- Or right-click → "Inspect Element"

### Step 3: Go to Console Tab

Once DevTools opens, click on the **"Console"** tab at the top.

### Step 4: Paste and Run the Script

1. **Copy the entire script** from `extract-session-urls.js`
2. **Click in the Console** (you'll see a `>` prompt)
3. **Paste the code** (Ctrl+V or Cmd+V)
4. **Press Enter**

### Step 5: See the Results

You'll see output like:
```
🔍 Extracting session URLs...

✅ Found 25 unique session URLs:

1. https://www.birchandstonecoaching.com/coaching/groups/.../sessions/session-1
2. https://www.birchandstonecoaching.com/coaching/groups/.../sessions/session-2
...

✅ Copied JSON payload to clipboard!
```

### Step 6: Use the Results

The JSON is already copied to your clipboard! You can:

**Option A: Paste into PowerShell script**
1. Open `sync-sessions-from-urls.ps1`
2. Find the `$sessionUrls = @(` section
3. Paste the URLs from the JSON

**Option B: Send directly to Supabase**
- The JSON is ready to send to the sync function

## Visual Guide

```
┌─────────────────────────────────────────┐
│  Browser Window                         │
│  [Sessions Page - logged in]            │
│                                         │
│  Press F12 →                            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  DevTools Panel                          │
│  ┌─────┬─────┬─────┬─────┐             │
│  │Elem │Console│Network│...│             │
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  Console Tab:                           │
│  > [paste code here]                    │
│  > [press Enter]                        │
│                                         │
│  Output:                                │
│  ✅ Found 25 sessions...                │
└─────────────────────────────────────────┘
```

## Troubleshooting

### "Console is not defined"
- Make sure you're in the **Console** tab, not Elements or Network

### "No sessions found"
- Make sure you're on the sessions page (not the login page)
- Make sure you're logged in
- Try scrolling down to load all sessions

### "Clipboard API not available"
- The script will still show the JSON in the console
- Just copy it manually from there

### Script doesn't run
- Make sure you copied the **entire** script
- Make sure there are no extra characters
- Try pasting it line by line if needed

## Alternative: Quick One-Liner

If the full script doesn't work, try this shorter version:

```javascript
const urls = [...new Set(Array.from(document.querySelectorAll('a[href*="/sessions/"]')).map(a => a.href))]; console.log('Found', urls.length, 'sessions'); navigator.clipboard.writeText(JSON.stringify({session_urls: urls}, null, 2)); console.log('Copied to clipboard!'); urls;
```

Just paste this in the console and press Enter!
