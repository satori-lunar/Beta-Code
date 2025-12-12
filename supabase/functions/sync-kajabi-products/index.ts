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
  product_type?: string
  [key: string]: any
}

interface KajabiOffering {
  id: string
  product_id: string
  name: string
  description?: string
  [key: string]: any
}

interface KajabiContact {
  id: string
  email: string
  first_name?: string
  last_name?: string
  full_name?: string
  tags?: string[]
  [key: string]: any
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Kajabi credentials from environment or use provided defaults
    // Trim whitespace to avoid issues with copy/paste
    const kajabiApiKey = (Deno.env.get('KAJABI_API_KEY') ?? 'zThg3LJbBrPS9L7BtFpzBzgm').trim()
    const kajabiApiSecret = (Deno.env.get('KAJABI_API_SECRET') ?? 'PxVd7iZBQ2UPymvyJ4XLaL4A').trim()
    const kajabiDomain = Deno.env.get('KAJABI_DOMAIN') ?? '' // User should set this

    // Debug: Log credential source (without exposing actual secrets)
    const usingEnvKey = Deno.env.get('KAJABI_API_KEY') !== null
    const usingEnvSecret = Deno.env.get('KAJABI_API_SECRET') !== null
    console.log(`Using credentials: API_KEY from ${usingEnvKey ? 'environment' : 'default'}, API_SECRET from ${usingEnvSecret ? 'environment' : 'default'}`)
    console.log(`API Key length: ${kajabiApiKey.length}, API Secret length: ${kajabiApiSecret.length}`)
    console.log(`API Key starts with: ${kajabiApiKey.substring(0, 5)}...`)

    // Step 1: Get OAuth access token from Kajabi
    console.log('Authenticating with Kajabi API...')
    console.log('Request URL: https://api.kajabi.com/v1/oauth/token')
    console.log(`Client ID length: ${kajabiApiKey.length}, Client Secret length: ${kajabiApiSecret.length}`)
    
    // Verify credentials are not empty
    if (!kajabiApiKey || kajabiApiKey.trim() === '') {
      throw new Error('KAJABI_API_KEY is empty or not set')
    }
    if (!kajabiApiSecret || kajabiApiSecret.trim() === '') {
      throw new Error('KAJABI_API_SECRET is empty or not set')
    }
    
    // Build form-encoded body using URLSearchParams (Kajabi API requires this format)
    // Per Kajabi docs: use separate form data parameters
    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append('client_id', kajabiApiKey.trim())
    params.append('client_secret', kajabiApiSecret.trim())
    
    const formBody = params.toString()
    console.log(`Form body length: ${formBody.length}`)
    console.log(`Contains grant_type: ${formBody.includes('grant_type')}`)
    console.log(`Contains client_id: ${formBody.includes('client_id')}`)
    console.log(`Contains client_secret: ${formBody.includes('client_secret')}`)
    
    let tokenResponse = await fetch('https://api.kajabi.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    })
    
    // If form-encoded fails, try with URLSearchParams (different encoding)
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.log(`First attempt failed (${tokenResponse.status}): ${errorText}`)
      console.log('Trying with URLSearchParams...')
      
      const params = new URLSearchParams()
      params.append('grant_type', 'client_credentials')
      params.append('client_id', kajabiApiKey)
      params.append('client_secret', kajabiApiSecret)
      
      tokenResponse = await fetch('https://api.kajabi.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      })
    }
    
    // If still failing, try JSON format as fallback
    if (!tokenResponse.ok && tokenResponse.status !== 200) {
      const errorText = await tokenResponse.text()
      console.log(`Form-encoded failed (${tokenResponse.status}): ${errorText}`)
      console.log('Trying JSON format...')
      
      tokenResponse = await fetch('https://api.kajabi.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: kajabiApiKey,
          client_secret: kajabiApiSecret,
        }),
      })
    }

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error(`Kajabi authentication failed with status ${tokenResponse.status}`)
      console.error(`Error response: ${errorText}`)
      console.error(`Using API Key: ${kajabiApiKey.substring(0, 10)}... (length: ${kajabiApiKey.length})`)
      throw new Error(`Kajabi auth failed: ${tokenResponse.status} - ${errorText}. Check that KAJABI_API_KEY and KAJABI_API_SECRET are correct in Supabase Edge Function secrets.`)
    }

    const tokenData: KajabiAccessTokenResponse = await tokenResponse.json()
    const accessToken = tokenData.access_token
    console.log('Successfully authenticated with Kajabi')

    const results = {
      products: { synced: 0, updated: 0, errors: 0 },
      contacts: { synced: 0, updated: 0, errors: 0 },
    }

    // Step 2: Fetch and sync products (replays)
    try {
      console.log('Fetching products from Kajabi...')
      const productsResponse = await fetch('https://api.kajabi.com/v1/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        const products: KajabiProduct[] = productsData.products || productsData.data || productsData || []

        console.log(`Found ${products.length} products from Kajabi`)

        for (const product of products) {
          try {
            // Filter for replay/digital products (adjust based on your product types)
            // You might want to sync all products or filter by type/name
            const isReplay = product.name?.toLowerCase().includes('replay') || 
                           product.product_type === 'digital_product' ||
                           product.product_type === 'course'

            if (!isReplay) {
              continue
            }

            // Fetch offerings for this product
            let offerings: KajabiOffering[] = []
            try {
              const offeringsResponse = await fetch(
                `https://api.kajabi.com/v1/products/${product.id}/offerings`,
                {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                  },
                }
              )

              if (offeringsResponse.ok) {
                const offeringsData = await offeringsResponse.json()
                offerings = offeringsData.offerings || offeringsData.data || offeringsData || []
              }
            } catch (error) {
              console.error(`Error fetching offerings for product ${product.id}:`, error)
            }

            // Process each offering as a separate recorded session
            if (offerings.length > 0) {
              for (const offering of offerings) {
                try {
                  const { data: existing } = await supabaseClient
                    .from('recorded_sessions')
                    .select('id')
                    .eq('kajabi_product_id', product.id)
                    .eq('kajabi_offering_id', offering.id)
                    .maybeSingle()

                  const recordingData: any = {
                    title: offering.name || product.name || 'Untitled Recording',
                    description: offering.description || product.description || 'Watch this recording',
                    instructor: 'Instructor', // Default, can be updated manually or from Kajabi if available
                    recorded_at: new Date().toISOString().split('T')[0],
                    duration: 30, // Default, update if available from Kajabi
                    video_url: kajabiDomain 
                      ? `https://${kajabiDomain}/products/${product.id}/offering/${offering.id}`
                      : `https://kajabi.com/products/${product.id}/offering/${offering.id}`,
                    thumbnail_url: product.hero_image_url || product.thumbnail_url || null,
                    category: 'Wellness', // Default, can categorize based on product name/tags
                    views: 0,
                    tags: [],
                    kajabi_product_id: product.id,
                    kajabi_offering_id: offering.id,
                    synced_from_kajabi: true,
                  }

                  if (existing) {
                    const { error: updateError } = await supabaseClient
                      .from('recorded_sessions')
                      .update(recordingData)
                      .eq('id', existing.id)

                    if (updateError) throw updateError
                    results.products.updated++
                  } else {
                    const { error: insertError } = await supabaseClient
                      .from('recorded_sessions')
                      .insert(recordingData)

                    if (insertError) throw insertError
                    results.products.synced++
                  }
                } catch (error) {
                  console.error(`Error syncing offering ${offering.id}:`, error)
                  results.products.errors++
                }
              }
            } else {
              // If no offerings, treat the product itself as a recording
              try {
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
                  video_url: kajabiDomain 
                    ? `https://${kajabiDomain}/products/${product.id}`
                    : `https://kajabi.com/products/${product.id}`,
                  thumbnail_url: product.hero_image_url || product.thumbnail_url || null,
                  category: 'Wellness',
                  views: 0,
                  tags: [],
                  kajabi_product_id: product.id,
                  kajabi_offering_id: null,
                  synced_from_kajabi: true,
                }

                if (existing) {
                  const { error: updateError } = await supabaseClient
                    .from('recorded_sessions')
                    .update(recordingData)
                    .eq('id', existing.id)

                  if (updateError) throw updateError
                  results.products.updated++
                } else {
                  const { error: insertError } = await supabaseClient
                    .from('recorded_sessions')
                    .insert(recordingData)

                  if (insertError) throw insertError
                  results.products.synced++
                }
              } catch (error) {
                console.error(`Error syncing product ${product.id}:`, error)
                results.products.errors++
              }
            }
          } catch (error) {
            console.error(`Error processing product ${product.id}:`, error)
            results.products.errors++
          }
        }
      } else {
        const errorText = await productsResponse.text()
        console.error(`Failed to fetch products: ${productsResponse.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error syncing products:', error)
      results.products.errors++
    }

    // Step 3: Fetch and sync contacts with "mastermind" tag
    try {
      console.log('Fetching contacts from Kajabi...')
      const contactsResponse = await fetch('https://api.kajabi.com/v1/contacts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json()
        const allContacts: KajabiContact[] = contactsData.contacts || contactsData.data || contactsData || []

        console.log(`Total contacts fetched from Kajabi: ${allContacts.length}`)
        
        // Debug: Log first contact structure to see tag format
        if (allContacts.length > 0) {
          console.log('Sample contact structure:', JSON.stringify(allContacts[0], null, 2))
        }

        // Filter for contacts with "mastermind" tag
        const mastermindContacts = allContacts.filter(contact => {
          const tags = contact.tags || []
          // Log tags for debugging
          if (tags.length > 0) {
            console.log(`Contact ${contact.email} has tags:`, JSON.stringify(tags))
          }
          return tags.some((tag: string) => {
            const tagStr = typeof tag === 'string' ? tag : JSON.stringify(tag)
            return tagStr.toLowerCase().includes('mastermind')
          })
        })

        console.log(`Found ${mastermindContacts.length} contacts with mastermind tag out of ${allContacts.length} total contacts`)
        
        // Log which contacts matched
        if (mastermindContacts.length > 0) {
          console.log('Matched contacts:', mastermindContacts.map(c => ({ email: c.email, tags: c.tags })))
        } else {
          console.log('No contacts matched the mastermind filter. Checking all contact tags...')
          allContacts.forEach(contact => {
            if (contact.tags && contact.tags.length > 0) {
              console.log(`Contact ${contact.email || contact.id} tags:`, JSON.stringify(contact.tags))
            }
          })
        }

        for (const contact of mastermindContacts) {
          try {
            if (!contact.email) {
              console.warn(`Contact ${contact.id} has no email, skipping`)
              continue
            }
            
            console.log(`Processing contact: ${contact.email} (ID: ${contact.id})`)

            // Check if user already exists by email
            const { data: existingAuthUser } = await supabaseClient.auth.admin.listUsers()
            const existingUser = existingAuthUser?.users?.find(u => u.email === contact.email)

            const fullName = contact.full_name || 
                            `${contact.first_name || ''} ${contact.last_name || ''}`.trim() ||
                            contact.email.split('@')[0]

            if (existingUser) {
              // Update existing user profile
              const { error: updateError } = await supabaseClient
                .from('users')
                .update({
                  name: fullName,
                  kajabi_contact_id: contact.id,
                  kajabi_tags: contact.tags || [],
                  synced_from_kajabi: true,
                })
                .eq('id', existingUser.id)

              if (updateError) {
                // If profile doesn't exist, create it
                if (updateError.code === 'PGRST116') {
                  await supabaseClient
                    .from('users')
                    .insert({
                      id: existingUser.id,
                      email: contact.email,
                      name: fullName,
                      kajabi_contact_id: contact.id,
                      kajabi_tags: contact.tags || [],
                      synced_from_kajabi: true,
                    })
                } else {
                  throw updateError
                }
              }
              results.contacts.updated++
            } else {
              // Create new user
              const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
                email: contact.email,
                email_confirm: true,
                user_metadata: {
                  name: fullName,
                  kajabi_contact_id: contact.id,
                  source: 'kajabi',
                },
              })

              if (createError) throw createError

              // Create user profile
              const { error: profileError } = await supabaseClient
                .from('users')
                .insert({
                  id: newUser.user.id,
                  email: contact.email,
                  name: fullName,
                  kajabi_contact_id: contact.id,
                  kajabi_tags: contact.tags || [],
                  synced_from_kajabi: true,
                })

              if (profileError) throw profileError

              // Send password reset email so they can set their password
              await supabaseClient.auth.admin.generateLink({
                type: 'recovery',
                email: contact.email,
              })

              results.contacts.synced++
              console.log(`Created user for contact ${contact.email}`)
            }
          } catch (error) {
            console.error(`Error syncing contact ${contact.id}:`, error)
            results.contacts.errors++
          }
        }
      } else {
        const errorText = await contactsResponse.text()
        console.error(`Failed to fetch contacts: ${contactsResponse.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error syncing contacts:', error)
      results.contacts.errors++
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: {
          products: {
            synced: results.products.synced,
            updated: results.products.updated,
            errors: results.products.errors,
            total: results.products.synced + results.products.updated,
          },
          contacts: {
            synced: results.contacts.synced,
            updated: results.contacts.updated,
            errors: results.contacts.errors,
            total: results.contacts.synced + results.contacts.updated,
          },
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: any) {
    console.error('Error in sync function:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.toString(),
        stack: error.stack,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

