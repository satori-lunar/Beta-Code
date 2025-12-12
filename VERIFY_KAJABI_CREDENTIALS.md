# Verify Your Kajabi API Credentials

## The Problem

You're getting `401 - Invalid client credentials` even though the credentials look correct. This usually means:

1. **Credentials are expired or rotated** - Kajabi may have regenerated them
2. **Credentials are from wrong account** - They might be for a different Kajabi site
3. **API access not enabled** - Your Kajabi account might not have API access enabled
4. **Wrong credentials location** - You might be looking at the wrong place in Kajabi

## How to Get Your Correct Kajabi API Credentials

### Step 1: Log into Kajabi Dashboard

1. Go to your Kajabi account: https://app.kajabi.com
2. Log in with your admin account

### Step 2: Navigate to API Settings

1. Go to **Settings** (gear icon, usually bottom left)
2. Look for **Integrations** or **API** or **Developer** section
3. Click on **Public API** or **API Access**

### Step 3: Find Your Credentials

You should see:
- **Client ID** (this is your API Key)
- **Client Secret** (this is your API Secret)

**Important Notes:**
- These are different from your Kajabi login credentials
- They're specifically for API access
- If you don't see them, API access might not be enabled for your account

### Step 4: Generate New Credentials (If Needed)

If you can't find credentials or they're not working:

1. Look for a **"Generate"** or **"Create"** button
2. Click it to create new API credentials
3. **Copy them immediately** - secrets are usually only shown once
4. Update them in Supabase Edge Function secrets

## Verify Credentials Are Correct

### Check 1: Credential Format

Kajabi API credentials are typically:
- **Client ID**: Usually 20-30 characters, alphanumeric
- **Client Secret**: Usually longer, 30-40+ characters

### Check 2: Test Credentials

You can test if credentials work by making a manual API call:

```bash
curl -X POST https://api.kajabi.com/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET"
  }'
```

If this returns a token, your credentials are correct. If it returns 401, the credentials are wrong.

## Common Issues

### Issue 1: API Access Not Enabled

**Symptom**: Can't find API settings in Kajabi

**Solution**: 
- Contact Kajabi support to enable API access
- Some Kajabi plans may not include API access
- You may need to upgrade your plan

### Issue 2: Credentials Were Rotated

**Symptom**: Credentials used to work but now don't

**Solution**:
- Someone may have regenerated the credentials
- Check Kajabi dashboard for new credentials
- Update Supabase secrets with new values

### Issue 3: Wrong Account

**Symptom**: Credentials don't match your Kajabi site

**Solution**:
- Make sure you're logged into the correct Kajabi account
- Check that the credentials match the site you want to sync

## Update Supabase Secrets

Once you have the correct credentials:

1. Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/settings/functions
2. Update the secrets:
   - `KAJABI_API_KEY` = Your Client ID
   - `KAJABI_API_SECRET` = Your Client Secret
3. Save
4. Test the function again

## Next Steps

1. ✅ Verify credentials in Kajabi Dashboard
2. ✅ Update Supabase Edge Function secrets
3. ✅ Test the function
4. ✅ Check logs for "Successfully authenticated"

If you still get 401 after verifying credentials are correct, the issue might be:
- API access not enabled for your Kajabi account
- Wrong Kajabi account/site
- Credentials need to be regenerated
