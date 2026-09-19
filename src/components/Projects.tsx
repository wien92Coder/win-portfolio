import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';

interface Project {
  id: string;
  name: string;
  /** Optional status label rendered beside the name (DM Mono, all caps,
   *  warning-yellow — e.g. Bliho's "in development"). */
  badge?: string;
  description: string;
  tech: string[];
  href?: string;
  image: string;
}

/** Projects — LUMEN list rows after the second CodePen's #projects framework:
 *  num → name+description → tech badges → view link, one shared fixed-position
 *  image that follows the cursor while hovering a row (desktop, fine pointer,
 *  motion allowed). Content comes entirely from i18n `projects.items`, so new
 *  projects are added by appending entries to the locale files — no code
 *  changes needed as the list grows. */
export function Projects() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true }) as Project[];

  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [img, setImg] = useState(items[0]?.image ?? '');

  const onMove = useCallback((e: ReactMouseEvent<HTMLAnchorElement>) => {
    target.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Lazily load each project image the first time its row is hovered — new
  // entries can keep remote URLs (Unsplash for now, user's own files later).
  const prime = useCallback(
    (src: string) => {
      if (!document.querySelector(`img[data-src="${src}"]`)) return;
      const loader = new Image();
      loader.src = src;
    },
    [],
  );

  useEffect(() => {
    if (!active) return;
    const float = floatRef.current;
    if (!float) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // Critically-damped lerp — the image trails the cursor like the pen's
      // translate3d in mousemove, but frame-rate independent.
      const ease = 1 - Math.exp(-10 * dt);
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      float.style.left = `${Math.round(current.current.x)}px`;
      float.style.top = `${Math.round(current.current.y)}px`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  const motionOk =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--accent)]">
              {t('projects.label')}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] tracking-[0.03em]">
              {t('projects.title')}
            </h2>
          </div>
          <p className="font-[family-name:var(--font-accent)] text-[0.7rem] uppercase tracking-[0.15em] text-[var(--muted)]">
            {String(items.length).padStart(2, '0')} {t('projects.countLabel')}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <ol aria-label={t('projects.listLabel')} className="mt-12">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={item.href ?? '#contact'}
                target="_blank"
                rel="noopener noreferrer"
                className="project-item"
                {...(motionOk
                  ? {
                      onMouseEnter: () => {
                        setImg(item.image);
                        prime(item.image);
                        current.current = { x: target.current.x, y: target.current.y };
                        setActive(true);
                      },
                      onMouseLeave: () => setActive(false),
                      onMouseMove: onMove,
                    }
                  : {})}
              >
                <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="project-name">
                    {item.name}
                    {item.badge && <span className="project-badge">{item.badge}</span>}
                  </span>
                  <span className="mt-1 block max-w-xl text-[0.68rem] leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </span>
                </span>
                <span className="project-tech">
                  {item.tech.map((tech) => (
                    <span key={tech} className="tech-badge">
                      {tech}
                    </span>
                  ))}
                </span>
                <span className="project-link">
                  {t('projects.cta')}
                  <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* One shared floating preview — position follows the cursor (pen
          #proj-hover-img), theme-aware border/hairline + grain sibling. */}
      {motionOk && (
        <div
          ref={floatRef}
          className={`project-float ${active ? 'project-float--visible' : ''}`}
          style={active ? { backgroundImage: `url("${img}")` } : undefined}
          aria-hidden="true"
        />
      )}
    </section>
  );
}
