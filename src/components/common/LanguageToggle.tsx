import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../../i18n';

interface LanguageToggleProps {
  className?: string;
  showText?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  showText = true,
}) => {
  const { locale, toggleLanguage } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer ${className}`}
      title="Toggle Language"
      aria-label="Toggle language between English and Spanish"
    >
      <Globe className="w-3.5 h-3.5 text-slate-500" />
      {showText && <span>{locale === 'en' ? 'Español' : 'English'}</span>}
    </button>
  );
};
