import { useTranslation } from 'react-i18next';
import { LocaleHygiene } from './i18n/LocaleHygiene';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { FoodCostCalculator } from './components/FoodCostCalculator';
import { CaseStudies } from './components/CaseStudies';
import { CompetencyGrid } from './components/CompetencyGrid';
import { Timeline } from './components/Timeline';
import { Contact } from './components/Contact';

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      <LocaleHygiene />
      <Nav />

      <main className="mx-auto max-w-5xl px-6">
        <Hero />
        <FoodCostCalculator />
        <CaseStudies />
        <CompetencyGrid />
        <Timeline />
        <Contact />
      </main>

      <footer className="border-t border-[color:var(--card-border)] py-10 text-center text-[0.6rem] uppercase tracking-[0.2em] text-[var(--muted)]">
        {t('contact.location')} · © {new Date().getFullYear()} Win Winarno
      </footer>
    </div>
  );
}