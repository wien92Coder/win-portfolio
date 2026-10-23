import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion, useAnimationControls } from 'motion/react';
import { site } from '../content/site';

type TransitionState = {
  /** Intercept a navigation: play the cover wipe, push the route, then reveal. */
  navigateTo: (href: string) => void;
  isAnimating: boolean;
};

const TransitionContext = createContext<TransitionState | null>(null);

// Shared easing/timing so the wipe always reads as one choreographed move.
const COVER = { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const };
const REVEAL = { duration: 0.65, ease: [0.76, 0, 0.24, 1] as const };

/**
 * Coordinates the full-screen overlay wipe with client-side routing:
 *   1. navigateTo() slides the accent panel up from below until it covers.
 *   2. once covered, navigate() swaps the route underneath.
 *   3. the pathname change triggers the reveal: the panel keeps travelling up
 *      and off the top, uncovering the freshly mounted page.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const controls = useAnimationControls();
  const labelControls = useAnimationControls();
  const [isAnimating, setIsAnimating] = useState(false);
  const firstRender = useRef(true);

  const navigateTo = useCallback(
    async (href: string) => {
      if (href === pathname || isAnimating) return;
      setIsAnimating(true);
      labelControls.set({ opacity: 0, y: 20 });
      labelControls.start({ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.15 } });
      await controls.start({ y: '0%', transition: COVER });
      navigate(href);
    },
    [pathname, isAnimating, navigate, controls, labelControls],
  );

  // React to the route actually changing → play the reveal.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    let cancelled = false;
    // Let the new page paint a frame before uncovering it.
    const timer = setTimeout(async () => {
      window.scrollTo(0, 0);
      labelControls.start({ opacity: 0, transition: { duration: 0.25 } });
      await controls.start({ y: '-100%', transition: REVEAL });
      if (cancelled) return;
      controls.set({ y: '100%' }); // park below the fold for next time
      setIsAnimating(false);
    }, 90);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pathname, controls, labelControls]);

  return (
    <TransitionContext.Provider value={{ navigateTo, isAnimating }}>
      {children}

      {/* Full-screen wipe panel, parked below the fold at y:100%. */}
      <motion.div
        aria-hidden
        initial={{ y: '100%' }}
        animate={controls}
        className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-accent"
      >
        <motion.span
          animate={labelControls}
          initial={{ opacity: 0, y: 20 }}
          className="font-display text-[clamp(3rem,12vw,9rem)] lowercase leading-none text-paper"
        >
          {site.word}
          <span className="text-paper/70">.</span>
        </motion.span>
      </motion.div>
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition must be used within <TransitionProvider>');
  return ctx;
}
