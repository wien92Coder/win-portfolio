import { useTranslation } from 'react-i18next';
import { LANGUAGES, normalizeLanguage, setLanguage } from './config';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const active = normalizeLanguage(i18n.language);

  return (
    <div
      className="flex items-stretch border border-[color:var(--card-border)]"
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((lang) => {
        const isActive = lang === active;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            aria-pressed={isActive}
            title={lang === 'id' ? 'Bahasa Indonesia' : 'English'}
            className={`px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.25em] transition-colors duration-300 ${
              isActive
                ? 'bg-[color:var(--card-bg)] text-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            {lang}
          </button>
        );
      })}
    </div>
  );
}