# 🔧 Troubleshooting Guide

## ✅ **Issues Fixed:**

### 1. Missing `.env.local` File ✅
**Problem:** Environment variables weren't being loaded  
**Solution:** Created `.env.local` with Supabase credentials

### 2. DEMO_MODE was TRUE ✅  
**Problem:** Authentication was completely bypassed  
**Solution:** Changed to `false` in `src/contexts/AuthContext.tsx`

---

## 🚀 **How to Test Authentication**

### Step 1: Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

**Important:** You MUST restart the dev server for `.env.local` changes to take effect!

### Step 2: Open Your App
Navigate to `http://localhost:5173` (or your dev server URL)

### Step 3: What Should Happen
1. ✅ You should be redirected to `/signin`
2. ✅ See a beautiful sign-in form
3. ✅ Click "Sign Up" to create an account
4. ✅ After signing up, you'll be signed in automatically
5. ✅ You should see the dashboard with your name

---

## 🐛 **Common Issues & Solutions**

### Issue: "Still seeing demo user"
**Cause:** Dev server not restarted  
**Fix:** 
```bash
# Kill the server completely
Ctrl+C
# Clear Vite cache
rm -rf node_modules/.vite
# Restart
npm run dev
```

### Issue: "Can't connect to Supabase"
**Check:**
1. Is `.env.local` file in the root directory?
2. Does it have both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY?
3. Did you restart the dev server?

**Verify:**
```bash
cat .env.local
# Should show:
# VITE_SUPABASE_URL=https://qbsrmbxuwacpqquorqaq.supabase.co
# VITE_SUPABASE_ANON_KEY=sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3
```

### Issue: "Sign up not working"
**Check browser console for errors:**
1. Open DevTools (F12)
2. Go to Console tab
3. Try signing up
4. Look for red error messages

**Common errors:**
- "Network error" → Supabase project might be paused
- "Invalid API key" → Check .env.local file
- "Email already registered" → Try a different email

### Issue: "Can't see my data"
**Verify:**
1. Are you signed in? (Check user in DevTools → Application → Local Storage)
2. Is RLS enabled on tables? (Should be ✅)
3. Check Supabase dashboard for data

---

## 🔍 **Debug Checklist**

Run through this checklist:

- [ ] `.env.local` file exists in root directory
- [ ] `.env.local` contains correct Supabase URL and key
- [ ] Dev server was restarted after creating .env.local
- [ ] DEMO_MODE is set to `false` in AuthContext.tsx
- [ ] Browser console shows no errors
- [ ] Can access /signin route
- [ ] Sign up form is visible
- [ ] Supabase project is active (not paused)

---

## 📊 **Verify Supabase Setup**

### Check Project Status
Visit: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq

Verify:
- ✅ Project status: Active
- ✅ Database: Running
- ✅ API: Available

### Check Tables
Go to: Table Editor in Supabase Dashboard

Verify these tables exist:
- ✅ user_profiles
- ✅ habits
- ✅ nutrition_entries
- ✅ weight_entries
- ✅ journal_entries
- ✅ health_metrics
- ✅ dashboard_settings

### Test Authentication in Supabase
Go to: Authentication → Users

Try creating a test user manually to verify auth is working.

---

## 🔐 **Security Verification**

### Confirm DEMO_MODE is OFF
```bash
# Check the file
grep "const DEMO_MODE" src/contexts/AuthContext.tsx
# Should show: const DEMO_MODE = false;
```

### Confirm Protected Routes Work
1. Try accessing `http://localhost:5173/` while signed out
2. Should redirect to `/signin` ✅

---

## 🆘 **Still Not Working?**

### Get Detailed Error Info
Add this to `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qbsrmbxuwacpqquorqaq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3'

console.log('🔧 Supabase Config:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length,
  keyPrefix: supabaseAnonKey.substring(0, 15) + '...'
})

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

Check browser console for the debug output.

### Test Supabase Connection
Add this test in `src/pages/SignIn.tsx` (temporarily):

```typescript
useEffect(() => {
  async function testConnection() {
    const { data, error } = await supabase.from('user_profiles').select('count')
    console.log('🔧 Supabase connection test:', { data, error })
  }
  testConnection()
}, [])
```

---

## ✅ **Success Indicators**

When everything is working:
1. ✅ Redirected to /signin when not authenticated
2. ✅ Can create account with email/password
3. ✅ Automatically signed in after signup
4. ✅ Can see dashboard with user's name
5. ✅ Can sign out and sign back in
6. ✅ Different users see different data
7. ✅ No errors in browser console

---

## 📞 **Get Help**

If you're still stuck, provide these details:
1. Browser console errors (screenshot)
2. Network tab showing failed requests
3. What step fails (signup, signin, data loading?)
4. Output of: `cat .env.local`
5. Output of: `grep DEMO_MODE src/contexts/AuthContext.tsx`

---

**Remember:** Always restart the dev server after changing `.env.local`! 🔄

