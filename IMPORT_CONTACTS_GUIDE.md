# Import Contacts Guide

This guide will help you import contacts from the CSV file into Supabase as users.

## Step 1: Get Your Supabase Service Role Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project: **birch and stone user dashboard** (qbsrmbxuwacpqquorqaq)
3. Navigate to **Settings** → **API**
4. Find the **service_role** key (it's under "Project API keys")
5. **⚠️ Important**: This key has admin privileges - keep it secret!

## Step 2: Run the Import Script

### Windows (PowerShell)

```powershell
# Set the service role key
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Run the import (it will use the default CSV path)
npm run import-contacts

# Or specify a custom CSV path
npm run import-contacts "C:\path\to\your\contacts.csv"
```

### Windows (CMD)

```cmd
set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
npm run import-contacts
```

### Mac/Linux

```bash
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
npm run import-contacts
```

## Step 3: What Happens During Import

The script will:
1. ✅ Read and parse the CSV file
2. ✅ For each contact with a valid email:
   - Check if user already exists (skips if exists)
   - Create user in Supabase Auth
   - Generate a secure temporary password
   - Auto-confirm their email
   - The database trigger automatically creates entry in `public.users`
3. ✅ Show progress for each user
4. ✅ Display a summary at the end

## Step 4: User Access

After import, users can:
1. Go to your app's sign-in page
2. Click "Forgot Password"
3. Enter their email address
4. Set their own password
5. Sign in and access their personalized dashboard

## Data Isolation

✅ **Already configured!** Each user will only see their own data:
- Their own habits
- Their own journal entries
- Their own weight entries
- Their own nutrition logs
- Their own calendar events
- etc.

This is enforced by **Row Level Security (RLS)** policies that are already set up in the database.

## Verification

After running the import, you can verify users were created:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. You should see all the imported users listed
3. Go to **Table Editor** → **users** table
4. You should see corresponding entries in the `public.users` table

## Troubleshooting

### "SUPABASE_SERVICE_ROLE_KEY environment variable is required"
- Make sure you set the environment variable before running the script
- On Windows PowerShell, use `$env:SUPABASE_SERVICE_ROLE_KEY="key"`
- On Windows CMD, use `set SUPABASE_SERVICE_ROLE_KEY=key`
- On Mac/Linux, use `export SUPABASE_SERVICE_ROLE_KEY=key`

### "User already exists" messages
- This is normal - the script skips users that already exist
- This prevents duplicate accounts

### "Error creating user"
- Check that the email is valid
- Check that the service role key is correct
- Check your Supabase project is active

## Security Notes

- Users are created with temporary passwords
- Users must use "Forgot Password" to set their own password
- The service role key should never be committed to git
- RLS policies ensure users can only access their own data
