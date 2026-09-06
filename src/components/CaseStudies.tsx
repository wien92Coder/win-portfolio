import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';

interface CaseStudy {
  id: string;
  tab?: string;
  name: string;
  tagline?: string;
  client: string;
  period: string;
  condition: string;
  solution: string;
  result: string;
}

interface Pillar {
  title: string;
  cases: CaseStudy[];
}

function CaseBlock({ item, labels }: { item: CaseStudy; labels: Record<string, string> }) {
  const sections: Array<{ key: keyof CaseStudy; label: string }> = [
    { key: 'condition', label: labels.condition },
    { key: 'solution', label: labels.solution },
    { key: 'result', label: labels.result },
  ];

  return (
    <article>
      <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,3.5rem)] leading-none tracking-[0.08em]">
        {item.name}
      </h3>
      {item.tagline && <p className="mt-2 max-w-2xl text-[0.7rem] italic text-[var(--muted)]">{item.tagline}</p>}

      <dl className="mt-6 grid grid-cols-1 gap-4 border-y border-[color:var(--card-border)] py-4 sm:grid-cols-2">
        <div>
          <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]">{labels.client}</dt>
          <dd className="mt-1 text-[0.72rem] leading-relaxed">{item.client}</dd>
        </div>
        {item.period && (
          <div>
            <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]">{labels.period}</dt>
            <dd className="mt-1 text-[0.72rem] leading-relaxed">{item.period}</dd>
          </div>
        )}
      </dl>

      <div className="mt-6 space-y-6">
        {sections.map(({ key, label }) => (
          <div key={key}>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--accent)]">{label}</p>
            <p className="mt-2 max-w-3xl text-[0.78rem] leading-[1.8]">{item[key]}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function CaseStudies() {
  const { t } = useTranslation();
  const pillarA = t('caseStudies.pillarA', { returnObjects: true }) as Pillar;
  const pillarB = t('caseStudies.pillarB', { returnObjects: true }) as Pillar;
  const labels = t('caseStudies.labels', { returnObjects: true }) as Record<string, string>;
  const [activeId, setActiveId] = useState(pillarA.cases[0]?.id ?? '');

  const active = pillarA.cases.find((item) => item.id === activeId) ?? pillarA.cases[0];

  return (
    <section id="case-studies" className="py-24">
      <Reveal>
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">{t('nav.caseStudies')}</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] tracking-[0.03em]">
          {t('caseStudies.title')}
        </h2>
      </Reveal>

      <Reveal>
        <h3 className="mt-12 text-[0.65rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          {pillarA.title}
        </h3>

        <div role="tablist" aria-label={pillarA.title} className="mt-4 flex flex-wrap gap-2">
          {pillarA.cases.map((item) => {
            const selected = item.id === active?.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(item.id)}
                className={`border px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  selected
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-[color:var(--card-border)] text-[var(--muted)] hover:text-[var(--fg)]'
                }`}
              >
                {item.tab ?? item.id}
              </button>
            );
          })}
        </div>

        {active && (
          <div role="tabpanel" className="mt-8">
            <CaseBlock item={active} labels={labels} />
          </div>
        )}
      </Reveal>

      <Reveal>
        <h3 className="mt-20 text-[0.65rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          {pillarB.title}
        </h3>
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {pillarB.cases.map((item) => (
            <CaseBlock key={item.id} item={item} labels={labels} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}