import { useState, useMemo } from 'react';
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
  Radio
} from 'lucide-react';
import { useRecordedSessions, useLiveClasses, useFavoriteSessions } from '../hooks/useSupabaseData';
import { format, parseISO, isAfter, isBefore, addHours } from 'date-fns';

const categories = [
  'All',
  'Yoga',
  'Meditation',
  'Fitness',
  'Nutrition',
  'Sleep',
  'Wellness',
];

const classImages: Record<string, string> = {
  'Yoga': 'from-pink-400 to-rose-500',
  'Meditation': 'from-purple-400 to-indigo-500',
  'Fitness': 'from-green-400 to-teal-500',
  'Nutrition': 'from-orange-400 to-amber-500',
  'Sleep': 'from-blue-400 to-indigo-500',
  'Wellness': 'from-coral-400 to-pink-500',
};

export default function Classes() {
  const { sessions: recordedSessions, loading: sessionsLoading } = useRecordedSessions();
  const { classes: liveClasses, loading: classesLoading } = useLiveClasses();
  const { favoriteIds, toggleFavorite } = useFavoriteSessions();
  
  const [activeTab, setActiveTab] = useState<'live' | 'recorded' | 'favorites'>('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const now = new Date();

  // Helper functions
  const isClassLive = (scheduledAt: string, duration: number) => {
    const startTime = parseISO(scheduledAt);
    const endTime = addHours(startTime, duration / 60);
    return isAfter(now, startTime) && isBefore(now, endTime);
  };

  const isClassUpcoming = (scheduledAt: string) => {
    return isAfter(parseISO(scheduledAt), now);
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
      tags: session.tags || [],
    }));
  }, [recordedSessions, favoriteIds]);

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

  // Filter functions
  const filterBySearch = (title: string, description: string) =>
    title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    description.toLowerCase().includes(searchQuery.toLowerCase());

  const filterByCategory = (category: string) =>
    selectedCategory === 'All' || category === selectedCategory;

  // Filtered data
  const filteredLiveClasses = mappedLiveClasses.filter(
    (c) => filterBySearch(c.title, c.description) && filterByCategory(c.category)
  );

  const filteredRecordedSessions = mappedRecordedSessions.filter(
    (s) => filterBySearch(s.title, s.description) && filterByCategory(s.category)
  );

  const favoriteSessions = mappedRecordedSessions.filter((s) => s.isFavorite);

  const loading = sessionsLoading || classesLoading;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Classes
        </h1>
        <p className="text-gray-500 mt-1">Join live sessions or watch recordings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100">
        {[
          { id: 'live', label: 'Live Classes', icon: Radio },
          { id: 'recorded', label: 'Recordings', icon: Video },
          { id: 'favorites', label: 'Favorites', icon: Heart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'live' | 'recorded' | 'favorites')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-coral-600 border-coral-500'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
            {tab.id === 'favorites' && favoriteSessions.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-coral-100 text-coral-600 text-xs rounded-full">
                {favoriteSessions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classes..."
            className="input pl-12"
          />
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

      {/* Live Classes */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          {/* Live Now */}
          {filteredLiveClasses.some((c) => isClassLive(c.scheduledAt, c.duration)) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                Live Now
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLiveClasses
                  .filter((c) => isClassLive(c.scheduledAt, c.duration))
                  .map((classItem) => (
                    <LiveClassCard key={classItem.id} classItem={classItem} isLive />
                  ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLiveClasses
                .filter((c) => isClassUpcoming(c.scheduledAt))
                .map((classItem) => (
                  <LiveClassCard key={classItem.id} classItem={classItem} />
                ))}
            </div>
            {filteredLiveClasses.filter((c) => isClassUpcoming(c.scheduledAt)).length === 0 && (
              <div className="card text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming classes scheduled</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recorded Sessions */}
      {activeTab === 'recorded' && (
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
                onToggleFavorite={() => toggleFavorite(session.id)}
              />
            ))
          ) : (
            <div className="col-span-full card text-center py-12">
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recordings found</p>
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
                onToggleFavorite={() => toggleFavorite(session.id)}
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
  const gradientClass = classImages[classItem.category] || 'from-coral-400 to-coral-600';

  return (
    <div className="card overflow-hidden hover:shadow-elevated transition-shadow">
      <div className={`h-32 bg-gradient-to-br ${gradientClass} -mx-6 -mt-6 mb-4 relative flex items-center justify-center`}>
        {isLive && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        )}
        <Video className="w-12 h-12 text-white/80" />
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
            {format(parseISO(classItem.scheduledAt), 'MMM d, h:mm a')}
          </span>
        </div>
        <a
          href={classItem.zoomLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            isLive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-coral-100 hover:bg-coral-200 text-coral-600'
          }`}
        >
          {isLive ? 'Join Now' : 'Set Reminder'}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
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
    tags: string[];
  };
  onToggleFavorite: () => void;
}

function RecordedSessionCard({ session, onToggleFavorite }: RecordedSessionCardProps) {
  const gradientClass = classImages[session.category] || 'from-coral-400 to-coral-600';

  return (
    <div className="card overflow-hidden hover:shadow-elevated transition-shadow group">
      <div className={`h-40 bg-gradient-to-br ${gradientClass} -mx-6 -mt-6 mb-4 relative`}>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <PlayCircle className="w-16 h-16 text-white" />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            session.isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${session.isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
          {session.duration} min
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-coral-600 transition-colors">
        {session.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{session.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {session.instructor}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {session.views}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {session.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          {format(parseISO(session.recordedAt), 'MMM d, yyyy')}
        </span>
        <button className="flex items-center gap-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-xl font-medium transition-colors">
          <PlayCircle className="w-4 h-4" />
          Watch
        </button>
      </div>
    </div>
  );
}
