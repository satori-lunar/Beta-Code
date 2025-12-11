import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Flame,
  Target,
  ChevronDown,
  Check,
  MapPin,
  Clock,
  Footprints,
  Wind,
  X,
  Trophy,
  Sparkles
} from 'lucide-react';

// Cardio activity types
interface CardioType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  caloriesPerMinute: number;
  description: string;
}

const cardioTypes: CardioType[] = [
  { id: 'walking', name: 'Walking', icon: Footprints, color: '#22c55e', caloriesPerMinute: 4, description: 'Leisurely pace' },
  { id: 'brisk-walk', name: 'Brisk Walk', icon: Wind, color: '#10b981', caloriesPerMinute: 5.5, description: 'Fast-paced walking' },
  { id: 'jogging', name: 'Jogging', icon: Footprints, color: '#f59e0b', caloriesPerMinute: 8, description: 'Light running' },
  { id: 'running', name: 'Running', icon: Flame, color: '#ef4444', caloriesPerMinute: 11, description: 'Steady run' },
  { id: 'interval', name: 'Intervals', icon: Target, color: '#8b5cf6', caloriesPerMinute: 10, description: 'Walk/run mix' },
  { id: 'free-cardio', name: 'Free Cardio', icon: Sparkles, color: '#06b6d4', caloriesPerMinute: 7, description: 'Any activity' },
];

// Goal types
type GoalType = 'free' | 'time' | 'milestones';

interface WorkoutConfig {
  goalType: GoalType;
  targetTime?: number; // in seconds
  targetMilestones?: number;
  intensity: 'easy' | 'moderate' | 'intense';
}

interface GuidedCardioProps {
  onClose: () => void;
  onWorkoutComplete?: (data: WorkoutData) => void;
}

interface WorkoutData {
  activityType: string;
  duration: number;
  milestones: number;
  calories: number;
}

// Coaching messages
const coachingMessages = {
  start: [
    "Let's do this! Starting your workout.",
    "Great choice! Let's get moving.",
    "Your workout is starting. You've got this!",
  ],
  encouragement: [
    "Keep it up! You're doing great.",
    "Excellent pace! Stay strong.",
    "You're crushing it! Keep going.",
    "Amazing work! Stay focused.",
    "That's the spirit! Keep moving.",
  ],
  milestone: [
    "Milestone reached! Fantastic work.",
    "Great job! You hit a milestone.",
    "Checkpoint complete! Keep it up.",
  ],
  speedUp: [
    "Pick up the pace a bit!",
    "Let's go a little faster.",
    "Time to speed up!",
  ],
  slowDown: [
    "Ease up a little, find your rhythm.",
    "Slow it down, catch your breath.",
    "Take it easy, you're doing great.",
  ],
  halfway: [
    "Halfway there! You're doing amazing.",
    "50% done! Keep pushing.",
    "Halfway point reached! Strong work.",
  ],
  almostDone: [
    "Almost there! Final push.",
    "Just a little more! You've got this.",
    "Nearly done! Finish strong.",
  ],
  complete: [
    "Workout complete! Excellent job!",
    "You did it! Great workout!",
    "Finished! You should be proud.",
  ],
};

export default function GuidedCardio({ onClose, onWorkoutComplete }: GuidedCardioProps) {
  // Activity selection
  const [selectedActivity, setSelectedActivity] = useState<CardioType>(cardioTypes[0]);
  const [showActivityPicker, setShowActivityPicker] = useState(false);
  
  // Workout configuration
  const [showConfig, setShowConfig] = useState(true);
  const [config, setConfig] = useState<WorkoutConfig>({
    goalType: 'free',
    targetTime: 1200, // 20 minutes default
    targetMilestones: 5,
    intensity: 'moderate',
  });
  
  // Workout state
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [milestones, setMilestones] = useState(0);
  const [calories, setCalories] = useState(0);
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [coachingMessage, setCoachingMessage] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Coaching state
  const [lastCoachingTime, setLastCoachingTime] = useState(0);
  const [coachingInterval, setCoachingInterval] = useState(60); // seconds between coaching
  
  // Speech synthesis
  const speak = useCallback((text: string) => {
    if (!audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [audioEnabled]);
  
  // Show coaching message (visual + audio)
  const showCoaching = useCallback((message: string) => {
    setCoachingMessage(message);
    speak(message);
    setTimeout(() => setCoachingMessage(''), 4000);
  }, [speak]);
  
  // Get random message from category
  const getRandomMessage = (category: keyof typeof coachingMessages) => {
    const messages = coachingMessages[category];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  // Workout timer and coaching logic
  useEffect(() => {
    if (!isWorkoutActive || isPaused) return;
    
    const interval = setInterval(() => {
      setWorkoutTime(prev => {
        const newTime = prev + 1;
        
        // Calculate calories
        const caloriesPerSecond = selectedActivity.caloriesPerMinute / 60;
        const intensityMultiplier = config.intensity === 'easy' ? 0.8 : config.intensity === 'intense' ? 1.2 : 1;
        setCalories(c => c + (caloriesPerSecond * intensityMultiplier));
        
        // Coaching logic
        const timeSinceLastCoaching = newTime - lastCoachingTime;
        
        // Time-based goal progress
        if (config.goalType === 'time' && config.targetTime) {
          const progress = newTime / config.targetTime;
          
          // Halfway coaching
          if (progress >= 0.5 && progress < 0.51) {
            showCoaching(getRandomMessage('halfway'));
            setLastCoachingTime(newTime);
          }
          // Almost done coaching
          else if (progress >= 0.85 && progress < 0.86) {
            showCoaching(getRandomMessage('almostDone'));
            setLastCoachingTime(newTime);
          }
          // Workout complete
          else if (newTime >= config.targetTime) {
            completeWorkout();
          }
          // Regular encouragement
          else if (timeSinceLastCoaching >= coachingInterval) {
            showCoaching(getRandomMessage('encouragement'));
            setLastCoachingTime(newTime);
          }
        }
        // Free/milestone mode encouragement
        else if (timeSinceLastCoaching >= coachingInterval) {
          showCoaching(getRandomMessage('encouragement'));
          setLastCoachingTime(newTime);
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isWorkoutActive, isPaused, selectedActivity, config, lastCoachingTime, coachingInterval, showCoaching]);
  
  // Check milestone completion
  useEffect(() => {
    if (config.goalType === 'milestones' && config.targetMilestones && milestones >= config.targetMilestones) {
      completeWorkout();
    }
  }, [milestones, config]);
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start workout
  const startWorkout = () => {
    setShowConfig(false);
    setIsWorkoutActive(true);
    setIsPaused(false);
    setWorkoutTime(0);
    setMilestones(0);
    setCalories(0);
    setLastCoachingTime(0);
    
    // Adjust coaching interval based on intensity
    setCoachingInterval(config.intensity === 'intense' ? 45 : config.intensity === 'easy' ? 90 : 60);
    
    // Initial coaching
    setTimeout(() => showCoaching(getRandomMessage('start')), 500);
  };
  
  // Complete milestone
  const completeMilestone = () => {
    const newCount = milestones + 1;
    setMilestones(newCount);
    
    // Coaching for milestone
    if (config.goalType === 'milestones' && config.targetMilestones) {
      const remaining = config.targetMilestones - newCount;
      if (remaining === 1) {
        showCoaching("Just one more milestone to go!");
      } else if (remaining === 0) {
        // Will trigger completion via useEffect
      } else {
        showCoaching(`${getRandomMessage('milestone')} ${remaining} more to go.`);
      }
    } else {
      showCoaching(getRandomMessage('milestone'));
    }
  };
  
  // Complete workout
  const completeWorkout = () => {
    setIsWorkoutActive(false);
    setIsPaused(false);
    showCoaching(getRandomMessage('complete'));
    setShowCompletionModal(true);
    
    if (onWorkoutComplete) {
      onWorkoutComplete({
        activityType: selectedActivity.name,
        duration: workoutTime,
        milestones,
        calories: Math.round(calories),
      });
    }
  };
  
  // Stop workout (manual)
  const stopWorkout = () => {
    if (workoutTime > 30) {
      completeWorkout();
    } else {
      setIsWorkoutActive(false);
      setShowConfig(true);
    }
  };
  
  // Reset workout
  const resetWorkout = () => {
    setWorkoutTime(0);
    setMilestones(0);
    setCalories(0);
    setLastCoachingTime(0);
  };
  
  // Calculate progress
  const getProgress = () => {
    if (config.goalType === 'time' && config.targetTime) {
      return Math.min(100, (workoutTime / config.targetTime) * 100);
    }
    if (config.goalType === 'milestones' && config.targetMilestones) {
      return Math.min(100, (milestones / config.targetMilestones) * 100);
    }
    return 0;
  };
  
  // Get time remaining
  const getTimeRemaining = () => {
    if (config.goalType === 'time' && config.targetTime) {
      return Math.max(0, config.targetTime - workoutTime);
    }
    return null;
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Guided Cardio</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
            title={audioEnabled ? 'Mute coach' : 'Unmute coach'}
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-gray-700 hover:bg-red-500 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Configuration Screen */}
      {showConfig && (
        <div className="p-6 space-y-6">
          {/* Activity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Activity Type</label>
            <div className="relative">
              <button
                onClick={() => setShowActivityPicker(!showActivityPicker)}
                className="w-full flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedActivity.color}20` }}
                  >
                    <selectedActivity.icon className="w-6 h-6" style={{ color: selectedActivity.color }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg">{selectedActivity.name}</div>
                    <div className="text-sm text-gray-400">{selectedActivity.description} • ~{selectedActivity.caloriesPerMinute} cal/min</div>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showActivityPicker ? 'rotate-180' : ''}`} />
              </button>
              
              {showActivityPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-700 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
                  {cardioTypes.map(activity => (
                    <button
                      key={activity.id}
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowActivityPicker(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-600 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${activity.color}20` }}
                      >
                        <activity.icon className="w-5 h-5" style={{ color: activity.color }} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-medium">{activity.name}</div>
                        <div className="text-xs text-gray-400">{activity.description}</div>
                      </div>
                      {selectedActivity.id === activity.id && (
                        <Check className="w-5 h-5 text-green-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Goal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Workout Goal</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setConfig({ ...config, goalType: 'free' })}
                className={`p-4 rounded-xl transition-all ${
                  config.goalType === 'free'
                    ? 'bg-cyan-500/20 border-2 border-cyan-500 text-white'
                    : 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Sparkles className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Free</div>
                <div className="text-xs text-gray-400">No goal</div>
              </button>
              <button
                onClick={() => setConfig({ ...config, goalType: 'time' })}
                className={`p-4 rounded-xl transition-all ${
                  config.goalType === 'time'
                    ? 'bg-blue-500/20 border-2 border-blue-500 text-white'
                    : 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Clock className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Time</div>
                <div className="text-xs text-gray-400">Set duration</div>
              </button>
              <button
                onClick={() => setConfig({ ...config, goalType: 'milestones' })}
                className={`p-4 rounded-xl transition-all ${
                  config.goalType === 'milestones'
                    ? 'bg-purple-500/20 border-2 border-purple-500 text-white'
                    : 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600'
                }`}
              >
                <MapPin className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Milestones</div>
                <div className="text-xs text-gray-400">Mark points</div>
              </button>
            </div>
          </div>
          
          {/* Time Goal Setting */}
          {config.goalType === 'time' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration: {Math.floor((config.targetTime || 0) / 60)} minutes
              </label>
              <input
                type="range"
                min="300"
                max="5400"
                step="300"
                value={config.targetTime || 1200}
                onChange={(e) => setConfig({ ...config, targetTime: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5 min</span>
                <span>30 min</span>
                <span>60 min</span>
                <span>90 min</span>
              </div>
            </div>
          )}
          
          {/* Milestones Goal Setting */}
          {config.goalType === 'milestones' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Milestones: {config.targetMilestones}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={config.targetMilestones || 5}
                onChange={(e) => setConfig({ ...config, targetMilestones: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-2">
                Mark milestones as you walk around your neighborhood, reach landmarks, or complete sections.
              </p>
            </div>
          )}
          
          {/* Intensity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Intensity</label>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'moderate', 'intense'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setConfig({ ...config, intensity: level })}
                  className={`p-3 rounded-xl transition-all capitalize ${
                    config.intensity === level
                      ? level === 'easy' ? 'bg-green-500/20 border-2 border-green-500 text-white'
                        : level === 'intense' ? 'bg-red-500/20 border-2 border-red-500 text-white'
                        : 'bg-yellow-500/20 border-2 border-yellow-500 text-white'
                      : 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          {/* Start Button */}
          <button
            onClick={startWorkout}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
          >
            <Play className="w-6 h-6 inline mr-2" />
            Start Workout
          </button>
        </div>
      )}
      
      {/* Active Workout Screen */}
      {!showConfig && (
        <div className="p-6">
          {/* Progress Ring */}
          <div className="relative flex flex-col items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                {/* Progress circle */}
                {config.goalType !== 'free' && (
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={selectedActivity.color}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={553}
                    strokeDashoffset={553 - (553 * getProgress()) / 100}
                    className="transition-all duration-500"
                  />
                )}
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-mono font-bold text-white">
                  {formatTime(workoutTime)}
                </div>
                {getTimeRemaining() !== null && (
                  <div className="text-sm text-gray-400">
                    {formatTime(getTimeRemaining()!)} remaining
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Coaching Message */}
          {coachingMessage && (
            <div className="mb-6 animate-pulse">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl px-6 py-4 text-center">
                <p className="text-white text-lg font-semibold">{coachingMessage}</p>
              </div>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold" style={{ color: selectedActivity.color }}>
                {milestones}
              </div>
              <div className="text-xs text-gray-400">
                {config.goalType === 'milestones' ? `/ ${config.targetMilestones}` : ''} Milestones
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">
                {Math.round(calories)}
              </div>
              <div className="text-xs text-gray-400">Calories</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">
                {Math.round(getProgress())}%
              </div>
              <div className="text-xs text-gray-400">Progress</div>
            </div>
          </div>
          
          {/* Milestone Button */}
          <button
            onClick={completeMilestone}
            disabled={isPaused}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg mb-4"
          >
            <MapPin className="w-5 h-5 inline mr-2" />
            Mark Milestone {milestones + 1}
          </button>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
            >
              {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </button>
            
            <button
              onClick={stopWorkout}
              className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              <Square className="w-6 h-6" />
            </button>
            
            <button
              onClick={resetWorkout}
              className="p-4 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
          
          {/* Activity Info */}
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
            <selectedActivity.icon className="w-5 h-5" style={{ color: selectedActivity.color }} />
            <span>{selectedActivity.name}</span>
            <span>•</span>
            <span className="capitalize">{config.intensity}</span>
          </div>
        </div>
      )}
      
      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Workout Complete!</h3>
            <p className="text-gray-400 mb-6">Great job on finishing your {selectedActivity.name.toLowerCase()} session!</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 rounded-xl p-3">
                <div className="text-2xl font-bold text-white">{formatTime(workoutTime)}</div>
                <div className="text-xs text-gray-400">Duration</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-3">
                <div className="text-2xl font-bold text-purple-400">{milestones}</div>
                <div className="text-xs text-gray-400">Milestones</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-3">
                <div className="text-2xl font-bold text-orange-400">{Math.round(calories)}</div>
                <div className="text-xs text-gray-400">Calories</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setShowConfig(true);
                }}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
              >
                New Workout
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

