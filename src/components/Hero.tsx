import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, type Variants } from 'motion/react';
import { HeroPortrait } from './HeroPortrait';

type Proof = Array<{ value: string; label: string }>;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/** Deterministic pseudo-random particle field — stable between re-renders
 *  (a Math.random() call inside render would re-shuffle on every state change). */
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  left: ((i * 37 + 13) % 100) + (i % 3) * 0.7,
  top: 60 + ((i * 23 + 7) % 40),
  duration: 4 + ((i * 17) % 80) / 10,
  delay: ((i * 29) % 60) / 10,
}));

/** LUMEN hero decor: breathing amber glow, two counter-rotating orbit rings
 *  and rising particle dots, all behind the copy (decor z-1, content z-2).
 *  The glow parallax-follows the pointer (±10px) via a wrapper element. */
function HeroDecor() {
  const glowWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = glowWrapRef.current;
    if (!wrap) return;
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      wrap.style.transform = `translate(${x}px, ${y}px)`;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div className="particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="hero-glow-wrap" ref={glowWrapRef} aria-hidden="true">
        <div className="hero-glow" aria-hidden="true" />
      </div>
      <div className="hero-ring" aria-hidden="true" />
      <div className="hero-ring-2" aria-hidden="true" />
      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </>
  );
}

const proofList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export function Hero() {
  const { t } = useTranslation();
  const proof = t('hero.proof', { returnObjects: true }) as Proof;
  const badges = t('hero.badges', { returnObjects: true }) as string[];

  return (
    <motion.section
      id="hero"
      className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center overflow-hidden px-6 py-28"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <HeroDecor />

      <div className="relative z-[2] grid items-center gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <motion.p
            variants={item}
            className="mb-6 text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]"
          >
            {t('competency.operationalTitle')} / {t('competency.techTitle')}
          </motion.p>
          <motion.h1
            variants={item}
            className="max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-[0.03em]"
          >
            {t('hero.h1')}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-[0.78rem] leading-[1.8] text-[var(--muted)]"
          >
            {t('hero.subheadline')}
          </motion.p>
          <motion.p variants={item} className="mt-4 text-[0.7rem] italic">
            {t('hero.bridge')}
          </motion.p>
        </div>

        <motion.div variants={item}>
          <HeroPortrait />
        </motion.div>
      </div>

      <motion.ul
        variants={proofList}
        className="relative z-[2] mt-14 grid grid-cols-2 gap-8 md:grid-cols-4"
      >
        {proof.map((proofItem) => (
          <motion.li
            key={proofItem.label}
            variants={item}
            className="border-l border-[color:var(--card-border)] pl-4"
          >
            <span className="block font-[family-name:var(--font-display)] text-[2.2rem] leading-none text-[var(--accent)]">
              {proofItem.value}
            </span>
            <span className="mt-2 block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
              {proofItem.label}
            </span>
          </motion.li>
        ))}
      </motion.ul>

      <motion.ul variants={item} className="relative z-[2] mt-10 flex flex-wrap gap-3">
        {badges.map((badge) => (
          <li
            key={badge}
            className="border border-[color:var(--card-border)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]"
          >
            {badge}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={item} className="relative z-[2] mt-14 flex flex-wrap gap-4">
        <a
          href="#playground"
          className="border border-[var(--accent)] px-5 py-3 text-[0.62rem] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg)]"
        >
          {t('hero.ctaPrimary')}
        </a>
        <a
          href="#contact"
          className="border border-[color:color-mix(in_srgb,var(--muted)_45%,transparent)] px-5 py-3 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--fg)]"
        >
          {t('hero.ctaSecondary')}
        </a>
      </motion.div>
    </motion.section>
  );
}