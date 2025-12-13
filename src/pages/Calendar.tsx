import { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Clock,
  Video,
  Target,
  Bell,
  Flag,
  Globe
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import {
  format,
  isBefore
} from 'date-fns';

const eventTypes = [
  { id: 'class', name: 'Class', icon: Video, color: '#f8b4b4' },
  { id: 'habit', name: 'Habit', icon: Target, color: '#d8f3dc' },
  { id: 'reminder', name: 'Reminder', icon: Bell, color: '#bde0fe' },
  { id: 'goal', name: 'Goal', icon: Flag, color: '#e2d5f1' },
];

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

export default function Calendar() {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent } = useStore();
  const [selectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [timezone, setTimezone] = useState<string>(() => {
    // Get timezone from localStorage or default to Eastern Time
    const saved = localStorage.getItem('calendar_timezone');
    return saved || 'America/New_York';
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'reminder',
    time: '',
    description: '',
  });

  // Save timezone to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('calendar_timezone', timezone);
  }, [timezone]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows: Date[][] = [];
  let days: Date[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  const getEventsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return calendarEvents.filter((event) => event.date === dateString);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  // Fetch Google Calendar events - get ALL events, not just today's
  const { loading: calendarLoading, events: googleCalendarEvents, getEventsForDate: getGoogleEventsForDate, getTodaysEvents } = useGoogleCalendar();

  // Get Google Calendar events for selected date
  const googleEventsForSelectedDate = getGoogleEventsForDate(selectedDate);
  
  // Get today's classes from Google Calendar
  const todaysGoogleClasses = getTodaysEvents();
  
  // Get Google Calendar events for any date (for the upcoming classes calendar)
  const getGoogleEventsForCalendarDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return googleCalendarEvents.filter((event) => {
      const eventDate = format(event.start, 'yyyy-MM-dd');
      return eventDate === dateString;
    });
  };
  
  // Combine user calendar events with Google Calendar events for selected date
  type CombinedCalendarEvent = {
    id: string;
    title: string;
    time?: string;
    description?: string;
    type: 'class' | 'habit' | 'reminder' | 'goal';
    color: string;
    isGoogleCalendar: boolean;
  };
  
  const allSelectedDateEvents: CombinedCalendarEvent[] = [
    ...selectedDateEvents.map(event => ({
      id: event.id,
      title: event.title,
      time: event.time,
      description: event.description,
      type: event.type,
      color: event.color,
      isGoogleCalendar: false,
    })),
    ...googleEventsForSelectedDate.map(event => ({
      id: `google-${event.id}`,
      title: event.title,
      time: event.allDay ? undefined : format(event.start, 'HH:mm'),
      description: event.description,
      type: 'class' as const,
      color: '#7986cb',
      isGoogleCalendar: true,
    }))
  ];

  // Debug logging
  useEffect(() => {
    console.log("Today's Google Classes:", todaysGoogleClasses);
    console.log('Calendar loading:', calendarLoading);
  }, [todaysGoogleClasses, calendarLoading]);

  const handleAddEvent = () => {
    if (newEvent.title.trim()) {
      const eventType = eventTypes.find((t) => t.id === newEvent.type);
      addCalendarEvent({
        id: Date.now().toString(),
        title: newEvent.title,
        date: selectedDateString,
        time: newEvent.time || undefined,
        type: newEvent.type as 'class' | 'habit' | 'reminder' | 'goal',
        color: eventType?.color || '#f8b4b4',
        description: newEvent.description || undefined,
      });
      setNewEvent({ title: '', type: 'reminder', time: '', description: '' });
      setShowAddModal(false);
    }
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
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Embedded Google Calendar */}
          <div className="card">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Calendar
            </h2>
            <div className="w-full" style={{ height: '600px' }}>
              <iframe
                src={`https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=${encodeURIComponent(timezone)}&showPrint=0&mode=WEEK&src=ZW1pbHlicm93ZXJsaWZlY29hY2hAZ21haWwuY29t&color=%237986cb`}
                style={{ border: 'solid 1px #777', width: '100%', height: '100%', borderWidth: 0 }}
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </div>

          {/* Upcoming Classes - Schedule View */}
          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">
                Upcoming Classes
              </h2>
              <p className="text-sm text-gray-500">Schedule view of classes from Google Calendar</p>
            </div>

            {calendarLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading classes...</p>
              </div>
            ) : googleCalendarEvents.length > 0 ? (
              <div className="space-y-4">
                {googleCalendarEvents.map((classItem) => {
                  const now = new Date();
                  const hasPassed = isBefore(classItem.end || classItem.start, now);
                  const classColor = '#7986cb';
                  
                  return (
                    <div
                      key={classItem.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border-l-4 transition-all ${
                        hasPassed 
                          ? 'opacity-60 bg-gray-50 border-gray-300' 
                          : 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: hasPassed ? '#9ca3af' : classColor }}
                        >
                          <Video className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className={`font-semibold text-gray-900 mb-1 ${
                              hasPassed ? 'line-through' : ''
                            }`}>
                              {classItem.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {classItem.allDay 
                                    ? 'All Day'
                                    : `${format(classItem.start, 'EEE, MMM d, h:mm a')}${classItem.end ? ` - ${format(classItem.end, 'h:mm a')}` : ''}`}
                                </span>
                              </div>
                            </div>
                            {classItem.description && !hasPassed && (
                              <p className="text-sm text-gray-500 mt-2">{classItem.description}</p>
                            )}
                          </div>
                          {hasPassed && (
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                              Past
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">No upcoming classes scheduled.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">
              {format(selectedDate, 'EEEE, MMMM d')}
            </h3>

            {allSelectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {allSelectedDateEvents.map((event) => {
                  const eventType = eventTypes.find((t) => t.id === event.type);
                  const IconComponent = eventType?.icon || Bell;

                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: event.color + '30' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: event.color }}
                      >
                        <IconComponent className="w-4 h-4 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        {event.time && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                        )}
                      </div>
                      {!event.isGoogleCalendar && (
                        <button
                          onClick={() => deleteCalendarEvent(event.id)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No events scheduled for this day</p>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full mt-4 py-2 px-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-coral-300 hover:text-coral-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          {/* Today's Classes */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Today&apos;s Classes</h3>
            {calendarLoading ? (
              <p className="text-gray-500 text-sm">Loading calendar events...</p>
            ) : (
              <div className="space-y-3">
                {todaysGoogleClasses.length > 0 ? (
                  todaysGoogleClasses.map((classItem) => {
                    const now = new Date();
                    const hasPassed = isBefore(classItem.end || classItem.start, now);
                    const classColor = '#7986cb'; // Google Calendar blue color
                    
                    return (
                      <div
                        key={classItem.id}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-opacity ${
                          hasPassed ? 'opacity-60' : ''
                        }`}
                        style={{ backgroundColor: hasPassed ? '#f3f4f6' : classColor + '30' }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: hasPassed ? '#9ca3af' : classColor }}
                        >
                          <Video className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-gray-900 ${
                            hasPassed ? 'line-through' : ''
                          }`}>
                            {classItem.title}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {classItem.allDay 
                              ? 'All Day'
                              : `${format(classItem.start, 'h:mm a')}${classItem.end ? ` - ${format(classItem.end, 'h:mm a')}` : ''}`}
                          </p>
                          {classItem.description && !hasPassed && (
                            <p className="text-sm text-gray-500 mt-1">{classItem.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No classes scheduled for today.</p>
                )}
              </div>
            )}
          </div>

          {/* Event Type Legend */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Event Types</h3>
            <div className="space-y-2">
              {eventTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm text-gray-600">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-elevated">
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
                      onClick={() => setNewEvent({ ...newEvent, type: type.id })}
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
                  type="text"
                  value={format(selectedDate, 'MMMM d, yyyy')}
                  disabled
                  className="input bg-gray-50"
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
