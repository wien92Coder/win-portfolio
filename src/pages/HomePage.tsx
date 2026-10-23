import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { site } from '../content/site';

/** Home. Sections land here one commit at a time; this is the shell scaffold. */
export function HomePage() {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <section className="px-5 pt-32 sm:px-8 sm:pt-40">
        <p className="label flex items-center gap-3 text-ink/50">
          <span className="inline-block h-1.5 w-1.5 bg-accent" />
          {site.brand} / {site.tagline}
        </p>
        <AnimatedText
          as="h1"
          text={t('menu.ctaTitle')}
          className="mt-6 block max-w-[16ch] font-display text-huge lowercase leading-[0.85] tracking-tight"
        />
        <p className="micro-copy mt-8 max-w-[42ch]">{site.descriptor}</p>
      </section>
    </PageWrapper>
  );
}
