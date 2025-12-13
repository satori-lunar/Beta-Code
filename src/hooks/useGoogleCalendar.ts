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
        
        // Filter for ALL events that occur today (regardless of time)
        const todaysEvents = parsedEvents.filter(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end || event.start);
          const eventStartDay = startOfDay(eventStart);
          const eventEndDay = startOfDay(eventEnd);
          
          // Check if event starts today
          const startsToday = eventStartDay.getTime() >= today.getTime() && eventStartDay.getTime() < tomorrow.getTime();
          
          // Check if event ends today
          const endsToday = eventEndDay.getTime() >= today.getTime() && eventEndDay.getTime() < tomorrow.getTime();
          
          // Check if event spans today (multi-day event)
          const spansToday = eventStart.getTime() < tomorrow.getTime() && eventEnd.getTime() > today.getTime();
          
          const isToday = startsToday || endsToday || spansToday;
          
          console.log(`Event: "${event.title}"`);
          console.log(`  Start: ${eventStart.toISOString()} (${eventStart.toString()})`);
          console.log(`  End: ${eventEnd.toISOString()} (${eventEnd.toString()})`);
          console.log(`  Start day: ${eventStartDay.toISOString()}`);
          console.log(`  Starts today: ${startsToday}, Ends today: ${endsToday}, Spans today: ${spansToday}`);
          console.log(`  Result: ${isToday ? '✓ INCLUDED' : '✗ EXCLUDED'}`);
          
          return isToday;
        });
        
        // Sort by start time
        todaysEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
        
        console.log(`=== TODAY'S EVENTS COUNT: ${todaysEvents.length} ===`);
        todaysEvents.forEach((event, idx) => {
          console.log(`${idx + 1}. "${event.title}" at ${event.start.toString()}`);
        });
        
        setEvents(todaysEvents);
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

  // Get today's events (already filtered in useEffect, just return all events)
  const getTodaysEvents = (): GoogleCalendarEvent[] => {
    return events; // Events are already filtered to today's events
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
