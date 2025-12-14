import { useState } from 'react';
import {
  Plus,
  Scale,
  TrendingDown,
  TrendingUp,
  Target,
  Calendar,
  X,
  Trash2
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
import { useWeightEntries, checkFirstTimeBadges } from '../hooks/useSupabaseData';
import { useTrackWeightLog } from '../hooks/useActivityTracking';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';

export default function WeightLog() {
  const { user } = useAuth();
  const { data: weightEntries = [], refetch } = useWeightEntries();
  const { trackWeightLog } = useTrackWeightLog();
  const [showAddModal, setShowAddModal] = useState(false);
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

  const goalWeight = 65;
  const toGoal = latestWeight ? (latestWeight.weight - goalWeight).toFixed(1) : null;

  const handleAddEntry = async () => {
    if (!user || !newEntry.weight) return;

    try {
      const isFirstEntry = weightEntries.length === 0;
      const weightValue = parseFloat(newEntry.weight);

      const { data: newWeightEntry, error } = await supabase.from('weight_entries').insert({
        user_id: user.id,
        date: newEntry.date,
        weight: weightValue,
        unit: 'kg',
        notes: newEntry.notes || null,
      }).select().single();

      if (error) throw error;

      // Track weight log activity (fire and forget - don't block on tracking)
      if (newWeightEntry) {
        trackWeightLog(newWeightEntry.id, weightValue, 'kg').catch(err => {
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
            {latestWeight?.weight || '--'} kg
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
            {weeklyChange ? `${Number(weeklyChange) > 0 ? '+' : ''}${weeklyChange}` : '--'} kg
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
            {totalChange ? `${Number(totalChange) > 0 ? '+' : ''}${totalChange}` : '--'} kg
          </p>
          <p className="text-sm text-gray-500">Total Change</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {toGoal || '--'} kg
          </p>
          <p className="text-sm text-gray-500">To Goal ({goalWeight}kg)</p>
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
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [`${value} kg`, 'Weight']}
              />
              <ReferenceLine
                y={goalWeight}
                stroke="#9333ea"
                strokeDasharray="5 5"
                label={{ value: `Goal: ${goalWeight}kg`, position: 'right', fontSize: 12 }}
              />
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
                  <p className="text-xl font-bold text-gray-900">{entry.weight} kg</p>
                  {change !== null && (
                    <p className={`text-sm ${
                      change < 0 ? 'text-green-600' : change > 0 ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)} kg
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-elevated">
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
                  Weight (kg)
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
    </div>
  );
}
