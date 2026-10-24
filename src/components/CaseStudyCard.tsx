import { CASE_SECTION, type CaseStudy, type Lang } from '../content/caseStudies';

/**
 * One case study card. The same component renders all three on the index and
 * is the only place the card's markup exists — adding a fourth case means
 * adding one object to `CASE_STUDIES`.
 *
 * Layout order: header → metrics → meta → context → approach → results →
 * focus. The hero metric is always first and visually the largest.
 */
export function CaseStudyCard({
  study,
  index,
  lang,
}: {
  study: CaseStudy;
  index: number;
  lang: Lang;
}) {
  const s = CASE_SECTION;
  const number = String(index + 1).padStart(2, '0');

  return (
    <article
      id={study.slug}
      aria-labelledby={`case-${study.slug}-title`}
      className="scroll-mt-24 border-t hairline border-t-ink/20 py-14 sm:py-20"
    >
      {/* 1 — Header */}
      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="label text-accent">{s.caseLabel[lang]} {number}</span>
          <span className="label text-ink/45">{study.sector[lang]}</span>
        </div>
        <h3
          id={`case-${study.slug}-title`}
          className="max-w-[22ch] font-display text-[7.5vw] leading-[0.95] tracking-tight sm:text-[3vw]"
        >
          {study.title[lang]}
        </h3>
        <p className="body-copy max-w-[58ch] !text-[16px] text-ink/85 sm:!text-[18px]">
          {study.tagline[lang]}
        </p>
        <ul className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <li
              key={tag.id}
              className="label border border-ink/20 px-2.5 py-1.5 text-ink/70"
            >
              {tag[lang]}
            </li>
          ))}
        </ul>
      </header>

      {/* 2 — Metrics: hero first, then two supporting numbers */}
      <div className="mt-10 grid grid-cols-1 gap-6 border-y hairline border-y-ink/15 py-7 sm:grid-cols-3 sm:gap-8">
        {study.metrics.map((metric, i) => (
          <div
            key={metric.label.id}
            className={i === 0 ? 'sm:col-span-1' : 'border-t border-t-ink/10 pt-5 sm:border-l sm:border-t-0 sm:border-l-ink/10 sm:pl-6 sm:pt-0'}
          >
            <p
              className={
                i === 0
                  ? 'font-display text-[13vw] leading-[0.85] tracking-tighter text-ink sm:text-[3.6vw]'
                  : 'font-display text-[9vw] leading-[0.9] tracking-tight text-ink sm:text-[1.9vw]'
              }
            >
              {metric.value[lang]}
            </p>
            <p className="label mt-3 max-w-[24ch] text-ink/55">
              {metric.label[lang]}
              {i === 0 && index === 0 ? (
                <sup aria-hidden className="ml-1 text-accent">
                  *
                </sup>
              ) : null}
            </p>
          </div>
        ))}
      </div>

      {index === 0 ? (
        <p className="micro-copy mt-3 max-w-[62ch]">
          <span aria-hidden className="text-accent">*</span> {s.csiNote[lang]}
        </p>
      ) : null}

      {/* 3 — Meta */}
      <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
        {[
          { term: s.labels.client[lang], value: study.client[lang] },
          { term: s.labels.period[lang], value: study.period[lang] },
          { term: s.labels.role[lang], value: study.role[lang] },
        ].map((row) => (
          <div key={row.term}>
            <dt className="label mb-2 text-ink/50">{row.term}</dt>
            <dd className="font-display text-base leading-snug tracking-tight sm:text-lg">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* 4–6 — Context, approach, results */}
      <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
        <section aria-labelledby={`case-${study.slug}-context`}>
          <h4 id={`case-${study.slug}-context`} className="label mb-4 flex items-center gap-2 text-ink/55">
            <span className="text-accent">01</span> {s.labels.context[lang]}
          </h4>
          <p className="body-copy">{study.context[lang]}</p>
        </section>

        <section aria-labelledby={`case-${study.slug}-approach`}>
          <h4 id={`case-${study.slug}-approach`} className="label mb-4 flex items-center gap-2 text-ink/55">
            <span className="text-accent">02</span> {s.labels.approach[lang]}
          </h4>
          <ol className="flex flex-col gap-4">
            {study.approach.map((step, i) => (
              <li key={step.id} className="grid grid-cols-[1.5rem_1fr] gap-3">
                <span className="label pt-1 text-ink/35">{String(i + 1).padStart(2, '0')}</span>
                <span className="body-copy">{step[lang]}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby={`case-${study.slug}-results`}>
          <h4 id={`case-${study.slug}-results`} className="label mb-4 flex items-center gap-2 text-ink/55">
            <span className="text-accent">03</span> {s.labels.results[lang]}
          </h4>
          <ul className="flex flex-col gap-4">
            {study.results.map((result) => (
              <li key={result.id} className="grid grid-cols-[0.6rem_1fr] gap-3">
                <span aria-hidden className="mt-[0.5em] block h-1.5 w-1.5 bg-accent" />
                <span className="body-copy">{result[lang]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 7 — Focus, explained so it works without knowing the framework */}
      <div className="mt-10 flex flex-col gap-2 border-t hairline border-t-ink/15 pt-5 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="label text-ink/50">
          {s.labels.focus[lang]} — {s.labels.focusNote[lang]}
        </p>
        <p className="font-display text-lg tracking-tight">{study.focus[lang]}</p>
      </div>
    </article>
  );
}

