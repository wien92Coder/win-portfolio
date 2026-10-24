import { useTranslation } from 'react-i18next';
import { LANGUAGES, normalizeLanguage, setLanguage } from '../i18n/config';

/**
 * ID | EN switch. Persists to localStorage through `setLanguage` (which writes
 * inside the i18n config) and keeps the same width in both states, so the
 * header does not shift when the language changes.
 */
export function LanguageToggle({
  className = '',
  tone = 'ink',
}: {
  className?: string;
  tone?: 'ink' | 'paper';
}) {
  const { i18n } = useTranslation();
  const current = normalizeLanguage(i18n.language);
  const idle = tone === 'paper' ? 'text-paper/45' : 'text-ink/40';
  const active = tone === 'paper' ? 'text-paper' : 'text-ink';
  const hover = tone === 'paper' ? 'hover:text-paper' : 'hover:text-ink';

  return (
    <div
      role="group"
      aria-label="Language / Bahasa"
      className={`label flex min-h-[44px] items-center gap-0.5 ${className}`}
    >
      {LANGUAGES.map((lang, i) => (
        <span key={lang} className="flex items-center gap-1">
          {i > 0 ? <span aria-hidden className={idle}>|</span> : null}
          <button
            type="button"
            onClick={() => setLanguage(lang)}
            aria-pressed={current === lang}
            className={`flex min-h-[44px] min-w-[30px] items-center justify-center px-1 uppercase transition-colors ${hover} ${
              current === lang ? active : idle
            }`}
          >
            {lang}
            <span className="sr-only">{lang === 'id' ? ' — Bahasa Indonesia' : ' — English'}</span>
          </button>
        </span>
      ))}
    </div>
  );
}
