import React, { useEffect, useMemo, useState } from 'react';

type TourStep = {
  id: string;
  selector: string;
  title: string;
  description: string;
};

type Props = {
  steps: TourStep[];
  currentStepIndex: number;
  isOpen: boolean;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onFinish: () => void;
};

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export const DashboardTour: React.FC<Props> = ({
  steps,
  currentStepIndex,
  isOpen,
  onNext,
  onBack,
  onSkip,
  onFinish,
}) => {
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  const currentStep = useMemo(() => {
    if (!steps.length) return null;
    return steps[Math.min(Math.max(currentStepIndex, 0), steps.length - 1)];
  }, [steps, currentStepIndex]);

  useEffect(() => {
    if (!isOpen || !currentStep || typeof document === 'undefined') {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(currentStep.selector) as HTMLElement | null;
      if (!el) {
        setTargetRect(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        if (currentStepIndex === steps.length - 1) {
          onFinish();
        } else {
          onNext();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentStepIndex > 0) {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, currentStepIndex, steps.length, onNext, onBack, onSkip, onFinish]);

  if (!isOpen || !currentStep) return null;

  const isLast = currentStepIndex === steps.length - 1;

  // Default to centered card on very small screens or when target not found
  const useCenteredCard = !targetRect || window.innerWidth < 640;

  let cardStyle: React.CSSProperties = {};
  if (!useCenteredCard && targetRect) {
    const margin = 16;
    const preferredTop = targetRect.top + targetRect.height + margin;
    const bottomSpace = window.scrollY + window.innerHeight - preferredTop;
    const placeAbove = bottomSpace < 200; // not enough space below

    const top = placeAbove
      ? Math.max(targetRect.top - margin - 200, window.scrollY + margin)
      : preferredTop;

    const centerX = targetRect.left + targetRect.width / 2;
    const width = Math.min(360, window.innerWidth - margin * 2);
    const left = Math.min(
      Math.max(centerX - width / 2, window.scrollX + margin),
      window.scrollX + window.innerWidth - margin - width
    );

    cardStyle = {
      position: 'absolute',
      top,
      left,
      width,
      zIndex: 60,
    };
  } else {
    cardStyle = {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: 420,
      zIndex: 60,
    };
  }

  return (
    <>
      {/* Highlight box with dimmed surroundings */}
      {targetRect && !useCenteredCard && (
        <div
          className="absolute border-2 border-coral-400 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] pointer-events-none transition-all duration-200"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            zIndex: 50,
          }}
        />
      )}

      {/* Tooltip/Card */}
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5"
        style={cardStyle}
        role="dialog"
        aria-modal="true"
        aria-label={currentStep.title}
      >
        <div className="flex justify-between items-start gap-3 mb-3">
          <div>
            <p className="text-xs font-medium text-gray-400">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-1">
              {currentStep.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            Skip tour
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {currentStep.description}
        </p>

        <div className="flex justify-between items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {steps.map((step, idx) => (
                <span
                  key={step.id}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'w-4 bg-coral-500'
                      : 'w-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={isLast ? onFinish : onNext}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-coral-500 text-white hover:bg-coral-600 transition-colors"
            >
              {isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTour;

