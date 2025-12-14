# Environment Variable Verification Checklist

## Production is Still Failing - Let's Debug

The React error #310 persists in production. Here's what to check:

### ✅ Already Fixed (Local)
- `.env.local` is UTF-8 encoded locally
- All useEffect dependencies use `user?.id` instead of `user`
- Code has been pushed to GitHub

### ❓ Need to Verify in Vercel Dashboard

Go to https://vercel.com/dashboard and check:

#### 1. Environment Variables Exist
Navigate to: **Your Project** → **Settings** → **Environment Variables**

You MUST have these two variables:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `VITE_SUPABASE_URL` | `https://qbsrmbxuwacpqquorqaq.supabase.co` | ✅ Production ✅ Preview ✅ Development |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzIX3` | ✅ Production ✅ Preview ✅ Development |

#### 2. Common Issues

**Issue**: Variables exist but don't work
**Cause**: Variable names might be incorrect
**Fix**: Delete and recreate with EXACT names (case-sensitive)

**Issue**: "Failed to retrieve data" in console
**Cause**: Environment variables not loaded
**Fix**: Redeploy after setting variables

**Issue**: Still getting React error #310
**Cause**: Old build cached or deployment not complete
**Fix**:
1. Wait 2-3 minutes for deployment to complete
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check deployment status in Vercel

### 🔍 How to Debug in Production

1. Open https://www.mybirchandstonecoaching.com
2. Open browser console (F12)
3. Look for this error message:
   ```
   ❌ Missing Supabase environment variables!
   VITE_SUPABASE_URL: ✗ or ✓
   VITE_SUPABASE_ANON_KEY: ✗ or ✓
   ```

4. If you see ✗ (cross marks), the environment variables are NOT set in Vercel

### 📊 Deployment Status

Check your latest deployment:
1. Go to **Deployments** tab in Vercel
2. Look at the most recent deployment
3. Status should be "Ready" (green checkmark)
4. Build logs should not show errors

### 🚨 If Environment Variables ARE Set But Still Failing

If Vercel shows the variables ARE set but you still get errors:

1. **Clear Vercel Build Cache**:
   - In Vercel Dashboard → Project Settings
   - Scroll to "Build & Development Settings"
   - Click "Clear Build Cache"
   - Trigger a new deployment

2. **Check Variable Scope**:
   - Make sure "Production" environment is checked
   - Variables must be set for the environment you're deploying to

3. **Verify No Typos**:
   - Variable name: `VITE_SUPABASE_URL` (not `VITE_SUPABASE_URI` or similar)
   - Check for extra spaces in the value

### ⏭️ Next Steps

1. ✅ Check Vercel environment variables (do this NOW)
2. ✅ Wait for latest deployment to complete (~2-3 minutes)
3. ✅ Hard refresh the production site
4. ✅ Check browser console for errors
5. ✅ Report back what you see in the console
