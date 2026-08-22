import React, { createContext, useContext, useState } from 'react';
import { en, TranslationKey } from './translations/en';
import { es } from './translations/es';
import { STORAGE_KEYS } from '../services/storage';

export type Locale = 'en' | 'es';

export interface I18nContextType {
  locale: Locale;
  t: (key: TranslationKey | string) => string;
  toggleLanguage: () => void;
  setLocale: (l: Locale) => void;
}

const dictionaries: Record<Locale, Record<string, string>> = {
  en,
  es,
};

const I18nContext = createContext<I18nContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(STORAGE_KEYS.LOCALE);
    return saved === 'es' ? 'es' : 'en';
  });

  const toggleLanguage = () => {
    setLocaleState((prev) => {
      const next: Locale = prev === 'en' ? 'es' : 'en';
      localStorage.setItem(STORAGE_KEYS.LOCALE, next);
      return next;
    });
  };

  const setLocale = (l: Locale) => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, l);
    setLocaleState(l);
  };

  const t = (key: TranslationKey | string): string => {
    const dict = dictionaries[locale] || dictionaries.en;
    return dict[key] || dictionaries.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, toggleLanguage, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
};
