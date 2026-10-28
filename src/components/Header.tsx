import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useUI } from '../context/UIContext';
import { site } from '../content/site';
import { TransitionLink } from './TransitionLink';
import { LanguageToggle } from './LanguageToggle';

/**
 * Persistent header: wordmark left, a live location tag, and one Menu trigger.
 * mix-blend-difference keeps it legible over both paper and image backgrounds.
 */
export function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { setCursor, menuOpen, setMenuOpen } = useUI();
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: '/work', key: 'menu.work' },
    { href: '/karya', key: 'menu.caseStudies' },
    { href: '/about', key: 'menu.studio' },
    { href: '/contact', key: 'menu.contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] mix-blend-difference">
      <div
        className={`flex items-center justify-between px-5 text-paper transition-[padding] duration-500 sm:px-8 ${
          scrolled ? 'py-3 sm:py-4' : 'py-5 sm:py-6'
        }`}
      >
        <TransitionLink
          href="/"
          className="pointer-events-auto flex items-baseline gap-1.5 font-display lowercase leading-none"
        >
          <span className="text-xl tracking-tight sm:text-2xl">{site.word}</span>
          <span className="text-accent">.</span>
          <span className="label ml-1 hidden translate-y-[-2px] text-paper/60 sm:inline">®</span>
        </TransitionLink>

        <nav aria-label={t('menu.label')} className="pointer-events-auto hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              cursorMode="link"
              aria-current={pathname === link.href ? 'page' : undefined}
              className={`label flex min-h-[44px] items-center py-2 transition-colors hover:text-paper ${
                pathname === link.href ? 'text-paper' : 'text-paper/55'
              }`}
            >
              {t(link.key)}
            </TransitionLink>
          ))}
        </nav>

        <div className="pointer-events-auto flex items-center gap-4 sm:gap-5">
          <LanguageToggle tone="paper" />
          <p className="label hidden text-paper/60 xl:block">{t('site.season')}</p>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          onMouseEnter={() => setCursor('link')}
          onMouseLeave={() => setCursor('default')}
          className="group label pointer-events-auto -my-4 flex min-h-[44px] items-center gap-3 py-4 text-paper"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? t('menu.close') : t('menu.openMenu')}
        >
          <span>{menuOpen ? t('menu.close') : t('menu.label')}</span>
          <span className="flex h-3 w-5 flex-col justify-between" aria-hidden>
            <span className="h-px w-full bg-paper" />
            <span className="h-px w-full bg-paper" />
            {/* the short accent line runs out to full width on hover */}
            <span className="h-px w-3/5 bg-accent transition-[width] duration-500 ease-expo group-hover:w-full" />
          </span>
        </button>
        </div>
      </div>
    </header>
  );
}
