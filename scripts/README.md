# Import Contacts Script

This script imports contacts from a CSV file and creates them as users in Supabase.

## Prerequisites

1. **Supabase Service Role Key**: You need the service role key (not the anon key) to create users programmatically.
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the `service_role` key (keep this secret!)

2. **CSV File**: The script expects a CSV file with contact information.

## Usage

### Option 1: Using environment variable

```bash
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
npm run import-contacts path/to/contacts.csv
```

### Option 2: Using inline environment variable

**Windows (PowerShell):**
```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"; npm run import-contacts "C:\Users\jenni\Downloads\site_2147540980_contacts_d082236a-ec76-4857-aae5-097a32e2a0ce_complete.csv"
```

**Windows (CMD):**
```cmd
set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here && npm run import-contacts "C:\Users\jenni\Downloads\site_2147540980_contacts_d082236a-ec76-4857-aae5-097a32e2a0ce_complete.csv"
```

**Mac/Linux:**
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here npm run import-contacts path/to/contacts.csv
```

## What the script does

1. Reads the CSV file and parses contact information
2. For each contact with a valid email:
   - Checks if user already exists (skips if exists)
   - Creates user in Supabase Auth with:
     - Email address
     - Temporary secure password
     - User metadata (name, first name, last name)
     - Auto-confirmed email
   - The database trigger automatically creates an entry in `public.users` table
3. Provides a summary of:
   - Successfully created users
   - Skipped contacts (no email or already exists)
   - Errors encountered

## CSV Format

The script expects a CSV with at least these columns:
- `Email` or `Email (email)` - Required
- `Name` or `Name (name)` - Used for user name
- `First Name` - Optional
- `Last Name` - Optional

## Security Notes

- Users are created with temporary passwords
- Users will need to use "Forgot Password" to set their own password
- The service role key has admin access - keep it secret!
- Row Level Security (RLS) ensures each user can only see their own data

## Data Isolation

Each user created will:
- Have their own isolated data in the database
- Only be able to see their own habits, journal entries, weight entries, etc.
- This is enforced by Row Level Security (RLS) policies already set up in the database
