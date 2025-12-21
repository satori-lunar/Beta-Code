import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  X,
  Video,
  Target,
  Bell,
  Flag,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { toZonedTime, format as formatTz } from 'date-fns-tz';
import { useUserClassReminders } from '../hooks/useSupabaseData';

const eventTypes = [
  { id: 'class', name: 'Class', icon: Video, color: '#ef4444' }, // Red - darker for contrast
  { id: 'habit', name: 'Habit', icon: Target, color: '#10b981' }, // Green - darker for contrast
  { id: 'reminder', name: 'Reminder', icon: Bell, color: '#3b82f6' }, // Blue - darker for contrast
  { id: 'goal', name: 'Goal', icon: Flag, color: '#8b5cf6' }, // Purple - darker for contrast
];

// Helper function to determine if a color is light (returns true) or dark (returns false)
function isLightColor(hex: string): boolean {
  // Remove # if present
  const color = hex.replace('#', '');
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

// Common timezones
const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona Time (MST)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
];

// Calendar event interface
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:MM format
  type: 'class' | 'habit' | 'reminder' | 'goal';
  color: string;
  description?: string;
  isRepeating?: boolean; // For weekly repeating classes
  originalDate?: string; // Original scheduled_at for repeating events
}

// Simple Month Calendar Component
function MonthCalendar({ 
  currentMonth, 
  events, 
  onDateClick,
  timezone
}: { 
  currentMonth: Date; 
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  timezone: string;
}) {
  // Convert current month to the selected timezone
  const zonedCurrentMonth = toZonedTime(currentMonth, timezone);
  const monthStart = startOfMonth(zonedCurrentMonth);
  const monthEnd = endOfMonth(zonedCurrentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start on Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getEventsForDate = (date: Date) => {
    // Convert date to the selected timezone for comparison
    const zonedDate = toZonedTime(date, timezone);
    const dateStr = format(zonedDate, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map(day => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, zonedCurrentMonth);
          // Get today in the selected timezone
          const nowInTimezone = toZonedTime(new Date(), timezone);
          const isToday = isSameDay(day, nowInTimezone);
          
          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={`
                min-h-[80px] p-1 border border-gray-200 rounded-lg cursor-pointer
                hover:bg-gray-50 transition-colors
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                ${isToday ? 'ring-2 ring-coral-500' : ''}
              `}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-coral-600' : ''}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => {
                  const useLightText = !isLightColor(event.color);
                  // Format time in the selected timezone
                  // Event time is already converted to the selected timezone, just format it
                  let timeDisplay = '';
                  if (event.time) {
                    try {
                      // The event.time is already in HH:mm format in the selected timezone
                      // Just format it for display
                      const [hours, minutes] = event.time.split(':');
                      const hour = parseInt(hours, 10);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour % 12 || 12;
                      timeDisplay = `${displayHour}:${minutes.padStart(2, '0')} ${ampm}`;
                    } catch (e) {
                      // Fallback: just format the time string directly
                      const [hours, minutes] = event.time.split(':');
                      const hour = parseInt(hours, 10);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour % 12 || 12;
                      timeDisplay = `${displayHour}:${minutes} ${ampm}`;
                    }
                  }
                  return (
                    <div
                      key={event.id}
                      className="text-xs px-1 py-0.5 rounded truncate font-medium"
                      style={{ 
                        backgroundColor: event.color, 
                        color: useLightText ? 'white' : '#1f2937',
                        fontWeight: 500
                      }}
                      title={event.title}
                    >
                      {timeDisplay ? `${timeDisplay} ` : ''}
                      {event.title}
                    </div>
                  );
                })}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar() {
  const { calendarEvents, addCalendarEvent } = useStore();
  const { reminders, loading: remindersLoading } = useUserClassReminders();
  const [activeTab, setActiveTab] = useState<'google' | 'my'>('google');
  const [timezone, setTimezone] = useState<string>(() => {
    const saved = localStorage.getItem('calendar_timezone');
    return saved || 'America/New_York';
  });
  
  // Helper function to get current date in selected timezone
  const getCurrentDateInTimezone = (tz: string) => {
    return toZonedTime(new Date(), tz);
  };
  
  // Initialize dates in the selected timezone
  const [currentMonth, setCurrentMonth] = useState(() => {
    const saved = localStorage.getItem('calendar_timezone');
    const tz = saved || 'America/New_York';
    return toZonedTime(new Date(), tz);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem('calendar_timezone');
    const tz = saved || 'America/New_York';
    return toZonedTime(new Date(), tz);
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'reminder' as 'class' | 'habit' | 'reminder' | 'goal',
    time: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  // Track viewport size
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save timezone to localStorage and update dates when timezone changes
  useEffect(() => {
    localStorage.setItem('calendar_timezone', timezone);
    // Update current month and selected date to reflect the new timezone
    const nowInTimezone = getCurrentDateInTimezone(timezone);
    setCurrentMonth(nowInTimezone);
    setSelectedDate(nowInTimezone);
  }, [timezone]);

  // Helper function to calculate UTC offset difference between two timezones (in hours)
  const getTimezoneOffsetHours = (fromTz: string, toTz: string): number => {
    // Use a fixed UTC date to calculate offset
    const utcDate = new Date('2024-01-15T12:00:00Z');
    
    // Get what time it is in each timezone for this UTC moment
    const fromTime = formatTz(utcDate, 'HH:mm', { timeZone: fromTz });
    const toTime = formatTz(utcDate, 'HH:mm', { timeZone: toTz });
    
    // Parse times
    const [fromHour, fromMin] = fromTime.split(':').map(Number);
    const [toHour, toMin] = toTime.split(':').map(Number);
    
    // Calculate difference in minutes
    const fromMinutes = fromHour * 60 + fromMin;
    const toMinutes = toHour * 60 + toMin;
    let diffMinutes = toMinutes - fromMinutes;
    
    // Handle day rollover (if difference is > 12 hours, it's probably the other direction)
    if (diffMinutes > 12 * 60) {
      diffMinutes = diffMinutes - 24 * 60;
    } else if (diffMinutes < -12 * 60) {
      diffMinutes = diffMinutes + 24 * 60;
    }
    
    // Convert to hours (round to nearest hour)
    return Math.round(diffMinutes / 60);
  };

  // Helper function to adjust time by hours (keep same day - no day rollover)
  const adjustTimeByHours = (timeStr: string, hours: number): string => {
    const [hour, minute] = timeStr.split(':').map(Number);
    let newHour = hour + hours;
    
    // Handle hour rollover but keep the same day (don't let it go negative or over 24)
    // This ensures Sunday 7:30 AM Eastern becomes Sunday 6:30 AM Central, not Saturday
    if (newHour < 0) {
      newHour = 24 + newHour; // Wrap around but stay on same day
    } else if (newHour >= 24) {
      newHour = newHour - 24; // Wrap around but stay on same day
    }
    
    return `${String(newHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  // Generate repeating weekly class events from reminders
  const classEvents = useMemo(() => {
    if (!reminders || reminders.length === 0) return [];
    
    const events: CalendarEvent[] = [];
    // Eastern timezone where classes are stored
    const EASTERN_TIMEZONE = 'America/New_York';
    
    // Calculate hour offset between Eastern and selected timezone
    const hourOffset = getTimezoneOffsetHours(EASTERN_TIMEZONE, timezone);
    
    reminders.forEach((reminder: any) => {
      const liveClass = reminder.live_classes;
      if (!liveClass || !liveClass.scheduled_at) return;
      
      // Parse the original scheduled time
      const originalDate = parseISO(liveClass.scheduled_at);
      
      // Get the time in Eastern (where classes are stored)
      const easternTimeStr = formatTz(originalDate, 'HH:mm', { timeZone: EASTERN_TIMEZONE });
      
      // Get day of week from Eastern date - THIS IS THE DAY WE KEEP
      const easternDayName = formatTz(originalDate, 'EEEE', { timeZone: EASTERN_TIMEZONE });
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = dayNames.indexOf(easternDayName); // 0 = Sunday, 6 = Saturday
      
      // Simply adjust the time by the hour offset (keep same day)
      const adjustedTime = adjustTimeByHours(easternTimeStr, hourOffset);
      
      // Generate events for the next 6 months, repeating weekly
      // Use the Eastern day of week to find matching dates
      // Get today's day of week in Eastern timezone to ensure consistency
      const today = new Date();
      const todayEasternDayName = formatTz(today, 'EEEE', { timeZone: EASTERN_TIMEZONE });
      const todayEasternDayOfWeek = dayNames.indexOf(todayEasternDayName);
      
      // Calculate days to add to get to the target day of week
      let daysToAdd = (dayOfWeek - todayEasternDayOfWeek + 7) % 7;
      
      // If it's the same day, check if we need to move to next week
      if (daysToAdd === 0) {
        const todayEasternTime = formatTz(today, 'HH:mm', { timeZone: EASTERN_TIMEZONE });
        if (todayEasternTime >= easternTimeStr) {
          daysToAdd = 7; // Move to next week
        }
      }
      
      // Start from today and add days to get to the target day
      // Use UTC date manipulation to avoid timezone shifts
      const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      let currentDate = new Date(todayUTC);
      currentDate.setUTCDate(currentDate.getUTCDate() + daysToAdd);
      
      // Generate events for 6 months
      const endDate = new Date(todayUTC);
      endDate.setUTCMonth(endDate.getUTCMonth() + 6);
      
      while (currentDate <= endDate) {
        // Format the date using UTC to avoid timezone shifts
        const year = currentDate.getUTCFullYear();
        const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getUTCDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        events.push({
          id: `class-${reminder.live_class_id}-${dateStr}`,
          title: liveClass.title,
          date: dateStr,
          time: adjustedTime, // Only the time is adjusted, not the date
          type: 'class',
          color: '#f8b4b4',
          description: liveClass.description,
          isRepeating: true,
          originalDate: liveClass.scheduled_at,
        });
        
        // Move to next week (same day of week) using UTC
        currentDate.setUTCDate(currentDate.getUTCDate() + 7);
      }
    });
    
    return events;
  }, [reminders, timezone]);

  // Combine class events with custom events
  const allEvents = useMemo(() => {
    const customEvents: CalendarEvent[] = calendarEvents.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      color: event.color,
      description: event.description,
    }));
    
    return [...classEvents, ...customEvents];
  }, [classEvents, calendarEvents]);

  const handleAddEvent = () => {
    if (newEvent.title.trim()) {
      const eventType = eventTypes.find((t) => t.id === newEvent.type);
      addCalendarEvent({
        id: Date.now().toString(),
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time || undefined,
        type: newEvent.type,
        color: eventType?.color || '#f8b4b4',
        description: newEvent.description || undefined,
      });
      setNewEvent({ title: '', type: 'reminder', time: '', description: '', date: format(selectedDate, 'yyyy-MM-dd') });
      setShowAddModal(false);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewEvent(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    setShowAddModal(true);
  };

  const getEventsForSelectedDate = () => {
    // Convert selected date to the selected timezone for comparison
    const zonedSelectedDate = toZonedTime(selectedDate, timezone);
    const dateStr = format(zonedSelectedDate, 'yyyy-MM-dd');
    return allEvents.filter(event => event.date === dateStr);
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
            Calendar
          </h1>
          <p className="text-gray-500 mt-1">Manage your wellness schedule</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Timezone Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="input text-sm py-2 pr-8"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              const nowInTimezone = getCurrentDateInTimezone(timezone);
              setSelectedDate(nowInTimezone);
              setNewEvent(prev => ({ ...prev, date: format(nowInTimezone, 'yyyy-MM-dd') }));
              setShowAddModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('google')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'google'
                ? 'border-coral-500 text-coral-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Google Calendar
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'my'
                ? 'border-coral-500 text-coral-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Calendar
          </button>
        </nav>
      </div>

      {/* Google Calendar View */}
      {activeTab === 'google' && (
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Calendar
          </h2>
          <div className="w-full" style={{ height: isMobile ? '500px' : '600px' }}>
            <iframe
              src={`https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=${encodeURIComponent(
                timezone
              )}&showPrint=0&mode=${isMobile ? 'AGENDA' : 'WEEK'}&src=ZW1pbHlicm93ZXJsaWZlY29hY2hAZ21haWwuY29t&color=%237986cb`}
              style={{ border: 'solid 1px #777', width: '100%', height: '100%', borderWidth: 0 }}
              frameBorder="0"
              scrolling="no"
            />
          </div>
        </div>
      )}

      {/* My Calendar View */}
      {activeTab === 'my' && (
        <div className="space-y-6">
          {/* Calendar Navigation */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {formatTz(currentMonth, 'MMMM yyyy', { timeZone: timezone })}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {remindersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500"></div>
                <span className="ml-3 text-gray-600">Loading calendar...</span>
              </div>
            ) : (
              <MonthCalendar
                currentMonth={currentMonth}
                events={allEvents}
                onDateClick={handleDateClick}
                timezone={timezone}
              />
            )}
          </div>

          {/* Selected Date Events */}
          <div className="card">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Events for {formatTz(selectedDate, 'EEEE, MMMM d, yyyy', { timeZone: timezone })}
            </h3>
            <div className="space-y-3">
              {getEventsForSelectedDate().length === 0 ? (
                <p className="text-gray-500 text-center py-8">No events scheduled for this day</p>
              ) : (
                getEventsForSelectedDate().map(event => {
                  const eventType = eventTypes.find(t => t.id === event.type);
                  const IconComponent = eventType?.icon || Bell;
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-4 rounded-xl border border-gray-200"
                      style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
                    >
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: event.color + '20' }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: event.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          {event.time && (
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {(() => {
                                try {
                                  // Event time is already in the selected timezone, just format it
                                  const [hours, minutes] = event.time.split(':');
                                  const hour = parseInt(hours, 10);
                                  const ampm = hour >= 12 ? 'PM' : 'AM';
                                  const displayHour = hour % 12 || 12;
                                  return `${displayHour}:${minutes.padStart(2, '0')} ${ampm}`;
                                } catch (e) {
                                  // Fallback: format time string directly
                                  const [hours, minutes] = event.time.split(':');
                                  const hour = parseInt(hours, 10);
                                  const ampm = hour >= 12 ? 'PM' : 'AM';
                                  const displayHour = hour % 12 || 12;
                                  return `${displayHour}:${minutes} ${ampm}`;
                                }
                              })()}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                        {event.isRepeating && (
                          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            Repeats weekly
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-elevated max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold">Add Event</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setNewEvent({ ...newEvent, type: type.id as any })}
                      className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                        newEvent.type === type.id
                          ? 'ring-2 ring-coral-500'
                          : 'hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: newEvent.type === type.id ? type.color : '#f9fafb',
                      }}
                    >
                      <type.icon className="w-5 h-5 text-gray-700" />
                      <span className="text-xs text-gray-600">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time (optional)
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Add a description..."
                  rows={3}
                  className="input resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={handleAddEvent} className="flex-1 btn-primary">
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
