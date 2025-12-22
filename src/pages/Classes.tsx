import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  PlayCircle,
  Clock,
  User,
  Calendar,
  Heart,
  Eye,
  Video,
  ExternalLink,
  Radio,
  CheckCircle2,
  ChevronRight,
  Moon,
  UtensilsCrossed,
  Sparkles,
  Target,
  Sunrise,
  Sunset,
  Dumbbell,
  Brain,
  Users,
  Leaf,
  Timer,
  Activity,
  Flame,
  Waves,
  Flower2,
} from 'lucide-react';
import { useRecordedSessions, useLiveClasses, useFavoriteSessions, useSessionCompletions, useClassReminders } from '../hooks/useSupabaseData';
import { useCourses } from '../hooks/useCourses';
import { useReminderChecker } from '../hooks/useReminderChecker';
import { useTrackVideoView, useTrackFavorite, useTrackReminder } from '../hooks/useActivityTracking';
import { format, parseISO, isAfter, isBefore, addHours } from 'date-fns';
import ReminderModal from '../components/ReminderModal';


const classImages: Record<string, string> = {
  'Yoga': 'from-pink-400 to-rose-500',
  'Meditation': 'from-purple-400 to-indigo-500',
  'Fitness': 'from-green-400 to-teal-500',
  'Nutrition': 'from-orange-400 to-amber-500',
  'Sleep': 'from-blue-400 to-indigo-500',
  'Wellness': 'from-coral-400 to-pink-500',
};

// Course-specific gradients and icons for visual variety
const courseStyles: Record<string, { gradient: string; icon: any }> = {
  'Wisdom Rising': { gradient: 'from-purple-500 to-indigo-600', icon: Sparkles },
  'Hatha Yoga with Meghan': { gradient: 'from-pink-400 to-rose-500', icon: Flower2 },
  'Hatha Yoga': { gradient: 'from-pink-400 to-rose-500', icon: Flower2 },
  'Time Management Replay': { gradient: 'from-blue-500 to-cyan-600', icon: Timer },
  'Foundations in Motion': { gradient: 'from-green-500 to-emerald-600', icon: Activity },
  'Nighttime Nurturing': { gradient: 'from-indigo-500 to-purple-600', icon: Moon },
  '2-Bite Tuesdays': { gradient: 'from-orange-400 to-amber-500', icon: UtensilsCrossed },
  'Refreshed & Ready': { gradient: 'from-yellow-400 to-orange-500', icon: Sunrise },
  'Refreshed and Ready': { gradient: 'from-yellow-400 to-orange-500', icon: Sunrise },
  'Evenings with Emily B': { gradient: 'from-pink-500 to-rose-600', icon: Sunset },
  'Evenings with Emily B.': { gradient: 'from-pink-500 to-rose-600', icon: Sunset },
  'The Habit Lab': { gradient: 'from-teal-500 to-cyan-600', icon: Target },
  'Habit Lab': { gradient: 'from-teal-500 to-cyan-600', icon: Target },
  'Energy in Motion': { gradient: 'from-red-500 to-orange-600', icon: Flame },
  'Strength in Motion': { gradient: 'from-slate-600 to-gray-700', icon: Dumbbell },
  'Made 2 Move: Group Exercise Replays': { gradient: 'from-green-500 to-teal-600', icon: Activity },
  'Inner Chords': { gradient: 'from-violet-500 to-purple-600', icon: Waves },
  'Instinctive Meditation': { gradient: 'from-indigo-400 to-blue-500', icon: Brain },
  'The Reflecting Pool': { gradient: 'from-blue-400 to-indigo-500', icon: Activity },
  'Tangled: Challenging Relationships': { gradient: 'from-rose-500 to-pink-600', icon: Users },
  'The Heart of Nourishment': { gradient: 'from-amber-400 to-orange-500', icon: Heart },
  'Grief & Growth': { gradient: 'from-gray-500 to-slate-600', icon: Flower2 },
  'Rooted Weight Health': { gradient: 'from-emerald-500 to-green-600', icon: Leaf },
  'Declutter to Breathe': { gradient: 'from-sky-400 to-blue-500', icon: Waves },
  'Seedlings': { gradient: 'from-lime-400 to-green-500', icon: Leaf },
  'Plan Your Week': { gradient: 'from-cyan-500 to-blue-600', icon: Calendar },
};

export default function Classes() {
  const location = useLocation();
  const { sessions: recordedSessions, loading: sessionsLoading } = useRecordedSessions();
  const { classes: liveClasses, loading: classesLoading } = useLiveClasses();
  const { favoriteIds, toggleFavorite } = useFavoriteSessions();
  const { completedIds, toggleCompletion } = useSessionCompletions();
  const { courses: courseList, loading: coursesLoading } = useCourses();
  const { trackView } = useTrackVideoView();
  const { trackFavorite } = useTrackFavorite();

  // Check for due reminders
  useReminderChecker();

  // Get initial tab from navigation state (e.g. from HealthDashboard)
  const initialState = (location.state as any) || {};
  const [activeTab, setActiveTab] = useState<'live' | 'recorded' | 'favorites' | 'completed'>(
    initialState.activeTab || 'live'
  );
  const [selectedWeekday, setSelectedWeekday] = useState<string>('Sunday');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const now = new Date();

  // Helper functions
  const isClassLive = (scheduledAt: string, duration: number) => {
    const startTime = parseISO(scheduledAt);
    const endTime = addHours(startTime, duration / 60);
    return isAfter(now, startTime) && isBefore(now, endTime);
  };

  // Map Supabase data to component format
  const mappedRecordedSessions = useMemo(() => {
    return (recordedSessions || []).map(session => ({
      id: session.id,
      title: session.title,
      description: session.description || '',
      instructor: session.instructor,
      recordedAt: session.recorded_at,
      duration: session.duration,
      videoUrl: session.video_url,
      thumbnail: session.thumbnail_url || '',
      category: session.category,
      views: session.views || 0,
      isFavorite: favoriteIds.has(session.id),
      isCompleted: completedIds.has(session.id),
      tags: session.tags || [],
      courseId: session.course_id || null,
    }));
  }, [recordedSessions, favoriteIds, completedIds]);

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
      isLive: isClassLive(cls.scheduled_at, cls.duration),
    }));
  }, [liveClasses]);

  // Filtered data - no filters for live classes, just use all classes
  const filteredLiveClasses = mappedLiveClasses;

  // Define class structure matching the SQL file exactly
  // This ensures the same order and grouping as defined in insert-live-classes.sql
  const classStructureByWeekday: Record<string, string[]> = {
    'Sunday': [
      'Plan Your Week',
      'Rooted Weight Health'
    ],
    'Monday': [
      'The Heart of Nourishment',
      'Foundations in Motion',
      'Hatha Yoga',
      'Seedlings'
    ],
    'Tuesday': [
      'Inner Chords',
      'Strength in Motion',
      'The Reflecting Pool',
      'Wisdom Rising',
      '2-Bite Tuesdays'
    ],
    'Wednesday': [
      'Refreshed & Ready',
      'Grief & Growth',
      'Instinctive Meditation'
    ],
    'Thursday': [
      'Rooted Weight Health',
      'Tangled: Challenging Relationships',
      'Hatha Yoga',
      'Evenings with Emily B'
    ],
    'Friday': [
      'The Habit Lab',
      'Energy in Motion',
      'Nighttime Nurturing'
    ],
    'Saturday': []
  };

  // Group classes by weekday using the SQL structure, maintaining order
  const classesByWeekday = useMemo(() => {
    // First, deduplicate classes by title + scheduled time
    const seen = new Set<string>();
    const uniqueClasses = filteredLiveClasses.filter((classItem) => {
      const key = `${classItem.title}|${classItem.scheduledAt}`;
      if (seen.has(key)) {
        return false; // Duplicate
      }
      seen.add(key);
      return true;
    });

    // Create a map of classes by title for quick lookup
    const classesByTitle = new Map<string, typeof uniqueClasses>();
    uniqueClasses.forEach((classItem) => {
      if (!classesByTitle.has(classItem.title)) {
        classesByTitle.set(classItem.title, []);
      }
      classesByTitle.get(classItem.title)!.push(classItem);
    });

    // Group by weekday using the SQL structure, maintaining order
    const grouped: Record<string, typeof uniqueClasses> = {
      'Sunday': [],
      'Monday': [],
      'Tuesday': [],
      'Wednesday': [],
      'Thursday': [],
      'Friday': [],
      'Saturday': [],
    };

    Object.entries(classStructureByWeekday).forEach(([weekday, classTitles]) => {
      classTitles.forEach((title) => {
        const classesForTitle = classesByTitle.get(title) || [];
        // For classes that appear on multiple days (like Rooted Weight Health, Hatha Yoga),
        // match by weekday from the scheduled date
        classesForTitle.forEach((classItem) => {
          const classWeekday = format(parseISO(classItem.scheduledAt), 'EEEE');
          if (classWeekday === weekday) {
            grouped[weekday].push(classItem);
          }
        });
      });
    });

    return grouped;
  }, [filteredLiveClasses]);

  const weekdayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentlyLiveClasses = filteredLiveClasses.filter((c) => isClassLive(c.scheduledAt, c.duration));
  
  // Track if we've initialized the selected weekday for the live tab
  const hasInitializedWeekday = useRef(false);

  // Set initial selected weekday to first weekday that has classes
  // Only when switching to live tab for the first time
  useEffect(() => {
    if (activeTab === 'live' && !hasInitializedWeekday.current) {
      const firstWeekdayWithClasses = weekdayOrder.find(
        (weekday) => (classesByWeekday[weekday] || []).length > 0
      );
      if (firstWeekdayWithClasses) {
        setSelectedWeekday(firstWeekdayWithClasses);
        hasInitializedWeekday.current = true;
      }
    }
    // Reset the flag when switching away from live tab
    if (activeTab !== 'live') {
      hasInitializedWeekday.current = false;
    }
  }, [activeTab, classesByWeekday]);

  const favoriteSessions = mappedRecordedSessions.filter((s) => s.isFavorite);
  const completedSessions = mappedRecordedSessions.filter((s) => s.isCompleted);

  const filteredRecordedSessions = useMemo(
    () => {
      const selectedCourse = selectedCourseId
        ? courseList.find((c) => c.id === selectedCourseId)
        : null;

      const normalizedCourseTitle = selectedCourse
        ? selectedCourse.title.toLowerCase().replace(/^the\s+/, '').trim()
        : null;

      return mappedRecordedSessions.filter((s) => {
        const matchesSearch =
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesCourse = true;
        if (selectedCourseId) {
          const byId = s.courseId === selectedCourseId;

          // Fuzzy title match for recordings missing course_id or with slightly different names
          const normalizedSessionTitle = s.title.toLowerCase().replace(/^the\s+/, '').trim();
          const byTitle =
            !!normalizedCourseTitle &&
            (normalizedSessionTitle === normalizedCourseTitle ||
              normalizedSessionTitle.includes(normalizedCourseTitle) ||
              normalizedCourseTitle.includes(normalizedSessionTitle));

          matchesCourse = byId || byTitle;
        }

        return matchesSearch && matchesCourse;
      });
    },
    [mappedRecordedSessions, searchQuery, selectedCourseId, courseList]
  );

  const filteredCourses = useMemo(
    () =>
      courseList.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [courseList, searchQuery]
  );

  const loading = sessionsLoading || classesLoading || coursesLoading;

  const handleToggleComplete = async (sessionId: string, sessionTitle: string) => {
    // Show toast notification
    setToastMessage(`"${sessionTitle}" has been moved to Completed`);
    
    // Wait a moment before actually toggling (so user sees the feedback)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Toggle completion
    await toggleCompletion(sessionId);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-0 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Classes
        </h1>
        <p className="text-gray-500 mt-1">Join live sessions or watch recordings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {[
          { id: 'live', label: 'Live Classes', icon: Radio },
          { id: 'recorded', label: 'Recordings', icon: Video },
          { id: 'favorites', label: 'Favorites', icon: Heart },
          { id: 'completed', label: 'Completed', icon: CheckCircle2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'live' | 'recorded' | 'favorites' | 'completed')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap text-sm sm:text-base ${
              activeTab === tab.id
                ? 'text-coral-600 border-coral-500'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="hidden xs:inline sm:inline">{tab.label}</span>
            <span className="inline xs:hidden sm:hidden">{tab.id === 'live' ? 'Live' : tab.id === 'recorded' ? 'Videos' : tab.label}</span>
            {tab.id === 'favorites' && favoriteSessions.length > 0 && (
              <span className="px-2 py-0.5 bg-coral-100 text-coral-600 text-xs rounded-full">
                {favoriteSessions.length}
              </span>
            )}
            {tab.id === 'completed' && completedSessions.length > 0 && (
              <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                {completedSessions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search - Only show for recordings tab */}
      {activeTab === 'recorded' && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recordings..."
              className="input pl-12"
            />
          </div>
        </div>
      )}

      {/* Live Classes */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          {/* Live Now */}
          {currentlyLiveClasses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                Live Now
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentlyLiveClasses.map((classItem) => (
                    <LiveClassCard key={classItem.id} classItem={classItem} isLive />
                  ))}
              </div>
            </div>
          )}

          {/* Weekday Tabs */}
          <div className="flex gap-2 border-b border-gray-100 overflow-x-auto scrollbar-hide pb-2">
            {weekdayOrder.map((weekday) => {
              const classesForDay = classesByWeekday[weekday] || [];
              if (classesForDay.length === 0) return null;

              return (
                <button
                  key={weekday}
                  onClick={() => setSelectedWeekday(weekday)}
                  className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 font-medium transition-colors border-b-2 -mb-2 ${
                    selectedWeekday === weekday
                      ? 'text-coral-600 border-coral-500'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <span className="text-xs sm:text-sm whitespace-nowrap">{weekday}</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full min-w-[24px] text-center">
                    {classesForDay.length}
                  </span>
                </button>
              );
            })}
            </div>

          {/* Classes for selected weekday */}
          {(() => {
            const classesForDay = classesByWeekday[selectedWeekday] || [];
            if (classesForDay.length === 0) {
              return (
              <div className="card text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No classes found for {selectedWeekday}</p>
              </div>
              );
            }

            return (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classesForDay.map((classItem) => (
                  <LiveClassCard 
                    key={classItem.id} 
                    classItem={classItem} 
                    isLive={isClassLive(classItem.scheduledAt, classItem.duration)}
                  />
                ))}
          </div>
            );
          })()}
        </div>
      )}

      {/* Recordings (Courses + Sessions) */}
      {activeTab === 'recorded' && (
        <div className="space-y-6">
          {selectedCourseId ? (
            <>
              <button
                onClick={() => setSelectedCourseId(null)}
                className="mb-4 flex items-center gap-2 text-coral-600 hover:text-coral-700 font-medium"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to all recordings
              </button>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">
                    {filteredRecordedSessions.length} session
                    {filteredRecordedSessions.length === 1 ? '' : 's'} in this class
                  </span>
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full card text-center py-12">
                    <p className="text-gray-500">Loading recordings...</p>
                  </div>
                ) : filteredRecordedSessions.length > 0 ? (
                  filteredRecordedSessions.map((session) => (
                    <RecordedSessionCard
                      key={session.id}
                      session={session}
                      onToggleFavorite={async () => {
                        const wasFavorite = favoriteIds.has(session.id);
                        toggleFavorite(session.id);
                        await trackFavorite(
                          session.id,
                          wasFavorite ? 'favorite_removed' : 'favorite_added',
                          session.title
                        );
                      }}
                      onToggleComplete={() => handleToggleComplete(session.id, session.title)}
                      onClick={() => {
                        if (session.videoUrl) {
                          trackView(session.id, session.title);
                          window.open(session.videoUrl, '_blank', 'noopener,noreferrer');
                        } else {
                          console.error('No video URL for session:', session.id);
                        }
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-full card text-center py-12">
                    <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No sessions found for this class</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full card text-center py-12">
                  <p className="text-gray-500">Loading recordings...</p>
                </div>
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => {
                  const courseStyle = courseStyles[course.title] || {
                    gradient: 'from-coral-400 to-coral-600',
                    icon: PlayCircle,
                  };
                  const IconComponent = courseStyle.icon;
                    
                    return (
                      <div
                      key={course.id}
                      className="card overflow-hidden hover:shadow-elevated transition-shadow cursor-pointer group"
                      onClick={() => setSelectedCourseId(course.id)}
                    >
                      <div
                        className={`h-32 bg-gradient-to-br ${courseStyle.gradient} -mx-6 -mt-6 mb-4 relative overflow-hidden`}
                      >
                        {/* Icon with hover glow, matching live classes style */}
                          <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent className="w-12 h-12 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] group-hover:filter group-hover:brightness-110" />
                          </div>
                        {/* Decorative gradient pattern */}
                          <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]" />
                          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2),transparent_50%)]" />
                          </div>
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-coral-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {course.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                            </span>
                          </div>
                      <div className="text-xs text-gray-400">
                        {course.session_count} session{course.session_count === 1 ? '' : 's'}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="col-span-full card text-center py-12">
                  <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No recordings found</h3>
                  <p className="text-gray-500">
                    Recordings from completed live sessions will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Favorites */}
      {activeTab === 'favorites' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full card text-center py-12">
              <p className="text-gray-500">Loading favorites...</p>
            </div>
          ) : favoriteSessions.length > 0 ? (
            favoriteSessions.map((session) => (
              <RecordedSessionCard
                key={session.id}
                session={session}
                onToggleFavorite={async () => {
                  const wasFavorite = favoriteIds.has(session.id);
                  toggleFavorite(session.id);
                  await trackFavorite(session.id, wasFavorite ? 'favorite_removed' : 'favorite_added', session.title);
                }}
                onToggleComplete={() => handleToggleComplete(session.id, session.title)}
                onClick={() => {
                  if (session.videoUrl) {
                    trackView(session.id, session.title);
                    window.open(session.videoUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    console.error('No video URL for session:', session.id);
                  }
                }}
              />
            ))
          ) : (
            <div className="col-span-full card text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-500">
                Browse recordings and click the heart icon to save your favorites
              </p>
            </div>
          )}
        </div>
      )}

      {/* Completed */}
      {activeTab === 'completed' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full card text-center py-12">
              <p className="text-gray-500">Loading completed sessions...</p>
            </div>
          ) : completedSessions.length > 0 ? (
            completedSessions.map((session) => (
              <RecordedSessionCard
                key={session.id}
                session={session}
                onToggleFavorite={async () => {
                  const wasFavorite = favoriteIds.has(session.id);
                  toggleFavorite(session.id);
                  await trackFavorite(session.id, wasFavorite ? 'favorite_removed' : 'favorite_added', session.title);
                }}
                onToggleComplete={() => handleToggleComplete(session.id, session.title)}
                onClick={() => {
                  if (session.videoUrl) {
                    trackView(session.id, session.title);
                    window.open(session.videoUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    console.error('No video URL for session:', session.id);
                  }
                }}
              />
            ))
          ) : (
            <div className="col-span-full card text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No completed sessions yet</h3>
              <p className="text-gray-500">
                Mark sessions as complete by clicking the checkmark icon on any recording
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface LiveClassCardProps {
  classItem: {
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
  };
  isLive?: boolean;
}

function LiveClassCard({ classItem, isLive }: LiveClassCardProps) {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const { setReminder } = useClassReminders();
  const { trackReminder } = useTrackReminder();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const classStyle = courseStyles[classItem.title] || {
    gradient: classImages[classItem.category] || 'from-coral-400 to-coral-600',
    icon: Video
  };
  const IconComponent = classStyle.icon;

  const handleSetReminder = async (reminderMinutes: 5 | 15) => {
    try {
      await setReminder(
        classItem.id,
        'email', // Only email now
        reminderMinutes,
        classItem.scheduledAt
      );
      // Track reminder activity
      await trackReminder(classItem.id, 'reminder_set', reminderMinutes, classItem.title);
      setToastMessage(`Reminder set! You'll receive an email ${reminderMinutes} minutes before the class.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error('Error setting reminder:', error);
      throw error;
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isLive) {
      // If live, open zoom link
      if (classItem.zoomLink) {
        window.open(classItem.zoomLink, '_blank', 'noopener,noreferrer');
      }
    } else {
      // If not live, show reminder modal
      e.preventDefault();
      setShowReminderModal(true);
    }
  };

  return (
    <>
      <div className="card overflow-hidden hover:shadow-elevated transition-shadow group">
        <div className={`h-32 bg-gradient-to-br ${classStyle.gradient} -mx-6 -mt-6 mb-4 relative overflow-hidden`}>
        {isLive && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1 z-10">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        )}
          {/* Icon - always visible, glows on hover */}
          <div className="absolute inset-0 flex items-center justify-center">
            <IconComponent className="w-12 h-12 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] group-hover:filter group-hover:brightness-110" />
          </div>
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2),transparent_50%)]"></div>
          </div>
          {/* Subtle overlay on hover for extra depth */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{classItem.title}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{classItem.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {classItem.instructor}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {classItem.duration} min
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm">
          <span className="text-gray-500">
              {format(parseISO(classItem.scheduledAt), 'EEEE')}, {format(parseISO(classItem.scheduledAt), 'h:mm a')}
          </span>
        </div>
          <button
            onClick={handleButtonClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            isLive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-coral-100 hover:bg-coral-200 text-coral-600'
          }`}
        >
          {isLive ? 'Join Now' : 'Set Reminder'}
          <ExternalLink className="w-4 h-4" />
          </button>
      </div>
    </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onConfirm={handleSetReminder}
        scheduledAt={classItem.scheduledAt}
        title={classItem.title}
      />
    </>
  );
}

interface RecordedSessionCardProps {
  session: {
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
    isCompleted: boolean;
    tags: string[];
  };
  onToggleFavorite: () => void;
  onToggleComplete: () => void;
  onClick?: () => void;
}

function RecordedSessionCard({ session, onToggleFavorite, onToggleComplete, onClick }: RecordedSessionCardProps) {
  // Generate a consistent gradient based on session ID for visual variety
  const gradients = [
    'from-coral-400 to-pink-500',
    'from-blue-400 to-indigo-500',
    'from-purple-400 to-pink-500',
    'from-green-400 to-teal-500',
    'from-orange-400 to-red-500',
    'from-indigo-400 to-purple-500',
    'from-teal-400 to-cyan-500',
    'from-rose-400 to-pink-500',
  ];
  const sessionGradient = gradients[parseInt(session.id.slice(-1), 16) % gradients.length];

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger onClick if the click wasn't on a button
    const target = e.target as HTMLElement
    if (!target.closest('button')) {
      onClick?.()
    }
  }

  return (
    <div 
      className="card overflow-hidden hover:shadow-elevated transition-all duration-300 group cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* Thumbnail/Image Area */}
      <div className={`h-48 bg-gradient-to-br ${sessionGradient} -mx-6 -mt-6 mb-4 relative overflow-hidden`} onClick={(e) => e.stopPropagation()}>
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform group-hover:scale-110 transition-transform">
            <PlayCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('[RecordedSessionCard] Favorite button clicked for session:', session.id, 'Current favorite state:', session.isFavorite);
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-50 pointer-events-auto transform ${
            session.isFavorite
              ? 'bg-red-500 text-white shadow-lg scale-100'
              : 'bg-white/90 text-gray-600 hover:bg-white hover:shadow-lg hover:scale-110 active:scale-95'
          }`}
          type="button"
          aria-label={session.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Heart className={`w-5 h-5 transition-transform duration-200 ${session.isFavorite ? 'fill-current' : 'hover:scale-110'}`} />
        </button>
        
        {/* Complete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('[RecordedSessionCard] Complete button clicked', session.id);
            onToggleComplete();
          }}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-200 z-50 pointer-events-auto transform ${
            session.isCompleted
              ? 'bg-green-500 text-white shadow-lg scale-100'
              : 'bg-white/90 text-gray-600 hover:bg-white hover:shadow-lg hover:scale-110 active:scale-95'
          }`}
          type="button"
          aria-label={session.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <CheckCircle2 className={`w-5 h-5 transition-transform duration-200 ${session.isCompleted ? 'fill-current' : 'hover:scale-110'}`} />
        </button>
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-coral-600 transition-colors line-clamp-2">
          {session.title}
        </h3>
        
        {session.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {session.instructor}
          </span>
          {session.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {session.views}
            </span>
          )}
        </div>

        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {session.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-coral-50 text-coral-700 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {format(parseISO(session.recordedAt), 'MMM d, yyyy')}
            </span>
            {session.isCompleted && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-coral-600 group-hover:text-coral-700 font-medium text-sm">
            <span>Watch</span>
            <PlayCircle className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
