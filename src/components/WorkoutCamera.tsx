import { useState, useRef, useEffect, useCallback } from 'react';
import {
  CameraOff,
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
  TrendingUp,
  ChevronDown,
  Check,
  Zap,
  Heart,
  Footprints,
  Dumbbell,
  PersonStanding
} from 'lucide-react';

interface WorkoutType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  countLabel: string;
  countUnit: string;
  caloriesPerUnit: number;
}

const workoutTypes: WorkoutType[] = [
  { id: 'running', name: 'Running', icon: PersonStanding, color: '#22c55e', countLabel: 'Laps', countUnit: 'laps', caloriesPerUnit: 50 },
  { id: 'jumping-jacks', name: 'Jumping Jacks', icon: Zap, color: '#f59e0b', countLabel: 'Reps', countUnit: 'reps', caloriesPerUnit: 0.2 },
  { id: 'squats', name: 'Squats', icon: TrendingUp, color: '#8b5cf6', countLabel: 'Reps', countUnit: 'reps', caloriesPerUnit: 0.5 },
  { id: 'pushups', name: 'Push-ups', icon: Dumbbell, color: '#ef4444', countLabel: 'Reps', countUnit: 'reps', caloriesPerUnit: 0.4 },
  { id: 'burpees', name: 'Burpees', icon: Flame, color: '#ec4899', countLabel: 'Reps', countUnit: 'reps', caloriesPerUnit: 1.0 },
  { id: 'lunges', name: 'Lunges', icon: Footprints, color: '#06b6d4', countLabel: 'Reps', countUnit: 'reps', caloriesPerUnit: 0.3 },
  { id: 'plank', name: 'Plank', icon: Target, color: '#6366f1', countLabel: 'Time', countUnit: 'sec', caloriesPerUnit: 0.1 },
  { id: 'custom', name: 'Custom', icon: Heart, color: '#78716c', countLabel: 'Reps', countUnit: 'reps', caloriesPerUnit: 0.3 },
];

interface RunConfig {
  type: 'laps' | 'time' | 'distance';
  targetLaps?: number;
  targetTime?: number;
  targetDistance?: number;
  lapDistance?: number;
  targetPace?: number; // seconds per lap
}

interface WorkoutCameraProps {
  onClose: () => void;
  onWorkoutComplete?: (data: WorkoutData) => void;
}

interface WorkoutData {
  workoutType: string;
  duration: number;
  count: number;
  calories: number;
}

export default function WorkoutCamera({ onClose, onWorkoutComplete }: WorkoutCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutType>(workoutTypes[0]);
  const [showWorkoutPicker, setShowWorkoutPicker] = useState(false);
  
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [count, setCount] = useState(0);
  const [calories, setCalories] = useState(0);
  
  const [motionDetected, setMotionDetected] = useState(false);
  
  // Running-specific states
  const [showRunConfig, setShowRunConfig] = useState(false);
  const [runConfig, setRunConfig] = useState<RunConfig | null>(null);
  const [currentPace, setCurrentPace] = useState(0);
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);
  const [coachingMessage, setCoachingMessage] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Speech synthesis
  const speak = (text: string) => {
    if (!audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };
  
  // Previous frame for motion detection
  const prevFrameRef = useRef<ImageData | null>(null);
  const motionThreshold = 30;
  const motionCountRef = useRef(0);
  const lastCountTimeRef = useRef(0);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions.'
          : 'Unable to access camera. Please check your device.'
      );
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Motion detection
  const detectMotion = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isWorkoutActive || isPaused) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 160;
    canvas.height = 120;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    if (prevFrameRef.current) {
      let motionPixels = 0;
      const data1 = prevFrameRef.current.data;
      const data2 = currentFrame.data;
      
      for (let i = 0; i < data1.length; i += 4) {
        const diff = Math.abs(data1[i] - data2[i]) + 
                     Math.abs(data1[i + 1] - data2[i + 1]) + 
                     Math.abs(data1[i + 2] - data2[i + 2]);
        if (diff > motionThreshold) {
          motionPixels++;
        }
      }
      
      const motionPercentage = (motionPixels / (data1.length / 4)) * 100;
      const hasMotion = motionPercentage > 5;
      setMotionDetected(hasMotion);
      
      // Simple rep counting based on motion patterns
      const now = Date.now();
      if (hasMotion && motionPercentage > 15) {
        motionCountRef.current++;
        
        // Count a rep when motion spike detected (with cooldown)
        if (motionCountRef.current > 3 && now - lastCountTimeRef.current > 800) {
          if (selectedWorkout.id !== 'plank') {
            setCount(prev => prev + 1);
            setCalories(prev => prev + selectedWorkout.caloriesPerUnit);
          }
          motionCountRef.current = 0;
          lastCountTimeRef.current = now;
        }
      } else {
        motionCountRef.current = Math.max(0, motionCountRef.current - 1);
      }
    }
    
    prevFrameRef.current = currentFrame;
  }, [isWorkoutActive, isPaused, selectedWorkout]);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Motion detection loop
  useEffect(() => {
    if (!cameraActive || !isWorkoutActive || isPaused) return;
    
    const interval = setInterval(detectMotion, 100);
    return () => clearInterval(interval);
  }, [cameraActive, isWorkoutActive, isPaused, detectMotion]);

  // Workout timer
  useEffect(() => {
    if (!isWorkoutActive || isPaused) return;
    
    const interval = setInterval(() => {
      setWorkoutTime(prev => prev + 1);
      
      // For plank, count seconds and calories
      if (selectedWorkout.id === 'plank') {
        setCount(prev => prev + 1);
        setCalories(prev => prev + selectedWorkout.caloriesPerUnit);
      }
      
      // Running coaching
      if (selectedWorkout.id === 'running' && runConfig) {
        const elapsed = workoutTime + 1;
        
        // Calculate current pace if we have lap times
        if (lapTimes.length > 0 && runConfig.targetPace) {
          const avgPace = lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length;
          setCurrentPace(avgPace);
          
          const paceVariance = avgPace - runConfig.targetPace;
          
          // Provide coaching every 30 seconds
          if (elapsed % 30 === 0) {
            if (paceVariance > 10) {
              setCoachingMessage('Speed up! 🏃');
              speak('Speed up');
            } else if (paceVariance < -10) {
              setCoachingMessage('Slow down! 🐢');
              speak('Slow down');
            } else {
              setCoachingMessage('Great pace! 💪');
              speak('Great pace');
            }
            
            setTimeout(() => setCoachingMessage(''), 5000);
          }
        }
        
        // Check if target reached
        if (runConfig.type === 'time' && runConfig.targetTime && elapsed >= runConfig.targetTime) {
          stopWorkout();
          speak('Workout complete! Great job!');
        } else if (runConfig.type === 'laps' && runConfig.targetLaps && count >= runConfig.targetLaps) {
          stopWorkout();
          speak('All laps completed! Great job!');
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isWorkoutActive, isPaused, selectedWorkout, workoutTime, runConfig, lapTimes, count]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start workout
  const startWorkout = () => {
    // For running, show config first
    if (selectedWorkout.id === 'running' && !runConfig) {
      setShowRunConfig(true);
      return;
    }
    
    setIsWorkoutActive(true);
    setIsPaused(false);
    setWorkoutTime(0);
    setCount(0);
    setCalories(0);
    setLapTimes([]);
    setLastLapTime(0);
    setCurrentPace(0);
    setCoachingMessage('');
    prevFrameRef.current = null;
    motionCountRef.current = 0;
    lastCountTimeRef.current = 0;
    
    if (selectedWorkout.id === 'running') {
      speak('Workout starting. Good luck!');
    }
  };
  
  // Complete a lap (for running)
  const completeLap = () => {
    const lapTime = workoutTime - lastLapTime;
    setLapTimes(prev => [...prev, lapTime]);
    setLastLapTime(workoutTime);
    setCount(prev => prev + 1);
    setCalories(prev => prev + selectedWorkout.caloriesPerUnit);
    
    // Announce lap
    speak(`Lap ${count + 1} complete. Time: ${Math.floor(lapTime / 60)} minutes ${lapTime % 60} seconds`);
    
    // Show lap time briefly
    setCoachingMessage(`Lap ${count + 1}: ${Math.floor(lapTime / 60)}:${(lapTime % 60).toString().padStart(2, '0')}`);
    setTimeout(() => setCoachingMessage(''), 5000);
  };

  // Stop workout
  const stopWorkout = () => {
    setIsWorkoutActive(false);
    setIsPaused(false);
    
    if (onWorkoutComplete && workoutTime > 0) {
      onWorkoutComplete({
        workoutType: selectedWorkout.name,
        duration: workoutTime,
        count,
        calories: Math.round(calories)
      });
    }
  };

  // Manual count adjustment
  const adjustCount = (delta: number) => {
    setCount(prev => Math.max(0, prev + delta));
    if (delta > 0) {
      setCalories(prev => prev + selectedWorkout.caloriesPerUnit);
    } else {
      setCalories(prev => Math.max(0, prev - selectedWorkout.caloriesPerUnit));
    }
  };

  return (
    <div className={`bg-gray-900 rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      {/* Camera View */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover mirror"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {/* Hidden canvas for motion detection */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Camera error overlay */}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white p-6">
            <CameraOff className="w-16 h-16 mb-4 text-gray-400" />
            <p className="text-center text-gray-300 mb-4">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Camera loading */}
        {!cameraActive && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-white">Starting camera...</p>
          </div>
        )}
        
        {/* Motion indicator */}
        {cameraActive && isWorkoutActive && (
          <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
            motionDetected ? 'bg-green-500' : 'bg-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${motionDetected ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-white text-sm font-medium">
              {motionDetected ? 'Motion Detected' : 'Waiting...'}
            </span>
          </div>
        )}
        
        {/* Top controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-red-500/70 rounded-full text-white transition-colors"
          >
            <CameraOff className="w-5 h-5" />
          </button>
        </div>
        
        {/* Coaching message overlay */}
        {coachingMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2">
            <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <p className="text-white text-lg font-bold">{coachingMessage}</p>
            </div>
          </div>
        )}
        
        {/* Workout stats overlay */}
        {isWorkoutActive && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4">
              {selectedWorkout.id === 'running' && runConfig ? (
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-white">{formatTime(workoutTime)}</div>
                    <div className="text-xs text-gray-400">Time</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold" style={{ color: selectedWorkout.color }}>
                      {count}/{runConfig.targetLaps || '∞'}
                    </div>
                    <div className="text-xs text-gray-400">Laps</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400">
                      {currentPace > 0 ? `${Math.floor(currentPace / 60)}:${(currentPace % 60).toString().padStart(2, '0')}` : '--:--'}
                    </div>
                    <div className="text-xs text-gray-400">Pace/Lap</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-400">{Math.round(calories)}</div>
                    <div className="text-xs text-gray-400">Calories</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-white">{formatTime(workoutTime)}</div>
                    <div className="text-xs text-gray-400">Duration</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold" style={{ color: selectedWorkout.color }}>{count}</div>
                    <div className="text-xs text-gray-400">{selectedWorkout.countLabel}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-400">{Math.round(calories)}</div>
                    <div className="text-xs text-gray-400">Calories</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="p-4 bg-gray-800">
        {/* Workout type selector */}
        <div className="mb-4">
          <div className="relative">
            <button
              onClick={() => setShowWorkoutPicker(!showWorkoutPicker)}
              disabled={isWorkoutActive}
              className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${selectedWorkout.color}20` }}
                >
                  <selectedWorkout.icon className="w-5 h-5" style={{ color: selectedWorkout.color }} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{selectedWorkout.name}</div>
                  <div className="text-xs text-gray-400">Tracking: {selectedWorkout.countLabel}</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showWorkoutPicker ? 'rotate-180' : ''}`} />
            </button>
            
            {showWorkoutPicker && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-700 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
                {workoutTypes.map(workout => (
                  <button
                    key={workout.id}
                    onClick={() => {
                      setSelectedWorkout(workout);
                      setShowWorkoutPicker(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-600 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${workout.color}20` }}
                    >
                      <workout.icon className="w-4 h-4" style={{ color: workout.color }} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium">{workout.name}</div>
                      <div className="text-xs text-gray-400">{workout.countLabel} • {workout.caloriesPerUnit} cal/{workout.countUnit}</div>
                    </div>
                    {selectedWorkout.id === workout.id && (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Main controls */}
        <div className="flex items-center justify-center gap-4">
          {!isWorkoutActive ? (
            <button
              onClick={startWorkout}
              disabled={!cameraActive}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Workout
            </button>
          ) : (
            <>
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
                onClick={() => {
                  setWorkoutTime(0);
                  setCount(0);
                  setCalories(0);
                }}
                className="p-4 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
        
        {/* Running-specific controls */}
        {isWorkoutActive && selectedWorkout.id === 'running' && (
          <div className="mt-4">
            <button
              onClick={completeLap}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors text-lg"
            >
              ✓ Complete Lap {count + 1}
            </button>
          </div>
        )}
        
        {/* Manual count adjustment for non-running workouts */}
        {isWorkoutActive && selectedWorkout.id !== 'plank' && selectedWorkout.id !== 'running' && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-gray-400 text-sm">Manual adjust:</span>
            <button
              onClick={() => adjustCount(-1)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              -1
            </button>
            <button
              onClick={() => adjustCount(1)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              +1
            </button>
            <button
              onClick={() => adjustCount(5)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              +5
            </button>
          </div>
        )}
        
        {/* Tips */}
        <div className="mt-4 p-3 bg-gray-700/50 rounded-xl">
          <p className="text-sm text-gray-400 text-center">
            {selectedWorkout.id === 'running' 
              ? '🏃 Press "Complete Lap" button each time you finish a lap. Voice coaching will guide your pace!'
              : selectedWorkout.id === 'plank'
              ? '🧘 Hold your plank position. Time is automatically tracked.'
              : `💪 Motion detection will auto-count ${selectedWorkout.countLabel.toLowerCase()}. Use manual buttons if needed.`
            }
          </p>
        </div>
      </div>
      
      {/* Running Configuration Modal */}
      {showRunConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Setup Your Run</h3>
            
            <div className="space-y-4">
              {/* Run type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Run Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRunConfig({ type: 'laps', targetLaps: 4, lapDistance: 400, targetPace: 120 })}
                    className="p-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  >
                    <div className="text-lg font-bold">🏃 Laps</div>
                    <div className="text-xs text-gray-400">Set number of laps</div>
                  </button>
                  <button
                    onClick={() => setRunConfig({ type: 'time', targetTime: 1200, targetPace: 120 })}
                    className="p-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  >
                    <div className="text-lg font-bold">⏱️ Time</div>
                    <div className="text-xs text-gray-400">Run for set time</div>
                  </button>
                </div>
              </div>
              
              {runConfig && (
                <>
                  {/* Target laps */}
                  {runConfig.type === 'laps' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Number of Laps: {runConfig.targetLaps}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={runConfig.targetLaps || 4}
                        onChange={(e) => setRunConfig({ ...runConfig, targetLaps: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  {/* Target time */}
                  {runConfig.type === 'time' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duration: {Math.floor((runConfig.targetTime || 0) / 60)} minutes
                      </label>
                      <input
                        type="range"
                        min="300"
                        max="3600"
                        step="300"
                        value={runConfig.targetTime || 1200}
                        onChange={(e) => setRunConfig({ ...runConfig, targetTime: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  {/* Target pace */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Pace: {Math.floor((runConfig.targetPace || 120) / 60)}:{((runConfig.targetPace || 120) % 60).toString().padStart(2, '0')}/lap
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="300"
                      step="15"
                      value={runConfig.targetPace || 120}
                      onChange={(e) => setRunConfig({ ...runConfig, targetPace: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Fast (1:00)</span>
                      <span>Moderate (2:00)</span>
                      <span>Easy (5:00)</span>
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowRunConfig(false);
                        setRunConfig(null);
                      }}
                      className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowRunConfig(false);
                        startWorkout();
                      }}
                      className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                    >
                      Start Run
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

