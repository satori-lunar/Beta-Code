import { Link } from 'react-router-dom';
import {
  Flame,
  Target,
  Dumbbell,
  BookOpen,
  Scale,
  Calendar,
  Video,
  Star,
  TrendingUp,
  Heart,
  Brain
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome back, {user?.user_metadata?.name || 'Friend'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                Your wellness journey starts here
              </p>
            </div>
            <Flame className="w-16 h-16 text-orange-500" />
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Habits */}
          <Link
            to="/habits"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-10 h-10 text-blue-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Daily Habits
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Track and build positive habits
            </p>
          </Link>

          {/* Workout */}
          <Link
            to="/workout"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Dumbbell className="w-10 h-10 text-purple-500" />
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Workouts
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Start your fitness journey
            </p>
          </Link>

          {/* Journal */}
          <Link
            to="/journal"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-10 h-10 text-green-500" />
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Journal
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Reflect on your day
            </p>
          </Link>

          {/* Weight Tracking */}
          <Link
            to="/weight"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Scale className="w-10 h-10 text-pink-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Weight Tracker
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your progress
            </p>
          </Link>

          {/* Health Metrics */}
          <Link
            to="/health"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-10 h-10 text-red-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Health Metrics
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Track vital health data
            </p>
          </Link>

          {/* Mindfulness */}
          <Link
            to="/mindfulness"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-10 h-10 text-indigo-500" />
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Mindfulness
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find your inner peace
            </p>
          </Link>

          {/* Live Classes */}
          <Link
            to="/live-classes"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Video className="w-10 h-10 text-cyan-500" />
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Live Classes
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join wellness sessions
            </p>
          </Link>

          {/* Nutrition */}
          <Link
            to="/nutrition"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-10 h-10 text-orange-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Nutrition
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Track your meals
            </p>
          </Link>

          {/* Courses */}
          <Link
            to="/courses"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Star className="w-10 h-10 text-yellow-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Learn and grow
            </p>
          </Link>
        </div>

        {/* Motivational Message */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">
            Every journey begins with a single step
          </h3>
          <p className="text-purple-100">
            Your wellness is our priority. Explore your tools and make today count!
          </p>
        </div>
      </div>
    </div>
  );
}
