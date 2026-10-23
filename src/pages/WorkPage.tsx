import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';

/** Work index — the editorial grid of every project. */
export function WorkPage() {
  return (
    <PageWrapper>
      <section className="px-5 pt-32 sm:px-8 sm:pt-40">
        <AnimatedText
          as="h1"
          text="selected work"
          className="block font-display text-huge lowercase leading-[0.85] tracking-tight"
        />
      </section>
    </PageWrapper>
  );
}
