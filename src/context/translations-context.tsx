"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import translations from '@/lib/translations';

type Language = keyof typeof translations;

interface TranslationsContextType {
  language: Language;
  t: (key: string, replacements?: Record<string, string>) => string;
  languages: Record<Language, string>;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

export const TranslationsProvider = ({ 
    children,
    language
}: { 
    children: ReactNode,
    language: string,
 }) => {
    
  const lang = (Object.keys(translations).includes(language) ? language : 'en') as Language;

  const t = (key: string, replacements?: Record<string, string>): string => {
    let translation = translations[lang]?.[key] || translations['en'][key] || key;
    
    if (replacements) {
        Object.entries(replacements).forEach(([placeholder, value]) => {
            translation = translation.replace(`{{${placeholder}}}`, value);
        });
    }

    return translation;
  };
  
  const languages = Object.keys(translations).reduce((acc, lang) => {
    acc[lang as Language] = translations[lang as Language].languageName;
    return acc;
  }, {} as Record<Language, string>);

  return (
    <TranslationsContext.Provider value={{ language: lang, t, languages }}>
      {children}
    </TranslationsContext.Provider>
  );
};

export const useTranslations = () => {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};
