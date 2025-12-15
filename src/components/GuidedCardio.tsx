import { useState, useEffect, useCallback, useRef } from 'react';
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
  Rocket,
  Navigation,
  Gauge,
  Route,
  MapPinned,
  AlertCircle,
  Video,
  Camera,
  Music
} from 'lucide-react';
import confetti from 'canvas-confetti';
import WorkoutMap from './WorkoutMap';

// GPS Coordinate type
interface GpsCoordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
  speed: number | null;
}

// Haversine formula to calculate distance between two GPS points (in meters)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Format distance for display
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

// Format pace (min/km)
function formatPace(metersPerSecond: number): string {
  if (metersPerSecond <= 0) return '--:--';
  const secondsPerKm = 1000 / metersPerSecond;
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format speed (km/h)
function formatSpeed(metersPerSecond: number): string {
  if (metersPerSecond <= 0) return '0.0';
  return (metersPerSecond * 3.6).toFixed(1);
}

// Cardio activity types
interface CardioType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  caloriesPerMinute: number;
  description: string;
  hypeEmoji: string;
  videoId?: string; // YouTube video ID for workout guidance
  tips: string[];
}

// Indoor workout types (with YouTube videos)
const indoorCardioTypes: CardioType[] = [
  { 
    id: 'zumba', 
    name: 'Zumba', 
    icon: Music, 
    color: '#ec4899', 
    caloriesPerMinute: 8, 
    description: 'Dance fitness party', 
    hypeEmoji: '💃',
    // Follow-through Zumba workout video
    videoId: 'mZeFvX3ALKY',
    tips: ['Move to the beat!', 'Keep it fun and energetic', 'Don\'t worry about perfect moves', 'Just keep moving and having fun!']
  },
  { 
    id: 'cardio', 
    name: 'Cardio', 
    icon: Zap, 
    color: '#06b6d4', 
    caloriesPerMinute: 9, 
    description: 'Full body cardio', 
    hypeEmoji: '⚡',
    videoId: 'ml6cT4AZdqI', // Cardio workout video
    tips: ['Stay in your comfort zone', 'Focus on form over speed', 'Take breaks when needed', 'Stay hydrated!']
  },
  { 
    id: 'walking-indoor', 
    name: 'Walking', 
    icon: Footprints, 
    color: '#22c55e', 
    caloriesPerMinute: 4, 
    description: 'Indoor walking workout', 
    hypeEmoji: '🚶',
    videoId: 'X3fkMqKbVCE', // Indoor walking workout video
    tips: ['Keep your head up', 'Swing your arms naturally', 'Maintain steady pace', 'Focus on your breathing']
  },
];

// Outdoor workout types (with GPS tracking)
const outdoorCardioTypes: CardioType[] = [
  { 
    id: 'running', 
    name: 'Running', 
    icon: Flame, 
    color: '#ef4444', 
    caloriesPerMinute: 11, 
    description: 'Steady run', 
    hypeEmoji: '🔥',
    tips: ['Drive your knees forward', 'Keep arms at 90 degrees', 'Stay light on your feet', 'Maintain steady breathing']
  },
  {
    id: 'walking',
    name: 'Walking',
    icon: Footprints,
    color: '#22c55e',
    caloriesPerMinute: 4,
    description: 'Leisurely pace',
    hypeEmoji: '🚶',
    tips: ['Keep your head up and look forward', 'Swing your arms naturally', 'Take comfortable strides', 'Breathe deeply and enjoy!']
  },
  {
    id: 'jogging',
    name: 'Jogging',
    icon: Wind,
    color: '#f59e0b',
    caloriesPerMinute: 8,
    description: 'Light running',
    hypeEmoji: '🏃',
    tips: ['Land midfoot, not heel', 'Keep shoulders relaxed', 'Find a comfortable pace', 'Breathe rhythmically']
  },
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
  mode?: 'indoor' | 'outdoor'; // Workout location mode
}

export interface WorkoutData {
  activityType: string;
  duration: number;
  milestones: number;
  calories: number;
  milestoneMode: MilestoneMode;
  autoMilestoneInterval?: number;
  // GPS data
  distance?: number; // meters
  averageSpeed?: number; // m/s
  averagePace?: string; // min/km
  routeCoordinates?: Array<{ lat: number; lng: number }>;
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

export default function GuidedCardio({ onClose, onWorkoutComplete, onSavePreset, initialPreset, mode = 'indoor' }: GuidedCardioProps) {
  // Determine available workout types based on mode
  const availableCardioTypes = mode === 'indoor' ? indoorCardioTypes : outdoorCardioTypes;
  
  // Activity selection
  const [selectedActivity, setSelectedActivity] = useState<CardioType>(
    initialPreset 
      ? availableCardioTypes.find(t => t.id === initialPreset.activityType) || availableCardioTypes[0]
      : availableCardioTypes[0]
  );
  const [showActivityPicker, setShowActivityPicker] = useState(false);
  
  // Camera state for indoor workouts
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
  
  // Video display state for indoor workouts
  const [showVideo, setShowVideo] = useState(false);
  
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
  
  // GPS tracking state (enabled by default for outdoor workouts)
  const [gpsEnabled, setGpsEnabled] = useState(mode === 'outdoor');
  const [gpsPermission, setGpsPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [currentPosition, setCurrentPosition] = useState<GpsCoordinate | null>(null);
  const [routeHistory, setRouteHistory] = useState<GpsCoordinate[]>([]);
  const [totalDistance, setTotalDistance] = useState(0); // in meters
  const [currentSpeed, setCurrentSpeed] = useState(0); // m/s
  const [averageSpeed, setAverageSpeed] = useState(0); // m/s
  const [lastDistanceMilestone, setLastDistanceMilestone] = useState(0);
  const [distanceMilestoneInterval, setDistanceMilestoneInterval] = useState(500); // meters between distance milestones
  const watchIdRef = useRef<number | null>(null);
  
  // Goal pin/marker state
  const [goalPin, setGoalPin] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [distanceToGoal, setDistanceToGoal] = useState(0); // meters
  
  // Fullscreen map state
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  
  // Spotify integration state
  const [spotifyEnabled, setSpotifyEnabled] = useState(false);
  const [spotifyPlayer, setSpotifyPlayer] = useState<any>(null);
  const [spotifyDeviceId, setSpotifyDeviceId] = useState<string | null>(null);
  const [spotifyVolume, setSpotifyVolume] = useState(50); // 0-100
  
  // Check for Spotify callback token on mount
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken && typeof window !== 'undefined' && (window as any).Spotify && !spotifyEnabled) {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Initialize Spotify player
      try {
        const player = new (window as any).Spotify.Player({
          name: 'Workout Player',
          getOAuthToken: (cb: (token: string) => void) => cb(accessToken),
          volume: spotifyVolume / 100
        });
        
        player.addListener('ready', ({ device_id }: { device_id: string }) => {
          setSpotifyDeviceId(device_id);
          setSpotifyPlayer(player);
          setSpotifyEnabled(true);
          setCoachingMessage('🎵 Spotify connected! Music will lower when coach talks.');
          setTimeout(() => setCoachingMessage(''), 5000);
        });
        
        player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
          console.log('Device ID has gone offline', device_id);
          setSpotifyEnabled(false);
        });
        
        player.addListener('initialization_error', ({ message }: { message: string }) => {
          console.error('Failed to initialize', message);
          setCoachingMessage(`⚠️ Spotify error: ${message}`);
          setTimeout(() => setCoachingMessage(''), 5000);
        });
        
        player.addListener('authentication_error', ({ message }: { message: string }) => {
          console.error('Failed to authenticate', message);
          setCoachingMessage(`⚠️ Spotify auth error: ${message}`);
          setTimeout(() => setCoachingMessage(''), 5000);
        });
        
        player.connect();
      } catch (error) {
        console.error('Spotify player error:', error);
        setCoachingMessage('⚠️ Failed to connect to Spotify. Please try again.');
        setTimeout(() => setCoachingMessage(''), 5000);
      }
    }
  }, [spotifyEnabled]);
  
  // GPS tracking functions
  const startGpsTracking = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    // Mobile-friendly options - longer timeout, allow cached positions initially
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // Increased from 10s to 30s for mobile GPS acquisition
      maximumAge: 5000 // Allow 5 second old positions initially
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newCoord: GpsCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed
        };

        setCurrentPosition(newCoord);
        
        // Use device speed if available, otherwise calculate
        if (position.coords.speed !== null && position.coords.speed >= 0) {
          setCurrentSpeed(position.coords.speed);
        }

        setRouteHistory(prev => {
          if (prev.length > 0) {
            const lastCoord = prev[prev.length - 1];
            const distance = calculateDistance(
              lastCoord.latitude, lastCoord.longitude,
              newCoord.latitude, newCoord.longitude
            );
            
            // More lenient threshold for mobile - only filter out GPS jitter
            // Accept any movement greater than 2 meters (very lenient for accurate tracking)
            const threshold = Math.max(newCoord.accuracy * 0.3, 2); // Use 30% of accuracy or 2m minimum
            
            if (distance > threshold) {
              // Always add distance if it's significant movement
              setTotalDistance(d => d + distance);
              
              // Calculate speed from distance if device speed not available
              if (position.coords.speed === null) {
                const timeDiff = (newCoord.timestamp - lastCoord.timestamp) / 1000;
                if (timeDiff > 0) {
                  setCurrentSpeed(distance / timeDiff);
                }
              }
              
              return [...prev, newCoord];
            } else {
              // Even if distance is small, update current position for map tracking
              // This ensures the blue dot follows accurately
              return prev;
            }
          }
          // Always add first coordinate
          return [newCoord];
        });

        setGpsPermission('granted');
        
        // Update distance to goal if goal pin is set
        if (goalPin) {
          const distToGoal = calculateDistance(
            newCoord.latitude,
            newCoord.longitude,
            goalPin.lat,
            goalPin.lng
          );
          setDistanceToGoal(distToGoal);
        }
      },
      (error) => {
        console.error('GPS Error:', error);
        let errorMessage = 'GPS error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsPermission('denied');
            errorMessage = 'Location permission denied. Please enable in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Check your GPS settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'GPS timeout. Trying again...';
            // Retry with less strict options
            setTimeout(() => {
              if (watchIdRef.current === null) {
                startGpsTracking();
              }
            }, 2000);
            break;
        }
        
        // Show user-friendly error message
        if (error.code === error.PERMISSION_DENIED) {
          setCoachingMessage(`⚠️ ${errorMessage}`);
          setTimeout(() => setCoachingMessage(''), 5000);
        }
      },
      options
    );
  }, [goalPin]);

  const stopGpsTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Request GPS permission - improved for mobile
  const requestGpsPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsPermission('denied');
      return;
    }

    // Check if HTTPS (required for mobile)
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure) {
      setCoachingMessage('⚠️ GPS requires HTTPS on mobile. Please use a secure connection.');
      setTimeout(() => setCoachingMessage(''), 5000);
      setGpsPermission('denied');
      return;
    }

    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          reject, 
          {
            enableHighAccuracy: true,
            timeout: 30000, // Longer timeout for mobile
            maximumAge: 10000 // Allow cached positions
          }
        );
      });
      setGpsPermission('granted');
      setGpsEnabled(true);
    } catch (error: any) {
      if (error.code === error.PERMISSION_DENIED) {
        setGpsPermission('denied');
        setCoachingMessage('⚠️ Please enable location permissions in your browser settings.');
        setTimeout(() => setCoachingMessage(''), 5000);
      } else {
        setGpsPermission('denied');
        setCoachingMessage('⚠️ Could not access location. Check your GPS settings.');
        setTimeout(() => setCoachingMessage(''), 5000);
      }
    }
  }, []);

  // Camera functions for indoor workouts
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      setCameraStream(stream);
      setCameraEnabled(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraEnabled(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraEnabled(false);
  }, [cameraStream]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Calculate average speed when workout is active
  useEffect(() => {
    if (isWorkoutActive && workoutTime > 0 && totalDistance > 0) {
      setAverageSpeed(totalDistance / workoutTime);
    }
  }, [isWorkoutActive, workoutTime, totalDistance]);

  // Start/stop GPS tracking with workout
  useEffect(() => {
    if (isWorkoutActive && gpsEnabled && !isPaused) {
      startGpsTracking();
    } else {
      stopGpsTracking();
    }

    return () => stopGpsTracking();
  }, [isWorkoutActive, gpsEnabled, isPaused, startGpsTracking, stopGpsTracking]);

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
  
  // Spotify music control
  const pauseSpotifyMusic = useCallback(async () => {
    if (!spotifyEnabled || !spotifyPlayer || !spotifyDeviceId) return;
    
    try {
      // Get OAuth token
      const token = await new Promise<string>((resolve) => {
        spotifyPlayer._options.getOAuthToken(resolve);
      });
      
      // Lower volume to 20% when coach talks
      await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=20&device_id=${spotifyDeviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Restore volume after 4 seconds
      setTimeout(async () => {
        if (spotifyEnabled && spotifyDeviceId && spotifyPlayer) {
          try {
            const restoreToken = await new Promise<string>((resolve) => {
              spotifyPlayer._options.getOAuthToken(resolve);
            });
            await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${spotifyVolume}&device_id=${spotifyDeviceId}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${restoreToken}`,
                'Content-Type': 'application/json',
              },
            });
          } catch (error) {
            console.error('Error restoring volume:', error);
          }
        }
      }, 4000);
    } catch (error) {
      console.error('Error controlling Spotify:', error);
    }
  }, [spotifyEnabled, spotifyPlayer, spotifyDeviceId, spotifyVolume]);
  
  // Show coaching message (visual + audio)
  const showCoaching = useCallback((message: string) => {
    setCoachingMessage(message);
    speak(message);
    pauseSpotifyMusic(); // Lower/pause music when coach talks
    setTimeout(() => setCoachingMessage(''), 4000);
  }, [speak, pauseSpotifyMusic]);
  
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

  // Goal-based milestone tracking
  const [lastGoalProgress, setLastGoalProgress] = useState(0);
  const [initialDistanceToGoal, setInitialDistanceToGoal] = useState(0);

  // Set initial distance when goal pin is set
  useEffect(() => {
    if (goalPin && currentPosition && initialDistanceToGoal === 0) {
      const initialDist = calculateDistance(
        currentPosition.latitude,
        currentPosition.longitude,
        goalPin.lat,
        goalPin.lng
      );
      setInitialDistanceToGoal(initialDist);
    }
  }, [goalPin, currentPosition, initialDistanceToGoal]);

  // Goal-based milestones - every 25% closer to goal
  useEffect(() => {
    if (!isWorkoutActive || !gpsEnabled || !goalPin || initialDistanceToGoal === 0) return;

    const progress = Math.max(0, (initialDistanceToGoal - distanceToGoal) / initialDistanceToGoal);
    const progressPercent = Math.floor(progress * 100);
    const milestonePercent = Math.floor(progressPercent / 25); // Every 25%

    if (milestonePercent > lastGoalProgress && progressPercent > 0) {
      setLastGoalProgress(milestonePercent);
      setMilestones(m => m + 1);
      setStreakCount(s => s + 1);
      triggerMilestoneFlash();
      
      const remaining = formatDistance(distanceToGoal);
      const message = `🎯 ${progressPercent}% to goal! Only ${remaining} left! Keep going!`;
      showCoaching(message);
      
      // Big confetti for reaching goal
      if (distanceToGoal < 50) {
        fireConfetti();
        showCoaching("🎉 GOAL REACHED! You're AMAZING!");
      } else if (typeof window !== 'undefined') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }
  }, [distanceToGoal, initialDistanceToGoal, lastGoalProgress, isWorkoutActive, gpsEnabled, goalPin, showCoaching, triggerMilestoneFlash, fireConfetti, formatDistance]);

  
  // Distance-based milestones (when no goal pin is set)
  useEffect(() => {
    if (!isWorkoutActive || !gpsEnabled || goalPin) return;

    const currentMilestone = Math.floor(totalDistance / distanceMilestoneInterval);
    if (currentMilestone > lastDistanceMilestone && totalDistance > 0) {
      setLastDistanceMilestone(currentMilestone);
      setMilestones(m => m + 1);
      setStreakCount(s => s + 1);
      triggerMilestoneFlash();
      
      const distanceKm = (currentMilestone * distanceMilestoneInterval) / 1000;
      const message = distanceKm >= 1 
        ? `🎯 ${distanceKm} kilometer${distanceKm > 1 ? 's' : ''} DOWN! Keep CRUSHING it!`
        : `📍 ${currentMilestone * distanceMilestoneInterval} meters! You're on FIRE!`;
      showCoaching(message);
      
      // Confetti for km milestones
      if (totalDistance >= (lastDistanceMilestone + 1) * 1000) {
        fireConfetti();
      } else if (typeof window !== 'undefined') {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
    }
  }, [totalDistance, lastDistanceMilestone, distanceMilestoneInterval, isWorkoutActive, gpsEnabled, goalPin, showCoaching, triggerMilestoneFlash, fireConfetti]);
  
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
    
    // Stop camera for outdoor workouts
    if (mode === 'outdoor' && cameraEnabled) {
      stopCamera();
    }
    
    // Reset GPS tracking
    setTotalDistance(0);
    setCurrentSpeed(0);
    setAverageSpeed(0);
    setRouteHistory([]);
    setLastDistanceMilestone(0);
    setCurrentPosition(null);
    
    // Reset goal tracking
    setLastGoalProgress(0);
    setInitialDistanceToGoal(0);
    setDistanceToGoal(0);
    
    // Adjust coaching interval based on intensity - more frequent for hype!
    setCoachingInterval(config.intensity === 'intense' ? 35 : config.intensity === 'easy' ? 60 : 45);
    
    // Initial coaching with energy!
    setTimeout(() => {
      const gpsMessage = gpsEnabled ? " GPS tracking is ON! 📍" : "";
      showCoaching(getRandomMessage('start') + gpsMessage);
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
        // GPS data
        distance: gpsEnabled ? totalDistance : undefined,
        averageSpeed: gpsEnabled && averageSpeed > 0 ? averageSpeed : undefined,
        averagePace: gpsEnabled && averageSpeed > 0 ? formatPace(averageSpeed) : undefined,
        routeCoordinates: gpsEnabled && routeHistory.length > 0 
          ? routeHistory.map(c => ({ lat: c.latitude, lng: c.longitude }))
          : undefined,
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
      stopGpsTracking();
      stopCamera();
    }
  };
  
  // Reset workout
  const resetWorkout = () => {
    setWorkoutTime(0);
    setMilestones(0);
    setCalories(0);
    setLastCoachingTime(0);
    // Reset GPS
    setTotalDistance(0);
    setCurrentSpeed(0);
    setAverageSpeed(0);
    setRouteHistory([]);
    setLastDistanceMilestone(0);
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
                  {availableCardioTypes.map(activity => (
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

          {/* Workout Tips & Video Preview */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                {selectedActivity.name} Tips
              </h4>
              {mode === 'indoor' && selectedActivity.videoId && (
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {showVideo ? 'Hide' : 'Watch'} Video Guide
                  <Play className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Tips List */}
            <div className="space-y-2 mb-3">
              {selectedActivity.tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedActivity.color }} />
                  {tip}
                </div>
              ))}
            </div>

            {/* Video Embed - Indoor workouts only */}
            {mode === 'indoor' && showVideo && selectedActivity.videoId && (
              <div className="mt-4">
                <div className="relative w-full pt-[56.25%] bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedActivity.videoId}?modestbranding=1&rel=0`}
                    title="Workout Guide"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Watch for form tips, then start your workout when ready!
                </p>
              </div>
            )}
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

          {/* Camera Toggle - Indoor workouts only */}
          {mode === 'indoor' && (
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-white">Camera</span>
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">OPTIONAL</span>
                </div>
                <button
                  onClick={() => {
                    if (!cameraEnabled) {
                      startCamera();
                    } else {
                      stopCamera();
                    }
                  }}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    cameraEnabled ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    cameraEnabled ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {cameraEnabled 
                  ? 'Camera is on! Use it to check your form or show off your moves! 📸'
                  : 'Enable camera to check your form or share your workout progress!'}
              </p>
            </div>
          )}

          {/* GPS Tracking - Outdoor workouts only */}
          {mode === 'outdoor' && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">GPS Tracking</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">NEW</span>
              </div>
              <button
                onClick={() => {
                  if (!gpsEnabled && gpsPermission !== 'granted') {
                    requestGpsPermission();
                  } else {
                    setGpsEnabled(!gpsEnabled);
                  }
                }}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  gpsEnabled ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  gpsEnabled ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            {gpsPermission === 'denied' && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                <AlertCircle className="w-4 h-4" />
                Location permission denied. Enable in browser settings.
              </div>
            )}
            
            {gpsEnabled && gpsPermission === 'granted' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  📍 Track your route, distance, speed, and pace in real-time!
                </p>
                
                {/* Distance milestone interval */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Distance milestones every: {distanceMilestoneInterval >= 1000 
                      ? `${distanceMilestoneInterval / 1000} km` 
                      : `${distanceMilestoneInterval} m`}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[250, 500, 1000, 2000].map(dist => (
                      <button
                        key={dist}
                        onClick={() => setDistanceMilestoneInterval(dist)}
                        className={`py-2 rounded-lg text-sm transition-all ${
                          distanceMilestoneInterval === dist
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {dist >= 1000 ? `${dist / 1000} km` : `${dist}m`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {!gpsEnabled && (
              <p className="text-xs text-gray-500">
                Enable to track distance, speed, and pace during your workout.
              </p>
            )}
          </div>
          )}
          
          {/* Spotify Integration - Outdoor workouts */}
          {mode === 'outdoor' && (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">Spotify Music</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">OPTIONAL</span>
                </div>
                <button
                  onClick={async () => {
                    if (!spotifyEnabled) {
                      // Check if Spotify SDK is loaded
                      if (typeof window === 'undefined' || !(window as any).Spotify) {
                        setCoachingMessage('⚠️ Loading Spotify SDK... Please refresh the page.');
                        setTimeout(() => setCoachingMessage(''), 5000);
                        return;
                      }

                      // Redirect to Spotify authorization
                      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'YOUR_SPOTIFY_CLIENT_ID';
                      const redirectUri = `${window.location.origin}${window.location.pathname}`;
                      const scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';
                      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;
                      window.location.href = authUrl;
                    } else {
                      // Disconnect
                      if (spotifyPlayer) {
                        spotifyPlayer.disconnect();
                      }
                      setSpotifyEnabled(false);
                      setSpotifyPlayer(null);
                      setSpotifyDeviceId(null);
                    }
                  }}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    spotifyEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    spotifyEnabled ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {spotifyEnabled && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">
                    🎵 Music will automatically lower to 20% when coach speaks
                  </p>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Music Volume: {spotifyVolume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={spotifyVolume}
                      onChange={async (e) => {
                        const vol = parseInt(e.target.value);
                        setSpotifyVolume(vol);
                        if (spotifyPlayer && spotifyDeviceId) {
                          try {
                            const token = await new Promise<string>((resolve) => {
                              spotifyPlayer._options.getOAuthToken(resolve);
                            });
                            await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${vol}&device_id=${spotifyDeviceId}`, {
                              method: 'PUT',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                              },
                            });
                          } catch (error) {
                            console.error('Error setting volume:', error);
                          }
                        }
                      }}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
              
              {!spotifyEnabled && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    Connect Spotify to listen to music during your run. Music will automatically lower when coach talks!
                  </p>
                  <p className="text-xs text-gray-600">
                    Note: You'll be redirected to Spotify to authorize access. Make sure to set VITE_SPOTIFY_CLIENT_ID in your .env file.
                  </p>
                </div>
              )}
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
          <div className={`grid ${gpsEnabled ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3'} gap-3 mb-4`}>
            {/* Distance - GPS */}
            {gpsEnabled && (
              <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-4 text-center border border-blue-500/30">
                <Route className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                  {formatDistance(totalDistance)}
                </div>
                <div className="text-xs text-gray-400">Distance</div>
              </div>
            )}
            
            {/* Speed - GPS */}
            {gpsEnabled && (
              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-4 text-center border border-green-500/30">
                <Gauge className="w-5 h-5 mx-auto mb-1 text-green-400" />
                <div className="text-2xl sm:text-3xl font-bold text-green-400">
                  {formatSpeed(currentSpeed)} <span className="text-sm">km/h</span>
                </div>
                <div className="text-xs text-gray-400">Speed</div>
              </div>
            )}
            
            {/* Pace - GPS */}
            {gpsEnabled && (
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 text-center border border-purple-500/30">
                <MapPinned className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                  {formatPace(averageSpeed)} <span className="text-sm">/km</span>
                </div>
                <div className="text-xs text-gray-400">Avg Pace</div>
              </div>
            )}
            
            {/* Checkpoints */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: selectedActivity.color }}>
                {milestones}
              </div>
              <div className="text-xs text-gray-400">
                {config.goalType === 'milestones' ? `/ ${config.targetMilestones}` : ''} Checkpoints
              </div>
            </div>
            
            {/* Calories */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl sm:text-3xl font-bold text-orange-400">
                {Math.round(calories)}
              </div>
              <div className="text-xs text-gray-400">🔥 Calories</div>
            </div>
            
            {/* Progress/Streak/Goal */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                {goalPin && initialDistanceToGoal > 0 
                  ? `${Math.round(((initialDistanceToGoal - distanceToGoal) / initialDistanceToGoal) * 100)}%`
                  : streakCount > 0 
                    ? `${streakCount}🔥` 
                    : `${Math.round(getProgress())}%`}
              </div>
              <div className="text-xs text-gray-400">
                {goalPin && initialDistanceToGoal > 0 
                  ? 'To Goal' 
                  : streakCount > 0 
                    ? 'Streak' 
                    : 'Progress'}
              </div>
            </div>
          </div>
          
          {/* Camera Display - Indoor workouts */}
          {mode === 'indoor' && cameraEnabled && (
            <div className="mb-4">
              <div className="bg-gray-800 rounded-xl overflow-hidden border border-purple-500/30">
                <div className="p-2 bg-purple-500/20 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400 font-medium">Camera View</span>
                </div>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          {/* YouTube Video Display - Indoor workouts */}
          {mode === 'indoor' && selectedActivity.videoId && !cameraEnabled && (
            <div className="mb-4">
              <div className="bg-gray-800 rounded-xl overflow-hidden border border-cyan-500/30">
                <div className="p-2 bg-cyan-500/20 flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-medium">Follow Along Video</span>
                </div>
                <div className="relative w-full pt-[56.25%] bg-gray-900">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedActivity.videoId}?modestbranding=1&rel=0&autoplay=1&controls=1`}
                    title="Workout Guide"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}

          {/* Map Display - Outdoor workouts */}
          {mode === 'outdoor' && gpsEnabled && currentPosition && (
            <div className="mb-4">
              <WorkoutMap
                currentPosition={currentPosition}
                routeHistory={routeHistory}
                goalPin={goalPin}
                isFullscreen={isMapFullscreen}
                activityColor={selectedActivity.color}
                onGoalPinSet={(lat, lng, name) => {
                  setGoalPin({ lat, lng, name });
                  const dist = calculateDistance(
                    currentPosition.latitude,
                    currentPosition.longitude,
                    lat,
                    lng
                  );
                  setDistanceToGoal(dist);
                  showCoaching(`🎯 Destination set: ${name || formatDistance(dist)} away`);
                }}
                onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
                distanceToGoal={distanceToGoal}
                formatDistance={formatDistance}
              />
            </div>
          )}

          {/* GPS Status Indicator */}
          {mode === 'outdoor' && gpsEnabled && (
            <div className="flex items-center justify-center gap-2 mb-4 text-sm">
              <div className={`w-2 h-2 rounded-full ${currentPosition ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-gray-400">
                {currentPosition 
                  ? `GPS Active • ±${Math.round(currentPosition.accuracy)}m accuracy`
                  : 'Acquiring GPS signal...'
                }
              </span>
            </div>
          )}
          
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
            
            <h3 className="text-2xl font-bold text-white mb-2">Workout Complete! 🎉</h3>
            <p className="text-gray-400 mb-6">Great job on finishing your {selectedActivity.name.toLowerCase()} session!</p>
            
            {/* Main Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-700 rounded-xl p-3">
                <div className="text-2xl font-bold text-white">{formatTime(workoutTime)}</div>
                <div className="text-xs text-gray-400">Duration</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-3">
                <div className="text-2xl font-bold text-purple-400">{milestones}</div>
                <div className="text-xs text-gray-400">Checkpoints</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-3">
                <div className="text-2xl font-bold text-orange-400">{Math.round(calories)}</div>
                <div className="text-xs text-gray-400">Calories</div>
              </div>
            </div>
            
            {/* GPS Stats */}
            {gpsEnabled && totalDistance > 0 && (
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 mb-6 border border-blue-500/20">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">GPS Tracking Results</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xl font-bold text-blue-400">{formatDistance(totalDistance)}</div>
                    <div className="text-xs text-gray-400">Distance</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-400">{formatSpeed(averageSpeed)} km/h</div>
                    <div className="text-xs text-gray-400">Avg Speed</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-400">{formatPace(averageSpeed)}/km</div>
                    <div className="text-xs text-gray-400">Avg Pace</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setShowConfig(true);
                  stopGpsTracking();
                }}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
              >
                New Workout
              </button>
              <button
                onClick={() => {
                  stopGpsTracking();
                  onClose();
                }}
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

