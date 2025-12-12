// Supabase Edge Function to insert "Plan Your Week" course and all 53 sessions
// No Kajabi API needed - just inserts directly into Supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PLAN_YOUR_WEEK_COURSE_ID = '00000000-0000-0000-0000-000000000001'

const SESSION_URLS = [
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766599/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766600/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766601/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766602/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766603/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766604/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766605/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766606/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766607/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766608/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766609/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766610/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766611/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766612/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766613/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766614/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766615/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766616/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766617/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766618/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766619/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766620/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766621/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766622/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766623/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766624/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766625/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766626/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766627/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766628/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766629/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766630/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766631/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766632/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766633/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766634/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766635/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766636/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766637/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766638/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766639/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766640/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766641/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766642/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766643/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766644/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766645/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766646/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766647/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766648/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766649/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766650/details',
  'https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766651/details',
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    console.log('Starting insertion of Plan Your Week course and sessions...')

    // Step 1: Ensure course_id column exists (run migration first if needed)
    // Step 2: Create or update the course
    const { data: course, error: courseError } = await supabaseClient
      .from('courses')
      .upsert({
        id: PLAN_YOUR_WEEK_COURSE_ID,
        title: 'Plan Your Week',
        description: 'Weekly planning sessions to help you organize and structure your week effectively. Join us every Sunday at 7:30 AM ET.',
        instructor: 'Birch & Stone Coaching',
        duration: '60 minutes per session',
        sessions: SESSION_URLS.length,
        category: 'Planning',
        level: 'beginner',
        tags: ['planning', 'productivity', 'weekly', 'organization'],
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    if (courseError) {
      console.error('Error creating course:', courseError)
      throw courseError
    }

    console.log('Course created/updated:', course.id)

    // Step 3: Insert all sessions
    const results = {
      course_created: true,
      total_sessions: SESSION_URLS.length,
      inserted: 0,
      updated: 0,
      errors: 0,
    }

    for (const sessionUrl of SESSION_URLS) {
      try {
        // Extract session ID from URL
        const urlParts = sessionUrl.split('/')
        const sessionId = urlParts[urlParts.length - 2] // Get the number before /details
        const sessionTitle = `Session ${sessionId}`

        // Check if session already exists
        const { data: existing } = await supabaseClient
          .from('recorded_sessions')
          .select('id')
          .eq('video_url', sessionUrl)
          .maybeSingle()

        const sessionData: any = {
          title: sessionTitle,
          description: 'Plan Your Week - Session Recording',
          instructor: 'Birch & Stone Coaching',
          recorded_at: new Date().toISOString().split('T')[0],
          duration: 60,
          video_url: sessionUrl,
          thumbnail_url: null,
          category: 'Planning',
          views: 0,
          tags: ['planning', 'weekly'],
          course_id: PLAN_YOUR_WEEK_COURSE_ID,
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
          results.inserted++
        }
      } catch (error) {
        console.error(`Error inserting session ${sessionUrl}:`, error)
        results.errors++
      }
    }

    console.log('Insertion complete:', results)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Plan Your Week course and sessions inserted successfully',
        course_id: PLAN_YOUR_WEEK_COURSE_ID,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
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
