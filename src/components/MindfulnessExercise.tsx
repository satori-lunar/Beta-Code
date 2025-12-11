import { useState, useEffect, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  Sparkles,
  Check,
  ChevronRight,
  Brain,
  Wind,
  Sun,
  Moon
} from 'lucide-react';

type ExerciseType = 'breathing' | 'bodyscan' | 'gratitude' | 'meditation';

interface MindfulnessExerciseProps {
  type: ExerciseType;
  onClose: () => void;
  onComplete?: () => void;
}

// Breathing patterns
const breathingPatterns = {
  relaxing: { inhale: 4, hold: 4, exhale: 6, name: '4-4-6 Relaxing' },
  balanced: { inhale: 4, hold: 4, exhale: 4, name: '4-4-4 Box Breathing' },
  energizing: { inhale: 4, hold: 2, exhale: 4, name: '4-2-4 Energizing' },
};

// Body scan regions
const bodyScanRegions = [
  { name: 'Head & Face', instruction: 'Notice any tension in your forehead, eyes, jaw. Let it soften.', duration: 20 },
  { name: 'Neck & Shoulders', instruction: 'Feel the weight of your shoulders. Let them drop and relax.', duration: 20 },
  { name: 'Arms & Hands', instruction: 'Scan from shoulders to fingertips. Release any grip or tension.', duration: 20 },
  { name: 'Chest & Heart', instruction: 'Notice your heartbeat. Feel your chest rise and fall with each breath.', duration: 25 },
  { name: 'Stomach & Core', instruction: 'Let your belly be soft. Release any holding in your core.', duration: 20 },
  { name: 'Lower Back & Hips', instruction: 'Feel where your body meets the surface. Let your hips be heavy.', duration: 20 },
  { name: 'Legs & Feet', instruction: 'Scan down through your thighs, knees, calves. Feel your feet grounded.', duration: 25 },
  { name: 'Whole Body', instruction: 'Now feel your entire body as one. Breathing, relaxed, present.', duration: 30 },
];

// Gratitude prompts
const gratitudePrompts = [
  "What's something small that brought you joy today?",
  "Who is someone you're grateful to have in your life?",
  "What's a challenge that helped you grow?",
  "What's something about your body you appreciate?",
  "What's a simple pleasure you often take for granted?",
  "What's a skill or ability you're thankful for?",
];

export default function MindfulnessExercise({ type, onClose, onComplete }: MindfulnessExerciseProps) {
  // Common state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showComplete, setShowComplete] = useState(false);

  // Breathing state
  const [breathPattern, setBreathPattern] = useState<keyof typeof breathingPatterns>('balanced');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [targetCycles] = useState(5);

  // Body scan state
  const [currentRegion, setCurrentRegion] = useState(0);
  const [regionTimer, setRegionTimer] = useState(0);

  // Gratitude state
  const [gratitudeEntries, setGratitudeEntries] = useState<string[]>(['', '', '']);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Meditation state
  const [meditationTime, setMeditationTime] = useState(0);
  const [targetMeditationTime] = useState(300); // 5 minutes

  // Speech synthesis
  const speak = useCallback((text: string) => {
    if (!audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }, [audioEnabled]);

  // Breathing logic
  useEffect(() => {
    if (type !== 'breathing' || !isActive || isPaused) return;

    const pattern = breathingPatterns[breathPattern];
    const phaseDuration = breathPhase === 'inhale' ? pattern.inhale : 
                          breathPhase === 'hold' ? pattern.hold : pattern.exhale;

    const interval = setInterval(() => {
      setBreathTimer(prev => {
        if (prev >= phaseDuration) {
          // Move to next phase
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            speak('Hold');
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            speak('Exhale');
          } else {
            setBreathPhase('inhale');
            setCycleCount(c => {
              const newCount = c + 1;
              if (newCount >= targetCycles) {
                setShowComplete(true);
                setIsActive(false);
                speak('Well done. You completed your breathing exercise.');
              } else {
                speak('Inhale');
              }
              return newCount;
            });
          }
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [type, isActive, isPaused, breathPhase, breathPattern, speak, targetCycles]);

  // Body scan logic
  useEffect(() => {
    if (type !== 'bodyscan' || !isActive || isPaused) return;

    const region = bodyScanRegions[currentRegion];

    const interval = setInterval(() => {
      setRegionTimer(prev => {
        if (prev >= region.duration) {
          // Move to next region
          if (currentRegion >= bodyScanRegions.length - 1) {
            setShowComplete(true);
            setIsActive(false);
            speak('Body scan complete. Take a moment to appreciate this feeling of relaxation.');
          } else {
            setCurrentRegion(r => r + 1);
            const nextRegion = bodyScanRegions[currentRegion + 1];
            speak(nextRegion.name + '. ' + nextRegion.instruction);
          }
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [type, isActive, isPaused, currentRegion, speak]);

  // Meditation timer
  useEffect(() => {
    if (type !== 'meditation' || !isActive || isPaused) return;

    const interval = setInterval(() => {
      setMeditationTime(prev => {
        if (prev >= targetMeditationTime) {
          setShowComplete(true);
          setIsActive(false);
          speak('Your meditation session is complete. Slowly bring your awareness back.');
          return prev;
        }
        // Gentle reminder at intervals
        if (prev === 60) speak('One minute. You\'re doing great.');
        if (prev === 180) speak('Three minutes. Stay present.');
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [type, isActive, isPaused, targetMeditationTime, speak]);

  // Start exercise
  const startExercise = () => {
    setIsActive(true);
    setIsPaused(false);
    
    if (type === 'breathing') {
      setBreathPhase('inhale');
      setBreathTimer(0);
      setCycleCount(0);
      speak('Let\'s begin. Inhale deeply.');
    } else if (type === 'bodyscan') {
      setCurrentRegion(0);
      setRegionTimer(0);
      const firstRegion = bodyScanRegions[0];
      speak('Find a comfortable position. We\'ll start with your ' + firstRegion.name + '. ' + firstRegion.instruction);
    } else if (type === 'meditation') {
      setMeditationTime(0);
      speak('Find a comfortable position. Close your eyes and focus on your breath.');
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate breathing circle scale
  const getBreathingScale = () => {
    const pattern = breathingPatterns[breathPattern];
    const phaseDuration = breathPhase === 'inhale' ? pattern.inhale : 
                          breathPhase === 'hold' ? pattern.hold : pattern.exhale;
    const progress = breathTimer / phaseDuration;
    
    if (breathPhase === 'inhale') return 1 + progress * 0.5;
    if (breathPhase === 'hold') return 1.5;
    return 1.5 - progress * 0.5;
  };

  // Handle gratitude submit
  const handleGratitudeSubmit = () => {
    const filledEntries = gratitudeEntries.filter(e => e.trim().length > 0);
    if (filledEntries.length >= 1) {
      setShowComplete(true);
      speak('Wonderful. Carrying gratitude with you can brighten your whole day.');
    }
  };

  // Get exercise title and description
  const getExerciseInfo = () => {
    switch (type) {
      case 'breathing':
        return { 
          title: 'Deep Breathing', 
          icon: Wind,
          color: '#8b5cf6',
          description: 'Follow the circle to regulate your breath and calm your nervous system.'
        };
      case 'bodyscan':
        return { 
          title: 'Body Scan', 
          icon: Brain,
          color: '#06b6d4',
          description: 'Progressively relax each part of your body to release tension.'
        };
      case 'gratitude':
        return { 
          title: 'Gratitude Practice', 
          icon: Heart,
          color: '#f59e0b',
          description: 'Reflect on things you\'re grateful for to boost your mood.'
        };
      case 'meditation':
        return { 
          title: 'Guided Meditation', 
          icon: Moon,
          color: '#22c55e',
          description: 'A quiet space to focus your mind and find inner peace.'
        };
    }
  };

  const info = getExerciseInfo();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${info.color}20` }}
            >
              <info.icon className="w-5 h-5" style={{ color: info.color }} />
            </div>
            <h2 className="text-xl font-bold text-white">{info.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-700 hover:bg-red-500 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Completion Screen */}
          {showComplete ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Well Done! ✨</h3>
              <p className="text-gray-400 mb-6">You completed your {info.title.toLowerCase()} exercise.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowComplete(false);
                    setIsActive(false);
                  }}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    onComplete?.();
                    onClose();
                  }}
                  className="flex-1 py-3 text-white rounded-xl font-medium transition-colors"
                  style={{ backgroundColor: info.color }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Breathing Exercise */}
              {type === 'breathing' && (
                <div className="space-y-6">
                  {!isActive ? (
                    <>
                      <p className="text-gray-400 text-center">{info.description}</p>
                      
                      {/* Pattern Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">Breathing Pattern</label>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(breathingPatterns).map(([key, pattern]) => (
                            <button
                              key={key}
                              onClick={() => setBreathPattern(key as keyof typeof breathingPatterns)}
                              className={`p-3 rounded-xl text-sm transition-all ${
                                breathPattern === key
                                  ? 'bg-purple-500/20 border-2 border-purple-500 text-white'
                                  : 'bg-gray-700 border-2 border-transparent text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {pattern.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={startExercise}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg"
                      >
                        <Play className="w-5 h-5 inline mr-2" />
                        Begin Breathing
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Breathing Circle */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                          <div
                            className="absolute rounded-full transition-all duration-500"
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: `${info.color}30`,
                              transform: `scale(${getBreathingScale()})`,
                            }}
                          />
                          <div className="relative text-center z-10">
                            <div className="text-3xl font-bold text-white capitalize mb-1">
                              {breathPhase}
                            </div>
                            <div className="text-gray-400">
                              Cycle {cycleCount + 1} of {targetCycles}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setIsPaused(!isPaused)}
                          className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                        >
                          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                        </button>
                        <button
                          onClick={() => {
                            setIsActive(false);
                            setCycleCount(0);
                          }}
                          className="p-4 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-colors"
                        >
                          <RotateCcw className="w-6 h-6" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Body Scan Exercise */}
              {type === 'bodyscan' && (
                <div className="space-y-6">
                  {!isActive ? (
                    <>
                      <p className="text-gray-400 text-center">{info.description}</p>
                      <div className="bg-gray-800 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-2">Duration</div>
                        <div className="text-2xl font-bold text-white">~3 minutes</div>
                        <div className="text-sm text-gray-500">{bodyScanRegions.length} body regions</div>
                      </div>
                      <button
                        onClick={startExercise}
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold text-lg"
                      >
                        <Play className="w-5 h-5 inline mr-2" />
                        Begin Body Scan
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Progress */}
                      <div className="flex gap-1 mb-4">
                        {bodyScanRegions.map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-2 rounded-full transition-colors ${
                              i < currentRegion ? 'bg-cyan-500' : 
                              i === currentRegion ? 'bg-cyan-400' : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Current Region */}
                      <div className="bg-gray-800 rounded-xl p-6 text-center">
                        <div className="text-cyan-400 text-sm font-medium mb-2">
                          Focus on your
                        </div>
                        <div className="text-2xl font-bold text-white mb-3">
                          {bodyScanRegions[currentRegion].name}
                        </div>
                        <p className="text-gray-400">
                          {bodyScanRegions[currentRegion].instruction}
                        </p>
                        <div className="mt-4 text-sm text-gray-500">
                          {regionTimer}s / {bodyScanRegions[currentRegion].duration}s
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setIsPaused(!isPaused)}
                          className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                        >
                          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                        </button>
                        <button
                          onClick={() => {
                            if (currentRegion < bodyScanRegions.length - 1) {
                              setCurrentRegion(r => r + 1);
                              setRegionTimer(0);
                            }
                          }}
                          className="p-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Gratitude Exercise */}
              {type === 'gratitude' && (
                <div className="space-y-6">
                  <p className="text-gray-400 text-center">{info.description}</p>
                  
                  {/* Prompt */}
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="w-5 h-5 text-amber-400" />
                      <span className="text-amber-400 font-medium">Today's Prompt</span>
                    </div>
                    <p className="text-white text-lg italic">"{gratitudePrompts[currentPromptIndex]}"</p>
                    <button
                      onClick={() => setCurrentPromptIndex((currentPromptIndex + 1) % gratitudePrompts.length)}
                      className="mt-2 text-sm text-amber-400 hover:text-amber-300"
                    >
                      Try another prompt →
                    </button>
                  </div>

                  {/* Entries */}
                  <div className="space-y-3">
                    {gratitudeEntries.map((entry, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-amber-400 font-bold">{i + 1}</span>
                        </div>
                        <textarea
                          value={entry}
                          onChange={(e) => {
                            const newEntries = [...gratitudeEntries];
                            newEntries[i] = e.target.value;
                            setGratitudeEntries(newEntries);
                          }}
                          placeholder={`I'm grateful for...`}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleGratitudeSubmit}
                    disabled={gratitudeEntries.every(e => !e.trim())}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold text-lg transition-colors"
                  >
                    <Check className="w-5 h-5 inline mr-2" />
                    Save Gratitude
                  </button>
                </div>
              )}

              {/* Meditation Exercise */}
              {type === 'meditation' && (
                <div className="space-y-6">
                  {!isActive ? (
                    <>
                      <p className="text-gray-400 text-center">{info.description}</p>
                      <div className="bg-gray-800 rounded-xl p-4 text-center">
                        <div className="text-sm text-gray-400 mb-2">Session Length</div>
                        <div className="text-3xl font-bold text-white">5 minutes</div>
                      </div>
                      <button
                        onClick={startExercise}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg"
                      >
                        <Play className="w-5 h-5 inline mr-2" />
                        Begin Meditation
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Timer Circle */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-48 h-48">
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
                            <circle
                              cx="96"
                              cy="96"
                              r="88"
                              stroke={info.color}
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={553}
                              strokeDashoffset={553 - (553 * meditationTime) / targetMeditationTime}
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-4xl font-mono font-bold text-white">
                              {formatTime(meditationTime)}
                            </div>
                            <div className="text-sm text-gray-400">
                              of {formatTime(targetMeditationTime)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Guidance */}
                      <div className="text-center text-gray-400 italic">
                        "Focus on your breath. Let thoughts pass like clouds."
                      </div>

                      {/* Controls */}
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setIsPaused(!isPaused)}
                          className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                        >
                          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                        </button>
                        <button
                          onClick={() => {
                            setShowComplete(true);
                            setIsActive(false);
                          }}
                          className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                        >
                          <Check className="w-6 h-6" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

