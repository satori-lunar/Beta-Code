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
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useHabits, useJournalEntries, useUserBadges } from '../hooks/useSupabaseData';
import { format, isToday, parseISO } from 'date-fns';

const badgeIcons: Record<string, React.ElementType> = {
  flame: Flame,
  target: Target,
  heart: Heart,
  award: Award,
};

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
  const { data: habits = [] } = useHabits();
  const { data: journalEntries = [] } = useJournalEntries();
  const { data: userBadges = [] } = useUserBadges();

  const [dailyQuote, setDailyQuote] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome Header with Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome back, {user?.user_metadata?.name || 'Friend'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>

            {/* Streak Badge */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <span className="text-4xl font-bold text-orange-500">{currentStreak}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Quote */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Daily Inspiration</h2>
              <p className="text-lg text-purple-100 italic">"{dailyQuote}"</p>
            </div>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Habits Check-in */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Today's Habits
                </h2>
              </div>
              <Link
                to="/habits"
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">
                  {todayCompletedCount} of {totalHabitsToday} completed
                </span>
                <span className="text-2xl font-bold text-blue-500">
                  {totalHabitsToday > 0 ? Math.round((todayCompletedCount / totalHabitsToday) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${totalHabitsToday > 0 ? (todayCompletedCount / totalHabitsToday) * 100 : 0}%` }}
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Journal
                </h2>
              </div>
              <Link
                to="/journal"
                className="text-green-500 hover:text-green-600 text-sm font-medium"
              >
                {journaledToday ? 'View Entry →' : 'Write Now →'}
              </Link>
            </div>

            {journaledToday ? (
              <div>
                <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">You journaled today!</span>
                </div>
                {latestJournal?.mood && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    Mood: <span className="font-medium">{latestJournal.mood}</span>
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-6 h-6 text-red-500" />
              <h3 className="font-semibold text-gray-800 dark:text-white">Health Metrics</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Track your vitals and stay on top of your health
            </p>
          </Link>

          {/* Weight Tracking Reminder */}
          <Link
            to="/weight"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-pink-500" />
              <h3 className="font-semibold text-gray-800 dark:text-white">Weight Progress</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Monitor your progress toward your goals
            </p>
          </Link>

          {/* Live Classes Reminder */}
          <Link
            to="/live-classes"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h3 className="font-semibold text-gray-800 dark:text-white">Live Classes</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Join today's wellness sessions
            </p>
          </Link>
        </div>

        {/* Badges Section */}
        {userBadges.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Your Achievements
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userBadges.map((badge) => {
                const IconComponent = badgeIcons[badge.icon || 'award'] || Award;
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg"
                  >
                    <IconComponent className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-2" />
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Start Your Journey
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Complete habits and track your wellness to earn badges!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
