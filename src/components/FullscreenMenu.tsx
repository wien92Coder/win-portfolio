import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useUI } from '../context/UIContext';
import { useTransition } from '../context/TransitionContext';
import { NAV_ITEMS } from '../content/nav';
import { site } from '../content/site';

const EASE = [0.76, 0, 0.24, 1] as const;

const panel = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.7, ease: EASE } },
  exit: { clipPath: 'inset(100% 0% 0% 0%)', transition: { duration: 0.55, ease: EASE } },
};

const line = {
  hidden: { y: '115%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] as const, delay: 0.22 + i * 0.07 },
  }),
  exit: { y: '115%', transition: { duration: 0.3, ease: EASE } },
};

const fade = (delay: number) => ({
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
});

/** Live local time in the menu footer — a small, honest detail. */
function Clock() {
  const [now, setNow] = useState('');

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Jakarta',
        }).format(new Date()),
      );
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="tabular-nums">{now} WIB</span>;
}

/**
 * Full-screen editorial menu: big lowercase links rising out of clip masks,
 * with a preview image crossfading on hover. Works on every viewport.
 */
export function FullscreenMenu() {
  const { t } = useTranslation();
  const { menuOpen, setMenuOpen } = useUI();
  const { navigateTo } = useTransition();
  const { pathname } = useLocation();
  const [active, setActive] = useState(0);

  // Lock scrolling while open (Lenis respects .lenis-stopped).
  useEffect(() => {
    document.documentElement.classList.toggle('lenis-stopped', menuOpen);
    return () => document.documentElement.classList.remove('lenis-stopped');
  }, [menuOpen]);

  function go(href: string) {
    setMenuOpen(false);
    // Let the menu start collapsing before the route wipe begins.
    setTimeout(() => navigateTo(href), 120);
  }

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          id="site-menu"
          variants={panel}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[88] flex flex-col bg-ink text-paper"
        >
          <motion.div
            variants={fade(0.15)}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6"
          >
            <p className="label text-paper/60">
              {site.brand} — {t('menu.label')}
            </p>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="label flex items-center gap-2 text-paper"
              aria-label={t('menu.close')}
            >
              {t('menu.close')}
              <span className="relative h-3 w-3" aria-hidden>
                <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-paper" />
                <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-paper" />
              </span>
            </button>
          </motion.div>

          <div className="grid flex-1 grid-cols-1 sm:grid-cols-12">
            <nav
              aria-label={t('menu.label')}
              className="col-span-1 flex flex-col justify-center px-5 sm:col-span-7 sm:px-8"
            >
              {NAV_ITEMS.map((link, i) => {
                const isCurrent = pathname === link.href;
                return (
                  <div key={link.href} className="reveal-mask">
                    <motion.button
                      type="button"
                      custom={i}
                      variants={line}
                      onClick={() => go(link.href)}
                      onMouseEnter={() => setActive(i)}
                      className="group flex w-full items-center gap-5 py-1 text-left sm:gap-8"
                    >
                      <span className="label w-6 shrink-0 text-paper/40 transition-colors group-hover:text-accent">
                        {link.index}
                      </span>
                      <span
                        className={`font-display text-[16vw] lowercase leading-[0.95] tracking-tight transition-[opacity,transform] duration-500 group-hover:translate-x-2 sm:text-[7vw] ${
                          isCurrent ? 'text-accent' : 'text-paper'
                        }`}
                      >
                        {t(link.key)}
                      </span>
                      <span className="label ml-auto hidden text-paper/40 transition-colors group-hover:text-paper/80 sm:block">
                        {t(link.metaKey)}
                      </span>
                    </motion.button>
                  </div>
                );
              })}
            </nav>

            <motion.div
              variants={fade(0.35)}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative col-span-5 hidden overflow-hidden sm:block"
            >
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={NAV_ITEMS[active].image}
                  src={NAV_ITEMS[active].image}
                  alt=""
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="img-editorial absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-ink/10" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                <p className="label text-paper/80">{t(NAV_ITEMS[active].metaKey)}</p>
                <p className="label text-paper/80">
                  {String(active + 1).padStart(2, '0')} / {String(NAV_ITEMS.length).padStart(2, '0')}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fade(0.45)}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid grid-cols-2 gap-y-4 border-t border-paper/15 px-5 py-5 sm:grid-cols-4 sm:px-8"
          >
            <div>
              <p className="label mb-2 text-paper/40">{t('menu.studioLabel')}</p>
              <p className="label text-paper/80">{site.location}</p>
            </div>
            <div>
              <p className="label mb-2 text-paper/40">{t('menu.seasonLabel')}</p>
              <p className="label text-paper/80">{site.season}</p>
            </div>
            <div>
              <p className="label mb-2 text-paper/40">{t('menu.estLabel')}</p>
              <p className="label text-paper/80">{site.est}</p>
            </div>
            <div>
              <p className="label mb-2 text-paper/40">{t('menu.localTime')}</p>
              <p className="label text-paper/80">
                <Clock />
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
