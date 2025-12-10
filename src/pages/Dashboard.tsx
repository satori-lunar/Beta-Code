import { useState } from 'react';
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
  X
} from 'lucide-react';
import { useStore } from '../store/useStore';
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
  { id: 'badges', type: 'badges', title: 'Your Badges', size: 'full', visible: true },
  { id: 'stats', type: 'stats', title: 'Stats Grid', size: 'full', visible: true },
  { id: 'live-classes', type: 'live-classes', title: "Today's Live Classes", size: 'full', visible: true },
  { id: 'habits', type: 'habits', title: "Today's Habits", size: 'medium', visible: true },
  { id: 'upcoming-class', type: 'upcoming-class', title: 'Next Live Class', size: 'medium', visible: true },
  { id: 'course-progress', type: 'course-progress', title: 'Course Progress', size: 'medium', visible: true },
  { id: 'journal', type: 'journal', title: 'Latest Journal', size: 'full', visible: true },
];

const availableWidgets = [
  { type: 'welcome', title: 'Welcome Header', description: 'Greeting with streak and badges count' },
  { type: 'badges', title: 'Your Badges', description: 'Display earned badges' },
  { type: 'stats', title: 'Stats Grid', description: 'Habits, water, sleep, weight stats' },
  { type: 'live-classes', title: "Today's Live Classes", description: 'Live classes scheduled for today' },
  { type: 'habits', title: "Today's Habits", description: 'Track daily habits' },
  { type: 'upcoming-class', title: 'Next Live Class', description: 'Upcoming class info' },
  { type: 'course-progress', title: 'Course Progress', description: 'Track course completion' },
  { type: 'journal', title: 'Latest Journal', description: 'Recent journal entry' },
];

export default function Dashboard() {
  const { user, habits, courses, liveClasses, weightEntries, journalEntries } = useStore();
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('dashboardWidgets');
    return saved ? JSON.parse(saved) : defaultWidgets;
  });
  const [editMode, setEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  const completedHabitsToday = habits.filter(h =>
    h.completedDates.includes(today)
  ).length;

  const upcomingClass = liveClasses.find(c => new Date(c.scheduledAt) > new Date());

  const todaysClasses = liveClasses.filter(c => {
    const classDate = parseISO(c.scheduledAt);
    return isToday(classDate);
  }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const latestWeight = weightEntries[weightEntries.length - 1];
  const previousWeight = weightEntries[weightEntries.length - 2];
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
    <div className="bg-gradient-to-r from-coral-500 to-primary-500 rounded-3xl p-6 lg:p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
            Good {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-white/80">
            You're doing great! Keep up with your wellness journey.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Flame className="w-8 h-8 text-yellow-300 animate-pulse-slow" />
              <span className="text-4xl font-bold">{user?.streak || 0}</span>
            </div>
            <p className="text-sm text-white/80">Day Streak</p>
          </div>
          <div className="w-px h-16 bg-white/20" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="w-8 h-8 text-yellow-300" />
              <span className="text-4xl font-bold">{user?.badges?.length || 0}</span>
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
        <Link to="/badges" className="text-coral-600 hover:text-coral-700 text-sm font-medium flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {user?.badges?.map((badge) => {
          const IconComponent = badgeIcons[badge.icon] || Award;
          return (
            <div
              key={badge.id}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 min-w-[120px]"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800 text-center">{badge.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const StatsWidget = () => (
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
        <p className="text-2xl font-bold text-gray-900">1,750ml</p>
        <p className="text-xs text-gray-500 mt-1">87% of daily goal</p>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Moon className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-sm text-gray-500">Sleep</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">7:49h</p>
        <p className="text-xs text-gray-500 mt-1">Ideal: 8:20h</p>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-coral-600" />
          </div>
          <span className="text-sm text-gray-500">Weight</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {latestWeight?.weight || '--'}{latestWeight?.unit || ''}
        </p>
        {weightChange && (
          <p className={`text-xs mt-1 ${Number(weightChange) < 0 ? 'text-green-600' : 'text-gray-500'}`}>
            {Number(weightChange) < 0 ? '' : '+'}{weightChange} {latestWeight?.unit} this week
          </p>
        )}
      </div>
    </div>
  );

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
          <Link to="/classes" className="text-coral-600 hover:text-coral-700 text-sm font-medium flex items-center gap-1">
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
                className={`p-4 rounded-xl border transition-all ${
                  isLive
                    ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200 ring-2 ring-red-200'
                    : isPast
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-white border-gray-200 hover:border-coral-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {format(classTime, 'h:mm a')}
                    </span>
                  </div>
                  {isLive && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full animate-pulse">
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
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isLive
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-coral-500 hover:bg-coral-600 text-white'
                      }`}
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
        <Link to="/habits" className="text-coral-600 hover:text-coral-700 text-sm font-medium flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {habits.slice(0, 5).map((habit) => {
          const isCompleted = habit.completedDates.includes(today);
          return (
            <div
              key={habit.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                isCompleted ? 'bg-sage-50' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: habit.color + '30' }}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-sage-600" />
                ) : (
                  <Circle className="w-5 h-5" style={{ color: habit.color }} />
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
      <div className="card bg-gradient-to-br from-navy-800 to-navy-900 text-white h-full">
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
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 rounded-xl text-sm font-medium transition-colors"
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
        <Link to="/courses" className="text-coral-600 hover:text-coral-700 text-sm font-medium flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {courses.slice(0, 3).map((course) => {
          const progress = Math.round((course.completedSessions / course.sessions) * 100);
          return (
            <div key={course.id} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center text-coral-600 font-bold text-sm">
                {progress}%
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{course.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-coral-400 to-coral-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
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

  const JournalWidget = () => {
    if (journalEntries.length === 0) return null;

    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold text-gray-900">Latest Journal Entry</h2>
          <Link to="/journal" className="text-coral-600 hover:text-coral-700 text-sm font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-4 bg-cream-50 rounded-xl border border-cream-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">{format(new Date(journalEntries[0].date), 'MMMM d, yyyy')}</span>
            <span className={`badge ${getMoodBadgeClass(journalEntries[0].mood)}`}>
              {journalEntries[0].mood}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{journalEntries[0].title}</h3>
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
      default:
        return <div className="card p-4 text-gray-500">Unknown widget</div>;
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Edit Mode Controls */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setShowAddWidget(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            editMode
              ? 'bg-coral-500 text-white hover:bg-coral-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Widget</span>
        </button>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            editMode
              ? 'bg-coral-100 text-coral-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="hidden sm:inline">{editMode ? 'Done' : 'Customize'}</span>
        </button>
      </div>

      {editMode && (
        <div className="p-3 bg-coral-50 border border-coral-200 rounded-xl text-sm text-coral-700 flex items-center justify-between">
          <span><strong>Edit Mode:</strong> Drag to reorder. Click size to resize. Click × to remove.</span>
          <button
            onClick={resetToDefault}
            className="text-coral-600 hover:text-coral-700 font-medium"
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
            } ${editMode ? 'ring-2 ring-coral-200 ring-dashed rounded-2xl' : ''}`}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
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
                {availableWidgets.map(widget => (
                  <button
                    key={widget.type}
                    onClick={() => addWidget(widget.type)}
                    className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors"
                  >
                    <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center text-coral-600 flex-shrink-0">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{widget.title}</p>
                      <p className="text-sm text-gray-500">{widget.description}</p>
                    </div>
                  </button>
                ))}
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
