import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { TransitionLink } from '../components/TransitionLink';
import { LanguageToggle } from '../components/LanguageToggle';
import { FoodCostCalculator } from '../components/FoodCostCalculator';

/**
 * Playground: one working tool rather than a gallery of experiments. The food
 * cost & margin calculator is the same one from v1, rebuilt with the v2 system
 * — hairline rules, display-face numbers, a single cobalt accent.
 */
export function PlaygroundPage() {
  const { t } = useTranslation();

  return (
    <PageWrapper className="px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <header className="border-b hairline border-b-ink/20 pb-10 sm:pb-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="label flex items-center gap-3 text-ink/50">
            <span className="inline-block h-px w-8 bg-ink/30" />
            {t('nav.playground')} — {t('playground.tagline')}
          </p>
          <LanguageToggle />
        </div>
        <AnimatedText
          as="h1"
          text={t('playground.title')}
          className="block max-w-[20ch] font-display text-[10vw] lowercase leading-[0.9] tracking-tighter sm:text-[4.5vw]"
          stagger={0.02}
        />
        <p className="body-copy mt-8 max-w-[52ch]">{t('playground.intro')}</p>
      </header>

      <FoodCostCalculator />

      <p className="micro-copy mt-16 max-w-[62ch] border-t hairline border-t-ink/20 pt-6">
        {t('playground.credibility')}
      </p>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <TransitionLink
          href="/contact?goal=hospitality"
          cursorMode="link"
          className="label border border-ink/30 px-6 py-4 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-paper"
        >
          {t('hero.ctaSecondary')}
        </TransitionLink>
        <TransitionLink href="/" cursorMode="link" className="link-line label text-ink/60">
          {t('menu.home')}
        </TransitionLink>
      </div>
    </PageWrapper>
  );
}
