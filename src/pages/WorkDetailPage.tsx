import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { RevealImage } from '../components/RevealImage';
import { TransitionLink } from '../components/TransitionLink';
import { useProjects } from '../content/projects';

/**
 * Case study detail. Everything shown here comes from the v1 project data —
 * name, description, stack, live URL, screenshot. No invented client names,
 * periods, or outcome numbers.
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
          <TransitionLink href="/work" cursorMode="link" className="label link-line mt-8 inline-block text-accent">
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

      <div className="mt-14 grid grid-cols-1 gap-10 border-t hairline border-t-ink/20 pt-10 sm:grid-cols-12 sm:gap-8">
        <div className="sm:col-span-5">
          <p className="label mb-4 text-ink/50">{t('work.overview')}</p>
          <p className="body-copy max-w-[42ch]">{project.description}</p>

          <dl className="mt-10 flex flex-col gap-6 border-t hairline border-t-ink/15 pt-6">
            <div>
              <dt className="label mb-2 text-ink/50">{t('work.stack')}</dt>
              <dd className="font-display text-lg lowercase leading-snug tracking-tight">
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
        </div>

        <div className="sm:col-span-7">
          <RevealImage
            src={project.image}
            alt={project.name}
            className="aspect-[16/10] w-full"
            priority
          />
        </div>
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
