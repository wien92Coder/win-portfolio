import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { site } from '../content/site';

/** Studio — profile, numbers, and the career timeline. */
export function StudioPage() {
  return (
    <PageWrapper>
      <section className="px-5 pt-32 sm:px-8 sm:pt-40">
        <p className="label text-ink/50">{site.est}</p>
        <AnimatedText
          as="h1"
          text="the operator behind the systems"
          className="mt-4 block max-w-[20ch] font-display text-huge lowercase leading-[0.85] tracking-tight"
        />
      </section>
    </PageWrapper>
  );
}
