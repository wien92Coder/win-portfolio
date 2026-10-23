import { useParams } from 'react-router';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';

/** Case study detail. The slug maps onto the project ids in the locale files. */
export function WorkDetailPage() {
  const { slug = '' } = useParams();

  return (
    <PageWrapper>
      <section className="px-5 pt-32 sm:px-8 sm:pt-40">
        <p className="label text-ink/50">{slug}</p>
        <AnimatedText
          as="h1"
          text="case study"
          className="mt-4 block font-display text-huge lowercase leading-[0.85] tracking-tight"
        />
      </section>
    </PageWrapper>
  );
}
