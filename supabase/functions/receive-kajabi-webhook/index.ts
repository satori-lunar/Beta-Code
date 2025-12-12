// Supabase Edge Function to receive Kajabi product data from Zapier
// This allows you to sync Kajabi products using Zapier as a bridge

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KajabiProduct {
  id: string
  name: string
  description?: string
  hero_image_url?: string
  thumbnail_url?: string
  product_type?: string
  url?: string
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
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Parse the incoming webhook data from Zapier
    const payload = await req.json()
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2))

    // Extract product data (Zapier might send it in different formats)
    let product: KajabiProduct | null = null
    let offering: KajabiOffering | null = null

    // Handle different payload formats from Zapier
    if (payload.product) {
      product = payload.product
    } else if (payload.data && payload.data.product) {
      product = payload.data.product
    } else if (payload.id) {
      // If the payload itself is a product
      product = payload as KajabiProduct
    }

    if (payload.offering) {
      offering = payload.offering
    } else if (payload.data && payload.data.offering) {
      offering = payload.data.offering
    }

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'No product data found in payload' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Only sync products that have a URL (as requested)
    const productUrl = product.url || offering?.url
    if (!productUrl) {
      console.log(`Skipping product ${product.id} - no URL found`)
      return new Response(
        JSON.stringify({ 
          message: 'Product skipped - no URL found',
          product_id: product.id 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Determine the video URL
    let videoUrl = productUrl
    if (offering && offering.url) {
      videoUrl = offering.url
    } else if (offering && offering.id) {
      // Construct URL from offering ID
      videoUrl = `https://kajabi.com/products/${product.id}/offering/${offering.id}`
    } else if (product.id) {
      videoUrl = `https://kajabi.com/products/${product.id}`
    }

    // Check if this product/offering already exists
    const { data: existing } = await supabaseClient
      .from('recorded_sessions')
      .select('id')
      .eq('kajabi_product_id', product.id)
      .eq('kajabi_offering_id', offering?.id || null)
      .maybeSingle()

    const recordingData: any = {
      title: offering?.name || product.name || 'Untitled Recording',
      description: offering?.description || product.description || 'Watch this recording',
      instructor: 'Instructor', // Default, can be updated manually
      recorded_at: new Date().toISOString().split('T')[0],
      duration: 30, // Default, update if available
      video_url: videoUrl,
      thumbnail_url: product.hero_image_url || product.thumbnail_url || null,
      category: 'Wellness', // Default, can categorize based on product data
      views: 0,
      tags: [],
      kajabi_product_id: product.id,
      kajabi_offering_id: offering?.id || null,
      synced_from_kajabi: true,
    }

    let result
    if (existing) {
      // Update existing record
      const { data, error } = await supabaseClient
        .from('recorded_sessions')
        .update(recordingData)
        .eq('id', existing.id)
        .select()

      if (error) throw error
      result = { action: 'updated', data }
    } else {
      // Insert new record
      const { data, error } = await supabaseClient
        .from('recorded_sessions')
        .insert(recordingData)
        .select()

      if (error) throw error
      result = { action: 'created', data }
    }

    console.log(`Successfully ${result.action} recorded session for product ${product.id}`)

    return new Response(
      JSON.stringify({
        success: true,
        action: result.action,
        product_id: product.id,
        offering_id: offering?.id || null,
        recorded_session_id: result.data[0]?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing webhook:', error)
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
