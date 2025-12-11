import {
  Award,
  Flame,
  Sunrise,
  Droplet,
  Brain,
  Dumbbell,
  Heart,
  Star,
  Trophy,
  Target,
  Zap,
  Crown,
  BookOpen
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useUserBadges, useUserProfile } from '../hooks/useSupabaseData';

const badgeIcons: Record<string, React.ElementType> = {
  flame: Flame,
  sunrise: Sunrise,
  droplet: Droplet,
  brain: Brain,
  dumbbell: Dumbbell,
  heart: Heart,
  star: Star,
  trophy: Trophy,
  target: Target,
  zap: Zap,
  crown: Crown,
  book: BookOpen,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  streak: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  habit: { bg: 'bg-sage-50', text: 'text-sage-700', border: 'border-sage-200' },
  workout: { bg: 'bg-coral-50', text: 'text-coral-700', border: 'border-coral-200' },
  nutrition: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  mindfulness: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  special: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

const lockedBadges = [
  { id: 'l1', name: '30 Day Streak', description: 'Complete habits for 30 days straight', icon: 'crown', category: 'streak' },
  { id: 'l2', name: 'Century Club', description: 'Log 100 workouts', icon: 'trophy', category: 'workout' },
  { id: 'l3', name: 'Zen Master', description: 'Complete 50 meditation sessions', icon: 'brain', category: 'mindfulness' },
  { id: 'l4', name: 'Nutrition Pro', description: 'Log meals for 30 consecutive days', icon: 'star', category: 'nutrition' },
  { id: 'l5', name: 'Goal Crusher', description: 'Reach your weight goal', icon: 'target', category: 'special' },
  { id: 'l6', name: 'Energy Boost', description: 'Complete 7 morning routines', icon: 'zap', category: 'habit' },
];

export default function Badges() {
  const { data: earnedBadges = [], loading: badgesLoading } = useUserBadges();
  const { profile, loading: profileLoading } = useUserProfile();
  const streak = profile?.streak || 0;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Your Badges
        </h1>
        <p className="text-gray-500 mt-1">Celebrate your achievements and unlock more!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{earnedBadges.length}</p>
          <p className="text-sm text-gray-500">Badges Earned</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{lockedBadges.length}</p>
          <p className="text-sm text-gray-500">To Unlock</p>
        </div>

        <div className="stat-card col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-coral-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{streak}</p>
          <p className="text-sm text-gray-500">Current Streak</p>
        </div>
      </div>

      {/* Earned Badges */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
          Earned Badges
        </h2>
        {badgesLoading || profileLoading ? (
          <div className="text-center py-12 text-gray-500">Loading your badges...</div>
        ) : earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => {
              const IconComponent = badgeIcons[badge.icon || ''] || Award;
              const colors = categoryColors[badge.category || 'special'] || categoryColors.special;

              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border ${colors.bg} ${colors.border}`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{badge.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                    {badge.earnedDate && (
                      <p className="text-xs text-gray-400 mt-2">
                        Earned {format(parseISO(badge.earnedDate), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Complete activities to earn your first badge!</p>
          </div>
        )}
      </div>

      {/* Locked Badges */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
          Badges to Unlock
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {lockedBadges.map((badge) => {
            const IconComponent = badgeIcons[badge.icon] || Award;
            const colors = categoryColors[badge.category] || categoryColors.special;

            return (
              <div
                key={badge.id}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-200 bg-gray-50 opacity-60"
              >
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-600">{badge.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${colors.bg} ${colors.text}`}>
                    {badge.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
