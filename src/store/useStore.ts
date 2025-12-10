import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User, Habit, NutritionEntry, WeightEntry,
  JournalEntry, Course, LiveClass, RecordedSession, CalendarEvent, Notification,
  HealthMetrics, ConnectedDevice
} from '../types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User) => void;

  // Habits
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;

  // Nutrition
  nutritionEntries: NutritionEntry[];
  addNutritionEntry: (entry: NutritionEntry) => void;
  updateNutritionEntry: (id: string, updates: Partial<NutritionEntry>) => void;

  // Weight
  weightEntries: WeightEntry[];
  addWeightEntry: (entry: WeightEntry) => void;
  deleteWeightEntry: (id: string) => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  // Courses
  courses: Course[];
  updateCourseProgress: (id: string, completedSessions: number) => void;

  // Classes
  liveClasses: LiveClass[];
  recordedSessions: RecordedSession[];
  toggleFavorite: (id: string) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Health Metrics
  healthMetrics: HealthMetrics;
  updateHealthMetric: <K extends keyof HealthMetrics>(key: K, value: HealthMetrics[K]) => void;
  connectedDevices: ConnectedDevice[];
  toggleDeviceConnection: (deviceId: string) => void;
}

// Mock data
const mockUser: User = {
  id: '1',
  name: 'Sarah',
  email: 'sarah@example.com',
  avatar: '',
  joinDate: '2024-01-15',
  streak: 12,
  badges: [
    { id: '1', name: '7 Day Streak', description: 'Complete habits for 7 days straight', icon: 'flame', earnedDate: '2024-02-01', category: 'streak' },
    { id: '2', name: 'Early Bird', description: 'Complete morning routine 5 times', icon: 'sunrise', earnedDate: '2024-02-05', category: 'habit' },
    { id: '3', name: 'Hydration Hero', description: 'Meet water goals for 10 days', icon: 'droplet', earnedDate: '2024-02-10', category: 'nutrition' },
    { id: '4', name: 'Mindfulness Master', description: 'Complete 20 meditation sessions', icon: 'brain', earnedDate: '2024-02-15', category: 'mindfulness' },
    { id: '5', name: 'Workout Warrior', description: 'Complete 15 workout sessions', icon: 'dumbbell', earnedDate: '2024-02-20', category: 'workout' },
  ],
};

const mockHabits: Habit[] = [
  { id: '1', name: 'Morning Meditation', icon: 'brain', color: '#f8b4b4', frequency: 'daily', completedDates: ['2024-12-07', '2024-12-08', '2024-12-09'], streak: 3, createdAt: '2024-01-01' },
  { id: '2', name: 'Drink 8 Glasses of Water', icon: 'droplet', color: '#bde0fe', frequency: 'daily', completedDates: ['2024-12-08', '2024-12-09'], streak: 2, createdAt: '2024-01-01' },
  { id: '3', name: 'Exercise 30 mins', icon: 'dumbbell', color: '#d8f3dc', frequency: 'daily', completedDates: ['2024-12-09'], streak: 1, createdAt: '2024-01-01' },
  { id: '4', name: 'Read for 20 mins', icon: 'book', color: '#e2d5f1', frequency: 'daily', completedDates: ['2024-12-07', '2024-12-08'], streak: 0, createdAt: '2024-01-01' },
  { id: '5', name: 'Gratitude Journal', icon: 'heart', color: '#fcd5ce', frequency: 'daily', completedDates: ['2024-12-09'], streak: 1, createdAt: '2024-01-01' },
  { id: '6', name: 'Stretch Routine', icon: 'activity', color: '#f5ebe0', frequency: 'daily', completedDates: [], streak: 0, createdAt: '2024-01-01' },
];

const mockCourses: Course[] = [
  { id: '1', title: 'Finding Calm', description: 'Learn to find inner peace', thumbnail: '', instructor: 'Dr. Emma Wilson', duration: '4 weeks', sessions: 17, completedSessions: 8, category: 'Meditation', level: 'beginner', tags: ['calm', 'beginner'] },
  { id: '2', title: 'Spiritual Growth', description: 'Explore your spiritual journey', thumbnail: '', instructor: 'Mark Thompson', duration: '6 weeks', sessions: 8, completedSessions: 3, category: 'Spirituality', level: 'intermediate', tags: ['growth', 'spiritual'] },
  { id: '3', title: 'Motivation Mastery', description: 'Unlock your potential', thumbnail: '', instructor: 'Lisa Chen', duration: '3 weeks', sessions: 11, completedSessions: 11, category: 'Personal Growth', level: 'beginner', tags: ['motivation', 'mindset'] },
  { id: '4', title: 'Breathe & Release', description: 'Master breathing techniques', thumbnail: '', instructor: 'Dr. Emma Wilson', duration: '2 weeks', sessions: 6, completedSessions: 0, category: 'Wellness', level: 'beginner', tags: ['breathing', 'relaxation'] },
  { id: '5', title: 'Meaningful Life', description: 'Create purpose and meaning', thumbnail: '', instructor: 'John Davis', duration: '8 weeks', sessions: 11, completedSessions: 5, category: 'Life Purpose', level: 'advanced', tags: ['purpose', 'life'] },
];

const mockRecordedSessions: RecordedSession[] = [
  { id: '1', title: 'Morning Yoga Flow', description: 'Start your day with energizing yoga', instructor: 'Sarah Mitchell', recordedAt: '2024-12-01', duration: 45, videoUrl: '#', thumbnail: '', category: 'Yoga', views: 234, isFavorite: true, tags: ['yoga', 'morning'] },
  { id: '2', title: 'Stress Relief Meditation', description: 'Release tension and find peace', instructor: 'Dr. Emma Wilson', recordedAt: '2024-12-03', duration: 30, videoUrl: '#', thumbnail: '', category: 'Meditation', views: 567, isFavorite: false, tags: ['meditation', 'stress'] },
  { id: '3', title: 'HIIT Workout for Beginners', description: 'High intensity training made easy', instructor: 'Mike Johnson', recordedAt: '2024-12-05', duration: 25, videoUrl: '#', thumbnail: '', category: 'Fitness', views: 891, isFavorite: true, tags: ['hiit', 'workout'] },
  { id: '4', title: 'Sleep Better Tonight', description: 'Techniques for better sleep', instructor: 'Dr. Emma Wilson', recordedAt: '2024-12-07', duration: 20, videoUrl: '#', thumbnail: '', category: 'Sleep', views: 432, isFavorite: false, tags: ['sleep', 'relaxation'] },
  { id: '5', title: 'Nutrition Basics', description: 'Understanding balanced nutrition', instructor: 'Lisa Chen', recordedAt: '2024-12-08', duration: 40, videoUrl: '#', thumbnail: '', category: 'Nutrition', views: 321, isFavorite: false, tags: ['nutrition', 'health'] },
];

const mockLiveClasses: LiveClass[] = [
  { id: '1', title: 'Live Yoga Session', description: 'Join our morning yoga class', instructor: 'Sarah Mitchell', scheduledAt: '2024-12-10T09:00:00', duration: 60, zoomLink: '#', thumbnail: '', category: 'Yoga', isLive: false },
  { id: '2', title: 'Meditation Circle', description: 'Group meditation for inner peace', instructor: 'Dr. Emma Wilson', scheduledAt: '2024-12-10T14:00:00', duration: 45, zoomLink: '#', thumbnail: '', category: 'Meditation', isLive: false },
  { id: '3', title: 'Strength Training Live', description: 'Build strength together', instructor: 'Mike Johnson', scheduledAt: '2024-12-11T10:00:00', duration: 50, zoomLink: '#', thumbnail: '', category: 'Fitness', isLive: false },
  { id: '4', title: 'Healthy Cooking Demo', description: 'Learn to cook healthy meals', instructor: 'Lisa Chen', scheduledAt: '2024-12-12T18:00:00', duration: 60, zoomLink: '#', thumbnail: '', category: 'Nutrition', isLive: false },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: mockUser,
      setUser: (user) => set({ user }),

      // Habits
      habits: mockHabits,
      addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map(h => h.id === id ? { ...h, ...updates } : h)
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id)
      })),
      toggleHabitCompletion: (id, date) => set((state) => ({
        habits: state.habits.map(h => {
          if (h.id !== id) return h;
          const isCompleted = h.completedDates.includes(date);
          const completedDates = isCompleted
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date];
          return { ...h, completedDates };
        })
      })),

      // Nutrition
      nutritionEntries: [],
      addNutritionEntry: (entry) => set((state) => ({
        nutritionEntries: [...state.nutritionEntries, entry]
      })),
      updateNutritionEntry: (id, updates) => set((state) => ({
        nutritionEntries: state.nutritionEntries.map(e =>
          e.id === id ? { ...e, ...updates } : e
        )
      })),

      // Weight
      weightEntries: [
        { id: '1', date: '2024-11-01', weight: 70, unit: 'kg' },
        { id: '2', date: '2024-11-08', weight: 69.5, unit: 'kg' },
        { id: '3', date: '2024-11-15', weight: 69.2, unit: 'kg' },
        { id: '4', date: '2024-11-22', weight: 68.8, unit: 'kg' },
        { id: '5', date: '2024-11-29', weight: 68.5, unit: 'kg' },
        { id: '6', date: '2024-12-06', weight: 68.2, unit: 'kg' },
      ],
      addWeightEntry: (entry) => set((state) => ({
        weightEntries: [...state.weightEntries, entry]
      })),
      deleteWeightEntry: (id) => set((state) => ({
        weightEntries: state.weightEntries.filter(e => e.id !== id)
      })),

      // Journal
      journalEntries: [
        { id: '1', date: '2024-12-09', title: 'A New Beginning', content: 'Today I started my wellness journey. Feeling motivated and excited about the changes ahead.', mood: 'great', tags: ['motivation', 'new start'], gratitude: ['My health', 'Supportive family', 'This opportunity'], createdAt: '2024-12-09T08:00:00', updatedAt: '2024-12-09T08:00:00' },
        { id: '2', date: '2024-12-08', title: 'Reflection Day', content: 'Took time to reflect on my goals and progress. Small steps lead to big changes.', mood: 'good', tags: ['reflection', 'goals'], gratitude: ['Progress made', 'Good weather', 'Helpful community'], createdAt: '2024-12-08T20:00:00', updatedAt: '2024-12-08T20:00:00' },
      ],
      addJournalEntry: (entry) => set((state) => ({
        journalEntries: [entry, ...state.journalEntries]
      })),
      updateJournalEntry: (id, updates) => set((state) => ({
        journalEntries: state.journalEntries.map(e =>
          e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
        )
      })),
      deleteJournalEntry: (id) => set((state) => ({
        journalEntries: state.journalEntries.filter(e => e.id !== id)
      })),

      // Courses
      courses: mockCourses,
      updateCourseProgress: (id, completedSessions) => set((state) => ({
        courses: state.courses.map(c =>
          c.id === id ? { ...c, completedSessions } : c
        )
      })),

      // Classes
      liveClasses: mockLiveClasses,
      recordedSessions: mockRecordedSessions,
      toggleFavorite: (id) => set((state) => ({
        recordedSessions: state.recordedSessions.map(s =>
          s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
        )
      })),

      // Calendar
      calendarEvents: [
        { id: '1', title: 'Morning Yoga', date: '2024-12-10', time: '09:00', type: 'class', color: '#f8b4b4', description: 'Live yoga session' },
        { id: '2', title: 'Meditation', date: '2024-12-10', time: '14:00', type: 'class', color: '#e2d5f1', description: 'Group meditation' },
        { id: '3', title: 'Weight Check-in', date: '2024-12-13', type: 'reminder', color: '#bde0fe', description: 'Weekly weight log' },
        { id: '4', title: 'Nutrition Course', date: '2024-12-11', time: '10:00', type: 'class', color: '#d8f3dc', description: 'Nutrition basics class' },
      ],
      addCalendarEvent: (event) => set((state) => ({
        calendarEvents: [...state.calendarEvents, event]
      })),
      deleteCalendarEvent: (id) => set((state) => ({
        calendarEvents: state.calendarEvents.filter(e => e.id !== id)
      })),

      // Notifications
      notifications: [
        { id: '1', title: 'Keep up your streak!', message: 'You\'re on a 12 day streak. Complete today\'s habits to keep it going!', type: 'streak', read: false, createdAt: new Date().toISOString(), link: '/habits' },
        { id: '2', title: 'Live Yoga Session starting soon', message: 'Your yoga class with Sarah Mitchell starts in 30 minutes.', type: 'class', read: false, createdAt: new Date(Date.now() - 1800000).toISOString(), link: '/classes' },
        { id: '3', title: 'New badge earned!', message: 'Congratulations! You\'ve earned the "Hydration Hero" badge.', type: 'achievement', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), link: '/badges' },
        { id: '4', title: 'Weekly weight check-in', message: 'Don\'t forget to log your weight this week.', type: 'reminder', read: true, createdAt: new Date(Date.now() - 86400000).toISOString(), link: '/weight' },
        { id: '5', title: 'Course progress update', message: 'You\'re 47% through "Finding Calm". Keep going!', type: 'system', read: true, createdAt: new Date(Date.now() - 172800000).toISOString(), link: '/courses' },
      ],
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      // Health Metrics
      healthMetrics: {
        heartRate: { value: 72, unit: 'bpm', lastUpdated: new Date().toISOString() },
        bloodPressure: { systolic: 120, diastolic: 80, unit: 'mmHg', lastUpdated: new Date().toISOString() },
        bodyTemperature: { value: 98.6, unit: '°F', lastUpdated: new Date().toISOString() },
        oxygenSaturation: { value: 98, unit: '%', lastUpdated: new Date().toISOString() },
        respiratoryRate: { value: 16, unit: 'breaths/min', lastUpdated: new Date().toISOString() },
        bmi: { value: 22.5, category: 'Normal', lastUpdated: new Date().toISOString() },
        bodyFat: { value: 18, unit: '%', lastUpdated: new Date().toISOString() },
        height: { value: 170, unit: 'cm', lastUpdated: new Date().toISOString() },
        weight: { value: 68, unit: 'kg', lastUpdated: new Date().toISOString() },
        sleepHours: { value: 7.5, quality: 'good', lastUpdated: new Date().toISOString() },
        steps: { value: 8500, goal: 10000, lastUpdated: new Date().toISOString() },
        activeMinutes: { value: 45, goal: 60, lastUpdated: new Date().toISOString() },
        caloriesBurned: { value: 1850, goal: 2200, lastUpdated: new Date().toISOString() },
        stressLevel: { value: 4, scale: 10, lastUpdated: new Date().toISOString() },
        energyLevel: { value: 7, scale: 10, lastUpdated: new Date().toISOString() },
        hydration: { value: 1500, goal: 2000, unit: 'ml', lastUpdated: new Date().toISOString() },
      },
      updateHealthMetric: (key, value) => set((state) => ({
        healthMetrics: { ...state.healthMetrics, [key]: value }
      })),
      connectedDevices: [
        { id: 'fitbit', name: 'Fitbit', type: 'fitbit', connected: false, lastSync: null, icon: 'watch' },
        { id: 'apple_watch', name: 'Apple Watch', type: 'apple_watch', connected: false, lastSync: null, icon: 'watch' },
        { id: 'garmin', name: 'Garmin', type: 'garmin', connected: false, lastSync: null, icon: 'watch' },
        { id: 'google_fit', name: 'Google Fit', type: 'google_fit', connected: false, lastSync: null, icon: 'smartphone' },
        { id: 'samsung', name: 'Samsung Health', type: 'samsung', connected: false, lastSync: null, icon: 'watch' },
      ],
      toggleDeviceConnection: (deviceId) => set((state) => ({
        connectedDevices: state.connectedDevices.map(d =>
          d.id === deviceId ? { ...d, connected: !d.connected, lastSync: !d.connected ? new Date().toISOString() : d.lastSync } : d
        )
      })),
    }),
    {
      name: 'wellness-dashboard-storage',
    }
  )
);
