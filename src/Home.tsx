import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleHygiene } from './i18n/LocaleHygiene';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { FoodCostCalculator } from './components/FoodCostCalculator';
import { CaseStudies } from './components/CaseStudies';
import { CompetencyGrid } from './components/CompetencyGrid';
import { Timeline } from './components/Timeline';
import { Contact } from './components/Contact';

/** Full-bleed band with an inner content container. `tone` alternates the
 *  LUMEN surface colors (--bg2 / --bg) down the page, exactly like the
 *  source pen: marquee + Playground share --bg2, then --bg, --bg2, …
 *  (Anchors live on the inner sections, so the band needs no id.) */
function Band({ tone = 'bg', children }: { tone?: 'bg' | 'bg2'; children: ReactNode }) {
  return (
    <div className={tone === 'bg2' ? 'bg-[var(--bg2)]' : undefined}>{children}</div>
  );
}

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      <LocaleHygiene />
      <Nav />

      <main>
        <Hero />

        {/* LUMEN-style infinite ticker between hero and the first section. */}
        <Marquee />

        <Band tone="bg2">
          <FoodCostCalculator />
        </Band>
        <Band>
          <CaseStudies />
        </Band>
        <Band tone="bg2">
          <CompetencyGrid />
        </Band>
        <Band>
          <Timeline />
        </Band>
        <Band tone="bg2">
          <Contact />
        </Band>
      </main>

      <footer className="border-t border-[color:var(--card-border)] bg-[var(--bg2)] py-10 text-center text-[0.6rem] uppercase tracking-[0.2em] text-[var(--muted)]">
        {t('contact.location')} · © {new Date().getFullYear()} Win Winarno
      </footer>
    </div>
  );
}
