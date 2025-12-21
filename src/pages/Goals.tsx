import { useState, useEffect } from 'react';
import {
  Plus,
  Target,
  X,
  Trash2,
  Edit3,
  Calendar,
  Flag,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { format, parseISO, isBefore } from 'date-fns';
import { useNavigate } from 'react-router-dom';

type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';
type GoalCategory = 'health' | 'fitness' | 'wellness' | 'personal' | 'career' | 'relationships';

interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  target_date: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
}

const categoryOptions: { id: GoalCategory; label: string; color: string; icon: any }[] = [
  { id: 'health', label: 'Health', color: 'bg-red-100 text-red-700', icon: Target },
  { id: 'fitness', label: 'Fitness', color: 'bg-orange-100 text-orange-700', icon: TrendingUp },
  { id: 'wellness', label: 'Wellness', color: 'bg-green-100 text-green-700', icon: Target },
  { id: 'personal', label: 'Personal', color: 'bg-blue-100 text-blue-700', icon: Target },
  { id: 'career', label: 'Career', color: 'bg-purple-100 text-purple-700', icon: Flag },
  { id: 'relationships', label: 'Relationships', color: 'bg-pink-100 text-pink-700', icon: Target },
];

const statusOptions: { id: GoalStatus; label: string; color: string }[] = [
  { id: 'not_started', label: 'Not Started', color: 'bg-gray-100 text-gray-700' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { id: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { id: 'paused', label: 'Paused', color: 'bg-amber-100 text-amber-700' },
];

export default function Goals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all');

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'health' as GoalCategory,
    status: 'not_started' as GoalStatus,
    target_date: '',
    progress: 0,
  });

  // Fetch goals
  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchGoals = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('goals' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals((data as any) || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  // Filter goals
  const filteredGoals = goals.filter((goal) => {
    const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  const handleSaveGoal = async () => {
    if (!user || !newGoal.title.trim()) return;

    try {
      const goalData = {
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        status: newGoal.status,
        target_date: newGoal.target_date || null,
        progress: newGoal.progress,
        user_id: user.id,
      };

      if (editingGoal) {
        const { error } = await supabase
          .from('goals' as any)
          .update(goalData)
          .eq('id', editingGoal);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('goals' as any)
          .insert(goalData);
        if (error) throw error;
      }

      fetchGoals();
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Failed to save goal. Please try again.');
    }
  };

  const resetForm = () => {
    setNewGoal({
      title: '',
      description: '',
      category: 'health',
      status: 'not_started',
      target_date: '',
      progress: 0,
    });
    setShowAddModal(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setNewGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      status: goal.status,
      target_date: goal.target_date || '',
      progress: goal.progress,
    });
    setEditingGoal(goal.id);
    setShowAddModal(true);
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      await supabase.from('goals' as any).delete().eq('id', id);
      fetchGoals();
    }
  };

  const updateProgress = async (id: string, progress: number) => {
    await supabase.from('goals' as any).update({ progress }).eq('id', id);
    fetchGoals();
  };

  const getCategoryData = (category: GoalCategory) => {
    return categoryOptions.find((c) => c.id === category) || categoryOptions[0];
  };

  const getStatusData = (status: GoalStatus) => {
    return statusOptions.find((s) => s.id === status) || statusOptions[0];
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Goals
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Set and track your wellness goals</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/new-year-resolution')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            New Year's Resolution
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm sm:text-base">New Goal</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-colors text-xs sm:text-sm ${
                filterCategory === 'all'
                  ? 'bg-coral-100 text-coral-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categoryOptions.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 sm:px-4 py-2 rounded-xl transition-colors text-xs sm:text-sm ${
                  filterCategory === cat.id ? cat.color : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-colors text-xs sm:text-sm ${
                filterStatus === 'all'
                  ? 'bg-coral-100 text-coral-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {statusOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => setFilterStatus(status.id)}
                className={`px-3 sm:px-4 py-2 rounded-xl transition-colors text-xs sm:text-sm ${
                  filterStatus === status.id ? status.color : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredGoals.map((goal) => {
          const categoryData = getCategoryData(goal.category);
          const statusData = getStatusData(goal.status);
          const CategoryIcon = categoryData.icon;
          const isOverdue = goal.target_date && isBefore(parseISO(goal.target_date), new Date()) && goal.status !== 'completed';

          return (
            <div key={goal.id} className="card hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryData.color}`}>
                    <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">{goal.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusData.color}`}>
                        {statusData.label}
                      </span>
                      {goal.target_date && (
                        <span className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'} flex items-center gap-1`}>
                          <Calendar className="w-3 h-3" />
                          {format(parseISO(goal.target_date), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-coral-500 hover:bg-coral-50 rounded-lg transition-colors"
                    aria-label="Edit goal"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {goal.description && (
                <p className="text-gray-600 mb-4 text-xs sm:text-sm line-clamp-2">{goal.description}</p>
              )}

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600">Progress</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-coral-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="flex gap-1 sm:gap-2 mt-2">
                  {[0, 25, 50, 75, 100].map((val) => (
                    <button
                      key={val}
                      onClick={() => updateProgress(goal.id, val)}
                      className={`flex-1 py-1 px-2 rounded text-xs transition-colors ${
                        goal.progress === val
                          ? 'bg-coral-100 text-coral-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filteredGoals.length === 0 && (
          <div className="col-span-full card text-center py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">No goals found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Start setting goals to track your progress'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-elevated sm:my-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-display font-semibold">
                {editingGoal ? 'Edit Goal' : 'New Goal'}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Run a 5K marathon"
                  className="input text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Describe your goal..."
                  rows={3}
                  className="input resize-none text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as GoalCategory })}
                    className="input text-sm sm:text-base"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newGoal.status}
                    onChange={(e) => setNewGoal({ ...newGoal, status: e.target.value as GoalStatus })}
                    className="input text-sm sm:text-base"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                    className="input text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newGoal.progress}
                    onChange={(e) => setNewGoal({ ...newGoal, progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                    className="input text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="w-full sm:flex-1 btn-primary text-sm sm:text-base"
                >
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
