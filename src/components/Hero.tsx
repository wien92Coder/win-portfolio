import { useTranslation } from 'react-i18next';
import { HeroPortrait } from './HeroPortrait';

type Proof = Array<{ value: string; label: string }>;

export function Hero() {
  const { t } = useTranslation();
  const proof = t('hero.proof', { returnObjects: true }) as Proof;
  const badges = t('hero.badges', { returnObjects: true }) as string[];

  return (
    <section id="hero" className="flex min-h-screen flex-col justify-center py-28">
      <div className="grid items-center gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="mb-6 text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
            {t('competency.operationalTitle')} / {t('competency.techTitle')}
          </p>
          <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-[0.03em]">
            {t('hero.h1')}
          </h1>
          <p className="mt-8 max-w-2xl text-[0.78rem] leading-[1.8] text-[var(--muted)]">
            {t('hero.subheadline')}
          </p>
          <p className="mt-4 text-[0.7rem] italic">{t('hero.bridge')}</p>
        </div>

        <HeroPortrait />
      </div>

      <ul className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
        {proof.map((item) => (
          <li key={item.label} className="border-l border-[color:var(--card-border)] pl-4">
            <span className="block font-[family-name:var(--font-display)] text-[2.2rem] leading-none text-[var(--accent)]">
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

      <div className="mt-14 flex flex-wrap gap-4">
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
      </div>
    </section>
  );
}
