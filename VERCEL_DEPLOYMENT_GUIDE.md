# Vercel Deployment Guide

## Environment Variables Setup

Your production deployment requires environment variables to be set in Vercel. Follow these steps:

### 1. Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (Beta-Code / mybirchandstonecoaching)
3. Click on **Settings** → **Environment Variables**

### 2. Add Required Environment Variables

Add these **TWO** environment variables with **EXACT** names (case-sensitive):

#### Variable 1: Supabase URL
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://qbsrmbxuwacpqquorqaq.supabase.co`
- **Environments**: ✅ Production ✅ Preview ✅ Development

#### Variable 2: Supabase Anonymous Key
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzIX3`
- **Environments**: ✅ Production ✅ Preview ✅ Development

### 3. Important Notes

#### Common Mistakes to Avoid
- ❌ **Wrong**: `SUPABASE_URL` (missing `VITE_` prefix)
- ❌ **Wrong**: `Vite_SUPABASE_URL` (incorrect capitalization)
- ❌ **Wrong**: `vite_supabase_url` (must be all caps)
- ✅ **Correct**: `VITE_SUPABASE_URL`

#### Why VITE_ Prefix?
Vite only exposes environment variables that start with `VITE_` to the client-side code for security reasons.

### 4. Deploy After Adding Variables

After adding the environment variables:
1. Go to the **Deployments** tab
2. Click on the latest deployment
3. Click the three dots menu (⋯)
4. Select **Redeploy**

**OR** just push a new commit - Vercel will auto-deploy with the new environment variables.

## Local Development

For local development, ensure your `.env.local` file is:

### File Encoding
- **Must be UTF-8 encoded** (not UTF-16)
- Some editors (like Windows Notepad) may save as UTF-16 by default
- Use VS Code, Notepad++, or another modern editor to ensure UTF-8 encoding

### File Content
```env
VITE_SUPABASE_URL=https://qbsrmbxuwacpqquorqaq.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzIX3
```

## Troubleshooting

### Issue: "Missing Supabase environment variables" Error

**Check**:
1. Verify variable names are EXACTLY as specified (case-sensitive)
2. Verify all three environments are checked (Production, Preview, Development)
3. After adding variables, trigger a new deployment

### Issue: App Loads but Shows No Data

**Check**:
1. Open browser console (F12)
2. Look for Supabase connection errors
3. Verify the environment variables are loading:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   // Should show: https://qbsrmbxuwacpqquorqaq.supabase.co
   ```

### Issue: 404 Errors on Page Refresh

This is handled by `vercel.json` which redirects all routes to `index.html` for SPA routing. If you're still seeing 404s:
1. Verify `vercel.json` exists in your repository
2. Redeploy to apply the configuration

## Security Note

- `.env.local` is in `.gitignore` (correct - never commit secrets to git)
- The Supabase **anonymous key** is safe to expose client-side
- Supabase uses Row Level Security (RLS) policies to protect data
- Never share your Supabase **service role key** (not used in this project)
