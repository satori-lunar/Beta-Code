# Session Iframe Setup

## What's Been Created

✅ **SessionViewerModal Component** - A modal that displays sessions in an iframe
✅ **Click to Open** - Clicking any session card now opens it in the modal
✅ **Fallback Handling** - If iframe is blocked, shows option to open in new tab

## How It Works

1. **User clicks a session card** → Modal opens with iframe
2. **Iframe loads the session URL** → Session displays in the modal
3. **If blocked** → Shows error message with "Open in New Tab" button

## Important Note: Iframe Restrictions

Kajabi may block iframe embedding with `X-Frame-Options: DENY` header. If this happens:
- The modal will show an error message
- Users can click "Open in New Tab" to view the session
- This is a security feature that prevents clickjacking

## If You Want to Provide Page Source

If you want me to extract the actual video embed code from the page source, I can:

1. **Extract video player code** - Find the actual video player/embed code
2. **Create custom player** - Build a custom video player component
3. **Extract direct video URLs** - If available, use direct video URLs instead

### How to Provide Page Source

1. **Visit a session page** (while logged in)
2. **Right-click** → "View Page Source" (or `Ctrl+U` / `Cmd+U`)
3. **Copy all the HTML** (or just the relevant section)
4. **Share it with me** and I'll extract:
   - Video embed code
   - Direct video URLs
   - Player configuration
   - Any authentication tokens needed

### Alternative: Browser DevTools

1. Open **DevTools** (F12)
2. Go to **Network** tab
3. Reload the page
4. Look for video/media requests
5. Share the network requests or response data

## Current Implementation

The modal uses:
- Full-screen iframe with the session URL
- Loading indicator while iframe loads
- Error handling if iframe is blocked
- "Open in New Tab" fallback button
- Close button to exit modal

## Testing

1. Go to **Classes** → **Recordings** tab
2. Click on **"Plan Your Week"** course
3. Click on any session card
4. Modal should open with iframe
5. If it doesn't load, you'll see the fallback option

## Next Steps

If iframes are blocked by Kajabi, we can:
1. Extract video embed code from page source
2. Create a custom video player
3. Use direct video URLs if available
4. Implement authentication if needed

Let me know if you want to provide the page source and I'll extract the video player code!
