import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { UIProvider } from '../context/UIContext';
import { TransitionProvider } from '../context/TransitionContext';
import { LenisProvider } from './LenisProvider';
import { Cursor } from './Cursor';
import { Header } from './Header';
import { Footer } from './Footer';
import { FullscreenMenu } from './FullscreenMenu';

/**
 * Single boundary that wires every cross-route concern:
 *   UI state → smooth scroll → page-transition overlay,
 * then the persistent chrome (cursor, header, menu, footer) around routed
 * content. MotionConfig honours prefers-reduced-motion in one place.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <UIProvider>
        <LenisProvider>
          <TransitionProvider>
            <div className="grain" aria-hidden />
            <Cursor />
            <Header />
            <FullscreenMenu />
            {children}
            <Footer />
          </TransitionProvider>
        </LenisProvider>
      </UIProvider>
    </MotionConfig>
  );
}
