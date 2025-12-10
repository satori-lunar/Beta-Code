import { useState } from 'react';
import { TrendingUp, TrendingDown, Edit2, Save } from 'lucide-react';

interface Measurement {
  value: number;
  unit: string;
  change: number;
  label: string;
}

interface BodyMeasurementsProps {
  onSave?: (measurements: Record<string, number>) => void;
}

export default function BodyMeasurements({ onSave }: BodyMeasurementsProps) {
  const [editing, setEditing] = useState(false);
  const [measurements, setMeasurements] = useState<Record<string, Measurement>>({
    chest: { value: 44.5, unit: 'in', change: 0.5, label: 'Chest' },
    waist: { value: 34, unit: 'in', change: -1, label: 'Waist' },
    hip: { value: 42.5, unit: 'in', change: -0.5, label: 'Hip' },
  });

  const bodyShape = 'Inverted Triangle Body Shape';
  const lastChecked = '2 Days Ago';

  const handleSave = () => {
    setEditing(false);
    if (onSave) {
      const values = Object.fromEntries(
        Object.entries(measurements).map(([key, m]) => [key, m.value])
      );
      onSave(values);
    }
  };

  const updateMeasurement = (key: string, value: number) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Body Measurements</h3>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {editing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-4">Last checked {lastChecked}</p>

      <div className="flex gap-6">
        {/* Body Shape Visual */}
        <div className="flex-1 relative">
          <span className="inline-block mb-4 px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
            {bodyShape}
          </span>

          {/* SVG Body Shape */}
          <div className="relative flex justify-center">
            <svg viewBox="0 0 200 350" className="w-40 h-64">
              {/* Head */}
              <ellipse cx="100" cy="30" rx="25" ry="28" fill="#e8c4a8" />

              {/* Neck */}
              <rect x="88" y="55" width="24" height="20" fill="#e8c4a8" />

              {/* Body/Torso */}
              <path
                d="M 60 75 Q 50 100 55 140 Q 60 180 70 220 L 75 220 L 80 280 L 70 350 L 130 350 L 120 280 L 125 220 L 130 220 Q 140 180 145 140 Q 150 100 140 75 Q 120 70 100 70 Q 80 70 60 75"
                fill="#f5d5c0"
              />

              {/* Tank top */}
              <path
                d="M 60 75 Q 50 100 55 140 Q 60 160 65 180 L 65 200 L 135 200 L 135 180 Q 140 160 145 140 Q 150 100 140 75 Q 120 70 100 70 Q 80 70 60 75"
                fill="#f8e8e8"
              />

              {/* Shorts */}
              <path
                d="M 70 200 L 65 280 L 135 280 L 130 200 Z"
                fill="#2d3748"
              />

              {/* Arms */}
              <path d="M 60 75 Q 40 90 30 130 Q 35 135 45 130 Q 55 100 60 85" fill="#e8c4a8" />
              <path d="M 140 75 Q 160 90 170 130 Q 165 135 155 130 Q 145 100 140 85" fill="#e8c4a8" />

              {/* Legs */}
              <path d="M 70 280 L 65 350 L 90 350 L 90 280" fill="#f5d5c0" />
              <path d="M 110 280 L 110 350 L 135 350 L 130 280" fill="#f5d5c0" />

              {/* Shoes */}
              <ellipse cx="77" cy="350" rx="18" ry="8" fill="#1a202c" />
              <ellipse cx="123" cy="350" rx="18" ry="8" fill="#1a202c" />

              {/* Measurement rings */}
              <ellipse cx="100" cy="100" rx="50" ry="15" fill="none" stroke="#f56565" strokeWidth="2" strokeDasharray="5,3" />
              <ellipse cx="100" cy="160" rx="40" ry="12" fill="none" stroke="#f56565" strokeWidth="2" strokeDasharray="5,3" />
              <ellipse cx="100" cy="220" rx="45" ry="14" fill="none" stroke="#f56565" strokeWidth="2" strokeDasharray="5,3" />
            </svg>
          </div>
        </div>

        {/* Measurements List */}
        <div className="flex-1 space-y-4">
          {Object.entries(measurements).map(([key, measurement]) => (
            <div key={key} className="bg-gray-800 rounded-xl p-4">
              <span className="text-sm text-gray-400">{measurement.label} ({measurement.unit})</span>
              <div className="flex items-center justify-between mt-1">
                {editing ? (
                  <input
                    type="number"
                    value={measurement.value}
                    onChange={(e) => updateMeasurement(key, Number(e.target.value))}
                    step="0.5"
                    className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-2xl font-bold"
                  />
                ) : (
                  <span className="text-2xl font-bold">{measurement.value}</span>
                )}
                <span className={`flex items-center gap-1 text-sm ${
                  measurement.change > 0 ? 'text-red-400' : measurement.change < 0 ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {measurement.change > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : measurement.change < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : null}
                  {measurement.change > 0 ? '+' : ''}{measurement.change !== 0 ? measurement.change : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
