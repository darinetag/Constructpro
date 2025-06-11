import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import enTranslations from '@/locales/en.js';
import frTranslations from '@/locales/fr.js';
import arTranslations from '@/locales/ar.js';


const translations = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations,
};

const I18nContext = createContext();

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    const storedLocale = localStorage.getItem('constructProLocale');
    return storedLocale && translations[storedLocale] ? storedLocale : 'en';
  });

  useEffect(() => {
    localStorage.setItem('constructProLocale', locale);
    if (locale === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', locale);
    }
  }, [locale]);

  const changeLocale = useCallback((newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
    }
  }, []);

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let current = translations[locale];
    try {
      for (const k of keys) {
        current = current[k];
        if (current === undefined) throw new Error(`Translation key not found: ${key}`);
      }
      if (typeof current === 'string') {
        return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
          return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
        }, current);
      }
      return current; 
    } catch (error) {
      console.warn(error.message);
      let fallback = translations['en'];
      try {
        for (const k of keys) {
          fallback = fallback[k];
          if (fallback === undefined) return key;
        }
        if (typeof fallback === 'string') {
          return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
            return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
          }, fallback);
        }
        return key;
      } catch {
        return key;
      }
    }
  }, [locale]);

  const value = {
    locale,
    changeLocale,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};