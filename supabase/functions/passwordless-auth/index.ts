import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
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
      // User exists - sign them in (no password check, just use email)
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



