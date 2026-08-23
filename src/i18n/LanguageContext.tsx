import React, { createContext, useContext, useState } from 'react';
import { en, TranslationKey } from './translations/en';
import { es } from './translations/es';
import { as } from './translations/as';
import { hi } from './translations/hi';
import { bn } from './translations/bn';
import { STORAGE_KEYS } from '../services/storage';

export type Locale = 'en' | 'hi' | 'bn' | 'as' | 'es';

export interface LanguageOption {
  code: Locale;
  name: string;
  nativeName: string;
  badge: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', badge: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', badge: 'HI' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', badge: 'BN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', badge: 'AS' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', badge: 'ES' },
];

export interface I18nContextType {
  locale: Locale;
  t: (key: TranslationKey | string) => string;
  toggleLanguage: () => void;
  setLocale: (l: Locale) => void;
  languages: LanguageOption[];
}

const dictionaries: Record<Locale, Record<string, string>> = {
  en,
  hi,
  bn,
  as,
  es,
};

const I18nContext = createContext<I18nContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(STORAGE_KEYS.LOCALE) as Locale | null;
    if (saved && ['en', 'hi', 'bn', 'as', 'es'].includes(saved)) {
      return saved;
    }
    return 'en';
  });

  const toggleLanguage = () => {
    setLocaleState((prev) => {
      const order: Locale[] = ['en', 'hi', 'bn', 'as', 'es'];
      const nextIndex = (order.indexOf(prev) + 1) % order.length;
      const next = order[nextIndex];
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
    <I18nContext.Provider value={{ locale, t, toggleLanguage, setLocale, languages: SUPPORTED_LANGUAGES }}>
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
