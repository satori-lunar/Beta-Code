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
        // Handle DTSTART with parameters (e.g., DTSTART;TZID=America/New_York:20240115T190000)
        // Split by colon and get the last part (the actual date string)
        const colonIndex = line.lastIndexOf(':');
        const dateStr = colonIndex >= 0 ? line.substring(colonIndex + 1) : line.split(':')[1];
        // Handle both DATE and DATE-TIME formats
        if (line.includes(';VALUE=DATE') || line.includes('VALUE=DATE')) {
          // All-day event: YYYYMMDD
          currentEvent.start = parseICalDate(dateStr, true);
          currentEvent.allDay = true;
        } else {
          // Date-time event: YYYYMMDDTHHMMSS[Z]
          currentEvent.start = parseICalDate(dateStr);
          currentEvent.allDay = false;
        }
      } else if (line.startsWith('DTEND')) {
        // Handle DTEND with parameters
        const colonIndex = line.lastIndexOf(':');
        const dateStr = colonIndex >= 0 ? line.substring(colonIndex + 1) : line.split(':')[1];
        if (line.includes(';VALUE=DATE') || line.includes('VALUE=DATE')) {
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
  if (!dateStr || dateStr.length < 8) {
    console.warn('Invalid date string:', dateStr);
    return new Date();
  }
  
  if (isDate) {
    // YYYYMMDD format (all-day events) - use local timezone
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    return new Date(year, month, day);
  } else {
    // YYYYMMDDTHHMMSS[Z] format
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    
    // Check if it has time component
    if (dateStr.length >= 15 && dateStr[8] === 'T') {
      const hour = parseInt(dateStr.substring(9, 11), 10) || 0;
      const minute = parseInt(dateStr.substring(11, 13), 10) || 0;
      const second = parseInt(dateStr.substring(13, 15), 10) || 0;
      
      // If it ends with Z, it's UTC, otherwise assume local time
      if (dateStr.endsWith('Z')) {
        return new Date(Date.UTC(year, month, day, hour, minute, second));
      } else {
        // Local timezone
        return new Date(year, month, day, hour, minute, second);
      }
    } else {
      // Just date, no time
      return new Date(year, month, day);
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
        
        // Direct fetch from Google Calendar iCal feed
        const encodedEmail = encodeURIComponent(calendarEmail);
        const icalUrl = `https://calendar.google.com/calendar/ical/${encodedEmail}/public/basic.ics`;
        
        console.log('Fetching Google Calendar from:', icalUrl);
        const response = await fetch(icalUrl);
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.error('Calendar fetch failed:', response.status, response.statusText, errorText);
          throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}. Make sure the calendar is set to "Public" in Google Calendar sharing settings.`);
        }
        
        const icalData = await response.text();
        console.log('iCal data fetched, length:', icalData.length);
        console.log('iCal data preview (first 1000 chars):', icalData.substring(0, 1000));
        
        const parsedEvents = parseICal(icalData);
        console.log('Total parsed events:', parsedEvents.length);
        parsedEvents.forEach((event, idx) => {
          console.log(`Event ${idx + 1}: "${event.title}" - Start: ${event.start}, End: ${event.end}, AllDay: ${event.allDay}`);
        });
        
        // Get today's date range (start and end of today) in local timezone
        const now = new Date();
        const today = startOfDay(now);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        console.log('=== FILTERING FOR TODAY ===');
        console.log('Current time:', now.toISOString(), now.toString());
        console.log('Today start:', today.toISOString(), today.toString());
        console.log('Tomorrow start:', tomorrow.toISOString(), tomorrow.toString());
        console.log('Total parsed events:', parsedEvents.length);
        
        // Keep ALL upcoming events (not just today) for the calendar view
        const currentTime = new Date();
        const allUpcomingEvents = parsedEvents
          .filter(event => {
            // Include events that are today or in the future
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end || event.start);
            
            // Include if event hasn't ended yet, or if it's today
            const eventStartDay = startOfDay(eventStart);
            const today = startOfDay(currentTime);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const isToday = eventStartDay.getTime() >= today.getTime() && eventStartDay.getTime() < tomorrow.getTime();
            const isUpcoming = eventEnd.getTime() > currentTime.getTime();
            
            return isToday || isUpcoming;
          })
          .sort((a, b) => a.start.getTime() - b.start.getTime());
        
        console.log(`=== ALL UPCOMING EVENTS COUNT: ${allUpcomingEvents.length} ===`);
        allUpcomingEvents.forEach((event, idx) => {
          console.log(`${idx + 1}. "${event.title}" at ${event.start.toString()}`);
        });
        
        setEvents(allUpcomingEvents);
      } catch (err) {
        console.error('Error fetching Google Calendar:', err);
        setError(err as Error);
        // Set empty array on error so UI shows "no classes" instead of crashing
        setEvents([]);
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

  // Get today's events only
  const getTodaysEvents = (): GoogleCalendarEvent[] => {
    return getEventsForDate(new Date());
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
    getTodaysEvents,
  };
}
