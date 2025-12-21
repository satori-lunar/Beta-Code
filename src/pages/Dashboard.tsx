import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Award,
  Target,
  BookOpen,
  Heart,
  TrendingUp,
  CheckCircle2,
  Circle,
  Sparkles,
  Calendar,
  X,
  Lock,
  Star,
  Zap,
  Trophy,
  Palette,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits, useJournalEntries, useUserBadges, useNewYearResolutions } from '../hooks/useSupabaseData';
import { supabase } from '../lib/supabase';
import { format, isToday, parseISO } from 'date-fns';
const badgeIcons: Record<string, React.ElementType> = {
  flame: Flame,
  target: Target,
  heart: Heart,
  award: Award,
  star: Star,
  zap: Zap,
  trophy: Trophy,
};

// All available badges in the system
const allAvailableBadges = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first habit',
    icon: 'target',
    category: 'habit'
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    category: 'streak'
  },
  {
    id: 'journaling-beginner',
    name: 'Journaling Beginner',
    description: 'Write your first journal entry',
    icon: 'star',
    category: 'journal'
  },
  {
    id: 'wellness-champion',
    name: 'Wellness Champion',
    description: 'Track health metrics for 7 days',
    icon: 'heart',
    category: 'health'
  },
  {
    id: 'fitness-enthusiast',
    name: 'Fitness Enthusiast',
    description: 'Complete 10 workouts',
    icon: 'zap',
    category: 'workout'
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Maintain a 30-day streak',
    icon: 'trophy',
    category: 'streak'
  },
  {
    id: 'habit-master',
    name: 'Habit Master',
    description: 'Complete all habits for 7 days straight',
    icon: 'award',
    category: 'habit'
  },
  {
    id: 'mindful-soul',
    name: 'Mindful Soul',
    description: 'Complete 5 mindfulness sessions',
    icon: 'sparkles',
    category: 'mindfulness'
  },
];

const wellnessQuotes = [
  "Your health is an investment, not an expense.",
  "Progress, not perfection. Every step counts.",
  "Self-care is not selfish. You cannot serve from an empty vessel.",
  "The only bad workout is the one that didn't happen.",
  "Healing is a journey, not a destination.",
  "Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.",
  "Take care of your body. It's the only place you have to live.",
  "Small daily improvements are the key to staggering long-term results.",
  "The greatest wealth is health.",
  "You are stronger than you think."
];

export default function Dashboard() {
  const { user } = useAuth();
  const { isDark, toggleDark, colorPreset, setColorPreset, colorPresets, primaryColor } = useTheme();
  const { data: habits = [] } = useHabits();
  const { data: journalEntries = [] } = useJournalEntries();
  const { data: userBadges = [] } = useUserBadges();
  const currentYear = 2026;
  const { resolutions: newYearResolutions } = useNewYearResolutions(currentYear);
  
  // Check if it's New Year season (Dec 1 - Jan 31)
  const isNewYearSeason = () => {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    return month === 11 || month === 0; // December or January
  };

  const [dailyQuote, setDailyQuote] = useState('');
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [suggestionType, setSuggestionType] = useState<'suggestion' | 'question' | 'feature'>('suggestion');
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionSubmitting, setSuggestionSubmitting] = useState(false);
  const [suggestionSuccess, setSuggestionSuccess] = useState('');
  const [suggestionError, setSuggestionError] = useState('');

  // Set daily quote (changes each day)
  useEffect(() => {
    const today = new Date().getDate();
    const quoteIndex = today % wellnessQuotes.length;
    setDailyQuote(wellnessQuotes[quoteIndex]);
  }, []);

  // Calculate streak (count habits completed today)
  const todayCompletedCount = habits.filter(habit => {
    const completedDates = habit.completed_dates as string[] || [];
    return completedDates.some(date => isToday(parseISO(date)));
  }).length;

  const totalHabitsToday = habits.length;

  // Get latest journal entry
  const latestJournal = journalEntries.length > 0 ? journalEntries[0] : null;
  const journaledToday = latestJournal ? isToday(parseISO(latestJournal.date)) : false;

  // Get current streak (simplified - just show total badges as motivation)
  const currentStreak = userBadges.length;

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setSuggestionError('You need to be signed in to submit a suggestion.');
      return;
    }
    if (!suggestionText.trim()) {
      setSuggestionError('Please enter your suggestion, question, or feature idea.');
      return;
    }

    setSuggestionSubmitting(true);
    setSuggestionError('');
    setSuggestionSuccess('');

    try {
      const typeLabel =
        suggestionType === 'suggestion'
          ? 'Suggestion'
          : suggestionType === 'question'
          ? 'Question'
          : 'Feature Request';

      const subject = `${typeLabel} from Dashboard`;
      const message = suggestionText.trim();

      const { error } = await (supabase as any).from('help_tickets').insert({
        user_id: user.id,
        subject,
        message,
      } as any);

      if (error) {
        throw error;
      }

      setSuggestionSuccess('Thank you! Your feedback has been submitted.');
      setSuggestionText('');
      // Reset success message after a short delay
      setTimeout(() => setSuggestionSuccess(''), 5000);
    } catch (err: any) {
      setSuggestionError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSuggestionSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome Header with Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.user_metadata?.name || 'Friend'}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>

              {/* Streak Badge and Theme Button */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setShowThemeModal(true)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  title="Customize theme"
                  style={{ color: primaryColor }}
                >
                  <Palette className="w-6 h-6" />
                </button>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-8 h-8" style={{ color: primaryColor }} />
                    <span className="text-4xl font-bold" style={{ color: primaryColor }}>{currentStreak}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
                </div>
              </div>
            </div>

            {/* Community Hub Button */}
            <div>
              <a
                href="https://www.birchandstonecoaching.com/products/communities/v2/birchandstone/home"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-coral-500 hover:bg-coral-600 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Community Hub
              </a>
            </div>
          </div>
        </div>

        {/* Daily Quote */}
        <div
          className="rounded-2xl shadow-xl p-8 text-white"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${colorPresets[colorPreset].colors[1]})`
          }}
        >
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Daily Inspiration</h2>
              <p className="text-lg opacity-90 italic">"{dailyQuote}"</p>
            </div>
          </div>
        </div>

        {/* New Year's Resolution Card (Seasonal) */}
        {isNewYearSeason() && (
          <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">New Year's Resolution {currentYear}</h2>
                </div>
                {newYearResolutions.length > 0 ? (
                  <div className="space-y-3">
                    {newYearResolutions.slice(0, 2).map((resolution) => (
                      <div key={resolution.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <h3 className="font-semibold text-lg mb-2">{resolution.title}</h3>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full transition-all duration-500"
                              style={{ width: `${resolution.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{resolution.progress}%</span>
                        </div>
                      </div>
                    ))}
                    <Link
                      to="/new-year-resolution"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors backdrop-blur-sm"
                    >
                      View All Resolutions
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg opacity-90 mb-4">
                      Ready for a fresh start? Set your intention for {currentYear} and create a resolution that truly matters to you.
                    </p>
                    <Link
                      to="/new-year-resolution"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      <Sparkles className="w-5 h-5" />
                      Create Your Resolution
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Today's Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Habits Check-in */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
            data-tour="habits"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8" style={{ color: primaryColor }} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Today's Habits
                </h2>
              </div>
              <Link
                to="/habits"
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: primaryColor }}
              >
                View All →
              </Link>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  {todayCompletedCount} of {totalHabitsToday} completed
                </span>
                <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                  {totalHabitsToday > 0 ? Math.round((todayCompletedCount / totalHabitsToday) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalHabitsToday > 0 ? (todayCompletedCount / totalHabitsToday) * 100 : 0}%`,
                    background: `linear-gradient(to right, ${primaryColor}, ${colorPresets[colorPreset].colors[1]})`
                  }}
                />
              </div>
            </div>

            {totalHabitsToday === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No habits set up yet. Start building positive routines!
              </p>
            ) : todayCompletedCount === totalHabitsToday ? (
              <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Amazing! All habits completed today!
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Keep going! You're making great progress.
              </p>
            )}
          </div>

          {/* Journal Check-in */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
            data-tour="journal"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8" style={{ color: colorPresets[colorPreset].colors[2] }} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Journal
                </h2>
              </div>
              <Link
                to="/journal"
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: colorPresets[colorPreset].colors[2] }}
              >
                {journaledToday ? 'View Entry →' : 'Write Now →'}
              </Link>
            </div>

            {journaledToday ? (
              <div>
                <div className="flex items-center gap-2 mb-3" style={{ color: colorPresets[colorPreset].colors[2] }}>
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">You journaled today!</span>
                </div>
                {latestJournal?.mood && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Mood: <span className="font-medium">{latestJournal.mood}</span>
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {latestJournal?.content}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400">
                  <Circle className="w-5 h-5" />
                  <span>Haven't journaled yet today</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Take a moment to reflect on your day. How are you feeling?
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Wellness Reminders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Health Check Reminder */}
          <Link
            to="/health"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 hover:scale-105"
          >
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-6 h-6" style={{ color: primaryColor }} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Health Metrics</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your vitals and stay on top of your health
            </p>
          </Link>

          {/* Weight Tracking Reminder */}
          <Link
            to="/weight"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 hover:scale-105"
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6" style={{ color: colorPresets[colorPreset].colors[1] }} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Weight Progress</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitor your progress toward your goals
            </p>
          </Link>

          {/* Live Classes Reminder */}
          <Link
            to="/calendar"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 hover:scale-105"
            data-tour="classes"
          >
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6" style={{ color: colorPresets[colorPreset].colors[2] }} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Live Classes</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join today's wellness sessions
            </p>
          </Link>
        </div>

        {/* Suggestion Jar */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          data-tour="suggestion-jar"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" style={{ color: primaryColor }} />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Suggestion Jar
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share a suggestion, question, or feature idea to help improve your experience.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitSuggestion} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'suggestion', label: 'Suggestion' },
                { id: 'question', label: 'Question' },
                { id: 'feature', label: 'Feature request' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSuggestionType(option.id as 'suggestion' | 'question' | 'feature')}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors ${
                    suggestionType === option.id
                      ? 'bg-coral-500 text-white border-coral-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div>
              <textarea
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none transition"
                placeholder="Tell us what would make this app more helpful for you..."
              />
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Your feedback goes directly to the team. We read every note.
              </p>
            </div>

            {suggestionError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {suggestionError}
              </div>
            )}
            {suggestionSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                {suggestionSuccess}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={suggestionSubmitting || !suggestionText.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-coral-500 text-white hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {suggestionSubmitting ? 'Sending...' : 'Submit feedback'}
              </button>
            </div>
          </form>
        </div>

        {/* Badges Section */}
        {userBadges.length > 0 && (
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
            data-tour="badges"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8" style={{ color: primaryColor }} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Achievements
                </h2>
              </div>
              <button
                onClick={() => setShowBadgeModal(true)}
                className="text-sm font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ color: primaryColor }}
              >
                View All Badges
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userBadges.map((badge) => {
                const IconComponent = badgeIcons[badge.icon || 'award'] || Award;
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <IconComponent className="w-12 h-12 mb-2" style={{ color: primaryColor }} />
                    <p className="text-sm font-semibold text-gray-800 dark:text-white text-center">
                      {badge.name}
                    </p>
                    {badge.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 text-center mt-1">
                        {badge.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Badges Yet Message */}
        {userBadges.length === 0 && (
          <button
            onClick={() => setShowBadgeModal(true)}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 hover:scale-105"
            data-tour="badges"
          >
            <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Start Your Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Complete habits and track your wellness to earn badges!
            </p>
            <span className="font-medium" style={{ color: primaryColor }}>
              Click to see all available badges →
            </span>
          </button>
        )}

      </div>

      {/* Badge Gallery Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" style={{ color: primaryColor }} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Badge Collection
                </h2>
              </div>
              <button
                onClick={() => setShowBadgeModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Earn badges by completing habits, tracking your wellness, and achieving your goals.
                You've earned {userBadges.length} of {allAvailableBadges.length} badges!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAvailableBadges.map((badge) => {
                  const isEarned = userBadges.some(
                    (earnedBadge) => earnedBadge.name === badge.name
                  );
                  const IconComponent = badgeIcons[badge.icon] || Award;

                  return (
                    <div
                      key={badge.id}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isEarned
                          ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <IconComponent
                            className="w-12 h-12"
                            style={{
                              color: isEarned ? primaryColor : undefined
                            }}
                          />
                          {!isEarned && (
                            <Lock className="w-5 h-5 text-gray-500 absolute -bottom-1 -right-1 bg-white dark:bg-gray-700 rounded-full p-0.5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-bold ${
                                isEarned
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {badge.name}
                            </h3>
                            {isEarned && (
                              <CheckCircle2 className="w-5 h-5" style={{ color: primaryColor }} />
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              isEarned
                                ? 'text-gray-600 dark:text-gray-400'
                                : 'text-gray-500 dark:text-gray-500'
                            }`}
                          >
                            {badge.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 capitalize">
                            {badge.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Customization Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="w-8 h-8" style={{ color: primaryColor }} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Customize Your Theme
                </h2>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Dark/Light Mode Toggle */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Appearance
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleDark}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all flex-1 ${
                      !isDark
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
                    }`}
                    style={{
                      borderColor: !isDark ? primaryColor : undefined
                    }}
                  >
                    <Sun className="w-6 h-6" style={{ color: !isDark ? primaryColor : '#9CA3AF' }} />
                    <div className="text-left">
                      <p className={`font-semibold ${!isDark ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}>
                        Light Mode
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bright and clear
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={toggleDark}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all flex-1 ${
                      isDark
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
                    }`}
                    style={{
                      borderColor: isDark ? primaryColor : undefined
                    }}
                  >
                    <Moon className="w-6 h-6" style={{ color: isDark ? primaryColor : '#9CA3AF' }} />
                    <div className="text-left">
                      <p className={`font-semibold ${isDark ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}>
                        Dark Mode
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Easy on the eyes
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Color Preset Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Color Theme
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(colorPresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => setColorPreset(key)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        colorPreset === key
                          ? 'bg-gray-100 dark:bg-gray-700'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
                      }`}
                      style={{
                        borderColor: colorPreset === key ? preset.colors[0] : undefined
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex gap-1">
                          {preset.colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        {colorPreset === key && (
                          <CheckCircle2 className="w-5 h-5 ml-auto" style={{ color: preset.colors[0] }} />
                        )}
                      </div>
                      <p className={`text-sm font-medium ${
                        colorPreset === key
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-400'
                      }`}>
                        {preset.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Theme changes apply instantly across the entire app
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
