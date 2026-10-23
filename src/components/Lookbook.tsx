import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUI } from '../context/UIContext';
import { AnimatedText } from './AnimatedText';

/**
 * Frames shown in the rail. Project frames are the v1 cube art for projects
 * that exist in the project list; the portrait is the studio photo. The two
 * photographs are free-licence Unsplash stock (see CREDITS.md) used as sector
 * atmosphere — they are captioned as the field, never as client work.
 */
const FRAMES = [
  { src: '/cube/face-01.webp', index: '01' },
  { src: '/images/healthcare-service.jpg', index: '02' },
  { src: '/cube/face-02.webp', index: '03' },
  { src: '/portrait.jpg', index: '04' },
  { src: '/cube/face-04.webp', index: '05' },
  { src: '/images/hospitality-operations.jpg', index: '06' },
];

/**
 * Horizontal rail with click-and-drag scrolling. Drag is 1:1 — scrollLeft is
 * written per pointer move, so it tracks the cursor with no lag — and the
 * release carries the built-up velocity with friction. Touch and trackpad keep
 * their native scrolling; only the mouse is hijacked.
 */
export function Lookbook() {
  const { t } = useTranslation();
  const { setCursor } = useUI();
  const captions = t('lookbook.captions', { returnObjects: true }) as string[];
  const railRef = useRef<HTMLDivElement>(null);
  const s = useRef({
    dragging: false,
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    vel: 0,
    raf: 0,
  });

  const clamp = (v: number) => {
    const el = railRef.current;
    if (!el) return 0;
    return Math.max(0, Math.min(v, el.scrollWidth - el.clientWidth));
  };

  const momentum = () => {
    const el = railRef.current;
    const st = s.current;
    if (!el || st.dragging) return;
    el.scrollLeft = clamp(el.scrollLeft + st.vel);
    st.vel *= 0.92;
    const atEdge = el.scrollLeft <= 0 || el.scrollLeft >= el.scrollWidth - el.clientWidth;
    if (Math.abs(st.vel) < 0.2 || atEdge) {
      st.vel = 0;
      return;
    }
    st.raf = requestAnimationFrame(momentum);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = railRef.current;
    if (!el) return;
    cancelAnimationFrame(s.current.raf);
    s.current = {
      ...s.current,
      dragging: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      startScroll: el.scrollLeft,
      vel: 0,
    };
    // Capture keeps the drag alive if the pointer leaves the rail. Not every
    // environment grants it for a synthetic or already-released pointer, and a
    // throw here would abort the gesture, so it stays optional.
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* drag still tracks through the container */
    }
    setCursor('drag');
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = railRef.current;
    const st = s.current;
    if (!el || !st.dragging) return;
    el.scrollLeft = clamp(st.startScroll - (e.clientX - st.startX));
    // Smoothed instantaneous velocity (px/frame) for the release flick.
    const inst = st.lastX - e.clientX;
    st.vel = st.vel * 0.6 + inst * 0.4;
    st.lastX = e.clientX;
  };

  const end = () => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    const el = railRef.current;
    try {
      if (st.pointerId >= 0) el?.releasePointerCapture(st.pointerId);
    } catch {
      /* capture already released by the browser */
    }
    setCursor('default');
    st.vel *= 4; // launch the flick
    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(momentum);
  };

  useEffect(() => {
    const st = s.current;
    return () => cancelAnimationFrame(st.raf);
  }, []);

  return (
    <section className="py-24 sm:py-32">
      <div className="mb-10 flex items-end justify-between px-5 sm:px-8">
        <AnimatedText
          as="h2"
          text={t('lookbook.title')}
          className="block font-display text-huge lowercase leading-[0.85] tracking-tight"
        />
        <p className="label hidden text-ink/50 sm:block">{t('lookbook.hint')}</p>
      </div>

      <div
        ref={railRef}
        tabIndex={0}
        role="group"
        aria-label={t('lookbook.title')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        onMouseEnter={() => setCursor('drag')}
        onMouseLeave={() => !s.current.dragging && setCursor('default')}
        style={{ touchAction: 'pan-x' }}
        className="no-scrollbar flex cursor-grab select-none gap-4 overflow-x-auto px-5 pb-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent sm:gap-6 sm:px-8"
      >
        {FRAMES.map((frame, i) => (
          <figure key={frame.src} className="group relative w-[72vw] shrink-0 sm:w-[30vw]">
            <div className="aspect-square w-full overflow-hidden bg-ink/5">
              {/* Zoom on the wrapper: `.img-editorial` owns the image's own
                  transition, and a scale on the same element would not animate. */}
              <div className="h-full w-full transition-transform duration-[900ms] ease-expo group-hover:scale-[1.04]">
                <img
                  src={frame.src}
                  alt={captions[i]}
                  loading="lazy"
                  draggable={false}
                  className="img-editorial pointer-events-none h-full w-full object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-3 flex items-center justify-between">
              <span className="label text-ink/55">{captions[i]}</span>
              <span className="label text-ink/35">{frame.index}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
