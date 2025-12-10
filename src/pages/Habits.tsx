import { useState } from 'react';
import {
  Plus,
  Flame,
  CheckCircle2,
  Circle,
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
  Sun
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits } from '../hooks/useSupabaseData';
import { supabase } from '../lib/supabase';
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns';

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

export default function Habits() {
  const { user } = useAuth();
  const { data: habits = [], refetch } = useHabits();
  const { colorPreset, colorPresets, primaryColor } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: 'target',
    color: colorOptions[0],
  });

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const completedToday = habits.filter(h => {
    const completedDates = h.completed_dates as any;
    return Array.isArray(completedDates) && completedDates.includes(dateString);
  }).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleToggle = async (habitId: string) => {
    if (!user) return;
    
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const completedDates = (habit.completed_dates as any) || [];
    const newCompletedDates = completedDates.includes(dateString)
      ? completedDates.filter((d: string) => d !== dateString)
      : [...completedDates, dateString];

    await supabase
      .from('habits')
      .update({ completed_dates: newCompletedDates })
      .eq('id', habitId);
    
    refetch();
  };

  const handleAddHabit = async () => {
    if (!user || !newHabit.name.trim()) return;

    await supabase.from('habits').insert({
      user_id: user.id,
      name: newHabit.name,
      icon: newHabit.icon,
      color: newHabit.color,
      frequency: 'daily',
      completed_dates: []
    });
    
    refetch();
    setNewHabit({ name: '', icon: 'target', color: colorOptions[0] });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
            Habit Tracker
          </h1>
          <p className="text-gray-500 mt-1">Track your daily habits and build consistency</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          Add Habit
        </button>
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
          <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
          <p className="text-sm text-gray-500">Completion Rate</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.max(...habits.map(h => h.streak), 0)}
          </p>
          <p className="text-sm text-gray-500">Best Streak</p>
        </div>
      </div>

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

      {/* Habits List */}
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

            return (
              <div
                key={habit.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-sage-50 border border-sage-200'
                    : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                }`}
                onClick={() => handleToggle(habit.id)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                  style={{ backgroundColor: habit.color || '#10b981' }}
                >
                  <IconComponent className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {habit.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" /> {habit.streak || 0} day streak
                    </span>
                    <span className="text-xs text-gray-400">
                      {Array.isArray(completedDates) ? completedDates.length : 0} total completions
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7 text-sage-600" />
                  ) : (
                    <Circle className="w-7 h-7 text-gray-300" />
                  )}
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await supabase.from('habits').delete().eq('id', habit.id);
                      refetch();
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-elevated">
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
