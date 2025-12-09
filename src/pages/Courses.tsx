import { useState } from 'react';
import {
  Search,
  PlayCircle,
  Clock,
  User,
  ChevronRight,
  BookOpen,
  Star,
  Grid,
  List
} from 'lucide-react';
import { useStore } from '../store/useStore';

const categories = [
  'All',
  'Meditation',
  'Yoga',
  'Nutrition',
  'Fitness',
  'Mindfulness',
  'Personal Growth',
  'Sleep',
];

const courseImages: Record<string, string> = {
  'Finding Calm': 'from-teal-400 to-teal-600',
  'Spiritual Growth': 'from-purple-400 to-purple-600',
  'Motivation Mastery': 'from-orange-400 to-orange-600',
  'Breathe & Release': 'from-pink-400 to-pink-600',
  'Meaningful Life': 'from-coral-400 to-coral-600',
};

export default function Courses() {
  const { courses, updateCourseProgress } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterProgress, setFilterProgress] = useState<'all' | 'in-progress' | 'completed'>('all');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const progress = (course.completedSessions / course.sessions) * 100;
    const matchesProgress =
      filterProgress === 'all' ||
      (filterProgress === 'in-progress' && progress > 0 && progress < 100) ||
      (filterProgress === 'completed' && progress === 100);
    return matchesSearch && matchesCategory && matchesProgress;
  });

  const inProgressCount = courses.filter(
    (c) => c.completedSessions > 0 && c.completedSessions < c.sessions
  ).length;
  const completedCount = courses.filter(
    (c) => c.completedSessions === c.sessions
  ).length;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Courses
        </h1>
        <p className="text-gray-500 mt-1">Expand your wellness knowledge</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          <p className="text-sm text-gray-500">Total Courses</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
          <p className="text-sm text-gray-500">In Progress</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="input pl-12"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'grid'
                  ? 'bg-coral-100 text-coral-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'list'
                  ? 'bg-coral-100 text-coral-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-coral-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(['all', 'in-progress', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterProgress(filter)}
              className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                filterProgress === filter
                  ? 'bg-navy-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'All Courses' : filter === 'in-progress' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const progress = Math.round((course.completedSessions / course.sessions) * 100);
            const gradientClass = courseImages[course.title] || 'from-coral-400 to-coral-600';

            return (
              <div
                key={course.id}
                className="card overflow-hidden hover:shadow-elevated transition-shadow cursor-pointer group"
              >
                <div className={`h-36 bg-gradient-to-br ${gradientClass} -mx-6 -mt-6 mb-4 relative`}>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                  {progress === 100 && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      Completed
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-coral-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {course.instructor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">
                      {course.completedSessions}/{course.sessions} sessions
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-coral-400 to-coral-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    updateCourseProgress(
                      course.id,
                      Math.min(course.completedSessions + 1, course.sessions)
                    )
                  }
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-gray-100 hover:bg-coral-50 text-gray-700 hover:text-coral-600 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {progress === 100 ? 'Review Course' : 'Continue Learning'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const progress = Math.round((course.completedSessions / course.sessions) * 100);
            const gradientClass = courseImages[course.title] || 'from-coral-400 to-coral-600';

            return (
              <div
                key={course.id}
                className="card flex gap-4 hover:shadow-elevated transition-shadow cursor-pointer"
              >
                <div className={`w-24 h-24 rounded-xl bg-gradient-to-br ${gradientClass} flex-shrink-0 flex items-center justify-center`}>
                  <PlayCircle className="w-10 h-10 text-white/80" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                    </div>
                    {progress === 100 && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full whitespace-nowrap">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {course.instructor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.sessions} sessions
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-coral-400 to-coral-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredCourses.length === 0 && (
        <div className="card text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No courses found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
