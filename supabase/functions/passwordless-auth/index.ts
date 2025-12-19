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

    // generateLink returns a magic link with tokens we can use
    // We need to extract the access_token and refresh_token from the action_link
    const actionLink = otpData.properties?.action_link || ''
    
    // Parse the URL to extract tokens
    // Magic links typically have format: https://...?token=XXX#access_token=YYY&refresh_token=ZZZ
    // or: https://...#access_token=YYY&refresh_token=ZZZ&type=magiclink
    try {
      const url = new URL(actionLink)
      const hashParams = new URLSearchParams(url.hash.substring(1)) // Remove the #
      const queryParams = new URLSearchParams(url.search.substring(1)) // Remove the ?
      
      // Try to get tokens from hash first, then query params
      let accessToken = hashParams.get('access_token') || queryParams.get('access_token') || ''
      let refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token') || ''
      const tokenType = hashParams.get('type') || queryParams.get('type') || 'magiclink'

      if (!accessToken || !refreshToken) {
        // Fallback: try regex extraction
        const accessTokenMatch = actionLink.match(/[#&?]access_token=([^&]+)/)
        const refreshTokenMatch = actionLink.match(/[#&?]refresh_token=([^&]+)/)
        
        accessToken = accessTokenMatch ? decodeURIComponent(accessTokenMatch[1]) : ''
        refreshToken = refreshTokenMatch ? decodeURIComponent(refreshTokenMatch[1]) : ''
      }
      
      if (!accessToken || !refreshToken) {
        return new Response(
          JSON.stringify({ error: 'Failed to extract tokens from authentication link' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          access_token: accessToken,
          refresh_token: refreshToken,
          type: tokenType
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (urlError) {
      // If URL parsing fails, try regex extraction
      const accessTokenMatch = actionLink.match(/[#&?]access_token=([^&]+)/)
      const refreshTokenMatch = actionLink.match(/[#&?]refresh_token=([^&]+)/)
      
      const accessToken = accessTokenMatch ? decodeURIComponent(accessTokenMatch[1]) : ''
      const refreshToken = refreshTokenMatch ? decodeURIComponent(refreshTokenMatch[1]) : ''
      
      if (!accessToken || !refreshToken) {
        return new Response(
          JSON.stringify({ error: 'Failed to extract tokens from authentication link' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          access_token: accessToken,
          refresh_token: refreshToken,
          type: 'magiclink'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})



