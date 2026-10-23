import { motion, useInView } from 'motion/react';
import { useRef, type ElementType } from 'react';

type Props = {
  text: string;
  /** Wrapper element (h1, h2, p…). */
  as?: ElementType;
  className?: string;
  /** Per-word stagger in seconds. */
  stagger?: number;
  delay?: number;
  /** Animate once on scroll-in (default) or every time it enters view. */
  once?: boolean;
};

/**
 * Word-by-word reveal: each word sits in a clip mask and rises into place,
 * staggered. Transforms only, so it stays on the compositor.
 */
export function AnimatedText({
  text,
  as: Tag = 'span',
  className = '',
  stagger = 0.045,
  delay = 0,
  once = true,
}: Props) {
  const words = text.split(' ');

  // Observe the OUTER (un-clipped) heading, not the translated word spans:
  // a word starting at y:110% inside an overflow-hidden mask is clipped to
  // zero area, so an observer attached there never fires and the reveal would
  // deadlock. The Tag itself is always in normal flow.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: '-10% 0px' });

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      {words.map((word, i) => (
        // Tight display leading means the line box is shorter than the glyphs,
        // so a plain overflow-hidden mask shears ascenders/descenders. The
        // inner span gains padding for the ink and the mask cancels it with
        // equal negative margins, keeping the line rhythm unchanged.
        <span key={i} className="-mb-[0.34em] -mt-[0.38em] inline-flex overflow-hidden">
          <motion.span
            className="inline-block pb-[0.34em] pt-[0.38em] will-change-transform"
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1], delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
