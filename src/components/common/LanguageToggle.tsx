import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n, Locale, SUPPORTED_LANGUAGES } from '../../i18n';

interface LanguageToggleProps {
  className?: string;
  showText?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  showText = true,
}) => {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === locale) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
        title="Select Language / ভাষা নিৰ্বাচন / भाषा चुनें / ভাষা নির্বাচন"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {showText && (
          <span className="flex items-center gap-1.5">
            <span className="font-medium text-slate-800">{currentLang.nativeName}</span>
            <span className="text-[10px] text-slate-400 font-normal">({currentLang.code.toUpperCase()})</span>
          </span>
        )}
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white border border-slate-200 shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Choose Language / ভাষা / भाषा
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === locale;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLocale(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-5 rounded flex items-center justify-center text-[10px] font-mono-code font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {lang.badge}
                  </span>
                  <div>
                    <div className="font-medium text-slate-800">{lang.nativeName}</div>
                    <div className="text-[10px] text-slate-400">{lang.name}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
