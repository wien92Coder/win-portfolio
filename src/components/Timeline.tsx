import { useTranslation } from 'react-i18next';
import { motion, type Variants } from 'motion/react';
import { Reveal } from './Reveal';

interface TimelineEntry {
  year: string;
  role: string;
  org: string;
}

const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const listItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function Timeline() {
  const { t } = useTranslation();
  const timeline = t('about.timeline', { returnObjects: true }) as TimelineEntry[];

  return (
    <section id="about" className="py-24">
      <Reveal>
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">{t('nav.about')}</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] tracking-[0.03em]">
          {t('about.title')}
        </h2>
      </Reveal>

      <motion.ol
        variants={listContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-12 border-l border-[color:var(--card-border)]"
      >
        {timeline.map((entry) => (
          <motion.li
            key={`${entry.year}-${entry.role}`}
            variants={listItem}
            className="relative border-b border-[color:var(--card-border)] py-5 pl-6"
          >
            <span
              className="absolute -left-[0.1875rem] top-7 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
              aria-hidden="true"
            />
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--accent)]">{entry.year}</p>
            <p className="mt-1 font-medium">{entry.role}</p>
            <p className="mt-0.5 text-[0.72rem] text-[var(--muted)]">{entry.org}</p>
          </motion.li>
        ))}
      </motion.ol>

      <Reveal>
        <p className="mt-10 max-w-3xl text-[0.8rem] leading-[1.9]">{t('about.closing')}</p>
      </Reveal>
    </section>
  );
}