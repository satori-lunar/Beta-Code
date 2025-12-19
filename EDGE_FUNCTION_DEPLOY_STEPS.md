# Step-by-Step: Deploy Edge Function via Dashboard

## Detailed Instructions

### Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Sign in if needed
3. Select your project: **qbsrmbxuwacpqquorqaq**

### Step 2: Navigate to Edge Functions
1. In the left sidebar, click **Edge Functions**
2. You should see a list of functions (might be empty if none deployed yet)
3. Click the **"Create a new function"** button (usually at the top right)

### Step 3: Create the Function
1. **Function Name**: Enter exactly: `passwordless-auth`
   - Must be lowercase
   - Use hyphens, not underscores
   - No spaces

2. **Function Code**: Copy the ENTIRE contents from the file below and paste it into the editor

### Step 4: Copy the Code
Open `supabase/functions/passwordless-auth/index.ts` and copy ALL of this code:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase admin client (uses service role key)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email)

    let userId: string
    let isNewUser = false

    if (existingUser?.user) {
      // User exists - check if they have a password
      const hasPassword = existingUser.user.encrypted_password !== null && existingUser.user.encrypted_password !== undefined
      
      if (hasPassword) {
        // User has password - they need to use password auth
        return new Response(
          JSON.stringify({ 
            error: null,
            requiresPassword: true,
            message: 'This account requires a password.'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // User exists but no password - generate sign-in link
      userId = existingUser.user.id
    } else {
      // User doesn't exist - create them
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: email.split('@')[0] // Use email prefix as default name
        }
      })

      if (createError || !newUser?.user) {
        return new Response(
          JSON.stringify({ error: createError?.message || 'Failed to create user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      userId = newUser.user.id
      isNewUser = true
    }

    // Generate OTP for passwordless sign-in
    // This sends an email with a code, but we'll extract the token for immediate use
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'http://localhost:3000'
    
    // Use admin API to send OTP
    const { data: otpData, error: otpError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${origin}/`
      }
    })

    if (otpError || !otpData) {
      return new Response(
        JSON.stringify({ error: otpError?.message || 'Failed to generate authentication link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract token from the generated link
    const actionLink = otpData.properties?.action_link || ''
    // The link format is usually: https://...?token=XXX or #access_token=XXX
    const tokenMatch = actionLink.match(/[#&?]token=([^&]+)/) || actionLink.match(/[#&?]token_hash=([^&]+)/)
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Failed to extract authentication token from link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        isNewUser,
        token,
        userId
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

### Step 5: Deploy
1. After pasting the code, click the **"Deploy"** button (usually at the bottom right)
2. Wait for deployment to complete (you'll see a success message)

### Step 6: Verify
1. After deployment, you should see `passwordless-auth` in your functions list
2. Click on it to see details
3. Check that the status is "Active" or "Deployed"

## Common Issues & Solutions

### Issue: "Function name already exists"
- **Solution**: Delete the existing function first, then create a new one

### Issue: "Deployment failed"
- **Solution**: 
  - Check for syntax errors in the code
  - Make sure you copied the ENTIRE code (including imports)
  - Check the function logs for error messages

### Issue: "Function not found" after deployment
- **Solution**: 
  - Wait a minute for propagation
  - Refresh the page
  - Check the function name is exactly `passwordless-auth` (lowercase, with hyphen)

### Issue: Code editor won't accept the code
- **Solution**: 
  - Make sure you're in the code editor (not a form field)
  - Try pasting in smaller chunks
  - Check if there's a "Format" or "Validate" button that shows errors

## Alternative: Try Command Prompt for CLI

If dashboard doesn't work, try Command Prompt (not PowerShell):

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```bash
   cd "C:\Users\jenni\New folder (2)\Beta-Code"
   ```
4. Install CLI:
   ```bash
   npm install -g supabase
   ```
5. Login:
   ```bash
   supabase login
   ```
6. Link:
   ```bash
   supabase link --project-ref qbsrmbxuwacpqquorqaq
   ```
7. Deploy:
   ```bash
   supabase functions deploy passwordless-auth
   ```
