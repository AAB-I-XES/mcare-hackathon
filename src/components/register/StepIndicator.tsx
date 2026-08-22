import React from 'react';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { step: 1, label: 'Personal Details' },
  { step: 2, label: 'Medical Baseline' },
  { step: 3, label: 'Preferences' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {steps.map(({ step, label }) => (
        <div key={label} className="text-center">
          <div
            className={`h-1.5 rounded-full transition mb-1.5 ${
              currentStep >= step ? 'bg-slate-900' : 'bg-slate-200'
            }`}
          />
          <p
            className={`text-[11px] font-semibold truncate ${
              currentStep === step ? 'text-slate-900 font-bold' : 'text-slate-400'
            }`}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};
