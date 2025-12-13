import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { calendarEmail } = await req.json().catch(() => ({ calendarEmail: 'emilybrowerlifecoach@gmail.com' }))
    
    // Google Calendar public iCal feed URL
    const encodedEmail = encodeURIComponent(calendarEmail || 'emilybrowerlifecoach@gmail.com')
    const icalUrl = `https://calendar.google.com/calendar/ical/${encodedEmail}/public/basic.ics`
    
    console.log('Fetching calendar from:', icalUrl)
    
    const response = await fetch(icalUrl)
    
    if (!response.ok) {
      console.error('Failed to fetch calendar:', response.status, response.statusText)
      return new Response(
        JSON.stringify({ 
          error: `Failed to fetch calendar: ${response.status} ${response.statusText}`,
          status: response.status 
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    const icalData = await response.text()
    
    return new Response(
      JSON.stringify({ 
        data: icalData,
        calendarEmail 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in fetch-google-calendar:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
