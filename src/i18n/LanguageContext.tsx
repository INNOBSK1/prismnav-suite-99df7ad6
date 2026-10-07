import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { Language, translations, TranslationKeys } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

export const LANGUAGE_ORDER: Language[] = ['en', 'lg', 'nyn', 'xog', 'ach', 'teo', 'sw', 'nyo', 'lgg', 'laj', 'cgg'];
// Languages Google Translate can machine-translate
export const GOOGLE_LANGS: Language[] = ['en', 'lg', 'sw', 'ach', 'cgg'];

export const TOOL_ORIGINS = [
  'https://planthelp.netlify.app',
  'https://fbmsani.netlify.app',
  'https://fbmsfarmtracker.netlify.app',
  'https://fbmsstore.netlify.app',
  'https://fbmsblog.netlify.app',
];

const isLang = (v: unknown): v is Language => typeof v === 'string' && LANGUAGE_ORDER.includes(v as Language);

function setGoogTransCookie(value: string | null) {
  const host = window.location.hostname;
  const domains = ['', `; domain=${host}`, `; domain=.${host}`];
  domains.forEach((d) => {
    document.cookie = value
      ? `googtrans=${value}; path=/${d}`
      : `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
  });
}

function applyGoogleTranslate(lang: Language) {
  const useGoogle = GOOGLE_LANGS.includes(lang) && lang !== 'en';
  setGoogTransCookie(useGoogle ? `/en/${lang}` : null);
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (combo) {
    const target = useGoogle ? lang : 'en';
    if (combo.value !== target) {
      combo.value = target;
      combo.dispatchEvent(new Event('change'));
    }
  }
}

/** Post the language to every tool iframe on the page. */
export function postLangToIframes(lang: Language) {
  document.querySelectorAll<HTMLIFrameElement>('iframe[data-fbms-tool]').forEach((frame) => {
    try {
      const origin = new URL(frame.src).origin;
      frame.contentWindow?.postMessage({ type: 'FBMS_LANG', lang }, origin);
    } catch { /* ignore */ }
  });
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function initialLanguage(): Language {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLang(fromUrl)) return fromUrl;
  const saved = localStorage.getItem('fbms_lang') ?? localStorage.getItem('fbms-language');
  return isLang(saved) ? saved : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const current = useRef(language);

  const setLanguage = useCallback((lang: Language) => {
    if (!isLang(lang)) return;
    current.current = lang;
    setLanguageState(lang);
  }, []);

  // Apply side effects on load and on every change
  useEffect(() => {
    localStorage.setItem('fbms_lang', language);
    document.documentElement.lang = language;
    window.dispatchEvent(new CustomEvent('fbms-lang', { detail: language }));
    applyGoogleTranslate(language);
    postLangToIframes(language);
  }, [language]);

  // Google widget may load later; re-apply once its combo appears
  useEffect(() => {
    const obs = new MutationObserver(() => {
      if (document.querySelector('.goog-te-combo')) {
        applyGoogleTranslate(current.current);
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  // Listen for language messages from tools / parent
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.type !== 'FBMS_LANG' || !isLang(d.lang)) return;
      if (e.origin !== window.location.origin && !TOOL_ORIGINS.includes(e.origin) && e.source !== window.parent) return;
      if (d.lang !== current.current) setLanguage(d.lang);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [setLanguage]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
