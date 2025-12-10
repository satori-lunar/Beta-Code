import { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Moon,
  Footprints,
  Scale,
  Ruler,
  Brain,
  Zap,
  Watch,
  Smartphone,
  Link2,
  X,
  Edit3,
  ChevronRight,
  TrendingDown,
  Play,
  Pause,
  Camera,
  Timer,
  Flame,
  Target,
  Plus,
  Settings,
  BarChart3,
  ChevronLeft,
  Dumbbell,
  PersonStanding,
  Hand,
  CircleDot
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';
import { format, formatDistanceToNow, startOfWeek, addDays } from 'date-fns';
import ComingSoonModal from '../components/ComingSoonModal';

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

type TabType = 'overview' | 'activity' | 'workout' | 'body';

const metricConfigs: MetricConfig[] = [
  { key: 'heartRate', label: 'Heart Rate', icon: Heart, color: '#ef4444', position: { top: '25%', left: '15%' } },
  { key: 'bloodPressure', label: 'Blood Pressure', icon: Activity, color: '#8b5cf6', position: { top: '35%', right: '10%' } },
  { key: 'bodyTemperature', label: 'Temperature', icon: Thermometer, color: '#f59e0b', position: { top: '55%', left: '10%' } },
  { key: 'oxygenSaturation', label: 'O2 Saturation', icon: Wind, color: '#06b6d4', position: { top: '15%', right: '15%' } },
  { key: 'sleepHours', label: 'Sleep', icon: Moon, color: '#6366f1', position: { bottom: '25%', left: '15%' } },
  { key: 'steps', label: 'Steps', icon: Footprints, color: '#22c55e', position: { bottom: '15%', right: '15%' } },
];

const deviceIcons: Record<string, React.ElementType> = {
  watch: Watch,
  smartphone: Smartphone,
};

// Weekly activity mock data
const generateWeeklyData = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const isPast = date <= today;
    return {
      day: format(date, 'EEE'),
      date: format(date, 'd'),
      steps: isPast ? Math.floor(Math.random() * 8000) + 4000 : 0,
      calories: isPast ? Math.floor(Math.random() * 300) + 200 : 0,
      active: isPast ? Math.floor(Math.random() * 45) + 15 : 0,
      isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
    };
  });
};

// Workout types
const workoutTypes = [
  { id: 'running', name: 'Running', icon: PersonStanding, color: '#22c55e' },
  { id: 'strength', name: 'Strength', icon: Dumbbell, color: '#8b5cf6' },
  { id: 'yoga', name: 'Yoga', icon: Hand, color: '#ec4899' },
  { id: 'hiit', name: 'HIIT', icon: Flame, color: '#f59e0b' },
  { id: 'custom', name: 'Custom', icon: Target, color: '#06b6d4' },
];

export default function HealthDashboard() {
  const { healthMetrics, updateHealthMetric, connectedDevices, toggleDeviceConnection } = useStore();
  const { colorPreset, colorPresets, primaryColor } = useTheme();
  const [editingMetric, setEditingMetric] = useState<MetricKey | null>(null);
  const [showDevicesPanel, setShowDevicesPanel] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [weeklyData] = useState(generateWeeklyData);
  const [heartBeat, setHeartBeat] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [showWorkoutCamera, setShowWorkoutCamera] = useState(false);
  const [motionPoints, setMotionPoints] = useState<{ x: number; y: number; id: number }[]>([]);

  const hasConnectedDevice = connectedDevices.some(d => d.connected);

  // Heart beat animation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartBeat(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Workout timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isWorkoutActive]);

  // Motion detection simulation
  useEffect(() => {
    if (showWorkoutCamera && isWorkoutActive) {
      const interval = setInterval(() => {
        setMotionPoints([
          { x: 30 + Math.random() * 10, y: 20 + Math.random() * 5, id: 1 },
          { x: 50 + Math.random() * 5, y: 35 + Math.random() * 5, id: 2 },
          { x: 70 + Math.random() * 10, y: 20 + Math.random() * 5, id: 3 },
          { x: 30 + Math.random() * 5, y: 70 + Math.random() * 10, id: 4 },
          { x: 70 + Math.random() * 5, y: 70 + Math.random() * 10, id: 5 },
          { x: 50 + Math.random() * 3, y: 50 + Math.random() * 5, id: 6 },
        ]);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showWorkoutCamera, isWorkoutActive]);

  const formatWorkoutTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMetricDisplay = (key: MetricKey) => {
    switch (key) {
      case 'heartRate': {
        const m = healthMetrics.heartRate;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toString(), unit: 'bpm', secondary: '' };
      }
      case 'bloodPressure': {
        const m = healthMetrics.bloodPressure;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: `${m.systolic}/${m.diastolic}`, unit: 'mmHg', secondary: '' };
      }
      case 'bodyTemperature': {
        const m = healthMetrics.bodyTemperature;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toFixed(1), unit: m.unit, secondary: '' };
      }
      case 'oxygenSaturation': {
        const m = healthMetrics.oxygenSaturation;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toString(), unit: '%', secondary: '' };
      }
      case 'respiratoryRate': {
        const m = healthMetrics.respiratoryRate;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toString(), unit: '/min', secondary: '' };
      }
      case 'bmi': {
        const m = healthMetrics.bmi;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toFixed(1), unit: '', secondary: m.category };
      }
      case 'bodyFat': {
        const m = healthMetrics.bodyFat;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toString(), unit: '%', secondary: '' };
      }
      case 'height': {
        const m = healthMetrics.height;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toString(), unit: m.unit, secondary: '' };
      }
      case 'weight': {
        const m = healthMetrics.weight;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toString(), unit: m.unit, secondary: '' };
      }
      case 'sleepHours': {
        const m = healthMetrics.sleepHours;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toFixed(1), unit: 'hrs', secondary: m.quality };
      }
      case 'steps': {
        const m = healthMetrics.steps;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toLocaleString(), unit: '', secondary: `/ ${m.goal.toLocaleString()}` };
      }
      case 'activeMinutes': {
        const m = healthMetrics.activeMinutes;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toString(), unit: 'min', secondary: `/ ${m.goal}` };
      }
      case 'caloriesBurned': {
        const m = healthMetrics.caloriesBurned;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toLocaleString(), unit: 'cal', secondary: `/ ${m.goal.toLocaleString()}` };
      }
      case 'stressLevel': {
        const m = healthMetrics.stressLevel;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toString(), unit: '/10', secondary: m.value <= 3 ? 'Low' : m.value <= 6 ? 'Moderate' : 'High' };
      }
      case 'energyLevel': {
        const m = healthMetrics.energyLevel;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: m.value.toString(), unit: '/10', secondary: m.value >= 7 ? 'High' : m.value >= 4 ? 'Moderate' : 'Low' };
      }
      case 'hydration': {
        const m = healthMetrics.hydration;
        if (!m) return { value: '--', unit: '', secondary: '' };
        return { value: (m.value / 1000).toFixed(1), unit: 'L', secondary: `/ ${(m.goal / 1000).toFixed(1)}L` };
      }
      default:
        return { value: '--', unit: '', secondary: '' };
    }
  };

  const getProgressPercent = (key: MetricKey) => {
    switch (key) {
      case 'steps': {
        const m = healthMetrics.steps;
        if (!m) return null;
        return Math.min(100, Math.round((m.value / m.goal) * 100));
      }
      case 'activeMinutes': {
        const m = healthMetrics.activeMinutes;
        if (!m) return null;
        return Math.min(100, Math.round((m.value / m.goal) * 100));
      }
      case 'caloriesBurned': {
        const m = healthMetrics.caloriesBurned;
        if (!m) return null;
        return Math.min(100, Math.round((m.value / m.goal) * 100));
      }
      case 'hydration': {
        const m = healthMetrics.hydration;
        if (!m) return null;
        return Math.min(100, Math.round((m.value / m.goal) * 100));
      }
      default:
        return null;
    }
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

  // Animated Heart with ECG
  const AnimatedHeart = () => (
    <div className="relative">
      {/* Heart SVG with pulse animation */}
      <div className={`transition-transform duration-200 ${heartBeat ? 'scale-110' : 'scale-100'}`}>
        <svg viewBox="0 0 120 120" className="w-28 h-28 mx-auto">
          {/* Heart glow effect */}
          <defs>
            <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
          {/* 3D-like Heart */}
          <path
            d="M60 100 C25 70 10 45 10 30 C10 12 25 5 40 5 C50 5 58 12 60 20 C62 12 70 5 80 5 C95 5 110 12 110 30 C110 45 95 70 60 100"
            fill="url(#heartGradient)"
            filter="url(#heartGlow)"
            className="drop-shadow-lg"
          />
          {/* Heart highlight */}
          <ellipse cx="35" cy="28" rx="12" ry="8" fill="rgba(255,255,255,0.3)" />
        </svg>
      </div>
      {/* BPM Display */}
      <div className="text-center mt-2">
        <span className="text-4xl font-bold text-gray-900">{healthMetrics.heartRate?.value || '--'}</span>
        <span className="text-lg text-gray-500 ml-1">bpm</span>
      </div>
    </div>
  );

  // ECG Waveform
  const ECGWaveform = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setOffset(prev => (prev + 2) % 100);
      }, 50);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="relative h-20 overflow-hidden rounded-xl bg-gray-900">
        <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
          {/* Grid lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="80" stroke="#1f2937" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 20 + 10} x2="400" y2={i * 20 + 10} stroke="#1f2937" strokeWidth="0.5" />
          ))}

          {/* ECG line with animation */}
          <path
            d={`M${-offset},40 ${Array.from({ length: 6 }).map((_, i) => {
              const x = i * 80 - offset;
              return `L${x + 10},40 L${x + 15},40 L${x + 20},20 L${x + 25},60 L${x + 30},10 L${x + 35},70 L${x + 40},40 L${x + 70},40`;
            }).join(' ')}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
          />
        </svg>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900 pointer-events-none" />
      </div>
    );
  };

  // Activity Bar Chart
  const ActivityChart = () => {
    const maxSteps = Math.max(...weeklyData.map(d => d.steps), 10000);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <span className="text-sm text-gray-500">This Week</span>
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 h-40">
          {weeklyData.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-28 gap-1">
                {/* Steps bar */}
                <div
                  className="w-full max-w-8 rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(day.steps / maxSteps) * 100}%`,
                    backgroundColor: day.isToday ? primaryColor : `${primaryColor}60`,
                    minHeight: day.steps > 0 ? '8px' : '0'
                  }}
                />
              </div>
              <div className={`text-xs font-medium ${day.isToday ? 'text-gray-900' : 'text-gray-400'}`}>
                {day.day}
              </div>
              <div className={`text-xs ${day.isToday ? '' : 'text-gray-400'}`} style={day.isToday ? { color: primaryColor } : {}}>
                {day.date}
              </div>
            </div>
          ))}
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {weeklyData.reduce((sum, d) => sum + d.steps, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {weeklyData.reduce((sum, d) => sum + d.calories, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Calories Burned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {weeklyData.reduce((sum, d) => sum + d.active, 0)}
            </div>
            <div className="text-xs text-gray-500">Active Minutes</div>
          </div>
        </div>
      </div>
    );
  };

  // Triple Activity Ring (Apple-style)
  const TripleRing = () => {
    const rings = [
      { progress: getProgressPercent('caloriesBurned') || 0, color: '#ef4444', label: 'Move', value: getMetricDisplay('caloriesBurned').value },
      { progress: getProgressPercent('activeMinutes') || 0, color: '#22c55e', label: 'Exercise', value: getMetricDisplay('activeMinutes').value },
      { progress: getProgressPercent('steps') || 0, color: '#06b6d4', label: 'Stand', value: getMetricDisplay('steps').value },
    ];

    return (
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          {rings.map((ring, i) => {
            const size = 128 - i * 24;
            const strokeWidth = 12;
            const radius = (size - strokeWidth) / 2;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (ring.progress / 100) * circumference;
            const centerOffset = (128 - size) / 2;

            return (
              <svg
                key={i}
                className="absolute -rotate-90"
                style={{ top: centerOffset, left: centerOffset }}
                width={size}
                height={size}
              >
                {/* Background */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={`${ring.color}20`}
                  strokeWidth={strokeWidth}
                />
                {/* Progress */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
            );
          })}
        </div>
        <div className="space-y-3">
          {rings.map((ring, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ring.color }} />
              <span className="text-sm text-gray-600">{ring.label}</span>
              <span className="text-sm font-semibold text-gray-900">{ring.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Workout Camera View with Motion Tracking
  const WorkoutCameraView = () => (
    <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden">
      {/* Simulated camera view */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-32 h-48 rounded-xl opacity-30"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      {/* Motion tracking points */}
      {motionPoints.map(point => (
        <div
          key={point.id}
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        >
          <div
            className="w-full h-full rounded-full animate-pulse"
            style={{ backgroundColor: primaryColor, boxShadow: `0 0 12px ${primaryColor}` }}
          />
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-50"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
      ))}

      {/* Skeleton overlay */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {motionPoints.length >= 6 && (
          <>
            {/* Head to center */}
            <line x1={motionPoints[1].x} y1={motionPoints[1].y} x2={motionPoints[5].x} y2={motionPoints[5].y}
                  stroke={primaryColor} strokeWidth="0.5" opacity="0.6" />
            {/* Left arm */}
            <line x1={motionPoints[0].x} y1={motionPoints[0].y} x2={motionPoints[5].x} y2={motionPoints[5].y}
                  stroke={primaryColor} strokeWidth="0.5" opacity="0.6" />
            {/* Right arm */}
            <line x1={motionPoints[2].x} y1={motionPoints[2].y} x2={motionPoints[5].x} y2={motionPoints[5].y}
                  stroke={primaryColor} strokeWidth="0.5" opacity="0.6" />
            {/* Left leg */}
            <line x1={motionPoints[3].x} y1={motionPoints[3].y} x2={motionPoints[5].x} y2={motionPoints[5].y}
                  stroke={primaryColor} strokeWidth="0.5" opacity="0.6" />
            {/* Right leg */}
            <line x1={motionPoints[4].x} y1={motionPoints[4].y} x2={motionPoints[5].x} y2={motionPoints[5].y}
                  stroke={primaryColor} strokeWidth="0.5" opacity="0.6" />
          </>
        )}
      </svg>

      {/* Timer overlay */}
      <div className="absolute top-4 left-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-xl">
        <div className="text-2xl font-mono font-bold text-white">{formatWorkoutTime(workoutTime)}</div>
      </div>

      {/* Rep counter */}
      <div className="absolute top-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-xl text-center">
        <div className="text-xl font-bold text-white">{Math.floor(workoutTime / 3)}</div>
        <div className="text-xs text-gray-300">Reps</div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setIsWorkoutActive(!isWorkoutActive)}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: isWorkoutActive ? '#ef4444' : primaryColor }}
        >
          {isWorkoutActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          setShowWorkoutCamera(false);
          setIsWorkoutActive(false);
          setWorkoutTime(0);
        }}
        className="absolute top-4 right-4 hidden sm:flex w-10 h-10 rounded-full bg-black/50 items-center justify-center text-white hover:bg-black/70"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  // 2D Body Silhouette SVG
  const BodySilhouette = () => (
    <svg viewBox="0 0 200 400" className="w-full h-full max-h-[400px]" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
      {/* Head */}
      <ellipse cx="100" cy="40" rx="30" ry="35" fill={`${primaryColor}30`} stroke={primaryColor} strokeWidth="2" />
      {/* Neck */}
      <rect x="90" y="70" width="20" height="20" fill={`${primaryColor}30`} stroke={primaryColor} strokeWidth="2" />
      {/* Torso */}
      <path
        d="M60 90 L60 200 Q60 220 80 230 L80 280 L120 280 L120 230 Q140 220 140 200 L140 90 Q120 80 100 80 Q80 80 60 90"
        fill={`${primaryColor}20`}
        stroke={primaryColor}
        strokeWidth="2"
      />
      {/* Left Arm */}
      <path
        d="M60 95 Q30 100 25 150 Q20 180 30 200 L35 200 Q40 180 40 160 Q45 130 60 120"
        fill={`${primaryColor}20`}
        stroke={primaryColor}
        strokeWidth="2"
      />
      {/* Right Arm */}
      <path
        d="M140 95 Q170 100 175 150 Q180 180 170 200 L165 200 Q160 180 160 160 Q155 130 140 120"
        fill={`${primaryColor}20`}
        stroke={primaryColor}
        strokeWidth="2"
      />
      {/* Left Leg */}
      <path
        d="M80 280 L75 380 L85 385 L95 280"
        fill={`${primaryColor}20`}
        stroke={primaryColor}
        strokeWidth="2"
      />
      {/* Right Leg */}
      <path
        d="M105 280 L115 385 L125 380 L120 280"
        fill={`${primaryColor}20`}
        stroke={primaryColor}
        strokeWidth="2"
      />
    </svg>
  );

  // Tab Navigation
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'activity', label: 'Activity', icon: BarChart3 },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'body', label: 'Body', icon: PersonStanding },
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
        <div className="grid grid-cols-12 gap-6">
          {/* Heart Rate Card */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-4">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Heart Rate</h3>
                <button
                  onClick={() => openEditModal('heartRate')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <AnimatedHeart />
              <div className="mt-6">
                <ECGWaveform />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>Resting: 62 bpm</span>
                <span>Max: 180 bpm</span>
              </div>
            </div>
          </div>

          {/* Activity Rings */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-4">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Daily Goals</h3>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <TripleRing />
              <div className="mt-6 grid grid-cols-3 gap-2">
                <button
                  onClick={() => openEditModal('caloriesBurned')}
                  className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors text-center"
                >
                  <Flame className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-gray-900">{getMetricDisplay('caloriesBurned').value}</div>
                  <div className="text-xs text-gray-500">cal</div>
                </button>
                <button
                  onClick={() => openEditModal('activeMinutes')}
                  className="p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-center"
                >
                  <Timer className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-gray-900">{getMetricDisplay('activeMinutes').value}</div>
                  <div className="text-xs text-gray-500">min</div>
                </button>
                <button
                  onClick={() => openEditModal('steps')}
                  className="p-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 transition-colors text-center"
                >
                  <Footprints className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-gray-900">{getMetricDisplay('steps').value}</div>
                  <div className="text-xs text-gray-500">steps</div>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="col-span-12 xl:col-span-4">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vitals</h3>
              <div className="space-y-3">
                {[
                  { key: 'bloodPressure' as MetricKey, icon: Activity, color: '#8b5cf6', label: 'Blood Pressure' },
                  { key: 'oxygenSaturation' as MetricKey, icon: Wind, color: '#06b6d4', label: 'O2 Saturation' },
                  { key: 'bodyTemperature' as MetricKey, icon: Thermometer, color: '#f59e0b', label: 'Temperature' },
                  { key: 'sleepHours' as MetricKey, icon: Moon, color: '#6366f1', label: 'Sleep' },
                ].map(item => {
                  const display = getMetricDisplay(item.key);
                  return (
                    <button
                      key={item.key}
                      onClick={() => openEditModal(item.key)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm text-gray-500">{item.label}</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-semibold text-gray-900">{display.value}</span>
                          <span className="text-sm text-gray-500">{display.unit}</span>
                        </div>
                      </div>
                      <Edit3 className="w-4 h-4 text-gray-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Wellness */}
          <div className="col-span-12 lg:col-span-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wellness</h3>
              <div className="space-y-4">
                <button onClick={() => openEditModal('stressLevel')} className="w-full text-left">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">Stress Level</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: primaryColor }}>
                      {getMetricDisplay('stressLevel').secondary}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(healthMetrics.stressLevel?.value ?? 0) * 10}%`,
                        backgroundColor: (healthMetrics.stressLevel?.value ?? 0) <= 3 ? '#22c55e' : (healthMetrics.stressLevel?.value ?? 0) <= 6 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </button>

                <button onClick={() => openEditModal('energyLevel')} className="w-full text-left">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-700">Energy Level</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: primaryColor }}>
                      {getMetricDisplay('energyLevel').secondary}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(healthMetrics.energyLevel?.value || 0) * 10}%`,
                        backgroundColor: primaryColor
                      }}
                    />
                  </div>
                </button>

                <button onClick={() => openEditModal('hydration')} className="w-full text-left">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">Hydration</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {getMetricDisplay('hydration').value}L {getMetricDisplay('hydration').secondary}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all bg-blue-500"
                      style={{ width: `${getProgressPercent('hydration') || 0}%` }}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Connected Devices */}
          <div className="col-span-12 lg:col-span-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Devices</h3>
                <button
                  onClick={() => setShowDevicesPanel(true)}
                  className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
                  style={{ color: primaryColor }}
                >
                  Manage <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="text-center py-6 px-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                    <Watch className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Device Integration Coming Soon!</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    We're building connections for Fitbit, Apple Watch, and more. For now, you can manually log your health metrics.
                  </p>
                  <button
                    onClick={() => setShowDevicesPanel(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Learn More
                  </button>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 text-center">
                    💡 Tip: Click on any health metric to manually update your data!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Weekly Chart */}
          <div className="col-span-12 lg:col-span-8">
            <div className="card p-6">
              <ActivityChart />
            </div>
          </div>

          {/* Activity Summary */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
              <TripleRing />
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Log</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'steps' as MetricKey, icon: Footprints, label: 'Steps', color: '#22c55e' },
                  { key: 'activeMinutes' as MetricKey, icon: Timer, label: 'Active', color: '#f59e0b' },
                  { key: 'caloriesBurned' as MetricKey, icon: Flame, label: 'Calories', color: '#ef4444' },
                  { key: 'hydration' as MetricKey, icon: Droplets, label: 'Water', color: '#06b6d4' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => openEditModal(item.key)}
                    className="p-4 rounded-xl hover:shadow-md transition-all text-center"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: item.color }} />
                    <div className="text-xs text-gray-600">{item.label}</div>
                    <Plus className="w-4 h-4 mx-auto mt-2 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workout' && (
        <div className="space-y-6">
          {showWorkoutCamera ? (
            <div className="card p-4">
              <WorkoutCameraView />
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CircleDot className="w-4 h-4 text-red-500 animate-pulse" />
                    <span className="text-sm text-gray-600">Motion Tracking Active</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowWorkoutCamera(false);
                    setIsWorkoutActive(false);
                    setWorkoutTime(0);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  End Workout
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Start Workout */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Workout</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {workoutTypes.map(workout => (
                    <button
                      key={workout.id}
                      onClick={() => setSelectedWorkout(workout.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedWorkout === workout.id
                          ? 'border-current shadow-lg scale-105'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                      style={selectedWorkout === workout.id ? { borderColor: workout.color } : {}}
                    >
                      <div
                        className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: `${workout.color}15` }}
                      >
                        <workout.icon className="w-6 h-6" style={{ color: workout.color }} />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{workout.name}</div>
                    </button>
                  ))}
                </div>

                {selectedWorkout && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => setShowWorkoutCamera(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Camera className="w-5 h-5" />
                      Start with Motion Tracking
                    </button>
                    <button
                      onClick={() => {
                        setIsWorkoutActive(true);
                        setWorkoutTime(0);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                    >
                      <Play className="w-5 h-5" />
                      Quick Start
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Timer (if active without camera) */}
              {isWorkoutActive && !showWorkoutCamera && (
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Workout in Progress</h3>
                      <p className="text-gray-500">{workoutTypes.find(w => w.id === selectedWorkout)?.name}</p>
                    </div>
                    <div className="text-4xl font-mono font-bold" style={{ color: primaryColor }}>
                      {formatWorkoutTime(workoutTime)}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setIsWorkoutActive(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => {
                        setIsWorkoutActive(false);
                        setWorkoutTime(0);
                        setSelectedWorkout(null);
                      }}
                      className="flex-1 px-4 py-3 rounded-xl text-white font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      End Workout
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Workouts */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h3>
                <div className="space-y-3">
                  {[
                    { type: 'Running', duration: '32 min', calories: 320, date: 'Today' },
                    { type: 'Strength', duration: '45 min', calories: 280, date: 'Yesterday' },
                    { type: 'HIIT', duration: '20 min', calories: 250, date: '2 days ago' },
                  ].map((workout, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: colorPresets[colorPreset]?.light }}
                      >
                        <Dumbbell className="w-6 h-6" style={{ color: primaryColor }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{workout.type}</div>
                        <div className="text-sm text-gray-500">{workout.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{workout.duration}</div>
                        <div className="text-sm text-gray-500">{workout.calories} cal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'body' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Body Visualization */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Body Overview</h2>
                <span className="text-sm text-gray-500">Tap any metric to update</span>
              </div>

              <div className="relative min-h-[500px] flex items-center justify-center">
                <div className="w-48 sm:w-56 lg:w-64">
                  <BodySilhouette />
                </div>

                {metricConfigs.map((config) => {
                  const display = getMetricDisplay(config.key);
                  return (
                    <button
                      key={config.key}
                      onClick={() => openEditModal(config.key)}
                      className="absolute p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105 min-w-[100px]"
                      style={{ ...config.position, borderLeftColor: config.color, borderLeftWidth: '3px' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <config.icon className="w-4 h-4" style={{ color: config.color }} />
                        <span className="text-xs text-gray-500">{config.label}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-gray-900">{display.value}</span>
                        <span className="text-xs text-gray-500">{display.unit}</span>
                      </div>
                      {display.secondary && (
                        <span className="text-xs text-gray-400">{display.secondary}</span>
                      )}
                      <Edit3 className="absolute top-2 right-2 w-3 h-3 text-gray-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Body Stats */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Measurements</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openEditModal('weight')}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Weight</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-900">{getMetricDisplay('weight').value}</span>
                    <span className="text-sm text-gray-500">{getMetricDisplay('weight').unit}</span>
                  </div>
                </button>

                <button
                  onClick={() => openEditModal('height')}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-gray-500">Height</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-900">{getMetricDisplay('height').value}</span>
                    <span className="text-sm text-gray-500">{getMetricDisplay('height').unit}</span>
                  </div>
                </button>

                <button
                  onClick={() => openEditModal('weight')}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">BMI</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-900">{getMetricDisplay('bmi').value}</span>
                  </div>
                  <span className="text-xs" style={{ color: primaryColor }}>{getMetricDisplay('bmi').secondary}</span>
                </button>

                <button
                  onClick={() => openEditModal('bodyFat')}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-gray-500">Body Fat</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-900">{getMetricDisplay('bodyFat').value}</span>
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Body Goals */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Goals</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 text-center">
                  <Plus className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Set a body goal</p>
                </div>
              </div>
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
    </div>
  );
}
