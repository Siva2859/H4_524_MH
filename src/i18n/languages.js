/**
 * MediGuard AI - Supported Clinical Languages Configuration
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 */

export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    shortLabel: 'EN',
    flag: '🇬🇧',
    direction: 'ltr',
    fontFamily: 'Inter, sans-serif'
  },
  te: {
    code: 'te',
    label: 'Telugu',
    nativeName: 'తెలుగు',
    shortLabel: 'తె',
    flag: '🇮🇳',
    direction: 'ltr',
    fontFamily: "'Noto Sans Telugu', 'Inter', sans-serif"
  },
  hi: {
    code: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    shortLabel: 'हि',
    flag: '🇮🇳',
    direction: 'ltr',
    fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif"
  }
};

export const SUPPORTED_LANGUAGES_LIST = Object.values(SUPPORTED_LANGUAGES);
export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_STORAGE_KEY = 'mediguard_language_preference';

export function getLanguageConfig(code) {
  return SUPPORTED_LANGUAGES[code] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
}
