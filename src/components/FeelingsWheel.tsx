import { X } from 'lucide-react';

// Feelings wheel organized by main mood categories
const feelingsWheel: Record<string, string[]> = {
  great: [
    'Joyful', 'Ecstatic', 'Elated', 'Euphoric', 'Blissful',
    'Grateful', 'Hopeful', 'Inspired', 'Confident', 'Proud',
    'Peaceful', 'Content', 'Serene', 'Tranquil', 'Calm'
  ],
  good: [
    'Happy', 'Cheerful', 'Optimistic', 'Enthusiastic', 'Energetic',
    'Satisfied', 'Comfortable', 'Relaxed', 'At Ease', 'Balanced',
    'Motivated', 'Focused', 'Determined', 'Ambitious', 'Productive'
  ],
  neutral: [
    'Indifferent', 'Apathetic', 'Detached', 'Uncertain', 'Confused',
    'Numb', 'Empty', 'Bored', 'Tired', 'Drained',
    'Contemplative', 'Reflective', 'Thoughtful', 'Curious', 'Questioning'
  ],
  low: [
    'Sad', 'Disappointed', 'Discouraged', 'Lonely', 'Isolated',
    'Anxious', 'Worried', 'Nervous', 'Overwhelmed', 'Stressed',
    'Frustrated', 'Irritated', 'Impatient', 'Restless', 'Unsettled'
  ],
  bad: [
    'Angry', 'Furious', 'Resentful', 'Betrayed', 'Hurt',
    'Depressed', 'Hopeless', 'Despairing', 'Desperate', 'Lost',
    'Afraid', 'Terrified', 'Panicked', 'Insecure', 'Vulnerable',
    'Ashamed', 'Guilty', 'Embarrassed', 'Humiliated', 'Worthless'
  ]
};

interface FeelingsWheelProps {
  mainMood: 'great' | 'good' | 'neutral' | 'low' | 'bad';
  selectedEmotion: string | null;
  onSelect: (emotion: string | null) => void;
  onClose: () => void;
}

export default function FeelingsWheel({ mainMood, selectedEmotion, onSelect, onClose }: FeelingsWheelProps) {
  const emotions = feelingsWheel[mainMood] || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-elevated flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900">
              What specifically are you feeling?
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Select a more specific emotion, or skip if you'd prefer to keep it simple
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
            aria-label="Close feelings wheel"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Emotions Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {emotions.map((emotion) => (
              <button
                key={emotion}
                onClick={() => {
                  onSelect(selectedEmotion === emotion ? null : emotion);
                }}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all ${
                  selectedEmotion === emotion
                    ? 'bg-coral-100 text-coral-700 ring-2 ring-coral-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-white transition-colors"
          >
            Skip
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl bg-coral-500 text-white font-medium hover:bg-coral-600 transition-colors"
          >
            {selectedEmotion ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

