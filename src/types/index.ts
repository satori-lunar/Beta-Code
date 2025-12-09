export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  streak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
  category: 'streak' | 'habit' | 'workout' | 'nutrition' | 'mindfulness' | 'special';
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  targetDays?: number[];
  streak: number;
  createdAt: string;
}

export interface NutritionEntry {
  id: string;
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterIntake: number;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  unit: 'kg' | 'lbs';
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'low' | 'bad';
  tags: string[];
  gratitude?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  sessions: number;
  completedSessions: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  scheduledAt: string;
  duration: number;
  zoomLink?: string;
  thumbnail: string;
  category: string;
  isLive: boolean;
}

export interface RecordedSession {
  id: string;
  title: string;
  description: string;
  instructor: string;
  recordedAt: string;
  duration: number;
  videoUrl: string;
  thumbnail: string;
  category: string;
  views: number;
  isFavorite: boolean;
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'class' | 'habit' | 'reminder' | 'goal';
  color: string;
  description?: string;
}
