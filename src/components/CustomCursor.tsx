import { useEffect, useRef, useState } from 'react';

/** Whether the custom cursor may run: fine pointer (mouse/trackpad) and the
 *  visitor allows motion. CSS gates the same conditions, so on touch devices
 *  or for reduced-motion users the elements stay display:none and the native
 *  cursor is never hidden. */
function useCustomCursorEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    setEnabled(fine && motionOk);
  }, []);

  return enabled;
}

/** LUMEN's cursor: a 6px amber dot glued to the pointer plus a 28px ring that
 *  lerps toward it (factor 0.12 per frame) and swells to 44px over any link
 *  or button. Pressing shrinks the ring briefly for tactile feedback. */
export function CustomCursor() {
  const enabled = useCustomCursorEnabled();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target;
      ring.classList.toggle(
        'cursor-ring-active',
        target instanceof Element && !!target.closest('a, button'),
      );
    };

    const onDown = () => {
      ring.style.transform = 'translate(-50%, -50%) scale(0.75)';
    };
    const onUp = () => {
      ring.style.transform = 'translate(-50%, -50%)';
    };

    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  // Touch-only or reduced-motion visitors keep the native cursor entirely.
  if (!enabled) return null;

  return (
    <>
      <div id="cur" ref={dotRef} aria-hidden="true" />
      <div id="cur-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
