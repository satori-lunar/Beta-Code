# How to Disable Email Confirmation

If users are getting "Invalid credentials" errors after signing up, it's likely because Supabase requires email confirmation by default.

## Quick Fix: Disable Email Confirmation

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **birch and stone user dashboard**
3. Navigate to **Authentication** → **Settings**
4. Scroll down to **Email Auth** section
5. Find the **"Confirm email"** toggle
6. **Turn it OFF**
7. Click **Save**

## What This Does

- Users can sign in immediately after creating an account
- No need to check email for confirmation links
- Better user experience for your app

## Alternative: Keep Email Confirmation

If you want to keep email confirmation enabled:
- Users must check their email and click the confirmation link before signing in
- The sign-up page will show a message: "Please check your email for a confirmation link"
- After clicking the link, they can sign in normally

## Current Status

- ✅ **Imported users** (from CSV) are already auto-confirmed
- ⚠️ **New sign-ups** through the web form require email confirmation (unless disabled above)
