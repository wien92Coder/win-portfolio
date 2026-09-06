import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';

export function CompetencyGrid() {
  const { t } = useTranslation();
  const operational = t('competency.operational', { returnObjects: true }) as string[];
  const tech = t('competency.tech', { returnObjects: true }) as string[];

  return (
    <section id="competency" className="py-24">
      <Reveal>
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">{t('nav.competency')}</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] tracking-[0.03em]">
          {t('competency.title')}
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
        <Reveal>
          <div className="border-l border-[var(--accent)] pl-5">
            <h3 className="text-[0.65rem] uppercase tracking-[0.25em] text-[var(--accent)]">
              {t('competency.operationalTitle')}
            </h3>
            <ul className="mt-6 space-y-4">
              {operational.map((item) => (
                <li key={item} className="border-b border-[color:var(--card-border)] pb-4 text-[0.75rem] leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal>
          <div className="border-l border-[var(--accent)] pl-5">
            <h3 className="text-[0.65rem] uppercase tracking-[0.25em] text-[var(--accent)]">
              {t('competency.techTitle')}
            </h3>
            <ul className="mt-6 space-y-4">
              {tech.map((item) => (
                <li key={item} className="border-b border-[color:var(--card-border)] pb-4 text-[0.75rem] leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}