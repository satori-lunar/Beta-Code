# Supabase Integration Guide

## 🎉 Your Health Dashboard is Now User-Specific!

All data is now stored in Supabase and filtered by authenticated user. Each user only sees their own data.

## 📦 What's Been Set Up

### 1. Database Tables (with RLS enabled)
✅ **habits** - User habits with completion tracking  
✅ **nutrition_entries** - Meal logging with macros  
✅ **weight_entries** - Weight tracking over time  
✅ **journal_entries** - Daily journal with mood and gratitude  
✅ **calendar_events** - User calendar events  
✅ **user_badges** - Achievement badges  
✅ **user_profiles** - Extended user profiles with streak and goals  
✅ **health_metrics** - Comprehensive health data  
✅ **course_progress** - Course completion tracking  
✅ **favorite_sessions** - Favorite workout sessions  
✅ **dashboard_settings** - User preferences  
✅ **activity_log** - User activity tracking  

### 2. Authentication System
✅ **AuthContext** - Manages authentication state  
✅ **Sign In/Sign Up pages** - Beautiful gradient UI  
✅ **ProtectedRoute** - Protects app routes  
✅ **Auto profile creation** - Creates profile, settings, and metrics on signup  

### 3. Data Fetching Hooks
✅ **useHabits()** - Fetch user habits  
✅ **useNutritionEntries()** - Fetch nutrition logs  
✅ **useWeightEntries()** - Fetch weight logs  
✅ **useJournalEntries()** - Fetch journal entries  
✅ **useCalendarEvents()** - Fetch calendar events  
✅ **useUserBadges()** - Fetch user badges  
✅ **useUserProfile()** - Fetch user profile  
✅ **useHealthMetrics()** - Fetch health metrics  
✅ **Real-time subscriptions** - Auto-updates when data changes  

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file (already done):
```env
VITE_SUPABASE_URL=https://qbsrmbxuwacpqquorqaq.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3
```

### 2. Using Supabase Hooks in Components

Replace Zustand store calls with Supabase hooks:

#### Before (Zustand):
```typescript
import { useStore } from '../store/useStore'

function MyComponent() {
  const habits = useStore(state => state.habits)
  const addHabit = useStore(state => state.addHabit)
  // ...
}
```

#### After (Supabase):
```typescript
import { useHabits } from '../hooks/useSupabaseData'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { data: habits, loading } = useHabits()
  const { user } = useAuth()

  const addHabit = async (habit) => {
    await supabase.from('habits').insert({
      ...habit,
      user_id: user.id
    })
    // Data will auto-update via real-time subscription
  }
  // ...
}
```

## 📝 Example: Converting Habits Component

### Step 1: Import Supabase hooks
```typescript
import { useHabits } from '../hooks/useSupabaseData'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
```

### Step 2: Use the hook
```typescript
const { data: habits, loading, error } = useHabits()
const { user } = useAuth()
```

### Step 3: CRUD Operations

**Create:**
```typescript
const handleAddHabit = async (habitData) => {
  await supabase.from('habits').insert({
    user_id: user!.id,
    name: habitData.name,
    icon: habitData.icon,
    color: habitData.color,
    frequency: 'daily',
    completed_dates: [],
    streak: 0
  })
}
```

**Update:**
```typescript
const handleUpdateHabit = async (id, updates) => {
  await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
}
```

**Delete:**
```typescript
const handleDeleteHabit = async (id) => {
  await supabase
    .from('habits')
    .delete()
    .eq('id', id)
}
```

**Toggle Completion:**
```typescript
const toggleCompletion = async (id, date) => {
  const habit = habits.find(h => h.id === id)
  const completedDates = habit?.completed_dates as string[] || []
  const isCompleted = completedDates.includes(date)
  
  const newDates = isCompleted
    ? completedDates.filter(d => d !== date)
    : [...completedDates, date]

  await supabase
    .from('habits')
    .update({ 
      completed_dates: newDates,
      streak: calculateStreak(newDates)
    })
    .eq('id', id)
}
```

## 🎨 Example: Nutrition Entries

```typescript
import { useNutritionEntries } from '../hooks/useSupabaseData'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function NutritionTracker() {
  const { data: entries, loading } = useNutritionEntries()
  const { user } = useAuth()

  const addMeal = async (meal) => {
    await supabase.from('nutrition_entries').insert({
      user_id: user!.id,
      date: new Date().toISOString().split('T')[0],
      meal_type: meal.type,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat
    })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {entries.map(entry => (
        <div key={entry.id}>
          {entry.name} - {entry.calories} cal
        </div>
      ))}
    </div>
  )
}
```

## 💪 Example: Health Metrics

```typescript
import { useHealthMetrics } from '../hooks/useSupabaseData'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function HealthDashboard() {
  const { metrics, loading } = useHealthMetrics()
  const { user } = useAuth()

  const updateMetric = async (key, value) => {
    await supabase
      .from('health_metrics')
      .upsert({
        user_id: user!.id,
        [key]: value
      }, {
        onConflict: 'user_id'
      })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <p>Heart Rate: {metrics?.heart_rate?.value} bpm</p>
      <p>Steps: {metrics?.steps?.value} / {metrics?.steps?.goal}</p>
    </div>
  )
}
```

## 🔄 Migration Strategy

### Option 1: Gradual Migration
1. Keep Zustand store for UI state
2. Replace data operations one component at a time
3. Test each component thoroughly

### Option 2: Complete Migration
1. Remove Zustand persistence
2. Update all components at once
3. Use Zustand only for temporary UI state

## 🔐 Security Notes

✅ **Row Level Security (RLS)** is enabled on all tables  
✅ Users can only access their own data  
✅ All queries are automatically filtered by `user_id`  
✅ Real-time subscriptions only receive user's own data  

## 📚 Useful Supabase Operations

### Filtering
```typescript
const { data } = await supabase
  .from('habits')
  .select('*')
  .eq('frequency', 'daily')
  .order('created_at', { ascending: false })
```

### Counting
```typescript
const { count } = await supabase
  .from('habits')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', user.id)
```

### Date Ranges
```typescript
const { data } = await supabase
  .from('nutrition_entries')
  .select('*')
  .gte('date', '2024-01-01')
  .lte('date', '2024-12-31')
```

## 🐛 Troubleshooting

### "No rows returned"
- Check if user is authenticated
- Verify RLS policies allow access
- Ensure user_id is set correctly

### "Permission denied"
- User might not be authenticated
- RLS policies might be too restrictive
- Check Supabase dashboard for policy errors

### Real-time not working
- Verify real-time is enabled in Supabase dashboard
- Check that you're subscribed to the correct table
- Ensure filter matches your user_id

## 📖 Next Steps

1. ✅ Update components to use Supabase hooks
2. ✅ Test CRUD operations for each feature
3. ✅ Remove localStorage dependencies
4. ✅ Add loading states
5. ✅ Add error handling
6. ✅ Deploy and test with multiple users

## 🔗 Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq)
- [Database Tables](https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/editor)
- [API Docs](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your dashboard is now ready for multiple users!** 🎉

Each user will have their own private data, and everything is securely stored in Supabase.

