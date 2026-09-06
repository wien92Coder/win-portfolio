import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../i18n/LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { id: 'hero', key: 'hero' },
  { id: 'playground', key: 'playground' },
  { id: 'case-studies', key: 'caseStudies' },
  { id: 'competency', key: 'competency' },
  { id: 'about', key: 'about' },
  { id: 'contact', key: 'contact' },
] as const;

export function Nav() {
  const { t } = useTranslation();

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-ui)] border-b border-[color:var(--card-border)] bg-[color:var(--card-bg)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-3">
        <a href="#hero" className="text-[0.65rem] font-medium uppercase tracking-[0.3em]">
          Win Winarno
        </a>
        <nav aria-label="Sections" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--fg)]"
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}