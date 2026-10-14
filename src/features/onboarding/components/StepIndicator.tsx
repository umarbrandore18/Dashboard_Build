import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const STEP_LABELS = [
  'Business Info',
  'Primary Contact',
  'Markets',
  'Payment Rails',
  'Settlement',
  'Review',
  'Submission',
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-xl p-4 shadow-subtle mb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress bar line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>

        {STEP_LABELS.slice(0, totalSteps).map((label, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = stepNumber < currentStep;

          return (
            <div
              key={label}
              className="flex flex-col items-center relative z-10 select-none group"
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(stepNumber)}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2',
                  isCompleted
                    ? 'bg-blue-600 text-white border-blue-600 cursor-pointer shadow-xs'
                    : isCurrent
                    ? 'bg-white text-blue-600 border-blue-600 ring-4 ring-blue-50'
                    : 'bg-white text-slate-400 border-slate-300 cursor-not-allowed'
                )}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${stepNumber}: ${label}`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </button>

              <span
                className={cn(
                  'text-[11px] font-semibold mt-2 hidden sm:block text-center transition-colors',
                  isCurrent
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

