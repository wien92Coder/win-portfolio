import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait after entering the viewport before animating. */
  delay?: number;
  /** Vertical travel distance in px (0 for a pure fade). */
  y?: number;
}

/** Reveals its children when scrolled into view (Framer Motion). Transform
 *  animations are auto-disabled for reduced-motion users via
 *  <MotionConfig reducedMotion="user"> (design-system.md §8). */
export function Reveal({ children, className = '', delay = 0, y = 18 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}