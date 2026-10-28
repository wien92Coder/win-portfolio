import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { CountUp } from '../components/CountUp';
import { RevealImage } from '../components/RevealImage';
import { TransitionLink } from '../components/TransitionLink';
import { site } from '../content/site';

type TimelineEntry = { year: string; role: string; org: string };
type StatsItem = { value: string; label: string };

/**
 * Studio — the person behind the work. Every row here comes from the v1
 * biography (timeline, competency grid, proof numbers); nothing is invented to
 * fill the template's layout.
 */
export function StudioPage() {
  const { t } = useTranslation();
  const timeline = t('about.timeline', { returnObjects: true }) as TimelineEntry[];
  const operational = t('competency.operational', { returnObjects: true }) as string[];
  const tech = t('competency.tech', { returnObjects: true }) as string[];
  const stats = t('home.stats', { returnObjects: true }) as StatsItem[];
  const body = t('studio.body', { returnObjects: true }) as string[];

  return (
    <PageWrapper className="px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      {/* The headline runs the full content width: capping the header at a ch
          measure of its 16px label font squeezed the 3.5vw display type into a
          narrow column and doubled its height. */}
      <header className="mb-20 sm:mb-28">
        <p className="label mb-8 flex items-center gap-3 text-ink/50">
          <span className="inline-block h-px w-8 bg-ink/30" />
          {t('studio.label')} — {site.est}
        </p>
        <AnimatedText
          as="h1"
          text={t('studio.title')}
          className="block font-display text-[8.5vw] lowercase leading-[1.04] tracking-tight sm:text-[3.5vw]"
          stagger={0.03}
        />
      </header>

      {/* Portrait + introduction */}
      <section className="mb-24 grid gap-10 sm:grid-cols-12 sm:gap-6">
        <div className="order-2 sm:order-1 sm:col-span-5">
          <RevealImage
            src="/about.jpg"
            alt={site.brand}
            className="aspect-[4/5] w-full"
            parallax
            priority
          />
          <p className="label mt-3 text-ink/50">
            {site.brand} — {site.location}
          </p>
        </div>

        <div className="order-1 flex flex-col justify-between sm:order-2 sm:col-span-6 sm:col-start-7">
          <p className="font-display text-[5.5vw] leading-[1.15] tracking-tight sm:text-[2vw]">
            {t('studio.lead')}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2">
            {body.map((paragraph) => (
              <p key={paragraph} className="body-copy">
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-4 border-t hairline border-t-ink/20 pt-6 sm:grid-cols-2">
            <div>
              <dt className="label mb-2 text-ink/50">{t('menu.seasonLabel')}</dt>
              <dd className="label text-ink/80">{t('site.season')}</dd>
            </div>
            <div>
              <dt className="label mb-2 text-ink/50">{t('menu.availabilityLabel')}</dt>
              <dd className="label text-ink/80">{t('site.availability')}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Career timeline — the v1 biography, one row per role. */}
      <section className="border-t hairline border-t-ink/20">
        <p className="label py-6 text-ink/50">{t('studio.careerLabel')}</p>
        <ul>
          {timeline.map((entry, i) => (
            <li
              key={`${entry.year}-${entry.role}-${i}`}
              className="grid grid-cols-12 items-baseline gap-2 border-b hairline border-b-ink/15 py-4 sm:py-5"
            >
              <span className="col-span-3 font-mono text-xs text-accent sm:col-span-1">
                {entry.year}
              </span>
              <span className="col-span-9 font-display text-[4.5vw] lowercase leading-[1.1] tracking-tight sm:col-span-6 sm:text-[1.6vw]">
                {entry.role}
              </span>
              <span className="col-span-9 col-start-4 micro-copy sm:col-span-5 sm:col-start-8">
                {entry.org}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Competency grid */}
      <section className="grid grid-cols-1 gap-10 py-20 sm:grid-cols-2 sm:gap-16 sm:py-28">
        <div>
          <p className="label mb-6 border-b hairline border-b-ink/20 pb-3 text-ink/50">
            {t('competency.operationalTitle')}
          </p>
          <ul className="flex flex-col gap-3">
            {operational.map((item) => (
              <li key={item} className="body-copy">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-6 border-b hairline border-b-ink/20 pb-3 text-ink/50">
            {t('competency.techTitle')}
          </p>
          <ul className="flex flex-col gap-3">
            {tech.map((item) => (
              <li key={item} className="body-copy">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Numbers */}
      <section className="grid grid-cols-2 border-y hairline border-y-ink/20 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="border-r hairline border-r-ink/15 px-4 py-8 last:border-r-0 sm:px-6 sm:py-10">
            <p className="font-display text-[12vw] leading-[0.85] tracking-tighter sm:text-[3.4vw]">
              <CountUp value={stat.value} delay={i * 0.06} />
            </p>
            <p className="label mt-3 max-w-[18ch] text-ink/50">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Closing link — the footer already carries the contact CTA, so this
          points at the work instead of repeating it. */}
      <section className="py-24 sm:py-28">
        <TransitionLink href="/work" cursorMode="view" className="group inline-block">
          <AnimatedText
            as="span"
            text={t('home.viewAll')}
            className="block font-display text-huge lowercase leading-[0.9] tracking-tight transition-transform duration-700 group-hover:-translate-y-1"
          />
          <span className="label mt-4 inline-flex items-center gap-2 text-accent">
            {t('nav.projects')} <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </span>
        </TransitionLink>
      </section>
    </PageWrapper>
  );
}
