# Dashboard Diagnostic Tools

## 🔍 What I've Added

### 1. **Comprehensive Logging**
- All hooks now log when they start/finish fetching data
- Dashboard logs its state on every update
- Connection tests verify Supabase is reachable

### 2. **Force Render Mechanism**
- Dashboard **WILL** show after 300ms maximum, regardless of loading state
- No more infinite spinners - the dashboard always appears

### 3. **Diagnostic Panel**
- Add `?debug=1` to your URL to see a diagnostic panel
- Shows: user status, loading states, data counts, errors
- Example: `http://localhost:5173/?debug=1`

### 4. **Improved Error Handling**
- Hooks now properly handle errors and always set loading to false
- Empty arrays returned on error (instead of hanging)
- Better cleanup of subscriptions

## 🚀 How to Use Diagnostics

### Step 1: Open Browser Console
Press `F12` or right-click → Inspect → Console tab

### Step 2: Check the Logs
Look for these log messages:
- `[useUserData] Fetching habits for user...` - Hook is working
- `[useUserData] Successfully fetched habits: X items` - Data loaded
- `❌ Supabase connection test failed` - Connection issue
- `📊 Dashboard state:` - Current state snapshot

### Step 3: Use Diagnostic Panel
1. Add `?debug=1` to your URL
2. See real-time diagnostic information
3. Click "Log to Console" for detailed info

## 🐛 Common Issues & Solutions

### Issue: Dashboard Still Spinning
**Check:**
1. Open console - are there errors?
2. Check if user is authenticated (look for user ID in logs)
3. Check if Supabase connection test passes
4. Look for `[useUserData]` logs - are hooks running?

**Solution:**
- If no user: Check AuthContext - user might not be loading
- If connection fails: Check `.env.local` file and Supabase project status
- If hooks stuck: Check browser Network tab for failed requests

### Issue: No Data Loading
**Check:**
1. Are there errors in console?
2. Check diagnostic panel (`?debug=1`)
3. Look for RLS (Row Level Security) errors

**Solution:**
- RLS errors: Check Supabase dashboard → Authentication → Policies
- Network errors: Check if Supabase project is paused
- Query errors: Check table names match exactly

### Issue: Hooks Stuck in Loading
**Check:**
1. Look for `[useUserData]` logs - do they complete?
2. Check if `finally` block runs (should see loading: false)

**Solution:**
- If hooks never start: User might be null
- If hooks start but never finish: Network timeout or RLS blocking
- Check Network tab for pending requests

## 📋 Diagnostic Checklist

Run through this checklist:

- [ ] User is authenticated (check console for user ID)
- [ ] Supabase connection test passes (look for ✅ in console)
- [ ] Hooks are running (look for `[useUserData]` logs)
- [ ] Hooks complete (look for "Successfully fetched" or errors)
- [ ] Dashboard shows after 300ms (should always happen now)
- [ ] No infinite loading states (check diagnostic panel)

## 🔧 Manual Tests

### Test 1: Check User Authentication
```javascript
// In browser console:
const { data } = await supabase.auth.getSession()
console.log('Session:', data.session?.user)
```

### Test 2: Test Direct Query
```javascript
// In browser console (replace YOUR_USER_ID):
const { data, error } = await supabase
  .from('habits')
  .select('*')
  .eq('user_id', 'YOUR_USER_ID')
console.log('Habits:', data, 'Error:', error)
```

### Test 3: Check Environment Variables
```javascript
// In browser console:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
```

## 📊 What the Diagnostic Panel Shows

1. **User Status**: Whether user is authenticated
2. **Loading States**: Which hooks are still loading
3. **Data Counts**: How many items each hook has loaded
4. **Errors**: Any errors from hooks

## 🎯 Next Steps

1. **Open your app** with `?debug=1` parameter
2. **Check the diagnostic panel** - what does it show?
3. **Check browser console** - what errors do you see?
4. **Share the diagnostic info** if you need help

The dashboard should now **always** show after 300ms, even if data is still loading. Widgets will show loading states or empty states as appropriate.
