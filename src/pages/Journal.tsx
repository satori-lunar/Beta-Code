import { useState } from 'react';
import {
  Plus,
  Search,
  Calendar,
  X,
  Trash2,
  Edit3,
  Heart,
  Tag,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useJournalEntries, checkFirstTimeBadges, checkJournalBadges } from '../hooks/useSupabaseData';
import { useTrackJournal } from '../hooks/useActivityTracking';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';

const moodOptions = [
  { id: 'great', label: 'Great', icon: '😊', color: 'bg-green-100 text-green-700' },
  { id: 'good', label: 'Good', icon: '🙂', color: 'bg-sage-100 text-sage-700' },
  { id: 'neutral', label: 'Neutral', icon: '😐', color: 'bg-gray-100 text-gray-700' },
  { id: 'low', label: 'Low', icon: '😔', color: 'bg-amber-100 text-amber-700' },
  { id: 'bad', label: 'Bad', icon: '😢', color: 'bg-red-100 text-red-700' },
];

type Mood = 'great' | 'good' | 'neutral' | 'low' | 'bad';

export default function Journal() {
  const { user } = useAuth();
  const { data: journalEntries = [], refetch } = useJournalEntries();
  const { trackJournalEntry } = useTrackJournal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'good' as Mood,
    specificEmotion: null as string | null,
    tags: '',
    gratitude: ['', '', ''],
  });
  const [showFeelingsWheel, setShowFeelingsWheel] = useState(false);

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      (entry.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = !filterMood || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const handleSaveEntry = async () => {
    if (!user || !newEntry.title.trim() || !newEntry.content.trim()) return;

    try {
      const entryData = {
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        specific_emotion: newEntry.specificEmotion || null,
        tags: newEntry.tags.split(',').map((t) => t.trim()).filter(Boolean),
        gratitude: newEntry.gratitude.filter(Boolean),
        date: format(new Date(), 'yyyy-MM-dd'),
        user_id: user.id,
      };

      const isNewEntry = !editingEntry;

      if (editingEntry) {
        const { error } = await supabase.from('journal_entries').update(entryData).eq('id', editingEntry);
        if (error) throw error;
        // Track journal update (fire and forget - don't block on tracking)
        trackJournalEntry(editingEntry, entryData.title, 'journal_entry_updated').catch(err => {
          console.error('Failed to track journal update:', err);
        });
      } else {
        const { data: newEntryData, error } = await supabase.from('journal_entries').insert(entryData).select().single();
        if (error) throw error;
        // Track journal creation (fire and forget - don't block on tracking)
        if (newEntryData) {
          trackJournalEntry(newEntryData.id, entryData.title, 'journal_entry_created').catch(err => {
            console.error('Failed to track journal creation:', err);
          });
        }
      }

      // Check for first journal entry badge (only for new entries)
      if (isNewEntry && journalEntries.length === 0) {
        checkFirstTimeBadges(user.id, 'journal_entry').catch(err => {
          console.error('Failed to check badges:', err);
        });
      }
      // Check for journal milestone badges
      if (isNewEntry) {
        checkJournalBadges(user.id).catch(err => {
          console.error('Failed to check journal badges:', err);
        });
      }

      refetch();
      resetForm();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save journal entry. Please try again.');
    }
  };

  const resetForm = () => {
    setNewEntry({
      title: '',
      content: '',
      mood: 'good',
      specificEmotion: null,
      tags: '',
      gratitude: ['', '', ''],
    });
    setShowAddModal(false);
    setEditingEntry(null);
    setShowFeelingsWheel(false);
  };

  const handleEditEntry = (entry: typeof journalEntries[0]) => {
    setNewEntry({
      title: entry.title || '',
      content: entry.content,
      mood: (entry.mood as Mood) || 'good',
      specificEmotion: (entry as any).specific_emotion || null,
      tags: Array.isArray(entry.tags) ? entry.tags.join(', ') : '',
      gratitude: [
        entry.gratitude?.[0] || '',
        entry.gratitude?.[1] || '',
        entry.gratitude?.[2] || '',
      ],
    });
    setEditingEntry(entry.id);
    setShowAddModal(true);
  };

  const getMoodIcon = (mood: string) => {
    const moodData = moodOptions.find((m) => m.id === mood);
    return moodData?.icon || '😐';
  };

  const getMoodColor = (mood: string) => {
    const moodData = moodOptions.find((m) => m.id === mood);
    return moodData?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
            Journal
          </h1>
          <p className="text-gray-500 mt-1">Reflect on your thoughts and feelings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal entries..."
            className="input pl-12"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilterMood(null)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
              !filterMood ? 'bg-coral-100 text-coral-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {moodOptions.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setFilterMood(filterMood === mood.id ? null : mood.id)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${
                filterMood === mood.id ? mood.color : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mood.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Entries - Grid Layout for better organization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="card hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0 ${getMoodColor(entry.mood || 'neutral')}`}>
                  {getMoodIcon(entry.mood || 'neutral')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{entry.title}</h3>
                  {(entry as any).specific_emotion && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 italic">
                      {(entry as any).specific_emotion}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{format(parseISO(entry.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{format(parseISO(entry.created_at || entry.date), 'h:mm a')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleEditEntry(entry)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-coral-500 hover:bg-coral-50 rounded-lg transition-colors"
                  aria-label="Edit entry"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this entry?')) {
                      await supabase.from('journal_entries').delete().eq('id', entry.id);
                      refetch();
                    }
                  }}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <p className="text-gray-600 mb-4 whitespace-pre-wrap text-sm sm:text-base line-clamp-4">{entry.content}</p>

            {/* Gratitude Section */}
            {entry.gratitude && entry.gratitude.length > 0 && (
              <div className="mb-4 p-3 sm:p-4 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-amber-700">
                  <Heart className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">Gratitude</span>
                </div>
                <ul className="space-y-1">
                  {entry.gratitude.map((item, index) => (
                    <li key={index} className="text-xs sm:text-sm text-amber-800 break-words">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {entry.tags && Array.isArray(entry.tags) && entry.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                {entry.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="col-span-full card text-center py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">No entries found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {searchQuery || filterMood
                ? 'Try adjusting your search or filters'
                : 'Start journaling to capture your thoughts'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-elevated sm:my-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-display font-semibold">
                {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => {
                        setNewEntry({ ...newEntry, mood: mood.id as Mood, specificEmotion: null });
                      }}
                      className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all text-sm ${
                        newEntry.mood === mood.id
                          ? `${mood.color} ring-2 ring-offset-2 ring-gray-300`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-base sm:text-lg">{mood.icon}</span>
                      <span className="font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeelingsWheel(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 hover:from-purple-100 hover:to-pink-100 transition-all text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  {newEntry.specificEmotion ? `Feeling: ${newEntry.specificEmotion}` : 'Explore deeper emotions'}
                </button>
                {newEntry.specificEmotion && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: <span className="font-medium italic">{newEntry.specificEmotion}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="Give your entry a title..."
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Write your thoughts here..."
                  rows={6}
                  className="input resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="w-4 h-4 inline mr-1 text-coral-500" />
                  Three things I'm grateful for
                </label>
                <div className="space-y-2">
                  {[0, 1, 2].map((index) => (
                    <input
                      key={index}
                      type="text"
                      value={newEntry.gratitude[index]}
                      onChange={(e) => {
                        const newGratitude = [...newEntry.gratitude];
                        newGratitude[index] = e.target.value;
                        setNewEntry({ ...newEntry, gratitude: newGratitude });
                      }}
                      placeholder={`${index + 1}. I'm grateful for...`}
                      className="input"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                  placeholder="e.g., reflection, goals, mindfulness"
                  className="input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={handleSaveEntry} className="flex-1 btn-primary">
                  {editingEntry ? 'Save Changes' : 'Save Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feelings Wheel Modal */}
      {showFeelingsWheel && (
        <FeelingsWheel
          mainMood={newEntry.mood}
          selectedEmotion={newEntry.specificEmotion}
          onSelect={(emotion) => setNewEntry({ ...newEntry, specificEmotion: emotion })}
          onClose={() => setShowFeelingsWheel(false)}
        />
      )}
    </div>
  );
}
