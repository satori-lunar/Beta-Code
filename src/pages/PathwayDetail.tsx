import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Compass, Flame, PlayCircle, Clock } from 'lucide-react';
import { usePathways } from '../hooks/usePathways';
import { pathwayDefinitions } from './Pathways';

export default function PathwayDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { userProgress, enrollInPathway, unenrollFromPathway } = usePathways();

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

  const handleStart = async () => {
    await enrollInPathway(pathway.id, pathway.class_titles.length);
  };

  const handleUnenroll = async () => {
    await unenrollFromPathway(pathway.id);
    navigate('/pathways');
  };

  const handleGoToClasses = () => {
    navigate('/classes', {
      state: {
        activeTab: 'recorded',
        pathwayTitle: pathway.title,
        filterClasses: pathway.class_titles,
      },
    });
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
                  <button
                    onClick={handleGoToClasses}
                    className="px-4 py-2 rounded-lg bg-coral-500 hover:bg-coral-600 text-white font-medium transition-colors flex items-center gap-2"
                  >
                    View Classes
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStart}
                  className="px-4 py-2 rounded-lg bg-coral-500 hover:bg-coral-600 text-white font-medium transition-colors flex items-center gap-2"
                >
                  Start Pathway
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Classes CTA */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">View Your Class Schedule</h2>
            <p className="text-sm text-gray-500">
              See all live sessions for this pathway in the main Classes schedule, with the correct dates and times.
            </p>
          </div>
        </div>
        <button
          onClick={handleGoToClasses}
          className="px-4 py-2 rounded-lg bg-coral-500 hover:bg-coral-600 text-white font-medium transition-colors flex items-center gap-2"
        >
          Go to Classes
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
