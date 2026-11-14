import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { RevealImage } from '../components/RevealImage';
import { TransitionLink } from '../components/TransitionLink';
import { useProjects } from '../content/projects';

/**
 * One project. The same three beats as a case study — where it started, the
 * decision that shaped the build, and what exists now — so a visitor arriving
 * from the digital lane gets the same depth as one reading a hospital case.
 * The live link is the proof beat; a project that has not shipped says so
 * instead of borrowing the tone of a launch.
 */
export function WorkDetailPage() {
  const { slug = '' } = useParams();
  const { t } = useTranslation();
  const projects = useProjects();

  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];

  if (!project) {
    return (
      <PageWrapper className="grid min-h-screen place-items-center px-5 text-center">
        <div>
          <p className="font-display text-huge lowercase leading-[0.9]">{t('work.notFound')}</p>
          <TransitionLink
            href="/work"
            cursorMode="link"
            className="label link-line mt-8 inline-block text-accent"
          >
            ← {t('work.back')}
          </TransitionLink>
        </div>
      </PageWrapper>
    );
  }

  const next = projects[(index + 1) % projects.length];
  const host = project.href.replace(/^https?:\/\//, '');

  return (
    <PageWrapper className="px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <header>
        <p className="label mb-5 flex items-center gap-2 text-ink/50">
          <span className="inline-block h-1.5 w-1.5 shrink-0 bg-accent" />
          {t('work.project')} {project.index} / {String(projects.length).padStart(2, '0')}
        </p>
        <AnimatedText
          as="h1"
          text={project.name}
          className="block max-w-[16ch] font-display text-mega lowercase leading-[0.82] tracking-tighter"
        />
      </header>

      <dl className="mt-12 grid grid-cols-2 gap-6 border-y hairline border-y-ink/20 py-6 sm:grid-cols-3 sm:gap-8">
        <div>
          <dt className="label mb-2 text-ink/50">{t('work.stack')}</dt>
          <dd className="font-display text-base lowercase leading-snug tracking-tight">
            {project.tech.join(' · ')}
          </dd>
        </div>
        <div>
          <dt className="label mb-2 text-ink/50">{t('work.status')}</dt>
          <dd className={`label ${project.badge ? 'text-accent' : 'text-ink/80'}`}>
            {project.badge ?? t('work.statusLive')}
          </dd>
        </div>
        <div>
          <dt className="label mb-2 text-ink/50">{t('work.live')}</dt>
          <dd>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label link-line text-ink hover:text-accent"
            >
              {host} ↗
            </a>
          </dd>
        </div>
      </dl>

      <RevealImage
        src={project.image}
        alt={project.name}
        className="mt-12 aspect-[16/10] w-full"
        priority
      />

      {/* 01 situation · 02 the call · 03 result, with the live link as proof. */}
      <div className="mt-16 grid grid-cols-1 gap-10 border-t hairline border-t-ink/20 pt-10 sm:grid-cols-12 sm:gap-8">
        <section className="sm:col-span-4">
          <h2 className="label mb-4 flex items-center gap-2 text-ink/55">
            <span className="text-accent">01</span> {t('work.situation')}
          </h2>
          <p className="body-copy">{project.situation}</p>
        </section>

        <section className="sm:col-span-8 sm:border-l sm:border-l-ink/20 sm:pl-8">
          <h2 className="label mb-4 flex items-center gap-2 text-ink/55">
            <span className="text-accent">02</span> {t('work.decision')}
          </h2>
          <p className="body-copy !text-[16px] text-ink">{project.decision}</p>
        </section>

        <section className="sm:col-span-12">
          <h2 className="label mb-4 flex items-center gap-2 text-ink/55">
            <span className="text-accent">03</span> {t('work.result')}
          </h2>
          <p className="body-copy max-w-[62ch]">{project.result}</p>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="label link-line mt-5 inline-flex items-center gap-2 text-ink hover:text-accent"
          >
            {host} ↗
          </a>
        </section>
      </div>

      {/* Next project — the same CTA pattern used on the home page. */}
      <TransitionLink
        href={`/work/${next.slug}`}
        cursorMode="view"
        className="group mt-24 block overflow-hidden border-t hairline border-t-ink/15 pt-8"
      >
        <p className="label mb-5 text-ink/50">
          {t('work.nextProject')} — {next.index}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="font-display text-[11vw] lowercase leading-[0.85] tracking-tight transition-transform duration-700 group-hover:translate-x-2 sm:text-[5vw]">
            {next.name}
          </span>
          <span className="text-3xl leading-none transition-transform duration-700 group-hover:translate-x-2 sm:text-5xl">
            →
          </span>
        </div>
      </TransitionLink>
    </PageWrapper>
  );
}
