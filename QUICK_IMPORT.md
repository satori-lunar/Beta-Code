# Quick Import Instructions

## Option 1: Using the PowerShell Script (Easiest)

1. Open PowerShell in the project directory
2. Run:
   ```powershell
   .\import-contacts.ps1 -ServiceRoleKey "your-service-role-key-here"
   ```

## Option 2: Manual PowerShell Commands

Run these commands **one at a time**:

```powershell
# First, set the environment variable
$env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key-here"

# Then run the import
npm run import-contacts
```

**Important**: Don't put them on the same line. Run them separately.

## Option 3: Single Line (with semicolon)

```powershell
$env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key-here"; npm run import-contacts
```

## Getting Your Service Role Key

1. Go to: https://supabase.com/dashboard
2. Select your project: **birch and stone user dashboard**
3. Go to **Settings** → **API**
4. Copy the **service_role** key (under "Project API keys")
5. Replace `your-service-role-key-here` with the actual key

## Example

```powershell
$env:SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
npm run import-contacts
```
