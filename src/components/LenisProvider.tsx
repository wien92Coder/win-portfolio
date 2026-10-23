import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import Lenis from 'lenis';

// Module-level handle so navigation code can reset scroll without prop drilling.
let lenisRef: Lenis | null = null;

/** Mounts a single Lenis smooth-scroll instance for the whole app.
 *  Visitors who ask for reduced motion keep the browser's native scrolling —
 *  hijacking the wheel is exactly the kind of motion they opted out of. */
export function LenisProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef = lenis;

    let frame = 0;
    function loop(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    }
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);

  // Jump to the top instantly whenever the route changes (the wipe hides it).
  useEffect(() => {
    lenisRef?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
