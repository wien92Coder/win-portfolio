/**
 * i18n setup for the bilingual (Bahasa/English) portfolio.
 *
 * Locale selection precedence (per ADR 0001):
 *   1. `?lang=` URL parameter (shareable links)
 *   2. Persisted choice in localStorage
 *   3. Browser-language detection (English browsers → EN)
 *   4. Bahasa default
 *
 * To wire up: `import '@/i18n/config'` once at app bootstrap (e.g. main.tsx),
 * then use `useTranslation()` from react-i18next in components. Language
 * toggle components should call `setLanguage('id' | 'en')`.
 *
 * Locale files live in `src/i18n/locales/` and are statically imported —
 * they're small, so no lazy loading is needed.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import id from './locales/id.json';

export const LANGUAGES = ['id', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'id';
export const FALLBACK_LANGUAGE: Language = 'en';
export const STORAGE_KEY = 'portfolio.lang';

const SUPPORTED = new Set<string>(LANGUAGES);

export function detectLanguage(): Language {
  // 1. Explicit ?lang= URL override (shareable/bookmarkable links)
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang && SUPPORTED.has(urlLang)) {
    return urlLang as Language;
  }

  // 2. Persisted preference from a previous visit
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.has(stored)) {
    return stored as Language;
  }

  // 3. Browser-language detection — English browsers get EN, everyone else
  //    (including Indonesian browsers) gets the Bahasa default
  const browser = navigator.language?.toLowerCase() ?? '';
  if (browser.startsWith('en')) {
    return 'en';
  }

  // 4. Default
  return DEFAULT_LANGUAGE;
}

export function persistLanguage(lang: Language): void {
  window.localStorage.setItem(STORAGE_KEY, lang);
}

/** Normalizes any resolved i18next language to the supported union. */
export function normalizeLanguage(lang: string | undefined): Language {
  return lang === 'en' ? 'en' : 'id';
}

export function setLanguage(lang: Language): void {
  persistLanguage(lang);
  void i18n.changeLanguage(lang);
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: detectLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: {
    // React already escapes rendered output — avoids double-escaping
    escapeValue: false,
  },
  // Locales are statically imported, so initialization is synchronous —
  // no Suspense boundary is required around the app.
  initAsync: false,
  returnNull: false,
});

export default i18n;