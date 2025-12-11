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
    const kajabiApiKey = Deno.env.get('KAJABI_API_KEY') ?? 'zThg3LJbBrPS9L7BtFpzBzgm'
    const kajabiApiSecret = Deno.env.get('KAJABI_API_SECRET') ?? 'PxVd7iZBQ2UPymvyJ4XLaL4A'
    const kajabiDomain = Deno.env.get('KAJABI_DOMAIN') ?? '' // User should set this

    // Step 1: Get OAuth access token from Kajabi
    console.log('Authenticating with Kajabi API...')
    const tokenResponse = await fetch('https://api.kajabi.com/v1/oauth/token', {
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

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      throw new Error(`Kajabi auth failed: ${tokenResponse.status} - ${errorText}`)
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

        // Filter for contacts with "mastermind" tag
        const mastermindContacts = allContacts.filter(contact => {
          const tags = contact.tags || []
          return tags.some((tag: string) => 
            tag.toLowerCase().includes('mastermind')
          )
        })

        console.log(`Found ${mastermindContacts.length} contacts with mastermind tag`)

        for (const contact of mastermindContacts) {
          try {
            if (!contact.email) {
              console.warn(`Contact ${contact.id} has no email, skipping`)
              continue
            }

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

