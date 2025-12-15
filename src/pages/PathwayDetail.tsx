import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight,
  Clock,
  Compass,
  Flame,
  PlayCircle,
  Calendar,
  User,
  ExternalLink,
} from 'lucide-react';
import { usePathways } from '../hooks/usePathways';
import { useLiveClasses } from '../hooks/useSupabaseData';
import { format, parseISO, isAfter, isBefore, addHours } from 'date-fns';
import { pathwayDefinitions } from './Pathways';

export default function PathwayDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { userProgress, enrollInPathway, unenrollFromPathway } = usePathways();
  const { classes: liveClasses, loading: classesLoading } = useLiveClasses();

  const pathway = pathwayDefinitions.find((p) => p.id === id);

  // If pathway not found, show fallback
  if (!pathway) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/pathways')}
          className="flex items-center gap-2 text-coral-600 hover:text-coral-700 font-medium"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Pathways
        </button>
        <div className="card p-6 text-center">
          <p className="text-gray-600">Pathway not found.</p>
        </div>
      </div>
    );
  }

  const progress = userProgress[pathway.id];
  const isEnrolled = !!progress && !progress.completed;
  const progressPercentage = progress
    ? Math.round((progress.classes_completed / pathway.class_titles.length) * 100)
    : 0;

  const isClassLive = (scheduledAt: string, duration: number) => {
    const now = new Date();
    const startTime = parseISO(scheduledAt);
    const endTime = addHours(startTime, duration / 60);
    return isAfter(now, startTime) && isBefore(now, endTime);
  };

  // Filter and group classes for this pathway
  const pathwayClasses = useMemo(() => {
    // Keep first occurrence per title + scheduled_at to avoid duplicates
    const seen = new Set<string>();
    return (liveClasses || []).filter((classItem) => {
      const matches = pathway.class_titles.some((title) =>
        classItem.title.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(classItem.title.toLowerCase())
      );
      if (!matches) return false;
      const key = `${classItem.title}|${classItem.scheduled_at}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [liveClasses, pathway.class_titles]);

  const classesByWeekday = useMemo(() => {
    const grouped: Record<string, typeof pathwayClasses> = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    };

    pathwayClasses.forEach((classItem) => {
      const weekday = format(parseISO(classItem.scheduled_at), 'EEEE');
      if (grouped[weekday]) {
        grouped[weekday].push(classItem);
      }
    });

    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) =>
        parseISO(a.scheduled_at).getTime() - parseISO(b.scheduled_at).getTime()
      );
    });

    return grouped;
  }, [pathwayClasses]);

  const handleStart = async () => {
    await enrollInPathway(pathway.id, pathway.class_titles.length);
  };

  const handleUnenroll = async () => {
    await unenrollFromPathway(pathway.id);
    navigate('/pathways');
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Back link */}
      <button
        onClick={() => navigate('/pathways')}
        className="flex items-center gap-2 text-coral-600 hover:text-coral-700 font-medium"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Pathways
      </button>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pathway.color_gradient} flex items-center justify-center text-4xl`}>
            {pathway.icon}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
                {pathway.title}
              </h1>
              {isEnrolled && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Enrolled
                </span>
              )}
            </div>
            <p className="text-gray-600">{pathway.description}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <PlayCircle className="w-4 h-4" />
                {pathway.class_titles.length} classes
              </span>
              {isEnrolled && progress && (
                <>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {progress.classes_completed} / {pathway.class_titles.length} completed
                  </span>
                  {progress.current_streak > 0 && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <Flame className="w-4 h-4" />
                      {progress.current_streak} day streak
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Progress bar */}
            {isEnrolled && progress && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{progressPercentage}% complete</span>
                  <span>{progress.classes_completed} of {pathway.class_titles.length}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-coral-400 to-coral-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              {isEnrolled ? (
                <>
                  <button
                    onClick={handleUnenroll}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                  >
                    Unenroll
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStart}
                  className="px-4 py-2 rounded-lg bg-coral-500 hover:bg-coral-600 text-white font-medium transition-colors"
                >
                  Start Pathway
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
            <p className="text-sm text-gray-500">Sessions linked to this pathway</p>
          </div>
        </div>

        {classesLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Loading classes...</p>
          </div>
        ) : pathwayClasses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No upcoming classes found for this pathway.</p>
          </div>
        ) : (
          Object.entries(classesByWeekday)
            .filter(([_, classes]) => classes.length > 0)
            .map(([weekday, classes]) => (
              <div key={weekday} className="space-y-3">
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <div className="h-8 w-8 rounded-lg bg-coral-50 text-coral-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  {weekday}
                  <span className="ml-auto text-xs font-medium text-gray-500 px-2 py-1 rounded-full bg-gray-100">
                    {classes.length} {classes.length === 1 ? 'class' : 'classes'}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map((classItem) => {
                    const live = isClassLive(classItem.scheduled_at, classItem.duration);
                    const scheduledDate = parseISO(classItem.scheduled_at);
                    return (
                      <div
                        key={classItem.id}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white/70 backdrop-blur"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{classItem.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-2">{classItem.description}</p>
                          </div>
                          {live && (
                            <div className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              LIVE
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{classItem.instructor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {format(scheduledDate, 'EEEE, MMM d')} • {format(scheduledDate, 'h:mm a')} • {classItem.duration} min
                            </span>
                          </div>
                        </div>

                        {classItem.zoom_link && (
                          <button
                            onClick={() => window.open(classItem.zoom_link, '_blank', 'noopener,noreferrer')}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                              live
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-coral-100 hover:bg-coral-200 text-coral-700'
                            }`}
                          >
                            {live ? 'Join Now' : 'Set Reminder'}
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
