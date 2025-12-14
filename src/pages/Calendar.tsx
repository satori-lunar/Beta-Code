import { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Video,
  Target,
  Bell,
  Flag,
  Globe
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

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
  const { addCalendarEvent } = useStore();
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

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

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
