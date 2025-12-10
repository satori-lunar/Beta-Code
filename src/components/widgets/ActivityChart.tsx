import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ActivityChartProps {
  className?: string;
}

export default function ActivityChart({ className }: ActivityChartProps) {
  const [selectedMonth, setSelectedMonth] = useState('Jan 2024');

  const months = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'];

  const data = [
    { day: 'Jan 1', aerobics: 65, yoga: 45, meditation: 30 },
    { day: 'Jan 2', aerobics: 72, yoga: 52, meditation: 35 },
    { day: 'Jan 3', aerobics: 58, yoga: 48, meditation: 40 },
    { day: 'Jan 4', aerobics: 80, yoga: 55, meditation: 28 },
    { day: 'Jan 5', aerobics: 45, yoga: 60, meditation: 45 },
    { day: 'Jan 6', aerobics: 68, yoga: 42, meditation: 38 },
    { day: 'Jan 7', aerobics: 75, yoga: 58, meditation: 42 },
    { day: 'Jan 8', aerobics: 62, yoga: 50, meditation: 35 },
    { day: 'Jan 9', aerobics: 78, yoga: 55, meditation: 30 },
    { day: 'Jan 10', aerobics: 55, yoga: 62, meditation: 48 },
    { day: 'Jan 11', aerobics: 70, yoga: 48, meditation: 38 },
    { day: 'Jan 12', aerobics: 82, yoga: 52, meditation: 32 },
    { day: 'Jan 13', aerobics: 48, yoga: 58, meditation: 45 },
    { day: 'Jan 14', aerobics: 65, yoga: 45, meditation: 40 },
    { day: 'Jan 15', aerobics: 72, yoga: 55, meditation: 35 },
    { day: 'Jan 16', aerobics: 58, yoga: 62, meditation: 42 },
    { day: 'Jan 17', aerobics: 75, yoga: 50, meditation: 38 },
    { day: 'Jan 18', aerobics: 68, yoga: 48, meditation: 45 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-100">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Activity Growth</h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500"
        >
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2} barSize={8}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              interval={1}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="aerobics" fill="#ef4444" radius={[4, 4, 0, 0]} name="Aerobics" />
            <Bar dataKey="yoga" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Yoga" />
            <Bar dataKey="meditation" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Meditation" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-600">Aerobics</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-600">Yoga</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-gray-600">Meditation</span>
        </div>
      </div>
    </div>
  );
}
