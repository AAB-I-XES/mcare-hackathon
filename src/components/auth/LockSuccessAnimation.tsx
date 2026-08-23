import React, { useEffect, useState } from 'react';
import { Lock, Unlock, Check } from 'lucide-react';

interface LockSuccessAnimationProps {
  title?: string;
  subtitle?: string;
  onAnimationEnd?: () => void;
}

export const LockSuccessAnimation: React.FC<LockSuccessAnimationProps> = ({
  title = 'Securing Digital Health Profile',
  subtitle = 'Generating encrypted credentials...',
  onAnimationEnd,
}) => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // 1. Initial state: unlocked shackle
    // 2. Lock shackle snaps down after 500ms
    const lockTimer = setTimeout(() => {
      setIsLocked(true);
    }, 500);

    // 3. Complete and proceed
    const finishTimer = setTimeout(() => {
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    }, 1800);

    return () => {
      clearTimeout(lockTimer);
      clearTimeout(finishTimer);
    };
  }, [onAnimationEnd]);

  return (
    <div
      id="lock-success-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-7 max-w-sm w-full shadow-lg text-center space-y-4">
        {/* Minimalist Lock Icon Stage */}
        <div className="relative flex items-center justify-center h-20">
          <div
            className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${
              isLocked
                ? 'bg-slate-900 border-slate-900 text-white scale-105'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {/* SVG Minimalist Padlock with Mechanical Shackle Animation */}
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Shackle: transitions from raised & open to closed */}
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                className={`transition-all duration-300 ease-out origin-top ${
                  isLocked
                    ? 'translate-y-0 opacity-100 stroke-current'
                    : '-translate-y-1.5 -translate-x-0.5 opacity-90 stroke-slate-500'
                }`}
              />
              {/* Body */}
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              {/* Center keyhole / checkmark */}
              {isLocked ? (
                <path
                  d="m9 16 2 2 4-4"
                  strokeWidth="2.5"
                  className="animate-in zoom-in-50 duration-200"
                />
              ) : (
                <circle cx="12" cy="16" r="1.25" fill="currentColor" />
              )}
            </svg>
          </div>
        </div>

        {/* Text & Status Information */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors duration-300 bg-slate-100 text-slate-700 border border-slate-200">
            {isLocked ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Encrypted & Secured</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                <span>Securing Passport</span>
              </>
            )}
          </div>

          <h3 className="text-base font-semibold text-slate-900">
            {isLocked ? 'Registration Complete' : title}
          </h3>

          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {isLocked
              ? 'Your cryptographic health record has been established.'
              : subtitle}
          </p>
        </div>

        {/* Minimal Progress Indicator */}
        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full bg-slate-900 transition-all duration-700 ease-out rounded-full ${
              isLocked ? 'w-full' : 'w-1/3'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
