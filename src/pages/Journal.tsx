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
  Clock,
  Sparkles,
  Brain,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useJournalEntries, checkFirstTimeBadges, checkJournalBadges } from '../hooks/useSupabaseData';
import { useTrackJournal } from '../hooks/useActivityTracking';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';
import FeelingsWheel from '../components/FeelingsWheel';
import EmotionalPrompts from '../components/EmotionalPrompts';

const moodOptions = [
  { 
    id: 'great', 
    label: 'Great', 
    icon: '😊', 
    color: 'bg-green-100 text-green-700',
    gradient: 'from-green-400 to-emerald-500',
    lightGradient: 'from-green-50 to-emerald-50'
  },
  { 
    id: 'good', 
    label: 'Good', 
    icon: '🙂', 
    color: 'bg-sage-100 text-sage-700',
    gradient: 'from-blue-400 to-cyan-500',
    lightGradient: 'from-blue-50 to-cyan-50'
  },
  { 
    id: 'neutral', 
    label: 'Neutral', 
    icon: '😐', 
    color: 'bg-gray-100 text-gray-700',
    gradient: 'from-gray-400 to-slate-500',
    lightGradient: 'from-gray-50 to-slate-50'
  },
  { 
    id: 'low', 
    label: 'Low', 
    icon: '😔', 
    color: 'bg-amber-100 text-amber-700',
    gradient: 'from-amber-400 to-orange-500',
    lightGradient: 'from-amber-50 to-orange-50'
  },
  { 
    id: 'bad', 
    label: 'Bad', 
    icon: '😢', 
    color: 'bg-red-100 text-red-700',
    gradient: 'from-red-400 to-rose-500',
    lightGradient: 'from-red-50 to-rose-50'
  },
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
    emotionalContext: '', // New field for deeper emotional exploration
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
    if (!user) {
      alert('You must be logged in to save journal entries.');
      return;
    }

    if (!newEntry.title.trim()) {
      alert('Please enter a title for your journal entry.');
      return;
    }

    if (!newEntry.content.trim()) {
      alert('Please enter some content for your journal entry.');
      return;
    }

    try {
      const entryData: any = {
        title: newEntry.title.trim(),
        content: newEntry.content.trim(),
        mood: newEntry.mood,
        specific_emotion: newEntry.specificEmotion || null,
        tags: newEntry.tags.split(',').map((t) => t.trim()).filter(Boolean),
        gratitude: newEntry.gratitude.filter(Boolean),
        date: format(new Date(), 'yyyy-MM-dd'),
        user_id: user.id,
      };
      
      // Add emotional context if provided (store in metadata)
      // Only include metadata if the column exists - wrap in try/catch to handle gracefully
      if (newEntry.emotionalContext && newEntry.emotionalContext.trim()) {
        entryData.metadata = { emotionalContext: newEntry.emotionalContext.trim() };
      }

      const isNewEntry = !editingEntry;

      // Retry logic for saving journal entries
      const saveWithRetry = async (maxRetries = 3): Promise<any> => {
        let lastError: any = null;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            if (editingEntry) {
              const { data, error } = await supabase
                .from('journal_entries')
                .update(entryData)
                .eq('id', editingEntry)
                .select()
                .single();
              
              if (error) throw error;
              return { data, isNew: false };
            } else {
              const { data: newEntryData, error } = await supabase
                .from('journal_entries')
                .insert(entryData)
                .select()
                .single();
              
              if (error) throw error;
              return { data: newEntryData, isNew: true };
            }
          } catch (error: any) {
            lastError = error;
            console.warn(`Journal save attempt ${attempt}/${maxRetries} failed:`, error);
            
            // Wait before retrying (exponential backoff)
            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 500 * attempt));
            }
          }
        }
        
        throw lastError || new Error('Failed to save journal entry after retries');
      };

      const result = await saveWithRetry();
      
      if (result.isNew) {
        console.log('Journal entry created successfully:', result.data);
        // Track journal creation (fire and forget - don't block on tracking)
        if (result.data) {
          trackJournalEntry(result.data.id, entryData.title, 'journal_entry_created').catch(err => {
            console.error('Failed to track journal creation:', err);
          });
        }
      } else {
        console.log('Journal entry updated successfully:', result.data);
        // Track journal update (fire and forget - don't block on tracking)
        trackJournalEntry(editingEntry!, entryData.title, 'journal_entry_updated').catch(err => {
          console.error('Failed to track journal update:', err);
        });
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

      // Reset form and close modal
      resetForm();
      
      // Refetch entries to show the new/updated entry
      await refetch();
      
      console.log('Journal entry saved and list refreshed');
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      const errorMessage = error?.message || 'Failed to save journal entry. Please try again.';
      alert(errorMessage);
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
      emotionalContext: '',
    });
    setShowAddModal(false);
    setEditingEntry(null);
    setShowFeelingsWheel(false);
  };

  const handleEditEntry = (entry: typeof journalEntries[0]) => {
    const metadata = (entry as any).metadata || {};
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
      emotionalContext: metadata.emotionalContext || '',
    });
    setEditingEntry(entry.id);
    setShowAddModal(true);
  };

  const handlePromptSelect = (prompt: string) => {
    // Add prompt to content or emotional context
    if (newEntry.content) {
      setNewEntry({ ...newEntry, content: newEntry.content + '\n\n' + prompt + '\n' });
    } else {
      setNewEntry({ ...newEntry, emotionalContext: newEntry.emotionalContext + (newEntry.emotionalContext ? '\n' : '') + prompt });
    }
  };

  const getMoodIcon = (mood: string) => {
    const moodData = moodOptions.find((m) => m.id === mood);
    return moodData?.icon || '😐';
  };

  const getMoodGradient = (mood: string) => {
    const moodData = moodOptions.find((m) => m.id === mood);
    return moodData?.gradient || 'from-gray-400 to-slate-500';
  };

  const getMoodLightGradient = (mood: string) => {
    const moodData = moodOptions.find((m) => m.id === mood);
    return moodData?.lightGradient || 'from-gray-50 to-slate-50';
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-coral-500 to-pink-500 bg-clip-text text-transparent">
            Journal
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Reflect on your thoughts and feelings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEntries.map((entry) => {
          const moodGradient = getMoodGradient(entry.mood || 'neutral');
          const moodLightGradient = getMoodLightGradient(entry.mood || 'neutral');
          
          return (
            <div 
              key={entry.id} 
              className="card overflow-hidden hover:shadow-elevated transition-all duration-300 group relative"
            >
              {/* Mood Gradient Header */}
              <div className={`h-20 bg-gradient-to-br ${moodGradient} -mx-6 -mt-6 mb-4 relative overflow-hidden`}>
                {/* Decorative pattern overlay */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_50%)]"></div>
                  <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                </div>
                {/* Mood Icon */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  {getMoodIcon(entry.mood || 'neutral')}
                </div>
                {/* Date Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                    <Calendar className="w-3 h-3" />
                    <span>{format(parseISO(entry.date), 'MMM d')}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Title and Emotion */}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-coral-600 transition-colors">
                    {entry.title}
                  </h3>
                  {(entry as any).specific_emotion && (
                    <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <p className="text-sm text-purple-700 italic font-semibold">
                          {(entry as any).specific_emotion}
                        </p>
                      </div>
                    </div>
                  )}
                  {((entry as any).metadata?.emotionalContext) && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-blue-700 mb-1">Emotional Context</p>
                          <p className="text-sm text-blue-800 whitespace-pre-wrap">
                            {((entry as any).metadata?.emotionalContext)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Preview */}
                <div className={`p-4 rounded-xl bg-gradient-to-br ${moodLightGradient} border border-gray-100`}>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base line-clamp-4 leading-relaxed">
                    {entry.content}
                  </p>
                </div>

                {/* Gratitude Section */}
                {entry.gratitude && entry.gratitude.length > 0 && (
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-amber-100 rounded-lg">
                        <Heart className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="font-semibold text-sm text-amber-800">Gratitude</span>
                    </div>
                    <ul className="space-y-2">
                      {entry.gratitude.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-amber-900">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {entry.tags && Array.isArray(entry.tags) && entry.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
                    <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {entry.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{format(parseISO(entry.created_at || entry.date), 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="p-2 text-gray-400 hover:text-coral-500 hover:bg-coral-50 rounded-lg transition-all duration-200"
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
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="col-span-full card text-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-coral-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Edit3 className="w-10 h-10 text-coral-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-xl">No entries found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery || filterMood
                ? "Try adjusting your search or filters to find what you're looking for"
                : 'Start your journaling journey by capturing your thoughts and feelings'}
            </p>
            {!searchQuery && !filterMood && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Entry
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl sm:my-auto flex flex-col">
            {/* Modal Header with Gradient */}
            <div className={`bg-gradient-to-r ${getMoodGradient(newEntry.mood)} p-6 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
              </div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-display font-bold mb-1">
                    {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
                  </h3>
                  <p className="text-white/90 text-sm">Capture your thoughts and feelings</p>
                </div>
                <button 
                  onClick={resetForm} 
                  className="p-2 hover:bg-white/20 rounded-lg flex-shrink-0 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">

              <div className="space-y-6">
                {/* Emotional Check-In Section */}
                <div className="p-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Emotional Check-In</h4>
                      <p className="text-xs text-gray-600">Start by naming what you're feeling</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      How are you feeling overall?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                      {moodOptions.map((mood) => (
                        <button
                          key={mood.id}
                          onClick={() => {
                            setNewEntry({ ...newEntry, mood: mood.id as Mood, specificEmotion: null });
                          }}
                          className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl transition-all text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105 ${
                            newEntry.mood === mood.id
                              ? `${mood.color} ring-2 ring-offset-2 ring-coral-300 shadow-md scale-105`
                              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <span className="text-2xl">{mood.icon}</span>
                          <span className="text-xs">{mood.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowFeelingsWheel(true)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all text-sm font-semibold shadow-sm hover:shadow-md ${
                        newEntry.specificEmotion
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-600'
                          : 'bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-300 text-purple-700 hover:from-purple-100 hover:via-pink-100 hover:to-rose-100'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {newEntry.specificEmotion ? `Feeling: ${newEntry.specificEmotion}` : '✨ Explore deeper emotions'}
                    </button>
                    
                    {newEntry.specificEmotion && (
                      <div className="mt-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-purple-300 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-purple-600 font-medium mb-1">Selected Emotion</p>
                            <p className="text-lg font-bold text-purple-700 italic">{newEntry.specificEmotion}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewEntry({ ...newEntry, specificEmotion: null })}
                            className="p-1.5 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emotional Reflection Prompts */}
                {(newEntry.specificEmotion || newEntry.mood) && (
                  <EmotionalPrompts
                    emotion={newEntry.specificEmotion}
                    mood={newEntry.mood}
                    onPromptSelect={handlePromptSelect}
                  />
                )}

                {/* Emotional Context - Deeper Exploration */}
                {newEntry.specificEmotion && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      What's behind this feeling?
                    </label>
                    <textarea
                      value={newEntry.emotionalContext}
                      onChange={(e) => setNewEntry({ ...newEntry, emotionalContext: e.target.value })}
                      placeholder={`Explore what's beneath ${newEntry.specificEmotion.toLowerCase()}. What thoughts, experiences, or needs are connected to this feeling?`}
                      rows={4}
                      className="input resize-none w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Take time to explore the roots of this emotion
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    placeholder="Give your entry a title..."
                    className="input w-full focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    placeholder="Write your thoughts here..."
                    rows={8}
                    className="input resize-none w-full focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Heart className="w-4 h-4 inline mr-2 text-coral-500" />
                    Three things I'm grateful for
                  </label>
                  <div className="space-y-3">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-bold text-amber-700">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={newEntry.gratitude[index]}
                          onChange={(e) => {
                            const newGratitude = [...newEntry.gratitude];
                            newGratitude[index] = e.target.value;
                            setNewEntry({ ...newEntry, gratitude: newGratitude });
                          }}
                          placeholder="I'm grateful for..."
                          className="input pl-12 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-2 text-gray-500" />
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                    placeholder="e.g., reflection, goals, mindfulness"
                    className="input w-full focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-white hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEntry} 
                  className="flex-1 btn-primary shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
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
