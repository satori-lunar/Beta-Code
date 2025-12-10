import { useState } from 'react';
import { Droplet, Heart, Activity, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricData {
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
  trend: number[];
  label: string;
}

interface HealthMetricsWidgetProps {
  onAddReading?: (type: string) => void;
}

export default function HealthMetricsWidget({ onAddReading }: HealthMetricsWidgetProps) {
  const [metrics] = useState<Record<string, MetricData>>({
    bloodSugar: {
      value: 80,
      unit: 'mg/dL',
      status: 'normal',
      trend: [75, 82, 78, 85, 80, 83, 80],
      label: 'Blood Sugar'
    },
    heartRate: {
      value: 98,
      unit: 'bpm',
      status: 'normal',
      trend: [92, 95, 98, 96, 100, 97, 98],
      label: 'Heart Rate'
    },
    bloodPressure: {
      value: 102,
      unit: '/ 72 mmhg',
      status: 'normal',
      trend: [100, 105, 102, 98, 104, 100, 102],
      label: 'Blood Pressure'
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-amber-600 bg-amber-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChartColor = (status: string) => {
    switch (status) {
      case 'normal': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'bloodSugar': return <Droplet className="w-5 h-5" />;
      case 'heartRate': return <Heart className="w-5 h-5" />;
      case 'bloodPressure': return <Activity className="w-5 h-5" />;
      default: return null;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'bloodSugar': return 'bg-amber-100 text-amber-600';
      case 'heartRate': return 'bg-red-100 text-red-600';
      case 'bloodPressure': return 'bg-teal-100 text-teal-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrendIcon = (trend: number[]) => {
    const last = trend[trend.length - 1];
    const prev = trend[trend.length - 2];
    if (last > prev) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (last < prev) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Object.entries(metrics).map(([key, metric]) => (
        <div
          key={key}
          className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => onAddReading?.(key)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getIconBg(key)}`}>
                {getIcon(key)}
              </div>
              <span className="font-medium text-gray-700">{metric.label}</span>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-lg">
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500">{metric.unit}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
              </span>
            </div>

            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.trend.map((value, index) => ({ value, index }))}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getChartColor(metric.status)}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
