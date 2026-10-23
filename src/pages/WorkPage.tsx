import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { TransitionLink } from '../components/TransitionLink';
import { useProjects } from '../content/projects';

/**
 * Work index — an editorial list rather than a grid. Hovering a row dims the
 * others and floats a preview that follows the pointer; selecting a row opens
 * that project.
 */
export function WorkPage() {
  const { t } = useTranslation();
  const projects = useProjects();
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preview follows the pointer. Stiff and overdamped: enough smoothing to
  // feel weighted, not enough to trail the cursor or overshoot when it stops.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 380, damping: 38, mass: 0.4 });
  const y = useSpring(my, { stiffness: 380, damping: 38, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <PageWrapper className="px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <header className="mb-16 flex flex-col gap-6 border-b hairline border-b-ink/20 pb-10 sm:mb-20 sm:flex-row sm:items-end sm:justify-between">
        <AnimatedText
          as="h1"
          text={t('work.title')}
          className="block font-display text-mega lowercase leading-[0.78] tracking-tighter"
        />
        <div className="max-w-[36ch]">
          <p className="label mb-3 text-ink/50">
            {t('work.indexLabel')} — {t('work.indexMeta', { count: projects.length })}
          </p>
          <p className="micro-copy">{t('work.intro')}</p>
        </div>
      </header>

      <div ref={containerRef} className="relative" onMouseMove={onMove}>
        {/* Cursor-following preview. Colour imagery is the hover state here, so
            it is deliberately not passed through `.img-editorial`. */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key="preview"
              className="pointer-events-none absolute z-10 hidden sm:block"
              style={{ x, y, left: -160, top: -110 }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative h-[200px] w-[320px] overflow-hidden bg-ink/5">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.img
                    key={projects[active].slug}
                    src={projects[active].image}
                    alt=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ul>
          {projects.map((project, i) => (
            <li key={project.slug} className="border-b hairline border-b-ink/20">
              <TransitionLink href={`/work/${project.slug}`} cursorMode="view" className="group block">
                <motion.div
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="flex flex-col gap-3 py-5 sm:grid sm:grid-cols-12 sm:items-center sm:gap-2 sm:py-6"
                  // Opacity only — it composites, where animating padding would
                  // force a layout pass on every frame of the hover.
                  animate={{ opacity: active === null || active === i ? 1 : 0.35 }}
                  transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                >
                  <div className="flex items-baseline gap-3 sm:contents">
                    <span
                      className={`font-mono text-sm transition-colors duration-300 sm:col-span-1 ${
                        active === i ? 'text-accent' : 'text-ink/40'
                      }`}
                    >
                      {project.index}
                    </span>
                    {/* The title glides right on hover — a transform, so the
                        row and its hairline hold still. */}
                    <motion.span
                      animate={{ x: active === i ? 18 : 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="font-display text-[8vw] lowercase leading-[1.02] tracking-tight sm:col-span-6 sm:text-[2.5vw]"
                    >
                      {project.name}
                    </motion.span>
                  </div>

                  <div className="flex items-center justify-between pl-9 sm:contents sm:pl-0">
                    <span className="label text-ink/55 sm:col-span-2">{project.tech[0]}</span>
                    <span className="label hidden text-ink/55 sm:col-span-1 sm:block">
                      {project.badge ?? t('work.statusLive')}
                    </span>
                    <span className="flex items-center justify-end text-ink/55 sm:col-span-2">
                      <span className="label inline-flex items-center gap-2 transition-transform duration-500 group-hover:translate-x-1">
                        {t('work.open')} <span className="text-accent">→</span>
                      </span>
                    </span>
                  </div>
                </motion.div>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </PageWrapper>
  );
}
