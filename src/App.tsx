import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { MotionConfig, motion } from 'motion/react';
import { Home } from './Home';
import { WebProject } from './pages/WebProject';

/** Each route change starts at the top of the page. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Fades each route in (Home ⇄ /web-project). The previous page unmounts
 *  immediately — AnimatePresence exit-out is deliberately avoided: with
 *  React 19 StrictMode its mode="wait" exit can stall and block the next
 *  route from mounting. */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/web-project" element={<WebProject />} />
      </Routes>
    </motion.div>
  );
}

export default function App() {
  return (
    // reducedMotion="user" disables transform/layout animations for
    // visitors who prefer reduced motion (design-system.md §8) — opacity
    // fades are kept, which is the recommended fallback.
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <AnimatedRoutes />
    </MotionConfig>
  );
}