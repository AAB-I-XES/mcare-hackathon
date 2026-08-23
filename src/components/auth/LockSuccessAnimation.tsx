import React, { useEffect, useState } from 'react';
import { Lock, Unlock, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

interface LockSuccessAnimationProps {
  title?: string;
  subtitle?: string;
  onAnimationEnd?: () => void;
}

export const LockSuccessAnimation: React.FC<LockSuccessAnimationProps> = ({
  title = 'Securing Digital Health Identity',
  subtitle = 'Generating zero-knowledge cryptographic keys...',
  onAnimationEnd,
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // 1. Initial state: unlocked (400ms)
    // 2. Snap to locked state at 650ms
    const lockTimer = setTimeout(() => {
      setIsLocked(true);
    }, 650);

    // 3. Mark complete & trigger final callback
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    }, 2200);

    return () => {
      clearTimeout(lockTimer);
      clearTimeout(finishTimer);
    };
  }, [onAnimationEnd]);

  return (
    <div
      id="lock-success-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative max-w-sm w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-8 text-center shadow-2xl overflow-hidden">
        {/* Subtle Background Glow */}
        <div
          className={`absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl transition-colors duration-700 pointer-events-none ${
            isLocked ? 'bg-emerald-500/25' : 'bg-amber-500/20'
          }`}
        />
        <div
          className={`absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-3xl transition-colors duration-700 pointer-events-none ${
            isLocked ? 'bg-sky-500/25' : 'bg-amber-500/15'
          }`}
        />

        {/* Lock Animation Stage */}
        <div className="relative flex items-center justify-center my-4 h-32">
          {/* Pulsing Concentric Security Rings */}
          <div
            className={`absolute w-28 h-28 rounded-full border border-dashed transition-all duration-700 ${
              isLocked
                ? 'border-emerald-500/40 scale-110 animate-[spin_8s_linear_infinite]'
                : 'border-amber-500/30 scale-100 animate-[spin_12s_linear_infinite]'
            }`}
          />
          <div
            className={`absolute w-20 h-20 rounded-full transition-all duration-700 ${
              isLocked
                ? 'bg-emerald-950/60 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                : 'bg-amber-950/50 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
            }`}
          />

          {/* SVG Animated Shackle and Padlock Container */}
          <div
            className={`relative z-10 flex items-center justify-center transition-transform duration-300 ${
              isLocked ? 'scale-105' : 'scale-95'
            }`}
          >
            {/* Custom Optical Animated Lock SVG */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Shackle */}
              <div
                className={`absolute top-0 w-8 h-8 rounded-t-full border-4 transition-all duration-500 ease-out origin-bottom-left ${
                  isLocked
                    ? 'border-emerald-400 translate-y-2 translate-x-0 rotate-0'
                    : 'border-amber-400 -translate-y-1 -translate-x-1 -rotate-25'
                }`}
              />

              {/* Padlock Body */}
              <div
                className={`absolute bottom-0 w-12 h-10 rounded-xl border-2 flex items-center justify-center transition-colors duration-500 shadow-md ${
                  isLocked
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-amber-600 border-amber-400 text-amber-100'
                }`}
              >
                {isLocked ? (
                  <ShieldCheck className="w-5 h-5 text-white animate-in zoom-in-75 duration-300" />
                ) : (
                  <KeyRound className="w-4 h-4 text-amber-100 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Text & Cryptographic Stage */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase transition-colors duration-500 border">
            {isLocked ? (
              <span className="bg-emerald-950 text-emerald-300 border-emerald-500/40 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Zero-Knowledge Encryption Locked
              </span>
            ) : (
              <span className="bg-amber-950 text-amber-300 border-amber-500/40 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Unlock className="w-3 h-3 text-amber-400" />
                Encrypting Personal Vault...
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">
            {isLocked ? 'Identity Secured & Encrypted' : title}
          </h3>

          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {isLocked
              ? 'Cryptographic pass activated. Personal medical records are secured under your private consent firewall.'
              : subtitle}
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-6 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out rounded-full ${
              isLocked
                ? 'w-full bg-gradient-to-r from-emerald-500 to-sky-400'
                : 'w-1/2 bg-gradient-to-r from-amber-500 to-amber-400'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
