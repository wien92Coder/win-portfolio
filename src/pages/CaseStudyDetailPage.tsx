import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { RevealImage } from '../components/RevealImage';
import { TransitionLink } from '../components/TransitionLink';
import { CASE_SECTION, CASE_STUDIES, findCaseStudy } from '../content/caseStudies';

/**
 * One case study detail. Every case uses this exact format, so the reading
 * rhythm is identical whether the visitor arrives from the home lane or the
 * index. No client name appears anywhere on the page.
 */
export function CaseStudyDetailPage() {
  const { slug = '' } = useParams();
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';
  const s = CASE_SECTION;
  const study = findCaseStudy(slug);

  if (!study) {
    return (
      <PageWrapper className="grid min-h-screen place-items-center px-5 text-center">
        <div>
          <p className="font-display text-huge lowercase leading-[0.9]">{t('work.notFound')}</p>
          <TransitionLink
            href="/karya"
            cursorMode="link"
            className="label link-line mt-8 inline-block text-accent"
          >
            ← {s.allCases[lang]}
          </TransitionLink>
        </div>
      </PageWrapper>
    );
  }

  const index = CASE_STUDIES.findIndex((item) => item.slug === study.slug);
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
  const number = String(index + 1).padStart(2, '0');
  const total = String(CASE_STUDIES.length).padStart(2, '0');

  return (
    <PageWrapper className="px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <TransitionLink
          href="/#hospitality"
          cursorMode="link"
          className="label link-line text-ink/60"
        >
          ← {s.backHome[lang]}
        </TransitionLink>
        <TransitionLink href="/karya" cursorMode="link" className="label link-line text-ink/60">
          {s.allCases[lang]}
        </TransitionLink>
      </div>

      <header>
        <p className="label mb-5 flex items-center gap-2 text-ink/50">
          <span className="inline-block h-1.5 w-1.5 shrink-0 bg-accent" />
          {s.caseLabel[lang]} {number} / {total} — Hospitality & Healthcare
        </p>
        <AnimatedText
          as="h1"
          text={study.title[lang]}
          className="block max-w-[18ch] font-display text-[11vw] leading-[0.85] tracking-tighter sm:text-[5vw]"
          stagger={0.02}
        />
      </header>

      {/* Meta row */}
      <dl className="mt-12 grid grid-cols-2 gap-6 border-y hairline border-y-ink/20 py-6 sm:grid-cols-4 sm:gap-8">
        {[
          { term: s.labels.sector[lang], value: study.sector[lang] },
          { term: s.labels.scale[lang], value: study.scale[lang] },
          { term: s.labels.period[lang], value: study.period[lang] },
          { term: s.labels.program[lang], value: 'SMART Care' },
        ].map((row) => (
          <div key={row.term}>
            <dt className="label mb-2 text-ink/50">{row.term}</dt>
            <dd className="font-display text-base leading-snug tracking-tight">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Hero metric */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-end">
        <p className="font-display text-[16vw] leading-[0.82] tracking-tighter sm:col-span-7 sm:text-[6vw]">
          {study.heroMetric.value[lang]}
        </p>
        <p className="label max-w-[28ch] text-ink/60 sm:col-span-4 sm:col-start-9">
          {study.heroMetric.label[lang]}
        </p>
      </div>

      <figure className="mt-12">
        <RevealImage
          src={study.image}
          alt={study.imageAlt[lang]}
          className="aspect-[16/9] w-full"
          priority
          parallax
        />
        <figcaption className="label mt-3 flex items-center justify-between text-ink/45">
          <span>{s.illustration[lang]}</span>
          <span>Unsplash</span>
        </figcaption>
      </figure>

      {/* Context, approach, results */}
      <div className="mt-16 grid grid-cols-1 gap-10 border-t hairline border-t-ink/20 pt-10 sm:grid-cols-3 sm:gap-8">
        <section>
          <h2 className="label mb-4 flex items-center gap-2 text-ink/55">
            <span className="text-accent">01</span> {s.labels.context[lang]}
          </h2>
          <p className="body-copy">{study.context[lang]}</p>
        </section>
        <section>
          <h2 className="label mb-4 flex items-center gap-2 text-ink/55">
            <span className="text-accent">02</span> {s.labels.approach[lang]}
          </h2>
          <ol className="flex flex-col gap-4">
            {study.approach.map((step, i) => (
              <li key={step.id} className="grid grid-cols-[1.5rem_1fr] gap-3">
                <span className="label pt-1 text-ink/35">{String(i + 1).padStart(2, '0')}</span>
                <span className="body-copy">{step[lang]}</span>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="label mb-4 flex items-center gap-2 text-ink/55">
            <span className="text-accent">03</span> {s.labels.results[lang]}
          </h2>
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

      {/* Focus */}
      <div className="mt-10 flex flex-col gap-3 border-t hairline border-t-ink/15 pt-6 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="label text-ink/50">
          {s.labels.focus[lang]} — {s.labels.focusNote[lang]}
        </p>
        <ul className="flex flex-wrap gap-2">
          {study.focus[lang].split(',').map((module) => (
            <li key={module} className="label border border-ink/20 px-2.5 py-1.5 text-ink/75">
              {module.trim()}
            </li>
          ))}
        </ul>
      </div>

      {/* Next case — circular */}
      <TransitionLink
        href={`/karya/${next.slug}`}
        cursorMode="view"
        className="group mt-20 block border-t hairline border-t-ink/20 pt-8"
      >
        <p className="label mb-5 text-ink/50">
          {s.nextCase[lang]} — {String(((index + 1) % CASE_STUDIES.length) + 1).padStart(2, '0')}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="max-w-[22ch] font-display text-[8vw] leading-[0.9] tracking-tight transition-transform duration-700 group-hover:translate-x-2 sm:text-[3.4vw]">
            {next.title[lang]}
          </span>
          <span className="text-3xl leading-none transition-transform duration-700 group-hover:translate-x-2 sm:text-5xl">
            →
          </span>
        </div>
      </TransitionLink>

      {/* Consultation CTA */}
      <section className="mt-20 flex flex-col gap-7 border-t hairline border-t-ink/20 pt-10 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="max-w-[18ch] font-display text-[8vw] lowercase leading-[0.95] tracking-tight sm:text-[3vw]">
          {s.detailCta[lang]}
        </h2>
        <TransitionLink
          href="/contact?goal=hospitality"
          cursorMode="link"
          className="group inline-flex shrink-0 items-center gap-4 bg-ink px-7 py-5 text-paper transition-colors hover:bg-accent"
        >
          <span className="font-display text-lg lowercase tracking-tight">
            {s.detailCtaButton[lang]}
          </span>
          <span className="text-2xl leading-none transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </TransitionLink>
      </section>
    </PageWrapper>
  );
}
