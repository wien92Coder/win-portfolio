import { MotionConfig } from 'motion/react';
import { CustomCursor } from './components/CustomCursor';
import { Home } from './Home';

/** Single-page app: Home is the only route (the former /web-project page was
 *  replaced by the in-page Projects section). Kept as a component so the
 *  MotionConfig + CustomCursor wiring stays untouched. */
function App() {
  return (
    // reducedMotion="user" disables transform/layout animations for
    // visitors who prefer reduced motion (design-system.md §8) — opacity
    // fades are kept, which is the recommended fallback.
    <MotionConfig reducedMotion="user">
      <CustomCursor />
      <Home />
    </MotionConfig>
  );
}

export default App;