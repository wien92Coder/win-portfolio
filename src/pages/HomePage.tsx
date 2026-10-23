import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { HeroSlider } from '../components/HeroSlider';
import { site } from '../content/site';

/**
 * Home hero — an editorial collage rather than a centred stack: a cobalt band
 * parallaxing behind the project slider, the wordmark oversized at the lower
 * left, and the colophon set vertically along the right edge.
 */
export function HomePage() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bandX = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <PageWrapper>
      <section
        ref={heroRef}
        className="relative min-h-[100svh] overflow-hidden px-5 pb-10 pt-24 sm:px-8 sm:pb-8 sm:pt-28"
      >
        {/* ---------- MOBILE — clean vertical flow ---------- */}
        <div className="flex flex-col sm:hidden">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mb-7"
          >
            <p className="label mb-3 flex items-center gap-2 text-ink">
              <span className="inline-block h-1.5 w-1.5 shrink-0 bg-accent" />
              {site.brand} / {site.tagline}
            </p>
            <p className="micro-copy max-w-[34ch]">{site.descriptor}</p>
          </motion.div>

          <div className="relative mb-9">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
              style={{ originX: 1 }}
              className="absolute right-0 top-10 z-0 h-[82%] w-[74%] bg-accent"
            />
            <HeroSlider className="relative z-10 aspect-[4/3] w-[90%]" />
          </div>

          <h1 className="font-display text-mega leading-[0.78] tracking-tighter text-ink">
            <AnimatedText text={`${site.word}.`} stagger={0} delay={0.4} />
            <span className="sr-only">
              {site.brand} — {site.tagline}
            </span>
          </h1>

          <div className="mt-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="label text-ink/80">{site.availability}</span>
            </span>
          </div>
        </div>

        {/* ---------- DESKTOP — editorial collage ---------- */}
        <div className="hidden sm:block">
          {/* Cobalt band behind the slider (parallaxed). */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.35 }}
            style={{ originX: 1, x: reducedMotion ? 0 : bandX }}
            className="absolute right-0 top-[38%] z-0 h-[38%] w-[54%] bg-accent"
          />

          {/* Rotated colophon along the right edge. */}
          <div className="absolute right-1 top-1/2 z-20 -translate-y-1/2">
            <p className="label origin-center rotate-90 whitespace-nowrap text-ink/80">
              {site.brand} · {site.est}
            </p>
          </div>

          {/* Project slider over the band. */}
          <div className="absolute right-[8%] top-[16%] z-10 w-[38%]">
            <HeroSlider className="aspect-[4/3] w-full" />
          </div>

          {/* Label cluster. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute left-[7%] top-[22%] z-20 max-w-[320px]"
          >
            <p className="label mb-3 flex items-center gap-2 text-ink">
              <span className="inline-block h-1.5 w-1.5 shrink-0 bg-accent" />
              {site.brand} / {site.tagline}
            </p>
            <p className="micro-copy max-w-[36ch]">{site.descriptor}</p>
          </motion.div>

          {/* Availability pill. */}
          <div className="absolute bottom-9 left-8 z-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="label text-ink/80">{site.availability}</span>
            </span>
          </div>

          {/* Wordmark. */}
          <div className="absolute bottom-[24%] left-7 z-20">
            <h1 className="font-display text-mega leading-[0.78] tracking-tighter text-ink">
              <AnimatedText text={`${site.word}.`} stagger={0} delay={0.45} />
              <span className="sr-only">
                {site.brand} — {site.tagline}
              </span>
            </h1>
          </div>

          {/* Scroll cue. */}
          <div className="absolute bottom-7 right-5 z-20 flex items-center gap-3">
            <span className="label text-ink/50">{t('home.scroll')}</span>
            <motion.span
              animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="text-ink/50"
              aria-hidden
            >
              ↓
            </motion.span>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
