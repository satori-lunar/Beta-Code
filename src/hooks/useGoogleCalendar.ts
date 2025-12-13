import { useState, useEffect } from 'react';
import { isAfter, startOfDay } from 'date-fns';

export interface GoogleCalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

// Parse iCal format - simplified parser for Google Calendar
function parseICal(icalData: string): GoogleCalendarEvent[] {
  const events: GoogleCalendarEvent[] = [];
  const lines = icalData.split(/\r?\n/);
  
  let currentEvent: Partial<GoogleCalendarEvent> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle continuation lines (lines starting with space)
    if (line.startsWith(' ') && currentEvent) {
      // This is a continuation of the previous line
      continue;
    }
    
    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {};
    } else if (line.startsWith('END:VEVENT') && currentEvent) {
      if (currentEvent.start && currentEvent.title) {
        events.push({
          id: currentEvent.id || `event-${events.length}`,
          title: currentEvent.title,
          description: currentEvent.description,
          start: currentEvent.start,
          end: currentEvent.end || currentEvent.start,
          allDay: currentEvent.allDay || false,
        });
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith('DTSTART')) {
        const dateStr = line.split(':')[1];
        // Handle both DATE and DATE-TIME formats
        if (line.includes(';VALUE=DATE')) {
          // All-day event: YYYYMMDD
          currentEvent.start = parseICalDate(dateStr, true);
          currentEvent.allDay = true;
        } else {
          // Date-time event: YYYYMMDDTHHMMSS[Z]
          currentEvent.start = parseICalDate(dateStr);
          currentEvent.allDay = false;
        }
      } else if (line.startsWith('DTEND')) {
        const dateStr = line.split(':')[1];
        if (line.includes(';VALUE=DATE')) {
          currentEvent.end = parseICalDate(dateStr, true);
        } else {
          currentEvent.end = parseICalDate(dateStr);
        }
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.title = line.substring(8).trim();
        // Unescape text
        currentEvent.title = currentEvent.title
          .replace(/\\n/g, '\n')
          .replace(/\\,/g, ',')
          .replace(/\\;/g, ';')
          .replace(/\\\\/g, '\\');
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring(12).trim();
        currentEvent.description = currentEvent.description
          .replace(/\\n/g, '\n')
          .replace(/\\,/g, ',')
          .replace(/\\;/g, ';')
          .replace(/\\\\/g, '\\');
      } else if (line.startsWith('UID:')) {
        currentEvent.id = line.substring(4).trim();
      }
    }
  }
  
  return events;
}

// Parse iCal date format: YYYYMMDDTHHMMSS[Z] or YYYYMMDD
function parseICalDate(dateStr: string, isDate = false): Date {
  if (isDate) {
    // YYYYMMDD format
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(Date.UTC(year, month, day));
  } else {
    // YYYYMMDDTHHMMSS[Z] format
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const hour = dateStr.length > 9 ? parseInt(dateStr.substring(9, 11)) : 0;
    const minute = dateStr.length > 11 ? parseInt(dateStr.substring(11, 13)) : 0;
    const second = dateStr.length > 13 ? parseInt(dateStr.substring(13, 15)) : 0;
    
    // If it ends with Z, it's UTC, otherwise assume local time
    if (dateStr.endsWith('Z')) {
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    } else {
      return new Date(year, month, day, hour, minute, second);
    }
  }
}

export function useGoogleCalendar(calendarEmail: string = 'emilybrowerlifecoach@gmail.com') {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCalendar() {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch via Supabase Edge Function first (avoids CORS)
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        let icalData: string | null = null;
        
        if (supabaseUrl) {
          try {
            console.log('Attempting to fetch via Supabase Edge Function...');
            const functionUrl = `${supabaseUrl}/functions/v1/fetch-google-calendar`;
            const functionResponse = await fetch(functionUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ calendarEmail }),
            });
            
            if (functionResponse.ok) {
              const result = await functionResponse.json();
              icalData = result.data;
              console.log('Fetched via Edge Function, iCal length:', icalData?.length);
            } else {
              console.log('Edge Function failed, trying direct fetch...');
            }
          } catch (edgeFunctionError) {
            console.log('Edge Function error, trying direct fetch:', edgeFunctionError);
          }
        }
        
        // Fallback to direct fetch if Edge Function doesn't work
        if (!icalData) {
          const encodedEmail = encodeURIComponent(calendarEmail);
          const icalUrl = `https://calendar.google.com/calendar/ical/${encodedEmail}/public/basic.ics`;
          
          console.log('Fetching Google Calendar directly from:', icalUrl);
          const response = await fetch(icalUrl);
          
          if (!response.ok) {
            console.error('Calendar fetch failed:', response.status, response.statusText);
            throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}. Make sure the calendar is set to "Public" in Google Calendar sharing settings.`);
          }
          
          icalData = await response.text();
          console.log('Fetched directly, iCal length:', icalData.length);
        }
        
        console.log('iCal data preview:', icalData.substring(0, 500));
        
        const parsedEvents = parseICal(icalData);
        console.log('Parsed events count:', parsedEvents.length);
        console.log('Parsed events:', parsedEvents);
        
        // Filter out past events and sort by start time
        const now = new Date();
        console.log('Current time:', now);
        const upcomingEvents = parsedEvents
          .filter(event => {
            const isUpcoming = isAfter(event.start, now) || isAfter(event.end, now);
            console.log(`Event "${event.title}" at ${event.start}: ${isUpcoming ? 'upcoming' : 'past'}`);
            return isUpcoming;
          })
          .sort((a, b) => a.start.getTime() - b.start.getTime());
        
        console.log('Upcoming events count:', upcomingEvents.length);
        setEvents(upcomingEvents);
      } catch (err) {
        console.error('Error fetching Google Calendar:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchCalendar();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchCalendar, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [calendarEmail]);

  // Get events for a specific date
  const getEventsForDate = (date: Date): GoogleCalendarEvent[] => {
    const dateStart = startOfDay(date);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);
    
    return events.filter(event => {
      const eventStart = startOfDay(event.start);
      return eventStart >= dateStart && eventStart < dateEnd;
    });
  };

  // Get upcoming events (next N events)
  const getUpcomingEvents = (limit: number = 10): GoogleCalendarEvent[] => {
    const now = new Date();
    return events
      .filter(event => isAfter(event.start, now) || isAfter(event.end, now))
      .slice(0, limit);
  };

  return {
    events,
    loading,
    error,
    getEventsForDate,
    getUpcomingEvents,
  };
}
