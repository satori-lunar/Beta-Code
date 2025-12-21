import { useState, useRef, useEffect } from 'react';
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
  X,
  Sparkles,
  Lightbulb,
  Target,
  CheckCircle,
  Camera,
  Upload,
  Loader2
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
import { analyzeFoodImage } from '../lib/foodAnalysis';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

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
  { id: 'snack', name: 'Snacks', icon: Cookie, color: '#e2d5f1' },
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
  const { user } = useAuth();
  const [waterIntake, setWaterIntake] = useState(0);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showGettingStarted, setShowGettingStarted] = useState(true);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [mealImage, setMealImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nutritionEntryId, setNutritionEntryId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

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

  // Get or create today's nutrition entry
  const getOrCreateNutritionEntry = async () => {
    if (!user) return null;

    try {
      // Try to get existing entry
      const { data: existing, error: fetchError } = await supabase
        .from('nutrition_entries')
        .select('id, water_intake')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing && existing.id) {
        setNutritionEntryId(existing.id);
        setWaterIntake(existing.water_intake || 0);
        return existing.id;
      }

      // Create new entry
      const { data: newEntry, error: createError } = await supabase
        .from('nutrition_entries')
        .insert({
          user_id: user.id,
          date: today,
          total_calories: 0,
          total_protein: 0,
          total_carbs: 0,
          total_fat: 0,
          water_intake: 0,
        } as any)
        .select('id')
        .single();

      if (createError) throw createError;

      if (newEntry && newEntry.id) {
        setNutritionEntryId(newEntry.id);
        return newEntry.id;
      }
      return null;
    } catch (error) {
      console.error('Error getting/creating nutrition entry:', error);
      return null;
    }
  };

  // Fetch meals for today
  const fetchMeals = async (entryId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('meals' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('nutrition_entry_id', entryId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const mappedMeals: Meal[] = data.map((meal: any) => ({
          id: meal.id,
          type: meal.type,
          name: meal.name,
          calories: meal.calories || 0,
          protein: meal.protein || 0,
          carbs: meal.carbs || 0,
          fat: meal.fat || 0,
        }));
        setMeals(mappedMeals);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };


  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const entryId = await getOrCreateNutritionEntry();
      if (entryId) {
        await fetchMeals(entryId);
      }
      setLoading(false);
    };

    loadData();
  }, [user, today]);

  // Update totals when meals or water change
  useEffect(() => {
    if (nutritionEntryId && user) {
      const totals = {
        total_calories: meals.reduce((sum, meal) => sum + meal.calories, 0),
        total_protein: meals.reduce((sum, meal) => sum + meal.protein, 0),
        total_carbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
        total_fat: meals.reduce((sum, meal) => sum + meal.fat, 0),
        water_intake: waterIntake,
      };

      supabase
        .from('nutrition_entries')
        .update(totals as any)
        .eq('id', nutritionEntryId)
        .then(({ error }) => {
          if (error) console.error('Error updating nutrition totals:', error);
        });
    }
  }, [meals, waterIntake, nutritionEntryId, user]);

  const addWater = async (amount: number) => {
    const newAmount = Math.max(0, waterIntake + amount);
    setWaterIntake(newAmount);
    
    if (nutritionEntryId && user) {
      try {
        await supabase
          .from('nutrition_entries')
          .update({ water_intake: newAmount } as any)
          .eq('id', nutritionEntryId);
      } catch (error) {
        console.error('Error updating water intake:', error);
      }
    }
  };

  const handleAddMeal = async () => {
    if (!newMeal.name.trim() || !nutritionEntryId || !user) return;

    try {
      const mealData = {
        nutrition_entry_id: nutritionEntryId,
        user_id: user.id,
        type: selectedMealType,
        name: newMeal.name,
        calories: parseInt(newMeal.calories) || 0,
        protein: parseInt(newMeal.protein) || 0,
        carbs: parseInt(newMeal.carbs) || 0,
        fat: parseInt(newMeal.fat) || 0,
        time: new Date().toTimeString().slice(0, 5), // HH:MM format
      };

      const { data, error } = await supabase
        .from('meals' as any)
        .insert(mealData)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Add to local state
        setMeals([
          ...meals,
          {
            id: data.id,
            type: data.type,
            name: data.name,
            calories: data.calories || 0,
            protein: data.protein || 0,
            carbs: data.carbs || 0,
            fat: data.fat || 0,
          },
        ]);
      }

      // Reset form but keep modal open and preserve meal type
      setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      setMealImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding meal:', error);
      alert('Failed to add meal. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowAddMealModal(false);
    // Reset form when closing
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setMealImage(null);
    setImagePreview(null);
  };

  const handleImageSelect = async (file: File) => {
    setMealImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleCaptureFromCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'meal-photo.jpg', { type: 'image/jpeg' });
        handleImageSelect(file);
        setShowCamera(false);
      }
    }, 'image/jpeg', 0.9);
  };

  const cancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleAnalyzeImage = async () => {
    if (!mealImage) return;

    setAnalyzingImage(true);
    try {
      const analysis = await analyzeFoodImage(mealImage);
      setNewMeal({
        name: analysis.name,
        calories: Math.round(analysis.calories).toString(),
        protein: Math.round(analysis.protein).toString(),
        carbs: Math.round(analysis.carbs).toString(),
        fat: Math.round(analysis.fat).toString(),
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please enter meal details manually.');
    } finally {
      setAnalyzingImage(false);
    }
  };

  const removeImage = () => {
    setMealImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getMealsByType = (type: string) => meals.filter(m => m.type === type);
  const getMealCaloriesByType = (type: string) =>
    getMealsByType(type).reduce((sum, m) => sum + m.calories, 0);

  const hasNoData = meals.length === 0 && waterIntake === 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Nutrition Tracker
        </h1>
        <p className="text-gray-500 mt-1">Track your meals and stay hydrated</p>
      </div>

      {/* Getting Started Card - Shows when there's no data */}
      {hasNoData && showGettingStarted && (
        <div className="card bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Welcome to Nutrition Tracking!</h2>
                <p className="text-gray-600 text-sm">Let's set up your daily nutrition goals and start tracking.</p>
              </div>
            </div>
            <button
              onClick={() => setShowGettingStarted(false)}
              className="p-1 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-white/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Droplet className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">1. Track Water</span>
              </div>
              <p className="text-sm text-gray-600">
                Use the + and - buttons to log your water intake throughout the day.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-white/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Apple className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-medium text-gray-900">2. Log Meals</span>
              </div>
              <p className="text-sm text-gray-600">
                Click on any meal type below or "Add Meal" to record what you eat.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-white/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium text-gray-900">3. Set Goals</span>
              </div>
              <p className="text-sm text-gray-600">
                Your daily goals are set to 2000 kcal and 2000ml water by default.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-emerald-100">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <p className="text-sm text-gray-600">
              <span className="font-medium">Pro tip:</span> Consistent tracking helps you understand your eating patterns and make healthier choices!
            </p>
          </div>
        </div>
      )}

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

        {meals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No meals logged yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Start tracking your nutrition by adding your first meal. Click on a meal type above or use the button below.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {mealTypes.map((mealType) => (
                <button
                  key={mealType.id}
                  onClick={() => {
                    setSelectedMealType(mealType.id);
                    setShowAddMealModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <mealType.icon className="w-4 h-4" style={{ color: mealType.color.replace('100', '600') }} />
                  <span className="text-sm font-medium text-gray-700">{mealType.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
              <CheckCircle className="w-4 h-4" />
              <span>Your meals will appear here once you add them</span>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold">Add Meal</h3>
              <button
                onClick={handleCloseModal}
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

              {/* Image Capture Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Take a Photo of Your Meal
                </label>
                {!imagePreview ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCaptureFromCamera}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-coral-400 hover:bg-coral-50 transition-colors"
                    >
                      <Camera className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Take Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-coral-400 hover:bg-coral-50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Upload</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Meal preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAnalyzeImage}
                      disabled={analyzingImage}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-coral-500 to-orange-500 text-white font-medium hover:from-coral-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {analyzingImage ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Analyze Meal</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  placeholder="e.g., Grilled chicken salad"
                  className="input"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calories and nutrition info are optional
                </p>
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
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Done
                </button>
                <button onClick={handleAddMeal} className="flex-1 btn-primary">
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <button
              onClick={cancelCamera}
              className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="bg-black/80 p-6 flex justify-center">
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
