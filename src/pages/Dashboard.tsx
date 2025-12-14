import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Award,
  Target,
  Droplet,
  Moon,
  Dumbbell,
  Brain,
  Sunrise,
  TrendingUp,
  Calendar,
  PlayCircle,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Video,
  Settings,
  Plus,
  GripVertical,
  X,
  Palette,
  Check,
  Heart,
  Sparkles,
  Smile,
  BookOpen,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits, useWeightEntries, useJournalEntries, useUserBadges, useHealthMetrics, useLiveClasses } from '../hooks/useSupabaseData';
import { format, isToday, parseISO } from 'date-fns';

const badgeIcons: Record<string, React.ElementType> = {
  flame: Flame,
  sunrise: Sunrise,
  droplet: Droplet,
  brain: Brain,
  dumbbell: Dumbbell,
};

interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  visible: boolean;
}

const defaultWidgets: WidgetConfig[] = [
  { id: 'welcome', type: 'welcome', title: 'Welcome Header', size: 'full', visible: true },
  { id: 'wellness-tip', type: 'wellness-tip', title: 'Daily Wellness Tip', size: 'medium', visible: true },
  { id: 'gratitude', type: 'gratitude', title: 'Daily Gratitude', size: 'medium', visible: true },
  { id: 'badges', type: 'badges', title: 'Your Badges', size: 'full', visible: true },
  { id: 'stats', type: 'stats', title: 'Stats Grid', size: 'full', visible: true },
  { id: 'habits', type: 'habits', title: "Today's Habits", size: 'medium', visible: true },
  { id: 'journal', type: 'journal', title: 'Latest Journal Entry', size: 'medium', visible: true },
  { id: 'mood-tracker', type: 'mood-tracker', title: 'How are you feeling?', size: 'medium', visible: true },
];

const availableWidgets = [
  { type: 'welcome', title: 'Welcome Header', description: 'Greeting with streak and badges count', icon: Sunrise },
  { type: 'badges', title: 'Your Badges', description: 'Display earned badges', icon: Award },
  { type: 'stats', title: 'Stats Grid', description: 'Habits, water, sleep, weight stats', icon: TrendingUp },
  { type: 'habits', title: "Today's Habits", description: 'Track daily habits', icon: Target },
  { type: 'journal', title: 'Latest Journal Entry', description: 'Recent journal entry', icon: BookOpen },
  { type: 'wellness-tip', title: 'Daily Wellness Tip', description: 'Inspirational wellness quotes and tips', icon: Sparkles },
  { type: 'gratitude', title: 'Daily Gratitude', description: 'Prompt for daily gratitude practice', icon: Heart },
  { type: 'mood-tracker', title: 'Mood Tracker', description: 'Quick mood check-in widget', icon: Smile },
  { type: 'live-classes', title: "Today's Live Classes", description: 'Live classes scheduled for today', icon: Video },
  { type: 'upcoming-class', title: 'Next Live Class', description: 'Upcoming class info', icon: Calendar },
  { type: 'course-progress', title: 'Course Progress', description: 'Track course completion', icon: Star },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: habits = [], loading: habitsLoading } = useHabits();
  const { data: weightEntries = [], loading: weightLoading } = useWeightEntries();
  const { data: journalEntries = [], loading: journalLoading } = useJournalEntries();
  const { data: userBadges = [], loading: badgesLoading } = useUserBadges();
  const { metrics: healthMetrics, loading: metricsLoading } = useHealthMetrics();
  const { classes: liveClasses = [], loading: classesLoading } = useLiveClasses();
  const { colorPreset, setColorPreset, colorPresets, primaryColor } = useTheme();
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('dashboardWidgets');
    return saved ? JSON.parse(saved) : defaultWidgets;
  });
  const [editMode, setEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  // For now, use empty arrays for data not yet in Supabase
  const courses: any[] = [];
  
  // Check if any data is still loading
  const isLoading = habitsLoading || weightLoading || journalLoading || badgesLoading || metricsLoading || classesLoading;

  // Show loading state if data is still loading
  if (isLoading && habits.length === 0 && weightEntries.length === 0 && journalEntries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-coral-200 border-t-coral-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const completedHabitsToday = habits.filter(h => {
    const completedDates = h.completed_dates as any;
    return Array.isArray(completedDates) && completedDates.includes(today);
  }).length;

  // Map live classes to expected format (use useMemo to prevent recalculation)
  const mappedLiveClasses = useMemo(() => {
    return (liveClasses || []).map(cls => ({
      id: cls.id,
      title: cls.title,
      description: cls.description || '',
      instructor: cls.instructor,
      scheduledAt: cls.scheduled_at,
      duration: cls.duration,
      zoomLink: cls.zoom_link || '#',
      thumbnail: cls.thumbnail_url || '',
      category: cls.category,
    }));
  }, [liveClasses]);

  const upcomingClass = useMemo(() => {
    return mappedLiveClasses.find(c => new Date(c.scheduledAt) > new Date());
  }, [mappedLiveClasses]);

  const todaysClasses = useMemo(() => {
    return mappedLiveClasses.filter(c => {
      const classDate = parseISO(c.scheduledAt);
      return isToday(classDate);
    }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [mappedLiveClasses]);

  const latestWeight = weightEntries[0]; // Already sorted descending by date
  const previousWeight = weightEntries[1];
  const weightChange = latestWeight && previousWeight
    ? (latestWeight.weight - previousWeight.weight).toFixed(1)
    : null;

  // Save widgets to localStorage whenever they change
  const saveWidgets = (newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(newWidgets));
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidget || draggedWidget === targetId) return;

    const newWidgets = [...widgets];
    const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidget);
    const targetIndex = newWidgets.findIndex(w => w.id === targetId);

    const [removed] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, removed);

    saveWidgets(newWidgets);
    setDraggedWidget(null);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const cycleWidgetSize = (id: string) => {
    const newWidgets = widgets.map(w => {
      if (w.id === id) {
        const sizes: Array<'small' | 'medium' | 'large' | 'full'> = ['small', 'medium', 'large', 'full'];
        const currentIndex = sizes.indexOf(w.size);
        const nextIndex = (currentIndex + 1) % sizes.length;
        return { ...w, size: sizes[nextIndex] };
      }
      return w;
    });
    saveWidgets(newWidgets);
  };

  const removeWidget = (id: string) => {
    saveWidgets(widgets.filter(w => w.id !== id));
  };

  const addWidget = (type: string) => {
    const widgetInfo = availableWidgets.find(w => w.type === type);
    if (!widgetInfo) return;

    // Check if widget of this type already exists
    const alreadyExists = widgets.some(w => w.type === type && w.visible);
    if (alreadyExists) {
      // Don't add duplicates, but close the modal
      setShowAddWidget(false);
      return;
    }

    const newWidget: WidgetConfig = {
      id: `${type}-${Date.now()}`,
      type,
      title: widgetInfo.title,
      size: 'medium',
      visible: true,
    };

    saveWidgets([...widgets, newWidget]);
    setShowAddWidget(false);
  };

  const resetToDefault = () => {
    saveWidgets(defaultWidgets);
  };

  const getWidgetClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-12 sm:col-span-6 lg:col-span-4';
      case 'medium':
        return 'col-span-12 lg:col-span-6';
      case 'large':
        return 'col-span-12 lg:col-span-8';
      case 'full':
        return 'col-span-12';
      default:
        return 'col-span-12 lg:col-span-6';
    }
  };

  // Widget Components
  const WelcomeWidget = () => (
    <div
      className="rounded-3xl p-6 lg:p-8 text-white"
      style={{
        background: `linear-gradient(to right, ${primaryColor}, ${colorPresets[colorPreset]?.colors[1] || primaryColor})`
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
            Good {getGreeting()}, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'}!
          </h1>
          <p className="text-white/80">
            You're doing great! Keep up with your wellness journey.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Flame className="w-8 h-8 text-yellow-300 animate-pulse-slow" />
              <span className="text-4xl font-bold">{completedHabitsToday}</span>
            </div>
            <p className="text-sm text-white/80">Habits Today</p>
          </div>
          <div className="w-px h-16 bg-white/20" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="w-8 h-8 text-yellow-300" />
              <span className="text-4xl font-bold">{userBadges.length}</span>
            </div>
            <p className="text-sm text-white/80">Badges</p>
          </div>
        </div>
      </div>
    </div>
  );

  const BadgesWidget = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-semibold text-gray-900">Your Badges</h2>
        <Link
          to="/badges"
          className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
          style={{ color: primaryColor }}
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {userBadges.map((badge) => {
          const IconComponent = badgeIcons[badge.icon || ''] || Award;
          return (
            <div
              key={badge.id}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border min-w-[120px]"
              style={{
                background: `linear-gradient(to bottom right, ${colorPresets[colorPreset]?.light}, ${colorPresets[colorPreset]?.light}dd)`,
                borderColor: `${primaryColor}30`
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(to bottom right, ${primaryColor}, ${colorPresets[colorPreset]?.colors[1]})`
                }}
              >
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800 text-center">{badge.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const StatsWidget = () => {
    // Get water intake from health metrics
    const hydration = healthMetrics?.hydration as { value?: number; goal?: number } | null;
    const waterIntake = hydration?.value || 0;
    const waterGoal = hydration?.goal || 2000; // Default 2000ml goal
    const waterPercentage = waterGoal > 0 ? Math.round((waterIntake / waterGoal) * 100) : 0;

    // Get sleep from health metrics
    const sleepData = healthMetrics?.sleep_hours as { value?: number; goal?: number } | null;
    const sleepHours = sleepData?.value || 0;
    const sleepGoal = sleepData?.goal || 8;
    const sleepFormatted = sleepHours > 0 
      ? `${Math.floor(sleepHours)}:${String(Math.round((sleepHours % 1) * 60)).padStart(2, '0')}h`
      : '--';

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-sage-600" />
            </div>
            <span className="text-sm text-gray-500">Today's Habits</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {completedHabitsToday}/{habits.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {habits.length > 0 ? Math.round((completedHabitsToday / habits.length) * 100) : 0}% complete
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Water Intake</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {waterIntake > 0 ? `${waterIntake.toLocaleString()}ml` : '--'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {waterIntake > 0 ? `${waterPercentage}% of ${waterGoal}ml goal` : 'No data logged'}
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Sleep</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{sleepFormatted}</p>
          <p className="text-xs text-gray-500 mt-1">
            {sleepHours > 0 ? `Goal: ${sleepGoal}h` : 'No data logged'}
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colorPresets[colorPreset]?.light }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <span className="text-sm text-gray-500">Weight</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {latestWeight?.weight || '--'}{latestWeight?.unit ? ` ${latestWeight.unit}` : ''}
          </p>
          {weightChange ? (
            <p className={`text-xs mt-1 ${Number(weightChange) < 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {Number(weightChange) < 0 ? '' : '+'}{weightChange} {latestWeight?.unit} this week
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              {latestWeight ? 'Log more to track progress' : 'No data logged'}
            </p>
          )}
        </div>
      </div>
    );
  };

  const LiveClassesWidget = () => {
    if (todaysClasses.length === 0) return null;

    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">Today's Live Classes</h2>
              <p className="text-sm text-gray-500">{todaysClasses.length} class{todaysClasses.length !== 1 ? 'es' : ''} scheduled</p>
            </div>
          </div>
          <Link
            to="/classes"
            className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
            style={{ color: primaryColor }}
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todaysClasses.map((liveClass) => {
            const classTime = new Date(liveClass.scheduledAt);
            const now = new Date();
            const isLive = classTime <= now && classTime.getTime() + liveClass.duration * 60000 > now.getTime();
            const isPast = classTime.getTime() + liveClass.duration * 60000 < now.getTime();

            return (
              <div
                key={liveClass.id}
                className="p-4 rounded-xl border transition-all"
                style={{
                  background: isLive
                    ? `linear-gradient(to bottom right, ${colorPresets[colorPreset]?.light}, white)`
                    : isPast ? '#f9fafb' : 'white',
                  borderColor: isLive ? primaryColor : isPast ? '#e5e7eb' : '#e5e7eb',
                  opacity: isPast ? 0.6 : 1,
                  boxShadow: isLive ? `0 0 0 2px ${primaryColor}40` : undefined
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {format(classTime, 'h:mm a')}
                    </span>
                  </div>
                  {isLive && (
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 text-white text-xs font-medium rounded-full animate-pulse"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      LIVE
                    </span>
                  )}
                  {isPast && (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                      Ended
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{liveClass.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{liveClass.instructor}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {liveClass.duration} min
                  </span>
                  {!isPast && (
                    <a
                      href={liveClass.zoomLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <PlayCircle className="w-4 h-4" />
                      {isLive ? 'Join Now' : 'Join'}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const HabitsWidget = () => (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-semibold text-gray-900">Today's Habits</h2>
        <Link
          to="/habits"
          className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
          style={{ color: primaryColor }}
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {habits.slice(0, 5).map((habit) => {
          const completedDates = (habit.completed_dates as any) || [];
          const isCompleted = Array.isArray(completedDates) && completedDates.includes(today);
          return (
            <div
              key={habit.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                isCompleted ? 'bg-sage-50' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: (habit.color || '#10b981') + '30' }}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-sage-600" />
                ) : (
                  <Circle className="w-5 h-5" style={{ color: habit.color || '#10b981' }} />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {habit.name}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {habit.streak} day streak
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const UpcomingClassWidget = () => {
    if (!upcomingClass) return null;

    return (
      <div
        className="card text-white h-full"
        style={{
          background: `linear-gradient(to bottom right, ${colorPresets[colorPreset]?.dark}, ${primaryColor})`
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-white/60 mb-1">Next Live Class</p>
            <h3 className="text-lg font-semibold">{upcomingClass.title}</h3>
          </div>
          <div className="p-2 bg-white/10 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <p className="text-sm text-white/70 mb-4">{upcomingClass.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/60">
            {format(new Date(upcomingClass.scheduledAt), 'MMM d, h:mm a')}
          </div>
          <Link
            to="/classes"
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm"
          >
            <PlayCircle className="w-4 h-4" />
            Join Class
          </Link>
        </div>
      </div>
    );
  };

  const CourseProgressWidget = () => (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-semibold text-gray-900">Course Progress</h2>
        <Link
          to="/courses"
          className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
          style={{ color: primaryColor }}
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {courses.slice(0, 3).map((course) => {
          const progress = Math.round((course.completedSessions / course.sessions) * 100);
          return (
            <div key={course.id} className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{
                  background: `linear-gradient(to bottom right, ${colorPresets[colorPreset]?.light}, ${colorPresets[colorPreset]?.light}aa)`,
                  color: primaryColor
                }}
              >
                {progress}%
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{course.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(to right, ${primaryColor}, ${colorPresets[colorPreset]?.colors[1]})`
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {course.completedSessions}/{course.sessions}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const WellnessTipWidget = () => {
    const tips = [
      { quote: "Self-care isn't selfish. It's essential.", author: "Unknown" },
      { quote: "Progress, not perfection, is the goal.", author: "Unknown" },
      { quote: "Every small step forward is a victory worth celebrating.", author: "Unknown" },
      { quote: "You are stronger than you think and more capable than you know.", author: "Unknown" },
      { quote: "Take time for yourself. You deserve it.", author: "Unknown" },
      { quote: "Wellness is a journey, not a destination.", author: "Unknown" },
      { quote: "Your mental health is just as important as your physical health.", author: "Unknown" },
      { quote: "Be kind to yourself. You're doing your best.", author: "Unknown" },
    ];
    
    const todayTip = tips[new Date().getDate() % tips.length];
    
    return (
      <div className="card h-full">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: colorPresets[colorPreset]?.light }}
          >
            <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-xl font-display font-semibold text-gray-900">Daily Wellness Tip</h2>
        </div>
        <div
          className="p-6 rounded-xl"
          style={{
            background: `linear-gradient(to bottom right, ${colorPresets[colorPreset]?.light}, ${colorPresets[colorPreset]?.light}dd)`,
          }}
        >
          <p className="text-lg font-medium text-gray-900 mb-2 italic">"{todayTip.quote}"</p>
          <p className="text-sm text-gray-600">— {todayTip.author}</p>
        </div>
      </div>
    );
  };

  const GratitudeWidget = () => {
    const prompts = [
      "What made you smile today?",
      "Who are you grateful for?",
      "What moment brought you joy?",
      "What are you thankful for today?",
      "What simple pleasure are you grateful for?",
    ];
    
    const todayPrompt = prompts[new Date().getDate() % prompts.length];
    
    return (
      <div className="card h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <h2 className="text-xl font-display font-semibold text-gray-900">Daily Gratitude</h2>
        </div>
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: colorPresets[colorPreset]?.light,
            borderColor: `${primaryColor}30`
          }}
        >
          <p className="text-gray-700 mb-4 font-medium">{todayPrompt}</p>
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            <BookOpen className="w-4 h-4" />
            Write in Journal
          </Link>
        </div>
      </div>
    );
  };

  const MoodTrackerWidget = () => {
    const recentMoods = journalEntries
      .slice(0, 5)
      .map(entry => ({
        date: entry.date,
        mood: entry.mood || 'neutral',
      }))
      .reverse();
    
    return (
      <div className="card h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Smile className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-display font-semibold text-gray-900">How are you feeling?</h2>
          </div>
          <Link
            to="/journal"
            className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
            style={{ color: primaryColor }}
          >
            Log Mood <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {recentMoods.length > 0 ? (
          <div className="space-y-3">
            {recentMoods.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <span className={`badge ${getMoodBadgeClass(entry.mood)}`}>
                  {entry.mood}
                </span>
                <span className="text-sm text-gray-600 flex-1">
                  {format(parseISO(entry.date), 'MMM d')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="p-6 rounded-xl border text-center"
            style={{
              backgroundColor: colorPresets[colorPreset]?.light,
              borderColor: `${primaryColor}30`
            }}
          >
            <Smile className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Start tracking your mood</p>
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-4 h-4" />
              Add Mood Entry
            </Link>
          </div>
        )}
      </div>
    );
  };

  const JournalWidget = () => {
    if (journalEntries.length === 0) {
      return (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-gray-900">Latest Journal Entry</h2>
            <Link
              to="/journal"
              className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
              style={{ color: primaryColor }}
            >
              Start Journaling <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div
            className="p-8 rounded-xl border text-center"
            style={{
              backgroundColor: colorPresets[colorPreset]?.light,
              borderColor: `${primaryColor}30`
            }}
          >
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Start your wellness journey with journaling</p>
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-4 h-4" />
              Create First Entry
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold text-gray-900">Latest Journal Entry</h2>
          <Link
            to="/journal"
            className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
            style={{ color: primaryColor }}
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: colorPresets[colorPreset]?.light,
            borderColor: `${primaryColor}30`
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">{format(new Date(journalEntries[0].date || new Date()), 'MMMM d, yyyy')}</span>
            <span className={`badge ${getMoodBadgeClass(journalEntries[0].mood || 'neutral')}`}>
              {journalEntries[0].mood || 'neutral'}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{journalEntries[0].title || 'Untitled'}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{journalEntries[0].content}</p>
        </div>
      </div>
    );
  };

  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'welcome':
        return <WelcomeWidget />;
      case 'badges':
        return <BadgesWidget />;
      case 'stats':
        return <StatsWidget />;
      case 'live-classes':
        return <LiveClassesWidget />;
      case 'habits':
        return <HabitsWidget />;
      case 'upcoming-class':
        return <UpcomingClassWidget />;
      case 'course-progress':
        return <CourseProgressWidget />;
      case 'journal':
        return <JournalWidget />;
      case 'wellness-tip':
        return <WellnessTipWidget />;
      case 'gratitude':
        return <GratitudeWidget />;
      case 'mood-tracker':
        return <MoodTrackerWidget />;
      default:
        return <div className="card p-4 text-gray-500">Unknown widget</div>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 lg:pb-0">
      {/* Edit Mode Controls */}
      <div className="flex items-center justify-end gap-2">
        {/* Theme Picker Button */}
        <div className="relative">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Palette className="w-5 h-5" style={{ color: primaryColor }} />
            <span className="hidden sm:inline">Theme</span>
          </button>

          {/* Theme Picker Dropdown */}
          {showThemePicker && (
            <div className="absolute right-0 top-12 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-[calc(100vw-2rem)] sm:w-64 max-w-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Color Theme</h4>
                <button
                  onClick={() => setShowThemePicker(false)}
                  className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(colorPresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setColorPreset(key);
                      setShowThemePicker(false);
                    }}
                    className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      colorPreset === key ? 'ring-2 ring-offset-1' : 'hover:bg-gray-50'
                    }`}
                    style={{
                      ['--tw-ring-color' as string]: colorPreset === key ? preset.colors[0] : undefined
                    }}
                  >
                    <div className="flex -space-x-1">
                      {preset.colors.slice(0, 2).map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">{preset.name}</span>
                    {colorPreset === key && (
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: preset.colors[0] }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowAddWidget(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors theme-bg-primary text-white hover:theme-bg-primary-dark"
          style={{ backgroundColor: editMode ? primaryColor : undefined }}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Widget</span>
        </button>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          style={{
            backgroundColor: editMode ? colorPresets[colorPreset]?.light : '#f3f4f6',
            color: editMode ? primaryColor : '#4b5563'
          }}
        >
          <Settings className="w-5 h-5" />
          <span className="hidden sm:inline">{editMode ? 'Done' : 'Customize'}</span>
        </button>
      </div>

      {editMode && (
        <div
          className="p-3 rounded-xl text-sm flex items-center justify-between"
          style={{
            backgroundColor: colorPresets[colorPreset]?.light,
            borderColor: primaryColor,
            color: primaryColor,
            border: '1px solid'
          }}
        >
          <span><strong>Edit Mode:</strong> Drag to reorder. Click size to resize. Click × to remove.</span>
          <button
            onClick={resetToDefault}
            className="font-medium hover:opacity-80"
            style={{ color: primaryColor }}
          >
            Reset to Default
          </button>
        </div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-12 gap-6">
        {widgets.filter(w => w.visible).map(widget => (
          <div
            key={widget.id}
            className={`${getWidgetClasses(widget.size)} transition-all duration-300 ${
              draggedWidget === widget.id ? 'opacity-50' : ''
            } ${editMode ? 'ring-2 ring-dashed rounded-2xl' : ''}`}
            style={editMode ? { ['--tw-ring-color' as string]: `${primaryColor}40` } : undefined}
            draggable={editMode}
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, widget.id)}
            onDragEnd={handleDragEnd}
          >
            <div className="relative h-full">
              {editMode && (
                <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="cursor-move p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <button
                      onClick={() => cycleWidgetSize(widget.id)}
                      className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-xs font-medium text-gray-600 hover:bg-white"
                    >
                      {widget.size}
                    </button>
                  </div>
                  <button
                    onClick={() => removeWidget(widget.id)}
                    className="p-1.5 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="h-full">
                {renderWidget(widget)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden my-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Add Widget</h3>
              <button
                onClick={() => setShowAddWidget(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="grid gap-3">
                {availableWidgets.map(widget => {
                  const isAdded = widgets.some(w => w.type === widget.type && w.visible);
                  const IconComponent = widget.icon || Plus;
                  
                  return (
                    <button
                      key={widget.type}
                      onClick={() => addWidget(widget.type)}
                      disabled={isAdded}
                      className={`flex items-start gap-4 p-4 rounded-xl text-left transition-colors ${
                        isAdded
                          ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isAdded ? '#e5e7eb' : colorPresets[colorPreset]?.light,
                          color: isAdded ? '#9ca3af' : primaryColor
                        }}
                      >
                        {isAdded ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <IconComponent className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{widget.title}</p>
                          {isAdded && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              Added
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{widget.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

function getMoodBadgeClass(mood: string) {
  const classes: Record<string, string> = {
    great: 'bg-green-100 text-green-700',
    good: 'bg-sage-100 text-sage-700',
    neutral: 'bg-gray-100 text-gray-700',
    low: 'bg-amber-100 text-amber-700',
    bad: 'bg-red-100 text-red-700',
  };
  return classes[mood] || 'bg-gray-100 text-gray-700';
}
