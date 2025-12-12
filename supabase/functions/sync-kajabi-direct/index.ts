// Supabase Edge Function to sync Kajabi products directly using Account Details API credentials
// This uses your API Key and API Secret (Account Details credentials)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KajabiAccessTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface KajabiProduct {
  id: string
  name: string
  description?: string
  hero_image_url?: string
  thumbnail_url?: string
  product_type?: string
  url?: string
  permalink?: string
  [key: string]: any
}

interface KajabiOffering {
  id: string
  product_id: string
  name: string
  description?: string
  url?: string
  [key: string]: any
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get credentials from environment or request
    const kajabiApiKey = Deno.env.get('KAJABI_API_KEY') || ''
    const kajabiApiSecret = Deno.env.get('KAJABI_API_SECRET') || ''

    if (!kajabiApiKey || !kajabiApiSecret) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing KAJABI_API_KEY or KAJABI_API_SECRET. Set them in Supabase Edge Function secrets.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Starting Kajabi sync with Account Details API credentials...')

    // Step 1: Get OAuth access token
    console.log('Authenticating with Kajabi API...')
    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append('client_id', kajabiApiKey.trim())
    params.append('client_secret', kajabiApiSecret.trim())

    const tokenResponse = await fetch('https://api.kajabi.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error(`Kajabi authentication failed: ${tokenResponse.status} - ${errorText}`)
      return new Response(
        JSON.stringify({ 
          error: `Kajabi authentication failed: ${tokenResponse.status}`,
          details: errorText 
        }),
        { 
          status: tokenResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const tokenData: KajabiAccessTokenResponse = await tokenResponse.json()
    const accessToken = tokenData.access_token
    console.log('Successfully authenticated with Kajabi')

    // Step 2: Fetch products
    console.log('Fetching products from Kajabi...')
    const productsResponse = await fetch('https://api.kajabi.com/v1/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text()
      console.error(`Failed to fetch products: ${productsResponse.status} - ${errorText}`)
      return new Response(
        JSON.stringify({ 
          error: `Failed to fetch products: ${productsResponse.status}`,
          details: errorText 
        }),
        { 
          status: productsResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const productsData = await productsResponse.json()
    const products: KajabiProduct[] = productsData.products || productsData.data || productsData || []
    console.log(`Found ${products.length} products`)

    // Step 3: Filter products with URLs and sync to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    const results = {
      total: products.length,
      withUrls: 0,
      synced: 0,
      updated: 0,
      errors: 0,
      skipped: 0,
    }

    for (const product of products) {
      // Check if product has a URL
      const productUrl = product.url || product.permalink
      if (!productUrl) {
        console.log(`Skipping product ${product.id} - no URL found`)
        results.skipped++
        continue
      }

      results.withUrls++

      try {
        // Try to fetch offerings for this product
        let offerings: KajabiOffering[] = []
        try {
          const offeringsResponse = await fetch(`https://api.kajabi.com/v1/products/${product.id}/offerings`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })

          if (offeringsResponse.ok) {
            const offeringsData = await offeringsResponse.json()
            offerings = offeringsData.offerings || offeringsData.data || offeringsData || []
          }
        } catch (error) {
          console.log(`Could not fetch offerings for product ${product.id}:`, error)
        }

        // Process each offering as a separate recorded session
        if (offerings.length > 0) {
          for (const offering of offerings) {
            const offeringUrl = offering.url || productUrl
            if (!offeringUrl) {
              results.skipped++
              continue
            }

            const { data: existing } = await supabaseClient
              .from('recorded_sessions')
              .select('id')
              .eq('kajabi_product_id', product.id)
              .eq('kajabi_offering_id', offering.id)
              .maybeSingle()

            const recordingData: any = {
              title: offering.name || product.name || 'Untitled Recording',
              description: offering.description || product.description || 'Watch this recording',
              instructor: 'Instructor',
              recorded_at: new Date().toISOString().split('T')[0],
              duration: 30,
              video_url: offeringUrl,
              thumbnail_url: product.hero_image_url || product.thumbnail_url || null,
              category: 'Wellness',
              views: 0,
              tags: [],
              kajabi_product_id: product.id,
              kajabi_offering_id: offering.id,
              synced_from_kajabi: true,
            }

            if (existing) {
              const { error } = await supabaseClient
                .from('recorded_sessions')
                .update(recordingData)
                .eq('id', existing.id)

              if (error) throw error
              results.updated++
            } else {
              const { error } = await supabaseClient
                .from('recorded_sessions')
                .insert(recordingData)

              if (error) throw error
              results.synced++
            }
          }
        } else {
          // No offerings, treat product itself as a recording
          const { data: existing } = await supabaseClient
            .from('recorded_sessions')
            .select('id')
            .eq('kajabi_product_id', product.id)
            .is('kajabi_offering_id', null)
            .maybeSingle()

          const recordingData: any = {
            title: product.name || 'Untitled Recording',
            description: product.description || 'Watch this recording',
            instructor: 'Instructor',
            recorded_at: new Date().toISOString().split('T')[0],
            duration: 30,
            video_url: productUrl,
            thumbnail_url: product.hero_image_url || product.thumbnail_url || null,
            category: 'Wellness',
            views: 0,
            tags: [],
            kajabi_product_id: product.id,
            kajabi_offering_id: null,
            synced_from_kajabi: true,
          }

          if (existing) {
            const { error } = await supabaseClient
              .from('recorded_sessions')
              .update(recordingData)
              .eq('id', existing.id)

            if (error) throw error
            results.updated++
          } else {
            const { error } = await supabaseClient
              .from('recorded_sessions')
              .insert(recordingData)

            if (error) throw error
            results.synced++
          }
        }
      } catch (error) {
        console.error(`Error syncing product ${product.id}:`, error)
        results.errors++
      }
    }

    console.log('Sync complete:', results)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Kajabi products synced successfully',
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in sync:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString() 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
