import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { motion, type Variants } from 'motion/react';
import { LanguageToggle } from '../i18n/LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { id: 'hero', key: 'hero' },
  { id: 'playground', key: 'playground' },
  { id: 'case-studies', key: 'caseStudies' },
  { id: '/six-faces', key: 'webProject', route: true },
  { id: 'competency', key: 'competency' },
  { id: 'about', key: 'about' },
  { id: 'contact', key: 'contact' },
] as const;

const LINK_CLASS =
  'nav-link text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--fg)]';

const MENU_LIST: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const MENU_ITEM: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export function Nav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape closes; focus moves to the first link on open and back to the
  // burger on close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    firstLinkRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function close() {
    setOpen(false);
    burgerRef.current?.focus();
  }

  /** Section anchor — close the menu first, then scroll once the scroll
   *  lock has been released (scrollIntoView is blocked while hidden). */
  function goToSection(href: string) {
    setOpen(false);
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[var(--z-ui)] border-b border-[color:var(--card-border)] bg-[color:var(--card-bg)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-x-6 px-6 py-3">
        <a href="#hero" className="text-[0.65rem] font-medium uppercase tracking-[0.3em]">
          Win Winarno
        </a>

        {/* Desktop links */}
        <nav aria-label="Sections" className="hidden items-center gap-x-4 md:flex">
          {LINKS.map((link) =>
            'route' in link ? (
              <Link key={link.id} to={link.id} className={LINK_CLASS}>
                {t(`nav.${link.key}`)}
              </Link>
            ) : (
              <a key={link.id} href={`#${link.id}`} className={LINK_CLASS}>
                {t(`nav.${link.key}`)}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop toggles */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Mobile burger */}
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            className="flex h-8 w-8 items-center justify-center border border-[color:var(--card-border)] text-[var(--fg)] transition-colors duration-300 hover:text-[var(--accent)] md:hidden"
          >
            <span className={`burger-icon ${open ? 'open' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      </header>

      {/* Mobile full-screen menu — OUTSIDE the header so its position:fixed
          stays viewport-relative (the header's backdrop-filter creates a
          containing block that would otherwise trap the overlay). Renders
          without an exit animation so it can never linger invisibly. */}
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-0 top-14 z-[calc(var(--z-ui)+1)] overflow-y-auto border-t border-[color:var(--card-border)] bg-[color:var(--card-bg)] backdrop-blur-md md:hidden"
        >
          <nav aria-label="Mobile sections" className="flex min-h-full flex-col px-6 py-8">
            <motion.ul variants={MENU_LIST} initial="hidden" animate="show" className="space-y-1">
              {LINKS.map((link, index) => {
                const label = t(`nav.${link.key}`);
                const className =
                  'font-[family-name:var(--font-display)] text-[clamp(1.8rem,8vw,2.6rem)] leading-none tracking-[0.04em] text-[var(--fg)] transition-colors duration-300 hover:text-[var(--accent)]';
                return (
                  <motion.li key={link.id} variants={MENU_ITEM}>
                    {'route' in link ? (
                      <Link ref={index === 0 ? firstLinkRef : undefined} to={link.id} onClick={close} className={className}>
                        {label}
                      </Link>
                    ) : (
                      <a
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={`#${link.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          goToSection(`#${link.id}`);
                        }}
                        className={className}
                      >
                        {label}
                      </a>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>

            <div className="mt-auto flex items-center gap-3 pt-10">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </nav>
        </motion.div>
      )}
    </>
  );
}