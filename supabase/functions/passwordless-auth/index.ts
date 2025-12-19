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

    // We don't need to look up or create the user explicitly here.
    // The generateLink admin API will handle user creation if needed.

    // Generate OTP for passwordless sign-in
    // This sends an email with a code, but we'll extract the token for immediate use
    const origin =
      req.headers.get('origin') ||
      req.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
      'http://localhost:3000'
    
    // Use admin API to send OTP / magic link
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

    // Debug: Log what we received (remove in production if needed)
    console.log('generateLink response:', JSON.stringify({
      hasProperties: !!otpData.properties,
      propertiesKeys: otpData.properties ? Object.keys(otpData.properties) : [],
      actionLink: otpData.properties?.action_link?.substring(0, 100) || 'none'
    }))

    // generateLink returns properties with action_link and potentially hashed_token
    // Try multiple ways to extract the token hash
    const properties = otpData.properties || {}
    const actionLink = properties.action_link || ''
    
    // Method 1: Direct property access
    let tokenHash = (properties as any)?.hashed_token || 
                    (properties as any)?.token_hash ||
                    (otpData as any)?.hashed_token ||
                    (otpData as any)?.token_hash ||
                    null

    // Method 2: Extract from action_link URL if it contains token_hash parameter
    if (!tokenHash && actionLink) {
      const tokenHashMatch = actionLink.match(/[?&#]token_hash=([^&]+)/)
      if (tokenHashMatch) {
        tokenHash = decodeURIComponent(tokenHashMatch[1])
      }
    }

    // Method 3: If we have action_link, we can extract the full URL and return it
    // The client can then use it to set the session
    if (!tokenHash && actionLink) {
      // Return the action_link so client can parse it
      return new Response(
        JSON.stringify({ 
          success: true,
          action_link: actionLink,
          // Also try to extract access_token and refresh_token from the link
          debug: 'Using action_link fallback'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!tokenHash) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to extract token hash from authentication link',
          debug: {
            hasProperties: !!properties,
            propertiesKeys: Object.keys(properties),
            actionLinkPreview: actionLink.substring(0, 150)
          }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        token_hash: tokenHash
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



