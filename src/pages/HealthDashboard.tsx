import { useState } from 'react';
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
  TrendingDown
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';
import { format, formatDistanceToNow } from 'date-fns';

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

export default function HealthDashboard() {
  const { healthMetrics, updateHealthMetric, connectedDevices, toggleDeviceConnection } = useStore();
  const { colorPreset, colorPresets, primaryColor } = useTheme();
  const [editingMetric, setEditingMetric] = useState<MetricKey | null>(null);
  const [showDevicesPanel, setShowDevicesPanel] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const hasConnectedDevice = connectedDevices.some(d => d.connected);

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
        // Recalculate BMI
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

  // Activity Ring Component
  const ActivityRing = ({ progress, color, size = 80, strokeWidth = 8, label, value }: {
    progress: number;
    color: string;
    size?: number;
    strokeWidth?: number;
    label: string;
    value: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background ring */}
          <svg className="absolute" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`${color}20`}
              strokeWidth={strokeWidth}
            />
          </svg>
          {/* Progress ring */}
          <svg className="absolute -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{progress}%</span>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700 mt-2">{label}</span>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
    );
  };

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

  return (
    <div className="pb-20 lg:pb-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">Health Profile</h1>
          <p className="text-gray-500">Track and manage your health metrics</p>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Body Visualization with Metrics */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Body Overview</h2>
              <span className="text-sm text-gray-500">
                Tap any metric to update
              </span>
            </div>

            <div className="relative min-h-[500px] flex items-center justify-center">
              {/* Body Silhouette */}
              <div className="w-48 sm:w-56 lg:w-64">
                <BodySilhouette />
              </div>

              {/* Floating Metric Cards */}
              {metricConfigs.map((config) => {
                const display = getMetricDisplay(config.key);

                return (
                  <button
                    key={config.key}
                    onClick={() => openEditModal(config.key)}
                    className="absolute p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105 min-w-[100px]"
                    style={{
                      ...config.position,
                      borderLeftColor: config.color,
                      borderLeftWidth: '3px'
                    }}
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

        {/* Right Sidebar - Stats & Quick Actions */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Activity Rings */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Progress</h3>
            <div className="grid grid-cols-3 gap-4">
              <ActivityRing
                progress={getProgressPercent('steps') || 0}
                color="#22c55e"
                label="Steps"
                value={getMetricDisplay('steps').value}
              />
              <ActivityRing
                progress={getProgressPercent('activeMinutes') || 0}
                color="#f59e0b"
                label="Active"
                value={`${getMetricDisplay('activeMinutes').value}min`}
              />
              <ActivityRing
                progress={getProgressPercent('caloriesBurned') || 0}
                color="#ef4444"
                label="Calories"
                value={getMetricDisplay('caloriesBurned').value}
              />
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Weight */}
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

              {/* Height */}
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

              {/* BMI */}
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

              {/* Body Fat */}
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

          {/* Wellness Scores */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wellness</h3>
            <div className="space-y-4">
              {/* Stress Level */}
              <button
                onClick={() => openEditModal('stressLevel')}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">Stress Level</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: primaryColor }}>
                    {getMetricDisplay('stressLevel').secondary}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(healthMetrics.stressLevel?.value ?? 0) * 10}%`,
                      backgroundColor: (healthMetrics.stressLevel?.value ?? 0) <= 3 ? '#22c55e' : (healthMetrics.stressLevel?.value ?? 0) <= 6 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </button>

              {/* Energy Level */}
              <button
                onClick={() => openEditModal('energyLevel')}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">Energy Level</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: primaryColor }}>
                    {getMetricDisplay('energyLevel').secondary}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(healthMetrics.energyLevel?.value || 0) * 10}%`,
                      backgroundColor: primaryColor
                    }}
                  />
                </div>
              </button>

              {/* Hydration */}
              <button
                onClick={() => openEditModal('hydration')}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Hydration</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {getMetricDisplay('hydration').value}L {getMetricDisplay('hydration').secondary}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all bg-blue-500"
                    style={{ width: `${getProgressPercent('hydration') || 0}%` }}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Connected Devices Summary */}
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
            <div className="space-y-2">
              {connectedDevices.filter(d => d.connected).length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No devices connected. Connect a device to sync your health data automatically.
                </p>
              ) : (
                connectedDevices.filter(d => d.connected).map(device => {
                  const IconComponent = deviceIcons[device.icon] || Watch;
                  return (
                    <div key={device.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colorPresets[colorPreset]?.light }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: primaryColor }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{device.name}</p>
                        <p className="text-xs text-gray-500">
                          Synced {device.lastSync ? formatDistanceToNow(new Date(device.lastSync), { addSuffix: true }) : 'never'}
                        </p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Metric Modal */}
      {editingMetric && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Update {metricConfigs.find(m => m.key === editingMetric)?.label || editingMetric}
              </h3>
              <button
                onClick={() => {
                  setEditingMetric(null);
                  setEditValues({});
                }}
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
                  onClick={() => {
                    setEditingMetric(null);
                    setEditValues({});
                  }}
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

      {/* Devices Panel Modal */}
      {showDevicesPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Connected Devices</h3>
              <button
                onClick={() => setShowDevicesPanel(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                Connect your fitness devices to automatically sync your health data.
              </p>
              {connectedDevices.map(device => {
                const IconComponent = deviceIcons[device.icon] || Watch;
                return (
                  <div
                    key={device.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: device.connected ? colorPresets[colorPreset]?.light : '#f3f4f6',
                        color: device.connected ? primaryColor : '#9ca3af'
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{device.name}</p>
                      <p className="text-sm text-gray-500">
                        {device.connected
                          ? `Connected • Last sync ${device.lastSync ? formatDistanceToNow(new Date(device.lastSync), { addSuffix: true }) : 'pending'}`
                          : 'Not connected'
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => toggleDeviceConnection(device.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        device.connected
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : ''
                      }`}
                      style={!device.connected ? {
                        backgroundColor: primaryColor,
                        color: 'white'
                      } : undefined}
                    >
                      {device.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-gray-100 mt-4">
                <p className="text-xs text-gray-500 text-center">
                  Your data is encrypted and stored securely. We never share your health information with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
