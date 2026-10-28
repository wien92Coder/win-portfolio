import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** Wraps each routed page. Pages remount on navigation, so the fade plays
 *  after the wipe uncovers them. */
export function PageWrapper({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
      className={`min-h-screen ${className}`}
    >
      {children}
    </motion.main>
  );
}
