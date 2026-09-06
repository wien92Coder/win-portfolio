import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from './i18n/config';
import { LanguageToggle } from './i18n/LanguageToggle';
import { LocaleHygiene } from './i18n/LocaleHygiene';
import { formatRupiah } from './lib/format';

type Proof = Array<{ value: string; label: string }>;

export default function App() {
  const { t, i18n } = useTranslation();
  const proof = t('hero.proof', { returnObjects: true }) as Proof;
  const badges = t('hero.badges', { returnObjects: true }) as string[];
  const demoAmounts = [25000, 75000, 900000];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      <LocaleHygiene />

      <header className="fixed right-[var(--ui-inset)] top-[var(--ui-inset)] z-[var(--z-ui)]">
        <LanguageToggle />
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <section className="flex min-h-screen flex-col justify-center py-24">
          <p className="mb-6 text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
            {t('competency.operationalTitle')} / {t('competency.techTitle')}
          </p>
          <h1 className="max-w-4xl font-[var(--font-display)] text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-[0.03em]">
            {t('hero.h1')}
          </h1>
          <p className="mt-8 max-w-2xl text-[0.78rem] leading-[1.8] text-[var(--muted)]">
            {t('hero.subheadline')}
          </p>
          <p className="mt-4 text-[0.7rem] italic">{t('hero.bridge')}</p>

          <ul className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {proof.map((item) => (
              <li key={item.label} className="border-l border-[color:var(--card-border)] pl-4">
                <span className="block font-[var(--font-display)] text-[2.2rem] leading-none text-[var(--accent)]">
                  {item.value}
                </span>
                <span className="mt-2 block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-10 flex flex-wrap gap-3">
            {badges.map((badge) => (
              <li
                key={badge}
                className="border border-[color:var(--card-border)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]"
              >
                {badge}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="#playground"
              className="border border-[var(--accent)] px-5 py-3 text-[0.62rem] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg)]"
            >
              {t('hero.ctaPrimary')}
            </a>
            <a
              href="#contact"
              className="border border-[color:color-mix(in srgb,var(--muted) 45%,transparent)] px-5 py-3 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--fg)]"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </section>

        <section id="playground" className="border-t border-[color:var(--card-border)] py-24">
          <h2 className="font-[var(--font-display)] text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] tracking-[0.03em]">
            {t('playground.title')}
          </h2>
          <p className="mt-2 text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
            {t('playground.tagline')}
          </p>
          <p className="mt-8 max-w-2xl text-[0.78rem] leading-[1.8] text-[var(--muted)]">
            {t('playground.credibility')}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {demoAmounts.map((amount) => (
              <div key={amount} className="border border-[color:var(--card-border)] bg-[color:var(--card-bg)] p-5">
                <span className="block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {t('playground.kpis.totalCogs')}
                </span>
                <span className="mt-2 block font-[var(--font-display)] text-[2.2rem] text-[var(--accent)]">
                  {formatRupiah(amount, normalizeLanguage(i18n.language))}
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer id="contact" className="border-t border-[color:var(--card-border)] py-16 text-[0.65rem] uppercase tracking-[0.15em] text-[var(--muted)]">
          {t('contact.location')} · {t('contact.title')}
        </footer>
      </main>
    </div>
  );
}