// Supabase Edge Function to sync Kajabi recorded sessions
// Can work with session URLs or fetch from API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SessionData {
  url: string
  title?: string
  description?: string
  recorded_at?: string
  duration?: number
  thumbnail_url?: string
  category?: string
  tags?: string[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    const payload = await req.json()
    console.log('Received payload:', JSON.stringify(payload, null, 2))

    // Option 1: If session URLs are provided directly
    if (payload.session_urls && Array.isArray(payload.session_urls)) {
      const results = {
        total: payload.session_urls.length,
        synced: 0,
        updated: 0,
        errors: 0,
      }

      for (const sessionUrl of payload.session_urls) {
        try {
          // Extract session ID or identifier from URL
          // Format: https://www.birchandstonecoaching.com/coaching/groups/.../sessions/...
          const urlParts = sessionUrl.split('/')
          const sessionIdentifier = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]

          // Check if session already exists
          const { data: existing } = await supabaseClient
            .from('recorded_sessions')
            .select('id')
            .eq('video_url', sessionUrl)
            .maybeSingle()

          const sessionData: any = {
            title: payload.title || `Session ${sessionIdentifier}`,
            description: payload.description || 'Recorded session',
            instructor: payload.instructor || 'Instructor',
            recorded_at: payload.recorded_at || new Date().toISOString().split('T')[0],
            duration: payload.duration || 60,
            video_url: sessionUrl,
            thumbnail_url: payload.thumbnail_url || null,
            category: payload.category || 'Wellness',
            views: 0,
            tags: payload.tags || [],
            synced_from_kajabi: true,
          }

          if (existing) {
            const { error } = await supabaseClient
              .from('recorded_sessions')
              .update(sessionData)
              .eq('id', existing.id)

            if (error) throw error
            results.updated++
          } else {
            const { error } = await supabaseClient
              .from('recorded_sessions')
              .insert(sessionData)

            if (error) throw error
            results.synced++
          }
        } catch (error) {
          console.error(`Error syncing session ${sessionUrl}:`, error)
          results.errors++
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Sessions synced successfully',
          results,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Option 2: If individual session data is provided
    if (payload.sessions && Array.isArray(payload.sessions)) {
      const results = {
        total: payload.sessions.length,
        synced: 0,
        updated: 0,
        errors: 0,
      }

      for (const session of payload.sessions) {
        try {
          if (!session.url && !session.video_url) {
            console.log('Skipping session - no URL provided')
            continue
          }

          const videoUrl = session.url || session.video_url
          const { data: existing } = await supabaseClient
            .from('recorded_sessions')
            .select('id')
            .eq('video_url', videoUrl)
            .maybeSingle()

          const sessionData: any = {
            title: session.title || 'Untitled Session',
            description: session.description || 'Recorded session',
            instructor: session.instructor || 'Instructor',
            recorded_at: session.recorded_at || session.recorded_date || new Date().toISOString().split('T')[0],
            duration: session.duration || 60,
            video_url: videoUrl,
            thumbnail_url: session.thumbnail_url || session.image_url || null,
            category: session.category || 'Wellness',
            views: session.views || 0,
            tags: session.tags || [],
            synced_from_kajabi: true,
          }

          if (existing) {
            const { error } = await supabaseClient
              .from('recorded_sessions')
              .update(sessionData)
              .eq('id', existing.id)

            if (error) throw error
            results.updated++
          } else {
            const { error } = await supabaseClient
              .from('recorded_sessions')
              .insert(sessionData)

            if (error) throw error
            results.synced++
          }
        } catch (error) {
          console.error(`Error syncing session:`, error)
          results.errors++
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Sessions synced successfully',
          results,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Option 3: If group URL is provided, try to extract sessions (requires API access)
    if (payload.group_url) {
      // This would require API access to fetch sessions from a group
      // For now, return instructions
      return new Response(
        JSON.stringify({
          error: 'Group URL extraction requires API access. Please provide session_urls or sessions array instead.',
          instructions: {
            method1: 'Provide an array of session URLs in session_urls field',
            method2: 'Provide an array of session objects with url, title, etc. in sessions field',
            example: {
              session_urls: [
                'https://www.birchandstonecoaching.com/coaching/groups/.../sessions/session-1',
                'https://www.birchandstonecoaching.com/coaching/groups/.../sessions/session-2',
              ],
            },
          },
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        error: 'Invalid payload. Provide either session_urls array or sessions array.',
        example: {
          session_urls: ['https://...', 'https://...'],
          // OR
          sessions: [
            { url: 'https://...', title: 'Session 1', description: '...' },
            { url: 'https://...', title: 'Session 2', description: '...' },
          ],
        },
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
