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
  Video
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

export default function Dashboard() {
  const { user, habits, courses, liveClasses, weightEntries, journalEntries } = useStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const completedHabitsToday = habits.filter(h =>
    h.completedDates.includes(today)
  ).length;

  const upcomingClass = liveClasses.find(c => new Date(c.scheduledAt) > new Date());

  // Get today's live classes
  const todaysClasses = liveClasses.filter(c => {
    const classDate = parseISO(c.scheduledAt);
    return isToday(classDate);
  }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const latestWeight = weightEntries[weightEntries.length - 1];
  const previousWeight = weightEntries[weightEntries.length - 2];
  const weightChange = latestWeight && previousWeight
    ? (latestWeight.weight - previousWeight.weight).toFixed(1)
    : null;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Welcome Header */}
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

      {/* Badges Section */}
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

      {/* Stats Grid */}
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
            {Math.round((completedHabitsToday / habits.length) * 100)}% complete
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

      {/* Today's Live Classes */}
      {todaysClasses.length > 0 && (
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
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Habits */}
        <div className="card">
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

        {/* Upcoming Class */}
        <div className="space-y-6">
          {upcomingClass && (
            <div className="card bg-gradient-to-br from-navy-800 to-navy-900 text-white">
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
          )}

          {/* Course Progress */}
          <div className="card">
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
        </div>
      </div>

      {/* Recent Journal Entry */}
      {journalEntries.length > 0 && (
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
