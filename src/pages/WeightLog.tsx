import { useState } from 'react';
import {
  Plus,
  Scale,
  TrendingDown,
  TrendingUp,
  Target,
  Calendar,
  X,
  Trash2,
  Edit2,
  Check,
  Star,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useWeightEntries, checkFirstTimeBadges, useUserProfile } from '../hooks/useSupabaseData';
import { useTrackWeightLog } from '../hooks/useActivityTracking';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';

export default function WeightLog() {
  const { user } = useAuth();
  const { data: weightEntries = [], refetch } = useWeightEntries();
  const { trackWeightLog } = useTrackWeightLog();
  const { profile } = useUserProfile();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoalType, setEditingGoalType] = useState<'ultimate' | 'weekly' | 'newyear' | null>(null);
  const [goalWeight, setGoalWeight] = useState('');
  const [newEntry, setNewEntry] = useState({
    weight: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  const sortedEntries = [...weightEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedEntries.map(entry => ({
    date: format(parseISO(entry.date), 'MMM d'),
    weight: entry.weight,
    fullDate: entry.date,
  }));

  const latestWeight = sortedEntries[sortedEntries.length - 1];
  const previousWeight = sortedEntries[sortedEntries.length - 2];
  const startWeight = sortedEntries[0];

  const weeklyChange = latestWeight && previousWeight
    ? (latestWeight.weight - previousWeight.weight).toFixed(1)
    : null;

  const totalChange = latestWeight && startWeight
    ? (latestWeight.weight - startWeight.weight).toFixed(1)
    : null;

  // Get goal weights from profile (default to null if not set)
  const userGoalWeight = (profile as any)?.goal_weight || null;
  const ultimateGoalWeight = (profile as any)?.ultimate_goal_weight || null;
  const weeklyGoalWeight = (profile as any)?.weekly_goal_weight || null;
  const newYearResolutionWeight = (profile as any)?.new_year_resolution_weight || null;
  const goalWeightUnit = (profile as any)?.goal_weight_unit || 'lbs';
  
  const toGoal = latestWeight && userGoalWeight 
    ? (latestWeight.weight - userGoalWeight).toFixed(1) 
    : null;
  const toUltimateGoal = latestWeight && ultimateGoalWeight 
    ? (latestWeight.weight - ultimateGoalWeight).toFixed(1) 
    : null;
  const toWeeklyGoal = latestWeight && weeklyGoalWeight 
    ? (latestWeight.weight - weeklyGoalWeight).toFixed(1) 
    : null;
  const toNewYearGoal = latestWeight && newYearResolutionWeight 
    ? (latestWeight.weight - newYearResolutionWeight).toFixed(1) 
    : null;

  const handleAddEntry = async () => {
    if (!user || !newEntry.weight) return;

    try {
      const isFirstEntry = weightEntries.length === 0;
      const weightValue = parseFloat(newEntry.weight);

      const { data: newWeightEntry, error } = await supabase.from('weight_entries').insert({
        user_id: user.id,
        date: newEntry.date,
        weight: weightValue,
        unit: 'lbs',
        notes: newEntry.notes || null,
      }).select().single();

      if (error) throw error;

      // Track weight log activity (fire and forget - don't block on tracking)
      if (newWeightEntry) {
        trackWeightLog(newWeightEntry.id, weightValue, 'lbs').catch(err => {
          console.error('Failed to track weight log:', err);
        });
      }

      // Check for first weight log badge (fire and forget)
      if (isFirstEntry) {
        checkFirstTimeBadges(user.id, 'weight_log').catch(err => {
          console.error('Failed to check badges:', err);
        });
      }

      refetch();
      setNewEntry({
        weight: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving weight entry:', error);
      alert('Failed to save weight entry. Please try again.');
    }
  };

  const handleSetGoalWeight = async () => {
    if (!user || !goalWeight || !editingGoalType) return;

    try {
      const goalWeightValue = parseFloat(goalWeight);
      if (isNaN(goalWeightValue)) {
        alert('Please enter a valid weight');
        return;
      }

      const updateData: any = {};
      if (editingGoalType === 'ultimate') {
        updateData.ultimate_goal_weight = goalWeightValue;
      } else if (editingGoalType === 'weekly') {
        updateData.weekly_goal_weight = goalWeightValue;
      } else if (editingGoalType === 'newyear') {
        updateData.new_year_resolution_weight = goalWeightValue;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setShowGoalModal(false);
      setEditingGoalType(null);
      setGoalWeight('');
      // Force a page refresh to update the profile data
      window.location.reload();
    } catch (error) {
      console.error('Error setting goal weight:', error);
      alert('Failed to set goal weight. Please try again.');
    }
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
            Weight Log
          </h1>
          <p className="text-gray-500 mt-1">Track your weight journey over time</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          Log Weight
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-coral-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {latestWeight?.weight || '--'} lbs
          </p>
          <p className="text-sm text-gray-500">Current Weight</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              weeklyChange && Number(weeklyChange) < 0 ? 'bg-green-100' : 'bg-amber-100'
            }`}>
              {weeklyChange && Number(weeklyChange) < 0 ? (
                <TrendingDown className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingUp className="w-5 h-5 text-amber-600" />
              )}
            </div>
          </div>
          <p className={`text-2xl font-bold ${
            weeklyChange && Number(weeklyChange) < 0 ? 'text-green-600' : 'text-amber-600'
          }`}>
            {weeklyChange ? `${Number(weeklyChange) > 0 ? '+' : ''}${weeklyChange}` : '--'} lbs
          </p>
          <p className="text-sm text-gray-500">This Week</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              totalChange && Number(totalChange) < 0 ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {totalChange && Number(totalChange) < 0 ? (
                <TrendingDown className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingUp className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </div>
          <p className={`text-2xl font-bold ${
            totalChange && Number(totalChange) < 0 ? 'text-green-600' : 'text-blue-600'
          }`}>
            {totalChange ? `${Number(totalChange) > 0 ? '+' : ''}${totalChange}` : '--'} lbs
          </p>
          <p className="text-sm text-gray-500">Total Change</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          {userGoalWeight ? (
            <>
              <p className={`text-2xl font-bold ${
                toGoal && Number(toGoal) <= 0 ? 'text-green-600' : 'text-gray-900'
              }`}>
                {toGoal ? `${Number(toGoal) > 0 ? '+' : ''}${toGoal}` : '0'} lbs
              </p>
              <p className="text-sm text-gray-500">
                To Goal ({userGoalWeight} {goalWeightUnit})
                {toGoal && Number(toGoal) <= 0 && (
                  <span className="text-green-600 font-medium ml-1">✓ Reached!</span>
                )}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-400">--</p>
              <button
                onClick={() => {
                  setGoalWeight('');
                  setEditingGoalType(null);
                  setShowGoalModal(true);
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-1"
              >
                Set Goal Weight
              </button>
            </>
          )}
        </div>
      </div>

      {/* Weight Plan Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-gray-900">
            Weight Plan
          </h2>
          <button
            onClick={() => {
              setShowGoalModal(true);
              setEditingGoalType(null);
              setGoalWeight('');
            }}
            className="text-sm text-coral-600 hover:text-coral-700 font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Manage Goals
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ultimate Goal */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Ultimate Goal</h3>
              </div>
              <button
                onClick={() => {
                  setGoalWeight(ultimateGoalWeight?.toString() || '');
                  setEditingGoalType('ultimate');
                  setShowGoalModal(true);
                }}
                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Edit ultimate goal"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            {ultimateGoalWeight ? (
              <>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {ultimateGoalWeight} {goalWeightUnit}
                </p>
                {latestWeight && (
                  <p className={`text-sm ${Number(toUltimateGoal) <= 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {Number(toUltimateGoal) > 0 ? '+' : ''}{toUltimateGoal} {goalWeightUnit} to go
                    {Number(toUltimateGoal) <= 0 && (
                      <span className="ml-1 font-medium">✓ Reached!</span>
                    )}
                  </p>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setGoalWeight('');
                  setEditingGoalType('ultimate');
                  setShowGoalModal(true);
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Set Ultimate Goal
              </button>
            )}
          </div>

          {/* Weekly Goal */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">This Week</h3>
              </div>
              <button
                onClick={() => {
                  setGoalWeight(weeklyGoalWeight?.toString() || '');
                  setEditingGoalType('weekly');
                  setShowGoalModal(true);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit weekly goal"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            {weeklyGoalWeight ? (
              <>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {weeklyGoalWeight} {goalWeightUnit}
                </p>
                {latestWeight && (
                  <p className={`text-sm ${Number(toWeeklyGoal) <= 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {Number(toWeeklyGoal) > 0 ? '+' : ''}{toWeeklyGoal} {goalWeightUnit} to go
                    {Number(toWeeklyGoal) <= 0 && (
                      <span className="ml-1 font-medium">✓ Reached!</span>
                    )}
                  </p>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setGoalWeight('');
                  setEditingGoalType('weekly');
                  setShowGoalModal(true);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Set Weekly Goal
              </button>
            )}
          </div>

          {/* New Year Resolution */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">New Year</h3>
              </div>
              <button
                onClick={() => {
                  setGoalWeight(newYearResolutionWeight?.toString() || '');
                  setEditingGoalType('newyear');
                  setShowGoalModal(true);
                }}
                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Edit New Year resolution"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            {newYearResolutionWeight ? (
              <>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {newYearResolutionWeight} {goalWeightUnit}
                </p>
                {latestWeight && (
                  <p className={`text-sm ${Number(toNewYearGoal) <= 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {Number(toNewYearGoal) > 0 ? '+' : ''}{toNewYearGoal} {goalWeightUnit} to go
                    {Number(toNewYearGoal) <= 0 && (
                      <span className="ml-1 font-medium">✓ Reached!</span>
                    )}
                  </p>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setGoalWeight('');
                  setEditingGoalType('newyear');
                  setShowGoalModal(true);
                }}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Set New Year Goal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
          Weight Progress
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                tickFormatter={(value) => `${value} lbs`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [`${value} lbs`, 'Weight']}
              />
              {userGoalWeight && (
                <ReferenceLine
                  y={userGoalWeight}
                  stroke="#9333ea"
                  strokeDasharray="5 5"
                  label={{ value: `Goal: ${userGoalWeight} ${goalWeightUnit}`, position: 'right', fontSize: 12 }}
                />
              )}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#f86f4d"
                strokeWidth={3}
                dot={{ fill: '#f86f4d', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#f86f4d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weight History */}
      <div className="card">
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
          Weight History
        </h2>
        <div className="space-y-3">
          {[...sortedEntries].reverse().map((entry, index) => {
            const prevEntry = sortedEntries[sortedEntries.length - 2 - index];
            const change = prevEntry ? entry.weight - prevEntry.weight : null;

            return (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                  {entry.notes && (
                    <p className="text-sm text-gray-500">{entry.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{entry.weight} lbs</p>
                  {change !== null && (
                    <p className={`text-sm ${
                      change < 0 ? 'text-green-600' : change > 0 ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)} lbs
                    </p>
                  )}
                </div>
                <button
                  onClick={async () => {
                    await supabase.from('weight_entries').delete().eq('id', entry.id);
                    refetch();
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {weightEntries.length === 0 && (
            <div className="text-center py-12">
              <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No weight entries yet. Log your first weight!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Weight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-4 sm:p-6 shadow-elevated my-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold">Log Weight</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                  placeholder="Enter your weight"
                  className="input text-2xl text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="e.g., After morning routine"
                  className="input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={handleAddEntry} className="flex-1 btn-primary">
                  Log Weight
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set Goal Weight Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-4 sm:p-6 shadow-elevated my-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold">
                {editingGoalType === 'ultimate' ? 'Ultimate Goal Weight' :
                 editingGoalType === 'weekly' ? 'Weekly Goal Weight' :
                 editingGoalType === 'newyear' ? 'New Year Resolution' :
                 'Weight Plan Goals'}
              </h3>
              <button
                onClick={() => {
                  setShowGoalModal(false);
                  setEditingGoalType(null);
                  setGoalWeight('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {editingGoalType ? (
                // Editing a specific goal
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goal Weight ({goalWeightUnit})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={goalWeight}
                      onChange={(e) => setGoalWeight(e.target.value)}
                      placeholder={`Enter your ${editingGoalType === 'ultimate' ? 'ultimate' : editingGoalType === 'weekly' ? 'weekly' : 'New Year'} goal weight`}
                      className="input text-2xl text-center font-bold"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {editingGoalType === 'ultimate' && 'Set your long-term ultimate weight goal.'}
                      {editingGoalType === 'weekly' && 'Set your goal weight for this week.'}
                      {editingGoalType === 'newyear' && 'Set your New Year resolution weight goal.'}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowGoalModal(false);
                        setEditingGoalType(null);
                        setGoalWeight('');
                      }}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSetGoalWeight} 
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                      disabled={!goalWeight || isNaN(parseFloat(goalWeight))}
                    >
                      <Check className="w-5 h-5" />
                      {((editingGoalType === 'ultimate' && ultimateGoalWeight) ||
                        (editingGoalType === 'weekly' && weeklyGoalWeight) ||
                        (editingGoalType === 'newyear' && newYearResolutionWeight)) ? 'Update Goal' : 'Set Goal'}
                    </button>
                  </div>

                  {((editingGoalType === 'ultimate' && ultimateGoalWeight) ||
                    (editingGoalType === 'weekly' && weeklyGoalWeight) ||
                    (editingGoalType === 'newyear' && newYearResolutionWeight)) && (
                    <button
                      onClick={async () => {
                        if (!user) return;
                        try {
                          const updateData: any = {};
                          if (editingGoalType === 'ultimate') {
                            updateData.ultimate_goal_weight = null;
                          } else if (editingGoalType === 'weekly') {
                            updateData.weekly_goal_weight = null;
                          } else if (editingGoalType === 'newyear') {
                            updateData.new_year_resolution_weight = null;
                          }

                          const { error } = await supabase
                            .from('user_profiles')
                            .update(updateData)
                            .eq('id', user.id);

                          if (error) throw error;
                          setShowGoalModal(false);
                          setEditingGoalType(null);
                          window.location.reload();
                        } catch (error) {
                          console.error('Error removing goal weight:', error);
                          alert('Failed to remove goal weight. Please try again.');
                        }
                      }}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove Goal
                    </button>
                  )}
                </>
              ) : (
                // Managing all goals - show options to edit each
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Select a goal type to set or edit:
                  </div>
                  
                  <button
                    onClick={() => {
                      setGoalWeight(ultimateGoalWeight?.toString() || '');
                      setEditingGoalType('ultimate');
                    }}
                    className="w-full p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 bg-purple-50 hover:bg-purple-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Ultimate Goal</p>
                        <p className="text-sm text-gray-600">Your long-term weight goal</p>
                        {ultimateGoalWeight && (
                          <p className="text-sm text-purple-600 font-medium mt-1">
                            Current: {ultimateGoalWeight} {goalWeightUnit}
                          </p>
                        )}
                      </div>
                      <Edit2 className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setGoalWeight(weeklyGoalWeight?.toString() || '');
                      setEditingGoalType('weekly');
                    }}
                    className="w-full p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <CalendarDays className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Weekly Goal</p>
                        <p className="text-sm text-gray-600">Your goal for this week</p>
                        {weeklyGoalWeight && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            Current: {weeklyGoalWeight} {goalWeightUnit}
                          </p>
                        )}
                      </div>
                      <Edit2 className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setGoalWeight(newYearResolutionWeight?.toString() || '');
                      setEditingGoalType('newyear');
                    }}
                    className="w-full p-4 rounded-xl border-2 border-amber-200 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">New Year Resolution</p>
                        <p className="text-sm text-gray-600">Your New Year weight goal</p>
                        {newYearResolutionWeight && (
                          <p className="text-sm text-amber-600 font-medium mt-1">
                            Current: {newYearResolutionWeight} {goalWeightUnit}
                          </p>
                        )}
                      </div>
                      <Edit2 className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowGoalModal(false);
                      setEditingGoalType(null);
                      setGoalWeight('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 mt-4"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
