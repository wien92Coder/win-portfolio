import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useUI } from '../context/UIContext';

type Props = {
  children: ReactNode;
  className?: string;
  /** How strongly the element is pulled toward the cursor (0–1). */
  strength?: number;
  onClick?: () => void;
};

// Just past critical damping for this mass, so the button settles back in one
// clean move instead of wobbling after every leave.
const SPRING = { stiffness: 220, damping: 24, mass: 0.5 };

/** Magnetic wrapper: drifts toward the pointer while hovered, settles on leave. */
export function MagneticButton({ children, className, strength = 0.35, onClick }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const { setCursor } = useUI();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  function onMove(event: MouseEvent<HTMLButtonElement>) {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
    setCursor('default');
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setCursor('link')}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
