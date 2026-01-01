// Emotional reflection prompts organized by emotion
const emotionalPrompts: Record<string, string[]> = {
  // Great emotions
  'Joyful': [
    'What brought you this joy today?',
    'How can you carry this feeling forward?',
    'Who or what are you grateful for in this moment?'
  ],
  'Ecstatic': [
    'What made you feel this way?',
    'How does this feeling affect your perspective?',
    'What would you tell someone else experiencing this?'
  ],
  'Grateful': [
    'What specifically are you grateful for?',
    'How has gratitude changed your day?',
    'Who deserves your gratitude today?'
  ],
  'Hopeful': [
    'What are you hoping for?',
    'What gives you this sense of hope?',
    'How can you nurture this feeling?'
  ],
  'Peaceful': [
    'What brought you this peace?',
    'How can you maintain this sense of calm?',
    'What does peace mean to you right now?'
  ],
  'Confident': [
    'What made you feel confident?',
    'How does confidence change your actions?',
    'What strengths are you recognizing in yourself?'
  ],

  // Good emotions
  'Happy': [
    'What made you happy today?',
    'How can you create more moments like this?',
    'What does happiness look like for you?'
  ],
  'Optimistic': [
    'What are you optimistic about?',
    'What positive outcomes do you see?',
    'How does optimism help you move forward?'
  ],
  'Satisfied': [
    'What are you satisfied with?',
    'What accomplishments led to this feeling?',
    'How does satisfaction feel in your body?'
  ],
  'Motivated': [
    'What is motivating you?',
    'What goals feel achievable right now?',
    'How can you channel this energy?'
  ],

  // Neutral emotions
  'Uncertain': [
    'What are you uncertain about?',
    'What information would help clarify things?',
    'How can you find peace in uncertainty?'
  ],
  'Contemplative': [
    'What are you contemplating?',
    'What questions are on your mind?',
    'What insights are emerging?'
  ],
  'Tired': [
    'What is making you tired?',
    'What rest do you need?',
    'How can you honor your need for rest?'
  ],

  // Low emotions
  'Sad': [
    'What is making you sad?',
    'What support do you need right now?',
    'How can you be gentle with yourself?'
  ],
  'Anxious': [
    'What is causing your anxiety?',
    'What can you control in this situation?',
    'What grounding techniques help you?'
  ],
  'Overwhelmed': [
    'What feels overwhelming?',
    'What can you let go of?',
    'What one small step can you take?'
  ],
  'Lonely': [
    'What does loneliness feel like for you?',
    'Who can you reach out to?',
    'How can you connect with yourself?'
  ],
  'Frustrated': [
    'What is frustrating you?',
    'What would help resolve this?',
    'How can you express this frustration constructively?'
  ],

  // Bad emotions
  'Angry': [
    'What is making you angry?',
    'What need is not being met?',
    'How can you express this anger safely?'
  ],
  'Depressed': [
    'What does this feeling tell you?',
    'What support do you need?',
    'What small thing can you do for yourself?'
  ],
  'Afraid': [
    'What are you afraid of?',
    'What is the worst that could happen?',
    'What would help you feel safer?'
  ],
  'Ashamed': [
    'What is causing this shame?',
    'What would you tell a friend feeling this?',
    'How can you practice self-compassion?'
  ],
  'Hopeless': [
    'What feels hopeless?',
    'What small glimmer of hope exists?',
    'Who can support you through this?'
  ]
};

interface EmotionalPromptsProps {
  emotion: string | null;
  mood: 'great' | 'good' | 'neutral' | 'low' | 'bad';
  onPromptSelect?: (prompt: string) => void;
}

export default function EmotionalPrompts({ emotion, mood, onPromptSelect }: EmotionalPromptsProps) {
  // Get prompts for specific emotion or general mood prompts
  const prompts = emotion && emotionalPrompts[emotion] 
    ? emotionalPrompts[emotion]
    : getMoodPrompts(mood);

  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
      <h4 className="font-semibold text-purple-900 mb-3 text-sm flex items-center gap-2">
        <span>💭</span>
        Reflection Prompts
      </h4>
      <div className="space-y-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptSelect?.(prompt)}
            className="w-full text-left p-3 bg-white/80 hover:bg-white rounded-lg text-sm text-gray-700 hover:shadow-sm transition-all border border-purple-100"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function getMoodPrompts(mood: string): string[] {
  const moodPrompts: Record<string, string[]> = {
    great: [
      'What made today great?',
      'How can you carry this energy forward?',
      'What are you most grateful for?'
    ],
    good: [
      'What went well today?',
      'What are you looking forward to?',
      'What made you smile?'
    ],
    neutral: [
      'What are you noticing about today?',
      'What questions are on your mind?',
      'What do you need right now?'
    ],
    low: [
      'What is weighing on you?',
      'What support do you need?',
      'How can you be kind to yourself?'
    ],
    bad: [
      'What is this feeling telling you?',
      'What do you need to feel better?',
      'Who can support you right now?'
    ]
  };
  return moodPrompts[mood] || [];
}

export { emotionalPrompts };

