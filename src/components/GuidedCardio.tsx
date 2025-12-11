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
  Sparkles,
  Zap,
  PartyPopper,
  Timer,
  Hand,
  Star,
  Rocket
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Cardio activity types
interface CardioType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  caloriesPerMinute: number;
  description: string;
  hypeEmoji: string;
}

const cardioTypes: CardioType[] = [
  { id: 'walking', name: 'Walking', icon: Footprints, color: '#22c55e', caloriesPerMinute: 4, description: 'Leisurely pace', hypeEmoji: '🚶' },
  { id: 'brisk-walk', name: 'Power Walk', icon: Zap, color: '#10b981', caloriesPerMinute: 5.5, description: 'Fast & fierce', hypeEmoji: '⚡' },
  { id: 'jogging', name: 'Jogging', icon: Wind, color: '#f59e0b', caloriesPerMinute: 8, description: 'Light running', hypeEmoji: '🏃' },
  { id: 'running', name: 'Running', icon: Flame, color: '#ef4444', caloriesPerMinute: 11, description: 'Steady run', hypeEmoji: '🔥' },
  { id: 'interval', name: 'Intervals', icon: Target, color: '#8b5cf6', caloriesPerMinute: 10, description: 'Walk/run mix', hypeEmoji: '💪' },
  { id: 'free-cardio', name: 'Free Cardio', icon: Sparkles, color: '#06b6d4', caloriesPerMinute: 7, description: 'Any activity', hypeEmoji: '✨' },
];

// Goal types
type GoalType = 'free' | 'time' | 'milestones';
type MilestoneMode = 'manual' | 'auto';

interface WorkoutConfig {
  goalType: GoalType;
  targetTime?: number; // in seconds
  targetMilestones?: number;
  milestoneMode: MilestoneMode;
  autoMilestoneInterval?: number; // in seconds for auto mode
  intensity: 'easy' | 'moderate' | 'intense';
  voiceEnabled: boolean;
}

// Export for use in other components
export interface WorkoutPreset {
  id?: string;
  name: string;
  activityType: string;
  goalType: GoalType;
  targetTime?: number;
  targetMilestones?: number;
  milestoneMode: MilestoneMode;
  autoMilestoneInterval?: number;
  intensity: 'easy' | 'moderate' | 'intense';
}

interface GuidedCardioProps {
  onClose: () => void;
  onWorkoutComplete?: (data: WorkoutData) => void;
  onSavePreset?: (preset: WorkoutPreset) => void;
  initialPreset?: WorkoutPreset;
}

export interface WorkoutData {
  activityType: string;
  duration: number;
  milestones: number;
  calories: number;
  milestoneMode: MilestoneMode;
  autoMilestoneInterval?: number;
}

// HYPE coaching messages - high energy!
const coachingMessages = {
  start: [
    "LET'S GOOO! 🔥 Time to crush this workout!",
    "YEAH BABY! Your workout starts NOW!",
    "Game time! Let's make it HAPPEN!",
    "You showed up — that's already WINNING! Let's GO!",
  ],
  encouragement: [
    "You're absolutely KILLING IT right now! 💪",
    "UNSTOPPABLE! Keep that energy UP!",
    "Look at you GO! This is YOUR moment!",
    "Beast mode ACTIVATED! Keep pushing!",
    "You're on FIRE today! Don't stop now!",
    "This is what CHAMPIONS do! Keep moving!",
    "Every step is PROGRESS! You're amazing!",
    "CRUSHING IT! Your future self thanks you!",
  ],
  milestone: [
    "BOOM! 💥 Milestone SMASHED!",
    "YES! Another one DOWN! You're incredible!",
    "Checkpoint CRUSHED! Keep that momentum!",
    "LEGENDARY! You just hit a milestone!",
    "That's what I'm TALKING about! Milestone complete!",
  ],
  autoMilestone: [
    "DING DING! ⏰ Auto-checkpoint reached!",
    "Time milestone HIT! You're staying strong!",
    "Another interval DOWN! Keep it rolling!",
  ],
  speedUp: [
    "Let's PICK IT UP! You've got more in you!",
    "Time to turn up the HEAT! Push harder!",
    "Show me what you've GOT! Faster!",
  ],
  slowDown: [
    "Easy does it, champ! Find your groove.",
    "Catch that breath, you've EARNED it!",
    "Steady pace, you're still WINNING!",
  ],
  halfway: [
    "HALFWAY THERE! 🎯 You're doing AMAZING!",
    "50% DOWN! The finish line is calling!",
    "Half done, but FULLY committed! LET'S GO!",
  ],
  almostDone: [
    "FINAL STRETCH! 🏁 Give it EVERYTHING!",
    "Almost there! DIG DEEP! You've got this!",
    "The finish line is RIGHT THERE! PUSH!",
    "Last push! Make it COUNT!",
  ],
  complete: [
    "🎉 WORKOUT COMPLETE! You're a LEGEND!",
    "DONE! 🏆 You absolutely CRUSHED it!",
    "VICTORY! That was INCREDIBLE!",
    "YOU DID IT! Time to celebrate! 🥳",
  ],
};

export default function GuidedCardio({ onClose, onWorkoutComplete, onSavePreset, initialPreset }: GuidedCardioProps) {
  // Activity selection
  const [selectedActivity, setSelectedActivity] = useState<CardioType>(
    initialPreset ? cardioTypes.find(t => t.id === initialPreset.activityType) || cardioTypes[0] : cardioTypes[0]
  );
  const [showActivityPicker, setShowActivityPicker] = useState(false);
  
  // Workout configuration
  const [showConfig, setShowConfig] = useState(true);
  const [config, setConfig] = useState<WorkoutConfig>({
    goalType: initialPreset?.goalType || 'time',
    targetTime: initialPreset?.targetTime || 1200, // 20 minutes default
    targetMilestones: initialPreset?.targetMilestones || 5,
    milestoneMode: initialPreset?.milestoneMode || 'manual',
    autoMilestoneInterval: initialPreset?.autoMilestoneInterval || 180, // 3 minutes default
    intensity: initialPreset?.intensity || 'moderate',
    voiceEnabled: true,
  });
  
  // Preset save state
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');
  
  // Workout state
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [milestones, setMilestones] = useState(0);
  const [calories, setCalories] = useState(0);
  const [lastAutoMilestoneTime, setLastAutoMilestoneTime] = useState(0);
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [coachingMessage, setCoachingMessage] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showMilestoneFlash, setShowMilestoneFlash] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  
  // Coaching state
  const [lastCoachingTime, setLastCoachingTime] = useState(0);
  const [coachingInterval, setCoachingInterval] = useState(45); // seconds between coaching
  
  
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
  
  // Fire confetti for celebrations
  const fireConfetti = useCallback(() => {
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [selectedActivity.color, '#FFD700', '#FF69B4', '#00FF00']
      });
    }
  }, [selectedActivity.color]);

  // Trigger milestone flash animation
  const triggerMilestoneFlash = useCallback(() => {
    setShowMilestoneFlash(true);
    setTimeout(() => setShowMilestoneFlash(false), 1500);
  }, []);
  
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
        
        // Auto milestone check
        if (config.milestoneMode === 'auto' && config.autoMilestoneInterval) {
          const timeSinceLastAutoMilestone = newTime - lastAutoMilestoneTime;
          if (timeSinceLastAutoMilestone >= config.autoMilestoneInterval) {
            setMilestones(m => m + 1);
            setLastAutoMilestoneTime(newTime);
            setStreakCount(s => s + 1);
            triggerMilestoneFlash();
            showCoaching(getRandomMessage('autoMilestone'));
            setLastCoachingTime(newTime);
            
            // Small confetti for auto milestones
            if (typeof window !== 'undefined') {
              confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
            }
          }
        }
        
        // Time-based goal progress
        if (config.goalType === 'time' && config.targetTime) {
          const progress = newTime / config.targetTime;
          
          // Halfway coaching
          if (progress >= 0.5 && progress < 0.51) {
            showCoaching(getRandomMessage('halfway'));
            setLastCoachingTime(newTime);
            fireConfetti();
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
  }, [isWorkoutActive, isPaused, selectedActivity, config, lastCoachingTime, coachingInterval, showCoaching, lastAutoMilestoneTime, triggerMilestoneFlash, fireConfetti]);
  
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
    setLastAutoMilestoneTime(0);
    setStreakCount(0);
    
    // Adjust coaching interval based on intensity - more frequent for hype!
    setCoachingInterval(config.intensity === 'intense' ? 35 : config.intensity === 'easy' ? 60 : 45);
    
    // Initial coaching with energy!
    setTimeout(() => {
      showCoaching(getRandomMessage('start'));
      if (typeof window !== 'undefined') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }, 500);
  };
  
  // Complete milestone (manual)
  const completeMilestone = () => {
    const newCount = milestones + 1;
    setMilestones(newCount);
    setStreakCount(s => s + 1);
    triggerMilestoneFlash();
    
    // Fire confetti!
    fireConfetti();
    
    // Coaching for milestone
    if (config.goalType === 'milestones' && config.targetMilestones) {
      const remaining = config.targetMilestones - newCount;
      if (remaining === 1) {
        showCoaching("ONE MORE to go! You're almost a LEGEND! 🔥");
      } else if (remaining === 0) {
        // Will trigger completion via useEffect
      } else {
        showCoaching(`${getRandomMessage('milestone')} Only ${remaining} more!`);
      }
    } else {
      showCoaching(getRandomMessage('milestone'));
    }
  };
  
  // Save current config as preset
  const saveAsPreset = () => {
    if (!presetName.trim() || !onSavePreset) return;
    
    onSavePreset({
      name: presetName.trim(),
      activityType: selectedActivity.id,
      goalType: config.goalType,
      targetTime: config.targetTime,
      targetMilestones: config.targetMilestones,
      milestoneMode: config.milestoneMode,
      autoMilestoneInterval: config.autoMilestoneInterval,
      intensity: config.intensity,
    });
    
    setShowSavePreset(false);
    setPresetName('');
    showCoaching("Preset saved! 💾");
  };
  
  // Complete workout
  const completeWorkout = () => {
    setIsWorkoutActive(false);
    setIsPaused(false);
    showCoaching(getRandomMessage('complete'));
    setShowCompletionModal(true);
    
    // Big celebration confetti!
    if (typeof window !== 'undefined') {
      const duration = 3000;
      const end = Date.now() + duration;
      const colors = [selectedActivity.color, '#FFD700', '#FF69B4', '#00FF00', '#00BFFF'];
      
      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
    
    if (onWorkoutComplete) {
      onWorkoutComplete({
        activityType: selectedActivity.name,
        duration: workoutTime,
        milestones,
        calories: Math.round(calories),
        milestoneMode: config.milestoneMode,
        autoMilestoneInterval: config.autoMilestoneInterval,
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
            <div className="space-y-4">
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
              </div>
            </div>
          )}

          {/* Milestone Mode - Manual vs Auto */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <MapPin className="w-4 h-4 inline mr-1" />
              Checkpoint Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfig({ ...config, milestoneMode: 'manual' })}
                className={`p-4 rounded-xl transition-all ${
                  config.milestoneMode === 'manual'
                    ? 'bg-purple-500/20 border-2 border-purple-500 text-white'
                    : 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Hand className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Manual</div>
                <div className="text-xs text-gray-400">Tap to mark</div>
              </button>
              <button
                onClick={() => setConfig({ ...config, milestoneMode: 'auto' })}
                className={`p-4 rounded-xl transition-all ${
                  config.milestoneMode === 'auto'
                    ? 'bg-cyan-500/20 border-2 border-cyan-500 text-white'
                    : 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Timer className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Auto</div>
                <div className="text-xs text-gray-400">Timed intervals</div>
              </button>
            </div>
            
            {config.milestoneMode === 'manual' && (
              <p className="text-xs text-gray-400 mt-3 flex items-start gap-2">
                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                Tap the milestone button when you pass landmarks, complete loops, or hit personal goals!
              </p>
            )}
            
            {config.milestoneMode === 'auto' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto checkpoint every: {Math.floor((config.autoMilestoneInterval || 180) / 60)} min
                </label>
                <input
                  type="range"
                  min="60"
                  max="600"
                  step="30"
                  value={config.autoMilestoneInterval || 180}
                  onChange={(e) => setConfig({ ...config, autoMilestoneInterval: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 min</span>
                  <span>5 min</span>
                  <span>10 min</span>
                </div>
              </div>
            )}
          </div>
          
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
          
          {/* Save as Preset */}
          {onSavePreset && (
            <div className="pt-2">
              {!showSavePreset ? (
                <button
                  onClick={() => setShowSavePreset(true)}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-medium transition-all border border-gray-600"
                >
                  <Star className="w-5 h-5 inline mr-2" />
                  Save as Preset
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Preset name..."
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={saveAsPreset}
                    disabled={!presetName.trim()}
                    className="px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowSavePreset(false)}
                    className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={startWorkout}
            className="w-full py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-xl transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Rocket className="w-6 h-6 inline mr-2" />
            LET'S GO! 🔥
          </button>
        </div>
      )}
      
      {/* Active Workout Screen */}
      {!showConfig && (
        <div className="p-6 relative overflow-hidden">
          {/* Milestone Flash Overlay */}
          {showMilestoneFlash && (
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/30 via-transparent to-transparent animate-pulse z-10 pointer-events-none" />
          )}
          
          {/* Activity & Mode Indicator */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="px-4 py-2 rounded-full flex items-center gap-2"
              style={{ backgroundColor: `${selectedActivity.color}20` }}
            >
              <selectedActivity.icon className="w-5 h-5" style={{ color: selectedActivity.color }} />
              <span className="text-white font-medium">{selectedActivity.name}</span>
              <span className="text-2xl">{selectedActivity.hypeEmoji}</span>
            </div>
            {config.milestoneMode === 'auto' && (
              <div className="px-3 py-2 bg-cyan-500/20 rounded-full flex items-center gap-1">
                <Timer className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm">Auto</span>
              </div>
            )}
          </div>

          {/* Progress Ring */}
          <div className="relative flex flex-col items-center justify-center mb-6">
            <div className="relative w-52 h-52">
              {/* Outer glow */}
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-30"
                style={{ backgroundColor: selectedActivity.color }}
              />
              
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90 relative z-10">
                <circle
                  cx="104"
                  cy="104"
                  r="92"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-gray-700"
                />
                {/* Progress circle */}
                {config.goalType !== 'free' && (
                  <circle
                    cx="104"
                    cy="104"
                    r="92"
                    stroke={selectedActivity.color}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={578}
                    strokeDashoffset={578 - (578 * getProgress()) / 100}
                    className="transition-all duration-500"
                    style={{ filter: `drop-shadow(0 0 8px ${selectedActivity.color})` }}
                  />
                )}
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="text-5xl font-mono font-bold text-white tracking-tight">
                  {formatTime(workoutTime)}
                </div>
                {getTimeRemaining() !== null && (
                  <div className="text-sm text-gray-400 mt-1">
                    {formatTime(getTimeRemaining()!)} left
                  </div>
                )}
                {config.milestoneMode === 'auto' && config.autoMilestoneInterval && (
                  <div className="text-xs text-cyan-400 mt-2 flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    Next in {formatTime(config.autoMilestoneInterval - ((workoutTime - lastAutoMilestoneTime) % config.autoMilestoneInterval))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Coaching Message */}
          {coachingMessage && (
            <div className="mb-6">
              <div 
                className="bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 border-2 border-purple-500/50 rounded-2xl px-6 py-5 text-center animate-bounce"
                style={{ animationDuration: '2s' }}
              >
                <p className="text-white text-xl font-bold">{coachingMessage}</p>
              </div>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-center border border-gray-700">
              <div className="text-3xl font-bold" style={{ color: selectedActivity.color }}>
                {milestones}
              </div>
              <div className="text-xs text-gray-400">
                {config.goalType === 'milestones' ? `/ ${config.targetMilestones}` : ''} Checkpoints
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-center border border-gray-700">
              <div className="text-3xl font-bold text-orange-400">
                {Math.round(calories)}
              </div>
              <div className="text-xs text-gray-400">🔥 Calories</div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-center border border-gray-700">
              <div className="text-3xl font-bold text-blue-400">
                {streakCount > 0 ? `${streakCount}🔥` : `${Math.round(getProgress())}%`}
              </div>
              <div className="text-xs text-gray-400">{streakCount > 0 ? 'Streak' : 'Progress'}</div>
            </div>
          </div>
          
          {/* Milestone Button - Only show for manual mode */}
          {config.milestoneMode === 'manual' && (
            <button
              onClick={completeMilestone}
              disabled={isPaused}
              className="w-full py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold text-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 mb-4 hover:scale-[1.02] active:scale-[0.98]"
            >
              <PartyPopper className="w-6 h-6 inline mr-2" />
              CHECKPOINT! 🎯 #{milestones + 1}
            </button>
          )}
          
          {/* Auto mode indicator */}
          {config.milestoneMode === 'auto' && (
            <div className="w-full py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 text-cyan-400 rounded-xl font-medium text-center mb-4">
              <Timer className="w-5 h-5 inline mr-2" />
              Auto-checkpoints every {Math.floor((config.autoMilestoneInterval || 180) / 60)} min
            </div>
          )}
          
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

