import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useTransition } from '../context/TransitionContext';
import { useUI } from '../context/UIContext';
import { useProjects } from '../content/projects';

const DURATION = 4200; // ms per slide
const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Hero showpiece: an auto-advancing slider through the project covers. Each
 * slide wipes in with a clip-path reveal over a slow Ken-Burns zoom, and an
 * accent bar tracks autoplay. Clicking the frame or the name chip opens the
 * case study through the page transition.
 *
 * Autoplay is switched off for reduced-motion visitors — a looping 4s
 * animation is exactly the kind of movement they asked the OS to stop.
 */
export function HeroSlider({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  const projects = useProjects();
  const { navigateTo } = useTransition();
  const { setCursor } = useUI();
  const reducedMotion = useReducedMotion();
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const count = projects.length;

  const go = useCallback(
    (delta: number) => setSlide(([i]) => [(i + delta + count) % count, delta]),
    [count],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => go(1), DURATION);
    return () => clearTimeout(timer);
  }, [index, go, reducedMotion]);

  if (count === 0) return null;
  const active = projects[index];

  return (
    <div className={`group relative overflow-hidden bg-ink/5 ${className}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.button
          key={active.slug}
          type="button"
          aria-label={`${t('menu.work')} — ${active.name}`}
          onClick={() => navigateTo(`/work/${active.slug}`)}
          onMouseEnter={() => setCursor('view')}
          onMouseLeave={() => setCursor('default')}
          className="absolute inset-0 block h-full w-full"
          initial={{ clipPath: direction > 0 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0% 0)', transition: { duration: 0.8, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.55 } }}
        >
          <motion.img
            src={active.image}
            alt={active.name}
            draggable={false}
            initial={{ scale: reducedMotion ? 1 : 1.25 }}
            animate={{ scale: 1, transition: { duration: reducedMotion ? 0 : 6, ease: 'linear' } }}
            className="img-editorial h-full w-full object-cover"
          />
        </motion.button>
      </AnimatePresence>

      {/* Autoplay progress bar */}
      {!reducedMotion && (
        <motion.div
          key={`bar-${index}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: DURATION / 1000, ease: 'linear' }}
          style={{ originX: 0 }}
          className="absolute inset-x-0 top-0 z-20 h-[3px] bg-accent"
        />
      )}

      {/* Counter */}
      <div className="pointer-events-none absolute right-3 top-4 z-20 mix-blend-difference">
        <p className="label text-paper">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
      </div>

      {/* Project name chip */}
      <div className="absolute bottom-0 left-0 z-20 max-w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.button
            key={active.slug}
            type="button"
            onClick={() => navigateTo(`/work/${active.slug}`)}
            onMouseEnter={() => setCursor('view')}
            onMouseLeave={() => setCursor('default')}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-baseline gap-2.5 bg-accent px-3.5 py-2.5 text-paper sm:gap-3 sm:px-4 sm:py-3"
          >
            <span className="font-mono text-[10px]">{active.index}</span>
            <span className="font-display text-sm lowercase leading-none tracking-tight sm:text-lg">
              {active.name}
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Advance arrow */}
      <button
        type="button"
        aria-label={t('work.nextProject')}
        onClick={() => go(1)}
        onMouseEnter={() => setCursor('link')}
        onMouseLeave={() => setCursor('default')}
        className="group/arrow absolute bottom-0 right-0 z-20 flex h-12 w-12 items-center justify-center bg-ink text-paper transition-colors duration-300 hover:bg-accent sm:h-14 sm:w-14"
      >
        <span className="text-lg leading-none transition-transform duration-500 ease-expo group-hover/arrow:translate-x-1">
          →
        </span>
      </button>
    </div>
  );
}
