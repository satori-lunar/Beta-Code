import { useState } from 'react';
import {
  Plus,
  Droplet,
  Apple,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Moon as MoonIcon,
  TrendingUp,
  Minus,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const waterData = [
  { time: '8AM', amount: 350 },
  { time: '9AM', amount: 100 },
  { time: '10AM', amount: 200 },
  { time: '11AM', amount: 150 },
  { time: '12PM', amount: 300 },
  { time: '1PM', amount: 150 },
  { time: '2PM', amount: 250 },
  { time: '3PM', amount: 100 },
  { time: '4PM', amount: 150 },
];

const mealTypes = [
  { id: 'breakfast', name: 'Breakfast', icon: Coffee, color: '#fcd5ce' },
  { id: 'lunch', name: 'Lunch', icon: UtensilsCrossed, color: '#d8f3dc' },
  { id: 'snacks', name: 'Snacks', icon: Cookie, color: '#e2d5f1' },
  { id: 'dinner', name: 'Dinner', icon: MoonIcon, color: '#bde0fe' },
];

interface Meal {
  id: string;
  type: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function Nutrition() {
  const [waterIntake, setWaterIntake] = useState(1750);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', type: 'breakfast', name: 'Oatmeal with berries', calories: 396, protein: 12, carbs: 68, fat: 8 },
    { id: '2', type: 'lunch', name: 'Grilled chicken salad', calories: 613, protein: 45, carbs: 32, fat: 35 },
    { id: '3', type: 'snacks', name: 'Greek yogurt & almonds', calories: 209, protein: 15, carbs: 12, fat: 12 },
    { id: '4', type: 'dinner', name: 'Salmon with vegetables', calories: 424, protein: 38, carbs: 22, fat: 20 },
  ]);

  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const waterGoal = 2000;
  const calorieGoal = 2000;

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
  };

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.calories) {
      setMeals([
        ...meals,
        {
          id: Date.now().toString(),
          type: selectedMealType,
          name: newMeal.name,
          calories: parseInt(newMeal.calories) || 0,
          protein: parseInt(newMeal.protein) || 0,
          carbs: parseInt(newMeal.carbs) || 0,
          fat: parseInt(newMeal.fat) || 0,
        },
      ]);
      setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      setShowAddMealModal(false);
    }
  };

  const getMealsByType = (type: string) => meals.filter(m => m.type === type);
  const getMealCaloriesByType = (type: string) =>
    getMealsByType(type).reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Nutrition Tracker
        </h1>
        <p className="text-gray-500 mt-1">Track your meals and stay hydrated</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center">
              <Apple className="w-5 h-5 text-coral-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalCalories}</p>
          <p className="text-sm text-gray-500">/ {calorieGoal} kcal</p>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-coral-500 rounded-full"
              style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalProtein}g</p>
          <p className="text-sm text-gray-500">Protein</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Cookie className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalCarbs}g</p>
          <p className="text-sm text-gray-500">Carbs</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalFat}g</p>
          <p className="text-sm text-gray-500">Fat</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Water Intake */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">Water Intake</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Today</span>
              <span className="font-bold text-blue-600">{waterIntake}ml</span>
              <span className="text-gray-400">/ {waterGoal}ml</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => addWater(-250)}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Minus className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <div className="h-4 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
                />
              </div>
              <div
                className="absolute -top-8 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded"
                style={{ left: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
              >
                {waterIntake}ml
              </div>
            </div>
            <button
              onClick={() => addWater(250)}
              className="p-3 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600" />
            </button>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {[150, 250, 350, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium transition-colors"
              >
                <Droplet className="w-4 h-4" />
                +{amount}ml
              </button>
            ))}
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  fill="url(#waterGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Meal Summary */}
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">Daily Meals</h2>
          <p className="text-3xl font-bold text-gray-900 mb-6">{totalCalories} Kcal</p>

          <div className="space-y-4">
            {mealTypes.map((mealType) => {
              const mealCalories = getMealCaloriesByType(mealType.id);
              return (
                <div
                  key={mealType.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedMealType(mealType.id);
                    setShowAddMealModal(true);
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: mealType.color }}
                  >
                    <mealType.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{mealType.name}</p>
                    <p className="text-sm text-gray-500">{mealCalories} Kcal</p>
                  </div>
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-gray-900">Today's Meals</h2>
          <button
            onClick={() => setShowAddMealModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Meal
          </button>
        </div>

        <div className="space-y-4">
          {mealTypes.map((mealType) => {
            const typeMeals = getMealsByType(mealType.id);
            if (typeMeals.length === 0) return null;

            return (
              <div key={mealType.id}>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <mealType.icon className="w-4 h-4" />
                  {mealType.name}
                </h3>
                <div className="space-y-2">
                  {typeMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{meal.name}</p>
                        <p className="text-sm text-gray-500">
                          P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">{meal.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold">Add Meal</h3>
              <button
                onClick={() => setShowAddMealModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedMealType(type.id)}
                      className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                        selectedMealType === type.id
                          ? 'ring-2 ring-coral-500'
                          : 'hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: selectedMealType === type.id ? type.color : '#f9fafb',
                      }}
                    >
                      <type.icon className="w-5 h-5 text-gray-700" />
                      <span className="text-xs text-gray-600">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name
                </label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  placeholder="e.g., Grilled chicken salad"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    placeholder="kcal"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                    placeholder="grams"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                    placeholder="grams"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                    placeholder="grams"
                    className="input"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddMealModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={handleAddMeal} className="flex-1 btn-primary">
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
