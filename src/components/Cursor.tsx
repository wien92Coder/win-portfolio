import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { useCursorMode } from '../context/UIContext';

/** Matches --accent (#2f50f2). Kept as a literal because Motion needs a value,
 *  not a CSS variable, when it animates backgroundColor. */
const ACCENT = '#2F50F2';

/**
 * Custom cursor: an ink dot that morphs by mode.
 *   default → tiny dot · link → ring · view → filled accent disc · drag → wide ring
 * Only rendered on fine-pointer devices; touch keeps the native pointer.
 * The position tracks the pointer 1:1 — a cursor that arrives late reads as
 * lag, so the weight lives in the shape morph, not in the position.
 */
export function Cursor() {
  const cursor = useCursorMode();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
    if (!mq.matches) return;

    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  if (!enabled) return null;

  const sizes: Record<string, number> = { default: 10, link: 52, view: 84, drag: 64 };
  const size = sizes[cursor] ?? 10;
  const filled = cursor === 'view';

  return (
    // Difference blending keeps the dot legible over anything, but a blended
    // accent disc turns muddy over paper — so the filled mode opts out.
    <motion.div
      className={`pointer-events-none fixed left-0 top-0 z-[120] ${filled ? '' : 'mix-blend-difference'}`}
      style={{ x, y }}
      aria-hidden
    >
      <motion.div
        className="flex items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          backgroundColor: filled ? ACCENT : cursor === 'default' ? '#ffffff' : 'rgba(255,255,255,0)',
          borderWidth: cursor === 'default' || filled ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.5 }}
        style={{ borderColor: '#ffffff', translateX: '-50%', translateY: '-50%' }}
      >
        {cursor === 'view' && (
          <span className="font-mono text-[9px] uppercase tracking-label text-paper">View</span>
        )}
        {cursor === 'drag' && <span className="text-lg leading-none text-paper">→</span>}
      </motion.div>
    </motion.div>
  );
}
