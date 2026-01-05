import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Flame,
  CheckCircle2,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Target,
  Droplet,
  Dumbbell,
  Brain,
  Heart,
  Activity,
  BookOpen,
  Coffee,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trophy,
  BarChart3,
  Sparkles,
  Plus as PlusIcon,
  FileText,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits, checkAndAwardStreakBadges, checkFirstTimeBadges, checkHabitCompletionBadges, checkPointsBadges } from '../hooks/useSupabaseData';
import { supabase } from '../lib/supabase';
import { 
  format, 
  addDays, 
  subDays, 
  startOfWeek, 
  isSameDay, 
  parseISO, 
  differenceInDays,
  eachDayOfInterval,
  subMonths,
  getDay
} from 'date-fns';

// Calculate streak from completed dates
function calculateStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }
  
  let streak = 1;
  let currentDate = parseISO(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const nextDate = parseISO(sortedDates[i]);
    const diff = differenceInDays(currentDate, nextDate);
    
    if (diff === 1) {
      streak++;
      currentDate = nextDate;
    } else if (diff > 1) {
      break;
    }
  }
  
  return streak;
}

// Calculate completion rate
function calculateCompletionRate(completedDates: string[], startDate: Date, endDate: Date): number {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const completedDays = days.filter(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return completedDates.includes(dayStr);
  }).length;
  return days.length > 0 ? Math.round((completedDays / days.length) * 100) : 0;
}

const habitIcons: Record<string, React.ElementType> = {
  brain: Brain,
  droplet: Droplet,
  dumbbell: Dumbbell,
  book: BookOpen,
  heart: Heart,
  activity: Activity,
  coffee: Coffee,
  moon: Moon,
  sun: Sun,
  target: Target,
};

const iconOptions = [
  { id: 'brain', icon: Brain, label: 'Mind' },
  { id: 'droplet', icon: Droplet, label: 'Water' },
  { id: 'dumbbell', icon: Dumbbell, label: 'Exercise' },
  { id: 'book', icon: BookOpen, label: 'Reading' },
  { id: 'heart', icon: Heart, label: 'Self-care' },
  { id: 'activity', icon: Activity, label: 'Activity' },
  { id: 'coffee', icon: Coffee, label: 'Morning' },
  { id: 'moon', icon: Moon, label: 'Sleep' },
  { id: 'sun', icon: Sun, label: 'Sunrise' },
  { id: 'target', icon: Target, label: 'Goal' },
];

const colorOptions = [
  '#f8b4b4', '#fcd5ce', '#bde0fe', '#d8f3dc', '#e2d5f1', '#f5ebe0',
  '#ffc8dd', '#a2d2ff', '#caffbf', '#ffd6a5',
];

// Motivational messages
const motivationalMessages = [
  "Every small step counts! 🌟",
  "You're building something amazing! 💪",
  "Consistency is key - you've got this! 🔥",
  "Progress, not perfection! ✨",
  "Your future self will thank you! 🙏",
  "Small habits, big changes! 🚀",
  "Keep going - you're doing great! 💯",
  "Every day is a fresh start! 🌅",
];

const habitSpecificMessages: Record<string, string[]> = {
  brain: ["Your mind is getting stronger! 🧠", "Knowledge is power! 📚"],
  dumbbell: ["Your body is thanking you! 💪", "Strength comes from consistency! 🔥"],
  droplet: ["Hydration is self-care! 💧", "Your body loves water! 🌊"],
  book: ["Reading expands your world! 📖", "Knowledge is your superpower! 🦸"],
  heart: ["Self-care isn't selfish! ❤️", "You deserve this! 💝"],
};

// Calendar Heatmap Component
function CalendarHeatmap({ 
  completedDates, 
  startDate, 
  endDate 
}: { 
  completedDates: string[]; 
  startDate: Date; 
  endDate: Date;
}) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const maxCompletions = Math.max(...days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return completedDates.filter(d => d === dayStr).length;
  }), 1);

  const getIntensity = (date: Date) => {
    const dayStr = format(date, 'yyyy-MM-dd');
    const count = completedDates.filter(d => d === dayStr).length;
    if (count === 0) return 0;
    return Math.min(4, Math.ceil((count / maxCompletions) * 4));
  };

  // Group days by week for better layout
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day, idx) => {
    if (idx % 7 === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="space-y-1">
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} className="flex gap-1">
          {week.map((day, dayIdx) => {
            const intensity = getIntensity(day);
            const dayStr = format(day, 'yyyy-MM-dd');
            const isCompleted = completedDates.includes(dayStr);
            
            const colors = [
              '#ebedf0', // No completions
              '#c6e48b', // Level 1
              '#7bc96f', // Level 2
              '#239a3b', // Level 3
              '#196127', // Level 4
            ];

            return (
              <div
                key={`${weekIdx}-${dayIdx}`}
                className="w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all flex-shrink-0"
                style={{ backgroundColor: colors[intensity] }}
                title={`${format(day, 'MMM d, yyyy')}: ${isCompleted ? 'Completed' : 'Not completed'}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Progress Ring Component
function ProgressRing({ 
  progress, 
  size = 40, 
  strokeWidth = 4,
  color = '#10b981'
}: { 
  progress: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold" style={{ color }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

interface UserPoints {
  total_points: number;
  level: number;
  current_level_points: number;
  points_to_next_level: number;
}

export default function Habits() {
  const { user } = useAuth();
  const { data: habits = [], refetch } = useHabits();
  const { colorPreset, colorPresets, primaryColor } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'habits' | 'analytics' | 'insights'>('habits');
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [habitNotes, setHabitNotes] = useState<Record<string, Record<string, string>>>({});
  
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: 'target',
    color: colorOptions[0],
  });

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Fetch user points
  useEffect(() => {
    if (!user) return;
    
    const fetchPoints = async () => {
      const { data } = await (supabase as any)
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setUserPoints(data as UserPoints);
      } else {
        // Initialize points
        const { data: newData } = await (supabase as any)
          .from('user_points')
          .insert({
            user_id: user.id,
            total_points: 0,
            level: 1,
            current_level_points: 0,
            points_to_next_level: 100
          })
          .select()
          .single();
        if (newData) setUserPoints(newData as UserPoints);
      }
    };
    
    fetchPoints();
  }, [user]);

  // Fetch habit notes
  useEffect(() => {
    if (!user || habits.length === 0) return;
    
    const fetchNotes = async () => {
      const notesMap: Record<string, Record<string, string>> = {};
      
      for (const habit of habits) {
        const { data } = await (supabase as any)
          .from('habit_notes')
          .select('completed_date, note')
          .eq('habit_id', habit.id);
        
        if (data) {
          notesMap[habit.id] = {};
          data.forEach((item: any) => {
            notesMap[habit.id][item.completed_date] = item.note || '';
          });
        }
      }
      
      setHabitNotes(notesMap);
    };
    
    fetchNotes();
  }, [user, habits]);

  const completedToday = habits.filter(h => {
    const completedDates = h.completed_dates as any;
    return Array.isArray(completedDates) && completedDates.includes(dateString);
  }).length;
  const totalHabits = habits.length;

  // Calculate weekly completion rate instead of daily rate
  const weekEnd = new Date();
  const weekStartForRate = subDays(weekEnd, 6); // Last 7 days including today
  const weeklyCompletionRate = totalHabits > 0 ? Math.round(
    habits.reduce((total, habit) => {
      const completedDates = (habit.completed_dates as any) || [];
      return total + calculateCompletionRate(
        Array.isArray(completedDates) ? completedDates : [],
        weekStartForRate,
        weekEnd
      );
    }, 0) / totalHabits
  ) : 0;

  // Award points function
  const awardPoints = async (points: number, source: string, sourceId?: string, description?: string) => {
    if (!user) return;
    
    try {
      // Try RPC call first
      const { error: rpcError } = await (supabase as any).rpc('award_points', {
        p_user_id: user.id,
        p_points: points,
        p_source: source,
        p_source_id: sourceId || null,
        p_description: description || null
      });
      
      if (rpcError) {
        // Fallback: manually update points
        console.warn('RPC failed, using fallback:', rpcError);
        
        // Insert into points history
        await (supabase as any).from('points_history').insert({
          user_id: user.id,
          points: points,
          source: source,
          source_id: sourceId || null,
          description: description || null
        });
        
        // Update or insert user_points
        const { data: existing } = await (supabase as any)
          .from('user_points')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (existing) {
          const newTotal = existing.total_points + points;
          const newLevel = Math.floor(Math.sqrt(newTotal / 25)) + 1;
          const prevLevelPoints = newLevel === 1 ? 0 : ((newLevel - 1) * (newLevel - 1) * 25);
          const pointsToNext = newLevel === 1 ? 100 : (newLevel * newLevel * 25) - ((newLevel - 1) * (newLevel - 1) * 25);
          
          await (supabase as any)
            .from('user_points')
            .update({
              total_points: newTotal,
              level: newLevel,
              current_level_points: newTotal - prevLevelPoints,
              points_to_next_level: Math.max(0, pointsToNext - (newTotal - prevLevelPoints)),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } else {
          await (supabase as any).from('user_points').insert({
            user_id: user.id,
            total_points: points,
            level: 1,
            current_level_points: points,
            points_to_next_level: 100 - points
          });
        }
      }
      
      // Refresh points
      const { data } = await (supabase as any)
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) setUserPoints(data as UserPoints);
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const handleToggle = async (habitId: string) => {
    if (!user) return;
    
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const completedDates = (habit.completed_dates as any) || [];
    const isCompleting = !completedDates.includes(dateString);
    const newCompletedDates = isCompleting
      ? [...completedDates, dateString]
      : completedDates.filter((d: string) => d !== dateString);

    const newStreak = calculateStreak(newCompletedDates);

    await supabase
      .from('habits')
      .update({ 
        completed_dates: newCompletedDates,
        streak: newStreak
      })
      .eq('id', habitId);
    
    // Award points
    if (isCompleting) {
      await awardPoints(10, 'habit_complete', habitId, `Completed ${habit.name}`);
      
      // Streak bonuses
      if (newStreak === 7) await awardPoints(20, 'streak_bonus', habitId, '7-day streak!');
      if (newStreak === 30) await awardPoints(50, 'streak_bonus', habitId, '30-day streak!');
      if (newStreak === 100) await awardPoints(100, 'streak_bonus', habitId, '100-day streak!');
      
      // Check for badges
      try {
        const totalCompletions = habits.reduce((sum, h) => {
          const dates = (h.completed_dates as any) || [];
          return sum + dates.length;
        }, 0);

        if (totalCompletions === 0) {
          await checkFirstTimeBadges(user.id, 'habit_complete');
        }

        if (newStreak > 0) {
          await checkAndAwardStreakBadges(user.id, newStreak);
        }

        // Check for habit completion badges (milestones, consistency)
        await checkHabitCompletionBadges(user.id);
        
        // Check for points badges
        await checkPointsBadges(user.id);
      } catch (error) {
        console.error('Error awarding badges:', error);
      }
    }

    refetch();
  };

  const handleSaveNote = async (habitId: string, date: string, note: string) => {
    if (!user) return;
    
    try {
      const { error } = await (supabase as any)
        .from('habit_notes')
        .upsert({
          habit_id: habitId,
          user_id: user.id,
          completed_date: date,
          note: note
        });
      
      if (error) throw error;
      
      setHabitNotes(prev => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [date]: note
        }
      }));
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleAddHabit = async () => {
    if (!user || !newHabit.name.trim()) return;

    await supabase.from('habits').insert({
      user_id: user.id,
      name: newHabit.name,
      icon: newHabit.icon,
      color: newHabit.color,
      frequency: 'weekly', // Default to weekly for better reliability
      completed_dates: []
    });
    
    refetch();
    setNewHabit({ name: '', icon: 'target', color: colorOptions[0] });
    setShowAddModal(false);
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;
    await supabase.from('habits').delete().eq('id', habitId);
    refetch();
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    const now = new Date();
    const last30Days = subDays(now, 30);
    const last7Days = subDays(now, 7);
    
    const habitStats = habits.map(habit => {
      const completedDates = (habit.completed_dates as any) || [];
      const dates = Array.isArray(completedDates) ? completedDates : [];
      
      const completionRate30 = calculateCompletionRate(dates, last30Days, now);
      const completionRate7 = calculateCompletionRate(dates, last7Days, now);
      
      // Best day of week
      const dayCounts: Record<number, number> = {};
      dates.forEach((d: string) => {
        const day = getDay(parseISO(d));
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      });
      const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      return {
        habit,
        completionRate30,
        completionRate7,
        totalCompletions: dates.length,
        bestDay: bestDay ? dayNames[parseInt(bestDay)] : 'N/A',
        streak: habit.streak || 0
      };
    });
    
    return {
      habits: habitStats.sort((a, b) => b.completionRate30 - a.completionRate30),
      totalCompletions: habits.reduce((sum, h) => {
        const dates = (h.completed_dates as any) || [];
        return sum + (Array.isArray(dates) ? dates.length : 0);
      }, 0),
      averageCompletionRate: habitStats.length > 0
        ? Math.round(habitStats.reduce((sum, s) => sum + s.completionRate30, 0) / habitStats.length)
        : 0
    };
  }, [habits]);

  // Smart insights
  const insights = useMemo(() => {
    const insightsList: string[] = [];
    
    if (analytics.habits.length > 0) {
      const bestHabit = analytics.habits[0];
      const worstHabit = analytics.habits[analytics.habits.length - 1];
      
      if (bestHabit.completionRate30 > 80) {
        insightsList.push(`You're crushing "${bestHabit.habit.name}" with ${bestHabit.completionRate30}% completion! 🎉`);
      }
      
      if (worstHabit.completionRate30 < 30) {
        insightsList.push(`"${worstHabit.habit.name}" needs attention - only ${worstHabit.completionRate30}% completion.`);
      }
      
      // Day analysis
      const dayCounts: Record<string, number> = {};
      analytics.habits.forEach(stat => {
        if (stat.bestDay !== 'N/A') {
          dayCounts[stat.bestDay] = (dayCounts[stat.bestDay] || 0) + 1;
        }
      });
      const mostCommonDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
      if (mostCommonDay && mostCommonDay[1] > 2) {
        insightsList.push(`You complete habits ${mostCommonDay[1]}x more on ${mostCommonDay[0]}s!`);
      }
    }
    
    return insightsList;
  }, [analytics]);

  const randomMessage = useMemo(() => {
    const messages = motivationalMessages;
    const habitMessages = habits.length > 0 
      ? habitSpecificMessages[habits[0]?.icon || ''] || []
      : [];
    return [...habitMessages, ...messages][Math.floor(Math.random() * ([...habitMessages, ...messages].length))];
  }, [habits]);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
            Habit Tracker
          </h1>
          <p className="text-gray-500 mt-1">Build consistency, one habit at a time</p>
        </div>
        <div className="flex items-center gap-3">
          {userPoints && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
              <Trophy className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-xs text-gray-500">Level {userPoints.level}</div>
                <div className="text-sm font-semibold text-gray-900">{userPoints.total_points} pts</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Habit
          </button>
        </div>
      </div>

      {/* Daily Motivation */}
      <div className="card bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Daily Motivation</h3>
            <p className="text-indigo-700">{randomMessage}</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colorPresets[colorPreset]?.light }}
            >
              <Target className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
          <p className="text-sm text-gray-500">Total Habits</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-sage-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
          <p className="text-sm text-gray-500">Completed Today</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{weeklyCompletionRate}%</p>
          <p className="text-sm text-gray-500">This Week's Rate</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.max(...habits.map(h => h.streak || 0), 0)}
          </p>
          <p className="text-sm text-gray-500">Best Streak</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        {[
          { id: 'habits', label: 'Habits', icon: Target },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'insights', label: 'Insights', icon: Lightbulb },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === tab.id ? { color: primaryColor } : {}}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'habits' && (
        <>
          {/* Week Selector */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedDate(subDays(selectedDate, 7))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {format(weekStart, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayString = format(day, 'yyyy-MM-dd');
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const completedCount = habits.filter(h => {
                  const completedDates = (h.completed_dates as any) || [];
                  return Array.isArray(completedDates) && completedDates.includes(dayString);
                }).length;
                const allCompleted = completedCount === totalHabits && totalHabits > 0;

                return (
                  <button
                    key={dayString}
                    onClick={() => setSelectedDate(day)}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                      !isSelected && !isToday ? 'hover:bg-gray-100 text-gray-600' : ''
                    }`}
                    style={{
                      backgroundColor: isSelected ? primaryColor : isToday ? colorPresets[colorPreset]?.light : undefined,
                      color: isSelected ? 'white' : isToday ? primaryColor : undefined
                    }}
                  >
                    <span className="text-xs font-medium mb-1">{format(day, 'EEE')}</span>
                    <span
                      className={`text-lg font-bold ${isSelected ? '' : !isToday ? 'text-gray-900' : ''}`}
                      style={{ color: isToday && !isSelected ? primaryColor : undefined }}
                    >
                      {format(day, 'd')}
                    </span>
                    {allCompleted && (
                      <div className={`w-2 h-2 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-sage-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Habits List */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h2>
              </div>
              <span className="text-sm text-gray-500">
                {completedToday} of {totalHabits} completed
              </span>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => {
                const completedDates = (habit.completed_dates as any) || [];
                const isCompleted = Array.isArray(completedDates) && completedDates.includes(dateString);
                const IconComponent = habitIcons[habit.icon || ''] || Target;
                const isExpanded = expandedHabit === habit.id;
                
                // Calculate completion rate for last 30 days
                const last30Days = subDays(new Date(), 30);
                const habitCompletionRate = calculateCompletionRate(
                  Array.isArray(completedDates) ? completedDates : [],
                  last30Days,
                  new Date()
                );
                
                // Get note for today
                const todayNote = habitNotes[habit.id]?.[dateString] || '';

                return (
                  <div key={habit.id} className="space-y-2">
                    {/* Main Habit Card */}
                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isCompleted
                          ? 'bg-sage-50 border border-sage-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      {/* Progress Ring / Checkbox */}
                      <div onClick={(e) => { e.stopPropagation(); handleToggle(habit.id); }}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8 text-sage-600 cursor-pointer" />
                        ) : (
                          <ProgressRing 
                            progress={habitCompletionRate} 
                            size={40}
                            color={habit.color || primaryColor}
                          />
                        )}
                      </div>

                      {/* Habit Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: habit.color || '#10b981' }}
                          >
                            <IconComponent className="w-5 h-5 text-gray-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {habit.name}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-500" /> {habit.streak || 0} day streak
                              </span>
                              <span className="text-xs text-gray-400">
                                {Array.isArray(completedDates) ? completedDates.length : 0} completions
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Input / Actions */}
                      <div className="flex items-center gap-2">
                        {!isCompleted && (
                          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggle(habit.id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <PlusIcon className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedHabit(isExpanded ? null : habit.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHabit(habit.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="ml-14 p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                        {/* Calendar Heatmap */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Completion History</h4>
                          <div className="overflow-x-auto">
                            <CalendarHeatmap
                              completedDates={Array.isArray(completedDates) ? completedDates : []}
                              startDate={subMonths(new Date(), 12)}
                              endDate={new Date()}
                            />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Completion Rate (30 days)</div>
                            <div className="text-2xl font-bold text-gray-900">{habitCompletionRate}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Total Completions</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {Array.isArray(completedDates) ? completedDates.length : 0}
                            </div>
                          </div>
                        </div>

                        {/* Notes Section */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Notes
                          </h4>
                          <textarea
                            value={todayNote}
                            onChange={(e) => {
                              setHabitNotes(prev => ({
                                ...prev,
                                [habit.id]: {
                                  ...prev[habit.id],
                                  [dateString]: e.target.value
                                }
                              }));
                            }}
                            onBlur={() => handleSaveNote(habit.id, dateString, todayNote)}
                            placeholder="Add a note about today's completion..."
                            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={3}
                          />
                          <div className="mt-2 text-xs text-gray-500">
                            {Object.keys(habitNotes[habit.id] || {}).length} notes saved
                          </div>
                        </div>

                        {/* Notes History */}
                        {Object.keys(habitNotes[habit.id] || {}).length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Notes</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {Object.entries(habitNotes[habit.id] || {})
                                .sort((a, b) => b[0].localeCompare(a[0]))
                                .slice(0, 5)
                                .map(([date, note]) => (
                                  note && (
                                    <div key={date} className="p-2 bg-gray-50 rounded-lg">
                                      <div className="text-xs text-gray-500 mb-1">
                                        {format(parseISO(date), 'MMM d, yyyy')}
                                      </div>
                                      <div className="text-sm text-gray-700">{note}</div>
                                    </div>
                                  )
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Edit Habit Button - Coming Soon */}
                        <button
                          onClick={() => {
                            // TODO: Implement habit editing
                            alert('Habit editing coming soon!');
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Habit
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {habits.length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No habits yet. Add your first habit to get started!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="text-sm text-gray-500 mb-1">Total Completions</div>
              <div className="text-3xl font-bold text-gray-900">{analytics.totalCompletions}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-500 mb-1">Average Completion Rate</div>
              <div className="text-3xl font-bold text-gray-900">{analytics.averageCompletionRate}%</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-500 mb-1">Active Habits</div>
              <div className="text-3xl font-bold text-gray-900">{habits.length}</div>
            </div>
          </div>

          {/* Habit Performance */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Habit Performance (Last 30 Days)</h3>
            <div className="space-y-4">
              {analytics.habits.map((stat) => {
                const IconComponent = habitIcons[stat.habit.icon || ''] || Target;
                return (
                  <div key={stat.habit.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: stat.habit.color || '#10b981' }}
                    >
                      <IconComponent className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{stat.habit.name}</span>
                        <span className="text-sm font-semibold text-gray-700">{stat.completionRate30}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${stat.completionRate30}%`,
                            backgroundColor: stat.habit.color || primaryColor
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Best day: {stat.bestDay}</span>
                        <span>Streak: {stat.streak} days</span>
                        <span>Total: {stat.totalCompletions}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Smart Insights
            </h3>
            <div className="space-y-3">
              {insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Complete more habits to unlock insights!
                </p>
              )}
            </div>
          </div>

          {/* Weekly Report */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Summary</h3>
            <div className="space-y-3">
              {weekDays.map((day) => {
                const dayString = format(day, 'yyyy-MM-dd');
                const completedCount = habits.filter(h => {
                  const completedDates = (h.completed_dates as any) || [];
                  return Array.isArray(completedDates) && completedDates.includes(dayString);
                }).length;
                const dayRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
                
                return (
                  <div key={dayString} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-20">
                        {format(day, 'EEE')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(day, 'MMM d')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${dayRate}%`,
                            backgroundColor: primaryColor
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                        {dayRate}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-4 sm:p-6 shadow-elevated my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold">Add New Habit</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="e.g., Morning Meditation"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setNewHabit({ ...newHabit, icon: option.id })}
                      className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                        newHabit.icon === option.id
                          ? 'ring-2'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={newHabit.icon === option.id ? {
                        backgroundColor: colorPresets[colorPreset]?.light,
                        color: primaryColor,
                        ['--tw-ring-color' as string]: primaryColor
                      } : undefined}
                    >
                      <option.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewHabit({ ...newHabit, color })}
                      className={`w-10 h-10 rounded-xl transition-all ${
                        newHabit.color === color ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={handleAddHabit} className="flex-1 btn-primary">
                  Add Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
