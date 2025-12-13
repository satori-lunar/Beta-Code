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
    
    // Filter out today's classes
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day
    
    // Parse iCal data and filter out events from today
    const lines = icalData.split('\n')
    const filteredLines: string[] = []
    let inEvent = false
    let eventStartDate: Date | null = null
    let eventLines: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.startsWith('BEGIN:VEVENT')) {
        inEvent = true
        eventLines = [line]
        eventStartDate = null
        continue
      }
      
      if (inEvent) {
        eventLines.push(line)
        
        // Check for DTSTART line to get event date
        if (line.startsWith('DTSTART')) {
          const dateMatch = line.match(/DTSTART[^:]*:(.+)/)
          if (dateMatch) {
            const dateStr = dateMatch[1].replace(/[TZ]/g, '').substring(0, 8) // Get YYYYMMDD format
            if (dateStr.length >= 8) {
              const year = parseInt(dateStr.substring(0, 4))
              const month = parseInt(dateStr.substring(4, 6)) - 1 // Month is 0-indexed
              const day = parseInt(dateStr.substring(6, 8))
              eventStartDate = new Date(year, month, day)
            }
          }
        }
        
        if (line.startsWith('END:VEVENT')) {
          // Check if event is today
          if (eventStartDate) {
            const eventDate = new Date(eventStartDate)
            eventDate.setHours(0, 0, 0, 0)
            
            // Only include event if it's not today
            if (eventDate.getTime() !== today.getTime()) {
              filteredLines.push(...eventLines)
            }
          } else {
            // If we couldn't parse the date, include the event to be safe
            filteredLines.push(...eventLines)
          }
          
          inEvent = false
          eventLines = []
          eventStartDate = null
          continue
        }
      } else {
        // Not in an event, just copy the line
        filteredLines.push(line)
      }
    }
    
    const filteredIcalData = filteredLines.join('\n')
    
    return new Response(
      JSON.stringify({ 
        data: filteredIcalData,
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
