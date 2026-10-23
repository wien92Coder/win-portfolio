import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { site } from '../content/site';

/** Contact — the working form (contact.php endpoint) lands here next. */
export function ContactPage() {
  return (
    <PageWrapper>
      <section className="px-5 pt-32 sm:px-8 sm:pt-40">
        <p className="label text-ink/50">{site.location}</p>
        <AnimatedText
          as="h1"
          text="let's work together"
          className="mt-4 block font-display text-huge lowercase leading-[0.85] tracking-tight"
        />
      </section>
    </PageWrapper>
  );
}
