/**
 * MediGuard AI - Language Context & Translation Provider
 * Supports English (en), Telugu (te), and Hindi (hi)
 * Extensible design for adding further languages
 * Never alters medicine names, dosages, clinical metrics or identifiers
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './languages';
import { en } from './translations/en';
import { te } from './translations/te';
import { hi } from './translations/hi';
import { translateAlert as translateClinicalAlert } from './clinicalExplanations';

const dictionaries = {
  en,
  te,
  hi
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES[saved]) {
        return saved;
      }
    } catch {
      // ignore storage access errors
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((newLang) => {
    if (SUPPORTED_LANGUAGES[newLang]) {
      setLanguageState(newLang);
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } catch (err) {
        console.warn('Unable to persist language choice:', err);
      }
      try {
        document.documentElement.lang = newLang;
      } catch {
        // SSR safe
      }
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // SSR safe
    }
  }, [language]);

  /**
   * Helper function to resolve nested keys like "dashboard.patientsReviewed"
   */
  const getNestedValue = (obj, path) => {
    if (!obj || !path) return undefined;
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  };

  /**
   * Translation function `t(key, params, fallback)`
   * Resolves in active language, falls back to English, then to fallback/key.
   * Interpolates {paramName} patterns without mutating parameters.
   */
  const t = useCallback((key, params = {}, fallback = '') => {
    const activeDict = dictionaries[language] || dictionaries.en;
    let template = getNestedValue(activeDict, key);

    // Fallback to English dictionary if key is missing in active language
    if (template === undefined && language !== 'en') {
      template = getNestedValue(dictionaries.en, key);
    }

    if (template === undefined) {
      template = fallback || key;
    }

    if (typeof template !== 'string') {
      return template;
    }

    // Interpolate {key} placeholders
    if (params && typeof params === 'object') {
      return template.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return paramKey in params ? String(params[paramKey]) : match;
      });
    }

    return template;
  }, [language]);

  /**
   * Localizes a clinical safety alert with translated clinical rationale and action
   * while strictly protecting drug names, brand names, and rule codes.
   */
  const translateAlert = useCallback((alert) => {
    return translateClinicalAlert(alert, language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    translateAlert,
    languages: Object.values(SUPPORTED_LANGUAGES),
    currentLanguage: SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.en
  }), [language, setLanguage, t, translateAlert]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

