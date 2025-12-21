import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Moon,
  Footprints,
  Brain,
  Zap,
  Watch,
  Link2,
  X,
  Edit3,
  ChevronRight,
  Flame,
  Target,
  Plus,
  PersonStanding,
  Dumbbell,
  Smile,
  Frown,
  Meh,
  Sun,
  CloudRain,
  Sparkles,
  BookOpen,
  Coffee,
  Battery,
  Lightbulb
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import ComingSoonModal from '../components/ComingSoonModal';
import MindfulnessExercise from '../components/MindfulnessExercise';

type MetricKey = 'heartRate' | 'bloodPressure' | 'bodyTemperature' | 'oxygenSaturation' |
  'respiratoryRate' | 'bmi' | 'bodyFat' | 'height' | 'weight' | 'sleepHours' |
  'steps' | 'activeMinutes' | 'caloriesBurned' | 'stressLevel' | 'energyLevel' | 'hydration';

interface MetricConfig {
  key: MetricKey;
  label: string;
  icon: React.ElementType;
  color: string;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
}

type TabType = 'workout' | 'mind' | 'overview';

const metricConfigs: MetricConfig[] = [
  { key: 'heartRate', label: 'Heart Rate', icon: Heart, color: '#ef4444', position: { top: '25%', left: '15%' } },
  { key: 'bloodPressure', label: 'Blood Pressure', icon: Activity, color: '#8b5cf6', position: { top: '35%', right: '10%' } },
  { key: 'bodyTemperature', label: 'Temperature', icon: Thermometer, color: '#f59e0b', position: { top: '55%', left: '10%' } },
  { key: 'oxygenSaturation', label: 'O2 Saturation', icon: Wind, color: '#06b6d4', position: { top: '15%', right: '15%' } },
  { key: 'sleepHours', label: 'Sleep', icon: Moon, color: '#6366f1', position: { bottom: '25%', left: '15%' } },
  { key: 'steps', label: 'Steps', icon: Footprints, color: '#22c55e', position: { bottom: '15%', right: '15%' } },
];

export default function HealthDashboard() {
  const navigate = useNavigate();
  const { healthMetrics, updateHealthMetric, connectedDevices } = useStore();
  const { colorPreset, colorPresets, primaryColor } = useTheme();
  const [editingMetric, setEditingMetric] = useState<MetricKey | null>(null);
  const [showDevicesPanel, setShowDevicesPanel] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabType>('mind');
  const [activeMindfulness, setActiveMindfulness] = useState<'breathing' | 'bodyscan' | 'gratitude' | 'meditation' | null>(null);
  const [selfCareChecklist, setSelfCareChecklist] = useState<Record<string, boolean>>({
    'sleep': false,
    'water': false,
    'moved': false,
    'breaks': false,
    'connected': false,
    'enjoy': false,
  });

  const hasConnectedDevice = connectedDevices.some(d => d.connected);

  // Calculate self-care progress
  const selfCareProgress = Object.values(selfCareChecklist).filter(Boolean).length;
  const selfCareTotal = Object.keys(selfCareChecklist).length;
  const selfCarePercentage = (selfCareProgress / selfCareTotal) * 100;

  // Toggle self-care checklist item
  const toggleSelfCareItem = (key: string) => {
    setSelfCareChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveMetric = (key: MetricKey) => {
    const now = new Date().toISOString();

    switch (key) {
      case 'heartRate': {
        const m = healthMetrics.heartRate;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseInt(editValues.value) || m.value, lastUpdated: now });
        break;
      }
      case 'bloodPressure': {
        const m = healthMetrics.bloodPressure;
        if (!m) return;
        updateHealthMetric(key, {
          ...m,
          systolic: parseInt(editValues.systolic) || m.systolic,
          diastolic: parseInt(editValues.diastolic) || m.diastolic,
          lastUpdated: now
        });
        break;
      }
      case 'bodyTemperature': {
        const m = healthMetrics.bodyTemperature;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseFloat(editValues.value) || m.value, lastUpdated: now });
        break;
      }
      case 'oxygenSaturation': {
        const m = healthMetrics.oxygenSaturation;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseInt(editValues.value) || m.value, lastUpdated: now });
        break;
      }
      case 'weight': {
        const m = healthMetrics.weight;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseFloat(editValues.value) || m.value, lastUpdated: now });
        const height = healthMetrics.height;
        if (height) {
          const weightKg = parseFloat(editValues.value) || m.value;
          const heightM = height.unit === 'cm' ? height.value / 100 : height.value * 0.3048;
          const bmiValue = weightKg / (heightM * heightM);
          const category = bmiValue < 18.5 ? 'Underweight' : bmiValue < 25 ? 'Normal' : bmiValue < 30 ? 'Overweight' : 'Obese';
          updateHealthMetric('bmi', { value: bmiValue, category, lastUpdated: now });
        }
        break;
      }
      case 'height': {
        const m = healthMetrics.height;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseFloat(editValues.value) || m.value, lastUpdated: now });
        break;
      }
      case 'bodyFat': {
        const m = healthMetrics.bodyFat;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseFloat(editValues.value) || m.value, lastUpdated: now });
        break;
      }
      case 'sleepHours': {
        const m = healthMetrics.sleepHours;
        if (!m) return;
        const quality = parseFloat(editValues.value) >= 8 ? 'excellent' : parseFloat(editValues.value) >= 7 ? 'good' : parseFloat(editValues.value) >= 5 ? 'fair' : 'poor';
        updateHealthMetric(key, { ...m, value: parseFloat(editValues.value) || m.value, quality, lastUpdated: now });
        break;
      }
      case 'steps': {
        const m = healthMetrics.steps;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseInt(editValues.value) || m.value, lastUpdated: now });
        break;
      }
      case 'activeMinutes': {
        const m = healthMetrics.activeMinutes;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseInt(editValues.value) || m.value, lastUpdated: now });
        break;
      }
      case 'caloriesBurned': {
        const m = healthMetrics.caloriesBurned;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseInt(editValues.value) || m.value, lastUpdated: now });
        break;
      }
      case 'hydration': {
        const m = healthMetrics.hydration;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: parseInt(editValues.value) || m.value, lastUpdated: now });
        break;
      }
      case 'stressLevel': {
        const m = healthMetrics.stressLevel;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: Math.min(10, Math.max(1, parseInt(editValues.value) || m.value)), lastUpdated: now });
        break;
      }
      case 'energyLevel': {
        const m = healthMetrics.energyLevel;
        if (!m) return;
        updateHealthMetric(key, { ...m, value: Math.min(10, Math.max(1, parseInt(editValues.value) || m.value)), lastUpdated: now });
        break;
      }
    }

    setEditingMetric(null);
    setEditValues({});
  };

  const openEditModal = (key: MetricKey) => {
    switch (key) {
      case 'bloodPressure': {
        const m = healthMetrics.bloodPressure;
        if (!m) return;
        setEditValues({ systolic: m.systolic.toString(), diastolic: m.diastolic.toString() });
        break;
      }
      case 'heartRate': {
        const m = healthMetrics.heartRate;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'bodyTemperature': {
        const m = healthMetrics.bodyTemperature;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'oxygenSaturation': {
        const m = healthMetrics.oxygenSaturation;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'weight': {
        const m = healthMetrics.weight;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'height': {
        const m = healthMetrics.height;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'bodyFat': {
        const m = healthMetrics.bodyFat;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'sleepHours': {
        const m = healthMetrics.sleepHours;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'steps': {
        const m = healthMetrics.steps;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'activeMinutes': {
        const m = healthMetrics.activeMinutes;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'caloriesBurned': {
        const m = healthMetrics.caloriesBurned;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'hydration': {
        const m = healthMetrics.hydration;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'stressLevel': {
        const m = healthMetrics.stressLevel;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
      case 'energyLevel': {
        const m = healthMetrics.energyLevel;
        if (!m) return;
        setEditValues({ value: m.value.toString() });
        break;
      }
    }
    setEditingMetric(key);
  };

  // Tab Navigation - Workout and Mental Health focused
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'mind', label: 'Mind', icon: Brain },
    { id: 'overview', label: 'Metrics', icon: Activity },
  ];

  return (
    <div className="pb-20 lg:pb-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">Health Profile</h1>
          <p className="text-gray-500">Your personalized health journey</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDevicesPanel(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: colorPresets[colorPreset]?.light, color: primaryColor }}
          >
            <Link2 className="w-5 h-5" />
            <span className="hidden sm:inline">Devices</span>
            {hasConnectedDevice && (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === tab.id ? { color: primaryColor } : {}}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Coming Soon Hero */}
          <div className="card p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Watch className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
                Device Integration Coming Soon!
              </h2>
              <p className="text-gray-600 mb-6">
                We're working on connecting your favorite health devices like Fitbit, Apple Watch, Garmin, and more. 
                Once connected, you'll see real-time metrics here automatically.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {['Fitbit', 'Apple Watch', 'Garmin', 'Oura Ring', 'Whoop'].map((device) => (
                  <span key={device} className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm">
                    {device}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setShowDevicesPanel(true)}
                className="px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                Get Notified When Available
              </button>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: Heart, 
                title: 'Real-Time Heart Rate', 
                desc: 'Continuous heart rate monitoring from your wearable device',
                color: '#ef4444'
              },
              { 
                icon: Footprints, 
                title: 'Auto Step Tracking', 
                desc: 'Steps, distance, and calories synced automatically',
                color: '#22c55e'
              },
              { 
                icon: Moon, 
                title: 'Sleep Analysis', 
                desc: 'Detailed sleep stages and quality scores each night',
                color: '#6366f1'
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 text-center">
                <div 
                  className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Manual Entry Option */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Edit3 className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Manual Entry Available Now</h3>
                <p className="text-gray-500 text-sm mb-4">
                  While we build device integrations, you can still track your health metrics manually. 
                  Click any metric below to log your data.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'steps' as MetricKey, icon: Footprints, label: 'Steps', color: '#22c55e' },
                    { key: 'sleepHours' as MetricKey, icon: Moon, label: 'Sleep', color: '#6366f1' },
                    { key: 'hydration' as MetricKey, icon: Droplets, label: 'Water', color: '#06b6d4' },
                    { key: 'heartRate' as MetricKey, icon: Heart, label: 'Heart Rate', color: '#ef4444' },
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => openEditModal(item.key)}
                      className="p-4 rounded-xl hover:shadow-md transition-all text-center border border-gray-100"
                      style={{ backgroundColor: `${item.color}08` }}
                    >
                      <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: item.color }} />
                      <div className="text-sm font-medium text-gray-700">{item.label}</div>
                      <Plus className="w-4 h-4 mx-auto mt-2 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mind' && (
        <div className="space-y-6">
          {/* Mood Check-in */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How are you feeling today?</h3>
            <p className="text-gray-500 text-sm mb-6">Track your mood to understand patterns and improve your mental wellness.</p>
            
            <div className="grid grid-cols-5 gap-3 mb-6">
              {[
                { mood: 'great', icon: Sun, label: 'Great', color: '#22c55e', bg: '#dcfce7' },
                { mood: 'good', icon: Smile, label: 'Good', color: '#84cc16', bg: '#ecfccb' },
                { mood: 'okay', icon: Meh, label: 'Okay', color: '#f59e0b', bg: '#fef3c7' },
                { mood: 'low', icon: CloudRain, label: 'Low', color: '#6366f1', bg: '#e0e7ff' },
                { mood: 'stressed', icon: Frown, label: 'Stressed', color: '#ef4444', bg: '#fee2e2' },
              ].map((item) => (
                <button
                  key={item.mood}
                  className="p-4 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all text-center"
                  style={{ backgroundColor: item.bg }}
                >
                  <item.icon className="w-8 h-8 mx-auto mb-2" style={{ color: item.color }} />
                  <div className="text-sm font-medium" style={{ color: item.color }}>{item.label}</div>
                </button>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <p className="text-sm text-purple-700">
                <Lightbulb className="w-4 h-4 inline mr-1" />
                <span className="font-medium">Tip:</span> Logging your mood daily helps identify patterns and triggers. Even a quick check-in makes a difference!
              </p>
            </div>
          </div>

          {/* Mindfulness & Self-Care */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Mindfulness */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Quick Mindfulness
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'breathing' as const, name: 'Deep Breathing', duration: '2 min', desc: 'Calm your mind', color: '#8b5cf6' },
                  { id: 'bodyscan' as const, name: 'Body Scan', duration: '3 min', desc: 'Release tension', color: '#06b6d4' },
                  { id: 'gratitude' as const, name: 'Gratitude', duration: '3 min', desc: 'Positive reflection', color: '#f59e0b' },
                  { id: 'meditation' as const, name: 'Meditation', duration: '5 min', desc: 'Guided session', color: '#22c55e' },
                ].map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => setActiveMindfulness(exercise.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all text-left border border-gray-100 group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${exercise.color}15` }}
                    >
                      <Brain className="w-6 h-6" style={{ color: exercise.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{exercise.name}</div>
                      <div className="text-sm text-gray-500">{exercise.desc}</div>
                    </div>
                    <div className="text-sm font-medium" style={{ color: exercise.color }}>
                      {exercise.duration}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Self-Care Checklist */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Daily Self-Care
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Slept 7+ hours', icon: Moon, color: '#6366f1', key: 'sleep' },
                  { name: 'Drank enough water', icon: Droplets, color: '#06b6d4', key: 'water' },
                  { name: 'Moved my body', icon: Footprints, color: '#22c55e', key: 'moved' },
                  { name: 'Took breaks', icon: Coffee, color: '#f59e0b', key: 'breaks' },
                  { name: 'Connected with someone', icon: Heart, color: '#ec4899', key: 'connected' },
                  { name: 'Did something I enjoy', icon: Smile, color: '#8b5cf6', key: 'enjoy' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selfCareChecklist[item.key]}
                      onChange={() => toggleSelfCareItem(item.key)}
                      className="w-5 h-5 rounded-lg border-2 border-gray-300 text-green-500 focus:ring-green-500"
                    />
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    <span className="text-gray-700">{item.name}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Today's progress</span>
                  <span className="font-medium text-gray-900">{selfCareProgress} / {selfCareTotal} completed</span>
                </div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${selfCarePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Energy & Stress Levels */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Battery className="w-5 h-5 text-amber-500" />
              Energy & Stress Tracker
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Low</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    defaultValue="5"
                    className="flex-1 h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-400">High</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Calm</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    defaultValue="5"
                    className="flex-1 h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-400">High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Journal Prompt */}
          <div className="card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Today's Journal Prompt</h3>
                <p className="text-indigo-700 italic mb-4">
                  "What's one small thing you can do today to take care of yourself?"
                </p>
                <button
                  onClick={() => navigate('/journal')}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
                >
                  Write in Journal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workout' && (
        <div className="space-y-6">
          {/* Coming Soon Hero */}
          <div className="card p-8 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border border-orange-100">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
                Workout Tracking Coming Soon!
              </h2>
              <p className="text-gray-600 mb-6">
                We're working on an amazing workout tracking feature that will help you track your fitness journey. 
                Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metric Modal */}
      {editingMetric && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Update {metricConfigs.find(m => m.key === editingMetric)?.label || editingMetric.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <button
                onClick={() => { setEditingMetric(null); setEditValues({}); }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {editingMetric === 'bloodPressure' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Systolic</label>
                    <input
                      type="number"
                      value={editValues.systolic || ''}
                      onChange={(e) => setEditValues({ ...editValues, systolic: e.target.value })}
                      className="input"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diastolic</label>
                    <input
                      type="number"
                      value={editValues.diastolic || ''}
                      onChange={(e) => setEditValues({ ...editValues, diastolic: e.target.value })}
                      className="input"
                      placeholder="80"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                  <input
                    type="number"
                    step={editingMetric === 'bodyTemperature' || editingMetric === 'sleepHours' ? '0.1' : '1'}
                    value={editValues.value || ''}
                    onChange={(e) => setEditValues({ ...editValues, value: e.target.value })}
                    className="input"
                    placeholder="Enter value"
                  />
                  {healthMetrics[editingMetric] && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {format(new Date(healthMetrics[editingMetric]!.lastUpdated), 'MMM d, yyyy h:mm a')}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setEditingMetric(null); setEditValues({}); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveMetric(editingMetric)}
                  className="flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Devices Panel - Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showDevicesPanel}
        onClose={() => setShowDevicesPanel(false)}
        feature="Device Connections"
        description="We're working hard to bring you seamless device integrations! Soon you'll be able to connect your Fitbit, Apple Watch, and other fitness devices to automatically sync your health data."
      />

      {/* Mindfulness Exercise Modal */}
      {activeMindfulness && (
        <MindfulnessExercise
          type={activeMindfulness}
          onClose={() => setActiveMindfulness(null)}
          onComplete={() => setActiveMindfulness(null)}
        />
      )}
    </div>
  );
}
