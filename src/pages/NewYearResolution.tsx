import { useState } from 'react';
import {
  Sparkles,
  Target,
  CheckCircle2,
  Heart,
  Brain,
  Flower2,
  Users,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Smile,
  Frown,
  Meh,
} from 'lucide-react';
import { useNewYearResolutions } from '../hooks/useSupabaseData';
import { format, parseISO } from 'date-fns';
type Milestone = {
  id: string;
  title: string;
  targetDate?: string;
  completed: boolean;
  notes?: string;
};
type Reflection = {
  id: string;
  date: string;
  content: string;
  mood?: string;
  progressPercentage?: number;
};

const currentYear = 2026;

const suggestedCategories = [
  { id: 'weight-health', label: 'Weight & Health', icon: Target, color: 'bg-purple-100 text-purple-700', description: 'Focus on your physical health and weight goals' },
  { id: 'mental-wellness', label: 'Mental Wellness', icon: Brain, color: 'bg-blue-100 text-blue-700', description: 'Prioritize your mental health and emotional well-being' },
  { id: 'grief-healing', label: 'Grief & Healing', icon: Heart, color: 'bg-pink-100 text-pink-700', description: 'Support your journey through grief and healing' },
  { id: 'personal-growth', label: 'Personal Growth', icon: Flower2, color: 'bg-green-100 text-green-700', description: 'Explore new interests and personal development' },
  { id: 'relationships', label: 'Relationships', icon: Users, color: 'bg-amber-100 text-amber-700', description: 'Nurture connections with loved ones' },
  { id: 'custom', label: 'Custom', icon: Sparkles, color: 'bg-gray-100 text-gray-700', description: 'Create your own category' },
];

export default function NewYearResolution() {
  const { resolutions, loading, createResolution, updateResolution, deleteResolution } = useNewYearResolutions(currentYear);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<string | null>(null);
  const [reflectionData, setReflectionData] = useState({
    content: '',
    mood: 'good',
    progressPercentage: 0,
  });
  
  // Wizard state
  const [wizardData, setWizardData] = useState({
    category: '',
    customCategory: '',
    title: '',
    whyImportant: '',
    description: '',
    milestones: [] as Milestone[],
    targetDate: '',
  });

  const hasResolutions = resolutions.length > 0;

  // Initialize wizard when creating new resolution
  const handleStartWizard = () => {
    setWizardData({
      category: '',
      customCategory: '',
      title: '',
      whyImportant: '',
      description: '',
      milestones: [],
      targetDate: '',
    });
    setWizardStep(1);
    setShowWizard(true);
  };

  // Step 1: Category Selection
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
          What would you like to focus on this year?
        </h3>
        <p className="text-gray-600">
          Choose a category that resonates with you, or create your own
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestedCategories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'custom') {
                  setWizardData({ ...wizardData, category: '', customCategory: '' });
                } else {
                  setWizardData({ ...wizardData, category: cat.id, customCategory: '' });
                }
              }}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                (cat.id === 'custom' && !wizardData.category) || wizardData.category === cat.id
                  ? 'border-coral-500 bg-coral-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{cat.label}</h4>
                  <p className="text-sm text-gray-600">{cat.description}</p>
                </div>
                {((cat.id === 'custom' && !wizardData.category) || wizardData.category === cat.id) && (
                  <CheckCircle2 className="w-6 h-6 text-coral-600 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Step 2: Define Resolution
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
          Tell us about your resolution
        </h3>
        <p className="text-gray-600">
          Be specific about what you want to achieve
        </p>
      </div>

      <div className="space-y-4">
        {!wizardData.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Category Name
            </label>
            <input
              type="text"
              value={wizardData.customCategory}
              onChange={(e) => setWizardData({ ...wizardData, customCategory: e.target.value })}
              placeholder="e.g., Creative Expression, Career Change"
              className="input"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resolution Title *
          </label>
          <input
            type="text"
            value={wizardData.title}
            onChange={(e) => setWizardData({ ...wizardData, title: e.target.value })}
            placeholder="e.g., Lose 20 pounds, Practice daily meditation"
            className="input text-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why is this important to you? *
          </label>
          <textarea
            value={wizardData.whyImportant}
            onChange={(e) => setWizardData({ ...wizardData, whyImportant: e.target.value })}
            placeholder="Reflecting on why this matters to you will help you stay motivated..."
            className="input min-h-[120px]"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Understanding your "why" is the foundation of lasting change
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Details (Optional)
          </label>
          <textarea
            value={wizardData.description}
            onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
            placeholder="Any additional thoughts, plans, or details about your resolution..."
            className="input min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Date (Optional)
          </label>
          <input
            type="date"
            value={wizardData.targetDate}
            onChange={(e) => setWizardData({ ...wizardData, targetDate: e.target.value })}
            className="input"
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-gray-500 mt-1">
            Set a target date to help keep you on track
          </p>
        </div>
      </div>
    </div>
  );

  // Step 3: Milestones
  const renderStep3 = () => {
    const addMilestone = () => {
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        title: '',
        completed: false,
      };
      setWizardData({
        ...wizardData,
        milestones: [...wizardData.milestones, newMilestone],
      });
    };

    const updateMilestone = (id: string, updates: Partial<Milestone>) => {
      setWizardData({
        ...wizardData,
        milestones: wizardData.milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      });
    };

    const removeMilestone = (id: string) => {
      setWizardData({
        ...wizardData,
        milestones: wizardData.milestones.filter((m) => m.id !== id),
      });
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
            Break it down into steps
          </h3>
          <p className="text-gray-600">
            Breaking big goals into smaller milestones makes them more achievable. Add 3-5 milestones to guide your journey.
          </p>
        </div>

        <div className="space-y-4">
          {wizardData.milestones.map((milestone, index) => (
            <div key={milestone.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-coral-100 text-coral-600 flex items-center justify-center font-semibold flex-shrink-0 mt-1">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                    placeholder={`Milestone ${index + 1} title`}
                    className="input"
                  />
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={milestone.targetDate || ''}
                      onChange={(e) => updateMilestone(milestone.id, { targetDate: e.target.value })}
                      className="input flex-1"
                      placeholder="Target date (optional)"
                    />
                  </div>
                  <textarea
                    value={milestone.notes || ''}
                    onChange={(e) => updateMilestone(milestone.id, { notes: e.target.value })}
                    placeholder="Notes (optional)"
                    className="input min-h-[60px]"
                  />
                </div>
                {wizardData.milestones.length > 1 && (
                  <button
                    onClick={() => removeMilestone(milestone.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {wizardData.milestones.length < 5 && (
            <button
              onClick={addMilestone}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-coral-400 hover:text-coral-600 hover:bg-coral-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Milestone
            </button>
          )}

          {wizardData.milestones.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Start by adding your first milestone</p>
              <button
                onClick={addMilestone}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add First Milestone
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Step 4: Review
  const renderStep4 = () => {
    const handleSave = async () => {
      if (!wizardData.title.trim() || !wizardData.whyImportant.trim()) {
        alert('Please complete all required fields');
        return;
      }

      if (wizardData.milestones.length === 0) {
        alert('Please add at least one milestone');
        return;
      }

      try {
        const result = await createResolution({
          title: wizardData.title,
          description: wizardData.description,
          category: wizardData.category || wizardData.customCategory,
          whyImportant: wizardData.whyImportant,
          milestones: wizardData.milestones,
          targetDate: wizardData.targetDate || undefined,
        });

        if (result.success) {
          setShowWizard(false);
          setWizardStep(1);
          setWizardData({
            category: '',
            customCategory: '',
            title: '',
            whyImportant: '',
            description: '',
            milestones: [],
            targetDate: '',
          });
        } else {
          alert('Failed to create resolution. Please try again.');
        }
      } catch (error) {
        console.error('Error creating resolution:', error);
        alert('Failed to create resolution. Please try again.');
      }
    };

    const selectedCategory = wizardData.category
      ? suggestedCategories.find((c) => c.id === wizardData.category)?.label
      : wizardData.customCategory || 'Custom';

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
            Review Your Resolution
          </h3>
          <p className="text-gray-600">
            Take a moment to review everything before you begin
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Category</p>
            <p className="text-lg font-semibold text-gray-900">{selectedCategory}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Resolution</p>
            <p className="text-lg font-semibold text-gray-900">{wizardData.title}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Why This Matters</p>
            <p className="text-gray-800 whitespace-pre-wrap">{wizardData.whyImportant}</p>
          </div>

          {wizardData.description && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Details</p>
              <p className="text-gray-800 whitespace-pre-wrap">{wizardData.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Milestones ({wizardData.milestones.length})</p>
            <div className="space-y-2">
              {wizardData.milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{milestone.title}</p>
                    {milestone.targetDate && (
                      <p className="text-xs text-gray-500">
                        Target: {format(parseISO(milestone.targetDate), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {wizardData.targetDate && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Target Date</p>
              <p className="text-gray-800">
                {format(parseISO(wizardData.targetDate), 'MMMM d, yyyy')}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setWizardStep(3)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleSave}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            I'm Ready to Begin!
          </button>
        </div>
      </div>
    );
  };

  // Empty/Welcome State
  const renderWelcomeState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
        Ready for a Fresh Start?
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        The New Year is a perfect time to reflect on what matters most to you and set intentions that will guide your journey. 
        Let's create a resolution that truly resonates with who you are and where you want to be.
      </p>
      <button
        onClick={handleStartWizard}
        className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
      >
        <Plus className="w-6 h-6" />
        Create Your Resolution
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resolutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
            New Year's Resolution {currentYear}
          </h1>
          <p className="text-gray-500 mt-1">
            Set meaningful intentions and track your progress throughout the year
          </p>
        </div>
        {!showWizard && (
          <button
            onClick={handleStartWizard}
            className="btn-primary flex items-center gap-2 self-start"
          >
            <Plus className="w-5 h-5" />
            {hasResolutions ? 'Add Another Resolution' : 'Create Resolution'}
          </button>
        )}
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Create Your Resolution
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Step {wizardStep} of 4
              </p>
            </div>
            <button
              onClick={() => {
                setShowWizard(false);
                setWizardStep(1);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= wizardStep ? 'bg-coral-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Wizard Steps */}
          <div className="min-h-[400px]">
            {wizardStep === 1 && renderStep1()}
            {wizardStep === 2 && renderStep2()}
            {wizardStep === 3 && renderStep3()}
            {wizardStep === 4 && renderStep4()}
          </div>

          {/* Navigation Buttons */}
          {wizardStep < 4 && (
            <div className="flex gap-3 pt-6 border-t border-gray-200 mt-8">
              {wizardStep > 1 && (
                <button
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (wizardStep === 1) {
                    // Allow proceeding if category is selected OR custom category is being used
                    if (wizardData.category || wizardData.customCategory) {
                      setWizardStep(2);
                    }
                  } else if (wizardStep === 2 && wizardData.title && wizardData.whyImportant) {
                    // Ensure custom category is set if using custom
                    if (!wizardData.category && !wizardData.customCategory) {
                      alert('Please enter a custom category name');
                      return;
                    }
                    // Ensure at least one milestone is added
                    if (wizardData.milestones.length === 0) {
                      const firstMilestone: Milestone = {
                        id: Date.now().toString(),
                        title: '',
                        completed: false,
                      };
                      setWizardData({ ...wizardData, milestones: [firstMilestone] });
                    }
                    setWizardStep(3);
                  } else if (wizardStep === 3) {
                    setWizardStep(4);
                  }
                }}
                disabled={
                  (wizardStep === 1 && !wizardData.category && !wizardData.customCategory) ||
                  (wizardStep === 2 && (!wizardData.title || !wizardData.whyImportant))
                }
                className="ml-auto px-6 py-3 rounded-xl bg-coral-500 text-white font-medium hover:bg-coral-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resolutions List */}
      {!showWizard && hasResolutions && (
        <div className="space-y-6">
          {resolutions.map((resolution) => (
            <div key={resolution.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {resolution.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      resolution.status === 'active' ? 'bg-green-100 text-green-700' :
                      resolution.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      resolution.status === 'paused' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {resolution.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
                    {resolution.title}
                  </h3>
                  {resolution.whyImportant && (
                    <p className="text-gray-700 mb-3 italic">
                      "{resolution.whyImportant}"
                    </p>
                  )}
                  {resolution.description && (
                    <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                      {resolution.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Edit functionality can be added later
                    }}
                    className="p-2 text-gray-400 hover:text-coral-600 hover:bg-coral-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this resolution?')) {
                        await deleteResolution(resolution.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{resolution.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${resolution.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              {resolution.milestones && resolution.milestones.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Milestones</h4>
                  <div className="space-y-3">
                    {resolution.milestones.map((milestone: Milestone, index: number) => (
                      <div
                        key={milestone.id || index}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                      >
                        <button
                          onClick={async () => {
                            const updatedMilestones = resolution.milestones.map((m: Milestone) =>
                              (m.id === milestone.id || m === milestone) ? { ...m, completed: !m.completed } : m
                            );
                            const completedCount = updatedMilestones.filter((m: Milestone) => m.completed).length;
                            const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
                            await updateResolution(resolution.id, {
                              milestones: updatedMilestones,
                              progress: newProgress,
                            });
                          }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            milestone.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {milestone.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {milestone.title}
                          </p>
                          {milestone.targetDate && (
                            <p className="text-sm text-gray-500">
                              Target: {format(parseISO(milestone.targetDate), 'MMM d, yyyy')}
                            </p>
                          )}
                          {milestone.notes && (
                            <p className="text-sm text-gray-600 mt-1">{milestone.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reflections */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Reflections
                    {resolution.reflections && resolution.reflections.length > 0 && (
                      <span className="ml-2 text-gray-500 font-normal">
                        ({resolution.reflections.length})
                      </span>
                    )}
                  </h4>
                  <button
                    onClick={() => {
                      setSelectedResolution(resolution.id);
                      setReflectionData({
                        content: '',
                        mood: 'good',
                        progressPercentage: resolution.progress,
                      });
                      setShowReflectionModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Add Reflection
                  </button>
                </div>

                {resolution.reflections && resolution.reflections.length > 0 ? (
                  <div className="space-y-3">
                    {resolution.reflections
                      .slice()
                      .sort((a: Reflection, b: Reflection) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((reflection: Reflection, index: number) => {
                        const MoodIcon =
                          reflection.mood === 'great' || reflection.mood === 'good' ? Smile :
                          reflection.mood === 'neutral' ? Meh :
                          Frown;
                        const moodColor =
                          reflection.mood === 'great' || reflection.mood === 'good' ? 'text-green-600' :
                          reflection.mood === 'neutral' ? 'text-gray-600' :
                          'text-amber-600';

                        return (
                          <div key={reflection.id || index} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <MoodIcon className={`w-5 h-5 ${moodColor}`} />
                                <span className="text-sm font-medium text-blue-900">
                                  {format(parseISO(reflection.date), 'MMMM d, yyyy')}
                                </span>
                              </div>
                              {reflection.progressPercentage !== undefined && (
                                <span className="text-sm font-semibold text-blue-700">
                                  {reflection.progressPercentage}% progress
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-blue-800 whitespace-pre-wrap">
                              {reflection.content}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No reflections yet</p>
                    <button
                      onClick={() => {
                        setSelectedResolution(resolution.id);
                        setReflectionData({
                          content: '',
                          mood: 'good',
                          progressPercentage: resolution.progress,
                        });
                        setShowReflectionModal(true);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add your first reflection
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reflection Modal */}
      {showReflectionModal && selectedResolution && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-4 sm:p-6 shadow-elevated my-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold">Add Reflection</h3>
              <button
                onClick={() => {
                  setShowReflectionModal(false);
                  setSelectedResolution(null);
                  setReflectionData({ content: '', mood: 'good', progressPercentage: 0 });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How has your resolution been going?
                </label>
                <textarea
                  value={reflectionData.content}
                  onChange={(e) => setReflectionData({ ...reflectionData, content: e.target.value })}
                  placeholder="Share your thoughts, progress, challenges, and victories..."
                  className="input min-h-[150px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Reflect on what's working well, what challenges you've faced, and how you're feeling about your journey.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How are you feeling about your progress?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'great', label: 'Great', icon: Smile, color: 'bg-green-100 text-green-700 border-green-300' },
                    { id: 'good', label: 'Good', icon: Smile, color: 'bg-blue-100 text-blue-700 border-blue-300' },
                    { id: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-gray-100 text-gray-700 border-gray-300' },
                    { id: 'challenging', label: 'Challenging', icon: Frown, color: 'bg-amber-100 text-amber-700 border-amber-300' },
                  ].map((mood) => {
                    const IconComponent = mood.icon;
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setReflectionData({ ...reflectionData, mood: mood.id })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          reflectionData.mood === mood.id
                            ? `${mood.color} border-2`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">{mood.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Progress: {reflectionData.progressPercentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={reflectionData.progressPercentage}
                  onChange={(e) => setReflectionData({ ...reflectionData, progressPercentage: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowReflectionModal(false);
                    setSelectedResolution(null);
                    setReflectionData({ content: '', mood: 'good', progressPercentage: 0 });
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!reflectionData.content.trim()) {
                      alert('Please write your reflection');
                      return;
                    }

                    const resolution = resolutions.find((r) => r.id === selectedResolution);
                    if (!resolution) return;

                    const newReflection: Reflection = {
                      id: Date.now().toString(),
                      date: new Date().toISOString(),
                      content: reflectionData.content,
                      mood: reflectionData.mood,
                      progressPercentage: reflectionData.progressPercentage,
                    };

                    const updatedReflections = [...(resolution.reflections || []), newReflection];
                    await updateResolution(selectedResolution, {
                      reflections: updatedReflections,
                      progress: reflectionData.progressPercentage,
                    });

                    setShowReflectionModal(false);
                    setSelectedResolution(null);
                    setReflectionData({ content: '', mood: 'good', progressPercentage: 0 });
                  }}
                  className="flex-1 btn-primary"
                  disabled={!reflectionData.content.trim()}
                >
                  Save Reflection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!showWizard && !hasResolutions && renderWelcomeState()}
    </div>
  );
}

