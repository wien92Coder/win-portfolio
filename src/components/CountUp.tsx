import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { parseStatValue } from '../lib/format';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type Props = {
  /** Final value exactly as it should read: `30+`, `92%`, `4,8`, `12x`. */
  value: string;
  /** Seconds the count takes once triggered. */
  duration?: number;
  /** Seconds to wait after entering view, used to stagger a row of stats. */
  delay?: number;
  className?: string;
};

/**
 * Counts a proof number up from zero the first time it scrolls into view, then
 * leaves it alone. The punctuation and suffix are parsed from `value`, so the
 * same component handles `30+`, `92%`, `4,8`, and `12x` and swaps form cleanly
 * when the language changes.
 *
 * Accessibility and fallbacks:
 *   - the visible digits are aria-hidden; the final value is exposed to screen
 *     readers as static text, so nobody hears a stream of changing numbers
 *   - reduced motion keeps the final value on screen and skips the count
 *   - the final value is also the initial render, so print and a missed
 *     IntersectionObserver never leave a stray zero on the page
 */
export function CountUp({ value, duration = 1.4, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reducedMotion = useReducedMotion();
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [display, setDisplay] = useState(() => parsed.format(parsed.target));
  const counted = useRef(false);

  useEffect(() => {
    if (!inView) return;

    // A language switch after the count should just swap the punctuation, not
    // replay the animation while the visitor is reading the section.
    if (reducedMotion || counted.current) {
      setDisplay(parsed.format(parsed.target));
      counted.current = true;
      return;
    }

    const controls = animate(0, parsed.target, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(parsed.format(latest)),
      onComplete: () => {
        counted.current = true;
      },
    });

    return () => controls.stop();
  }, [inView, reducedMotion, parsed, duration, delay]);

  return (
    <>
      <span ref={ref} aria-hidden className={`tabular-nums ${className}`}>
        {display}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
