# How to Create Public API User API Keys for Supabase Integration

## The Problem

You have **Account Details API Credentials** (which work with Zapier), but the Supabase integration needs **Public API User API Keys** (which use OAuth 2.0).

These are **two different types of credentials** in Kajabi!

## Steps to Create Public API User API Keys

1. **Go to Kajabi Dashboard**
   - Log in to your Kajabi account

2. **Navigate to Settings**
   - Click on **Settings** in the left sidebar

3. **Go to Public API**
   - Click on **Public API** (NOT "Account Details")
   - This is different from where you found the Zapier credentials

4. **Create a New User API Key**
   - Click on **"Create User API Key"** button
   - Give it a name (e.g., "Supabase Integration")
   - Select the **user** (usually your admin user)
   - Select the **permissions** you need:
     - ✅ **Products** (to sync products)
     - ✅ **Contacts** (to sync contacts/users)
     - ✅ Any other permissions your integration needs

5. **Copy the Credentials**
   - After creating, you'll see:
     - **Client ID** (this is your `client_id`)
     - **Client Secret** (this is your `client_secret`)
   - ⚠️ **IMPORTANT**: Copy these immediately! The secret is only shown once.
   - If you lose the secret, you'll need to delete and recreate the key.

6. **Update Supabase Secrets**
   - Go to your Supabase Dashboard
   - Navigate to **Edge Functions** > **Secrets**
   - Update:
     - `KAJABI_API_KEY` = Your new **Client ID**
     - `KAJABI_API_SECRET` = Your new **Client Secret**

7. **Test the Integration**
   - Redeploy your Edge Function
   - Test it using the test scripts or invoke it directly

## Key Differences

| Feature | Account Details API | Public API User Keys |
|---------|-------------------|---------------------|
| Location | Settings > Account Details | Settings > Public API |
| Used By | Zapier, third-party apps | Public API (OAuth 2.0) |
| Format | API Key + API Secret | Client ID + Client Secret |
| Authentication | Zapier-specific method | OAuth 2.0 Client Credentials |

## Why This Matters

- **Zapier** uses Account Details API Credentials (which you have)
- **Supabase/Public API** uses Public API User API Keys (which you need to create)

Both are valid, but they're for different purposes and use different authentication methods.

## After Creating the Keys

Once you have the new Public API User API Keys:
1. Test them with: `powershell -ExecutionPolicy Bypass -File "test-kajabi-correct-format.ps1"`
2. Update the script with your new Client ID and Client Secret
3. If the test succeeds, update your Supabase secrets
4. Redeploy the Edge Function
