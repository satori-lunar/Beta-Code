import { useState, useEffect } from 'react';
import { Ruler, Scale, Info } from 'lucide-react';

interface BMICalculatorProps {
  initialHeight?: number;
  initialWeight?: number;
  onSave?: (height: number, weight: number, bmi: number) => void;
}

export default function BMICalculator({ initialHeight = 170, initialWeight = 72, onSave }: BMICalculatorProps) {
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [bmi, setBmi] = useState(0);
  const [category, setCategory] = useState('');

  useEffect(() => {
    // Calculate BMI: weight (kg) / height (m)^2
    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters * heightInMeters);
    setBmi(Math.round(calculatedBmi * 10) / 10);

    // Determine category
    if (calculatedBmi < 18.5) setCategory('Underweight');
    else if (calculatedBmi < 25) setCategory("You're Healthy");
    else if (calculatedBmi < 30) setCategory('Overweight');
    else setCategory('Obese');
  }, [height, weight]);

  const getBmiPosition = () => {
    // Map BMI 15-40 to 0-100%
    const minBmi = 15;
    const maxBmi = 40;
    const position = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.max(0, Math.min(100, position));
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">BMI Calculator</h3>
        <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
          <option>Last Week</option>
          <option>Last Month</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Height Input */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Height</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="120"
              max="220"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-lg font-semibold w-20 text-right">{height} cm</span>
          </div>
        </div>

        {/* Weight Input */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Weight</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="30"
              max="200"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-lg font-semibold w-20 text-right">{weight} kg</span>
          </div>
        </div>
      </div>

      {/* BMI Result */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Body Mass Index (BMI)</span>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
            bmi < 18.5 ? 'bg-blue-500/20 text-blue-400' :
            bmi < 25 ? 'bg-green-500/20 text-green-400' :
            bmi < 30 ? 'bg-amber-500/20 text-amber-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {category}
          </span>
        </div>
        <div className="text-4xl font-bold mb-4">{bmi}</div>

        {/* BMI Scale */}
        <div className="relative">
          <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-amber-400 to-red-500" />
          <div
            className="absolute top-0 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-0.5 ring-2 ring-gray-900 transition-all duration-300"
            style={{ left: `${getBmiPosition()}%` }}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 text-xs text-gray-500">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>BMI is a screening tool, not a diagnostic measure. Consult a healthcare provider for personalized advice.</p>
      </div>

      {onSave && (
        <button
          onClick={() => onSave(height, weight, bmi)}
          className="w-full mt-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors"
        >
          Save Reading
        </button>
      )}
    </div>
  );
}
