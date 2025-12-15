import { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  ChevronRight,
  Compass,
  Target,
  CheckCircle2,
  PlayCircle,
  Flame,
  Star,
  Calendar,
  User,
  ExternalLink,
  X,
} from 'lucide-react';
import { usePathways } from '../hooks/usePathways';
import { useLiveClasses } from '../hooks/useSupabaseData';
import { format, parseISO, isAfter, isBefore, addHours } from 'date-fns';

// Define the pathways with their classes
const pathwayDefinitions = [
  {
    id: 'self-compassion',
    title: 'Self-Compassion Pathway',
    description: 'Cultivate kindness and understanding toward yourself through guided practices and mindful movement.',
    icon: '💚',
    color_gradient: 'from-green-500 to-emerald-600',
    class_titles: [
      'Inner Chords',
      'Foundations in Motion',
      'The Heart of Nourishment',
      'Nighttime Nurturing',
      'Hatha Yoga',
    ],
    benefits: [
      'Develop self-kindness and acceptance',
      'Reduce self-criticism and judgment',
      'Build emotional resilience',
      'Improve self-care practices',
    ],
  },
  {
    id: 'relationships',
    title: 'Relationships Pathway',
    description: 'Strengthen your connections with others and navigate relationship challenges with wisdom and compassion.',
    icon: '💙',
    color_gradient: 'from-blue-500 to-indigo-600',
    class_titles: [
      'Refreshed & Ready',
      'Grief & Growth',
      'Tangled: Challenging Relationships',
      'The Reflecting Pool',
    ],
    benefits: [
      'Improve communication skills',
      'Navigate difficult conversations',
      'Process grief and loss',
      'Build healthier relationships',
    ],
  },
  {
    id: 'life-balance',
    title: 'Life Balance Pathway',
    description: 'Find harmony between work, rest, and play while managing stress and creating sustainable routines.',
    icon: '💜',
    color_gradient: 'from-purple-500 to-pink-600',
    class_titles: [
      'Plan Your Week',
      'Evenings with Emily B',
      'Wisdom Rising',
      'Instinctive Meditation',
    ],
    benefits: [
      'Better time management',
      'Reduced stress and overwhelm',
      'Improved work-life balance',
      'Enhanced mindfulness practices',
    ],
  },
  {
    id: 'weight-health',
    title: 'Weight Health Pathway',
    description: 'Support your body with movement, nutrition, and sustainable habits for long-term wellness.',
    icon: '🧡',
    color_gradient: 'from-orange-500 to-amber-600',
    class_titles: [
      'Rooted Weight Health',
      'Strength in Motion',
      '2-Bite Tuesdays',
      'The Habit Lab',
    ],
    benefits: [
      'Build strength and mobility',
      'Develop healthy eating habits',
      'Create sustainable routines',
      'Support overall wellness',
    ],
  },
];

export default function Pathways() {
  const { userProgress, loading, enrollInPathway, unenrollFromPathway } = usePathways();
  const { classes: liveClasses, loading: classesLoading } = useLiveClasses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);

  // Get the current enrolled pathway
  const enrolledPathwayId = Object.keys(userProgress).find(
    (id) => !userProgress[id].completed
  );

  // Helper to check if a class is live
  const isClassLive = (scheduledAt: string, duration: number) => {
    const now = new Date();
    const startTime = parseISO(scheduledAt);
    const endTime = addHours(startTime, duration / 60);
    return isAfter(now, startTime) && isBefore(now, endTime);
  };

  // Get classes for selected pathway
  const pathwayClasses = useMemo(() => {
    if (!selectedPathwayId) return [];
    
    const pathway = pathwayDefinitions.find((p) => p.id === selectedPathwayId);
    if (!pathway) return [];

    // Filter live classes that match pathway class titles
    return (liveClasses || []).filter((classItem) =>
      pathway.class_titles.some((title) =>
        classItem.title.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(classItem.title.toLowerCase())
      )
    );
  }, [selectedPathwayId, liveClasses]);

  // Group classes by weekday
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

    // Sort classes within each day by scheduled time
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) =>
        parseISO(a.scheduled_at).getTime() - parseISO(b.scheduled_at).getTime()
      );
    });

    return grouped;
  }, [pathwayClasses]);

  // Filter pathways based on search
  const filteredPathways = pathwayDefinitions.filter((pathway) =>
    pathway.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pathway.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pathway.class_titles.some((title) =>
      title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEnroll = async (pathwayId: string) => {
    const pathway = pathwayDefinitions.find((p) => p.id === pathwayId);
    if (!pathway) return;

    // If user is already enrolled in another pathway, unenroll first
    if (enrolledPathwayId && enrolledPathwayId !== pathwayId) {
      await unenrollFromPathway(enrolledPathwayId);
    }

    await enrollInPathway(pathwayId, pathway.class_titles.length);
  };

  const handleViewClasses = (pathwayId: string) => {
    // Toggle selection - if already selected, deselect
    if (selectedPathwayId === pathwayId) {
      setSelectedPathwayId(null);
    } else {
      setSelectedPathwayId(pathwayId);
    }
  };

  const handleEnrollAndView = async (pathwayId: string) => {
    await handleEnroll(pathwayId);
    setSelectedPathwayId(pathwayId);
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Pathways
        </h1>
        <p className="text-gray-500 mt-1">
          Choose a guided journey tailored to your wellness goals
        </p>
      </div>

      {/* Info Banner */}
      {enrolledPathwayId && (
        <div className="card p-4 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium">
                You're currently enrolled in a pathway. You can only be enrolled in one pathway at a time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search pathways or classes..."
          className="input pl-12"
        />
      </div>

      {/* Pathways Grid */}
      {loading ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Loading pathways...</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredPathways.map((pathway) => {
            const progress = userProgress[pathway.id];
            const isEnrolled = !!progress;
            const isCurrentPathway = enrolledPathwayId === pathway.id;
            const progressPercentage = progress
              ? Math.round((progress.classes_completed / pathway.class_titles.length) * 100)
              : 0;

            return (
              <div
                key={pathway.id}
                className="card overflow-hidden hover:shadow-elevated transition-shadow group relative"
              >
                {/* Pathway Header with Icon */}
                <div className={`h-32 bg-gradient-to-br ${pathway.color_gradient} -mx-6 -mt-6 mb-4 relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">{pathway.icon}</div>
                  </div>
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                  </div>
                  {isEnrolled && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                      {progressPercentage}% Complete
                    </div>
                  )}
                  {isCurrentPathway && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-blue-700 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Active
                    </div>
                  )}
                </div>

                {/* Pathway Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl mb-2">{pathway.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{pathway.description}</p>
                  </div>

                  {/* Classes in Pathway */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Classes in this pathway
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pathway.class_titles.map((classTitle, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                        >
                          {classTitle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Benefits
                    </p>
                    <ul className="space-y-1">
                      {pathway.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-4 h-4" />
                      {pathway.class_titles.length} classes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Self-paced
                    </span>
                    {progress && progress.current_streak > 0 && (
                      <span className="flex items-center gap-1 text-orange-600">
                        <Flame className="w-4 h-4" />
                        {progress.current_streak} day streak
                      </span>
                    )}
                  </div>

                  {/* Progress Bar (if enrolled) */}
                  {isEnrolled && progress && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{progress.classes_completed} / {pathway.class_titles.length} completed</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-coral-400 to-coral-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    {isCurrentPathway ? (
                      <>
                        <button
                          onClick={() => handleViewClasses(pathway.id)}
                          className="w-full py-2 px-4 bg-coral-500 hover:bg-coral-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <span>{selectedPathwayId === pathway.id ? 'Hide Classes' : 'View Classes'}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedPathwayId === pathway.id ? 'rotate-90' : ''}`} />
                        </button>
                        <button
                          onClick={() => unenrollFromPathway(pathway.id)}
                          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                        >
                          Unenroll
                        </button>
                      </>
                    ) : isEnrolled ? (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 text-center">
                          You completed this pathway
                        </p>
                        <button
                          onClick={() => handleViewClasses(pathway.id)}
                          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <span>{selectedPathwayId === pathway.id ? 'Hide Classes' : 'Review Classes'}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedPathwayId === pathway.id ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnrollAndView(pathway.id)}
                        disabled={!!enrolledPathwayId}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          enrolledPathwayId
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-coral-500 hover:bg-coral-600 text-white'
                        }`}
                      >
                        {enrolledPathwayId
                          ? 'Enroll in another pathway to start'
                          : 'Start Pathway'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredPathways.length === 0 && (
        <div className="card text-center py-12">
          <Compass className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No pathways found matching your search</p>
        </div>
      )}

      {/* Classes for Selected Pathway */}
      {selectedPathwayId && (
        <div className="card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {pathwayDefinitions.find((p) => p.id === selectedPathwayId)?.title} Classes
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View scheduled times for all classes in this pathway
              </p>
            </div>
            <button
              onClick={() => setSelectedPathwayId(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {classesLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading classes...</p>
            </div>
          ) : pathwayClasses.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming classes found for this pathway</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(classesByWeekday)
                .filter(([_, classes]) => classes.length > 0)
                .map(([weekday, classes]) => (
                  <div key={weekday}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-coral-600" />
                      {weekday}
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {classes.map((classItem) => {
                        const isLive = isClassLive(classItem.scheduled_at, classItem.duration);
                        const scheduledDate = parseISO(classItem.scheduled_at);
                        
                        return (
                          <div
                            key={classItem.id}
                            className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{classItem.title}</h4>
                                <p className="text-sm text-gray-500 line-clamp-2">{classItem.description}</p>
                              </div>
                              {isLive && (
                                <div className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                  LIVE
                                </div>
                              )}
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>{classItem.instructor}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {format(scheduledDate, 'h:mm a')} • {classItem.duration} min
                                </span>
                              </div>
                            </div>

                            {classItem.zoom_link && (
                              <button
                                onClick={() => window.open(classItem.zoom_link, '_blank', 'noopener,noreferrer')}
                                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                  isLive
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-coral-100 hover:bg-coral-200 text-coral-700'
                                }`}
                              >
                                {isLive ? 'Join Now' : 'Set Reminder'}
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="card p-4 bg-purple-50 border border-purple-100">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-purple-900">
              <span className="font-medium">Not sure which pathway to choose?</span> Pathways are
              designed for users who want guided journeys. Each pathway includes live classes that
              you can attend. You can only be enrolled in one pathway at a time to help you stay
              focused on your wellness journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
