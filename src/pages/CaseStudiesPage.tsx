import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { TransitionLink } from '../components/TransitionLink';
import { CaseStudyCard } from '../components/CaseStudyCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { CASE_SECTION, CASE_STUDIES } from '../content/caseStudies';

/**
 * Case studies index. The intro, three cards, and the confidentiality note use
 * the same copy as the detail pages; nothing here names a client.
 */
export function CaseStudiesPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';
  const s = CASE_SECTION;

  return (
    <PageWrapper className="px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <header className="border-b hairline border-b-ink/20 pb-10 sm:pb-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="label flex items-center gap-3 text-ink/50">
            <span className="inline-block h-px w-8 bg-ink/30" />
            {s.label[lang]} — {s.index[lang]}
          </p>
          <LanguageToggle />
        </div>
        <AnimatedText
          as="h1"
          text={s.title[lang]}
          className="block max-w-[20ch] font-display text-[10vw] lowercase leading-[0.9] tracking-tighter sm:text-[4.5vw]"
          stagger={0.02}
        />
        <p className="body-copy mt-8 max-w-[52ch]">{s.intro[lang]}</p>
      </header>

      {/* Glance strip: all three hero metrics stay visible together on desktop,
          while the full cards stack below. */}
      <nav
        aria-label={s.atGlance[lang]}
        className="grid grid-cols-1 border-b hairline border-b-ink/20 sm:grid-cols-3"
      >
        {CASE_STUDIES.map((study, index) => (
          <a
            key={study.slug}
            href={`#${study.slug}`}
            className="group flex flex-col justify-between gap-6 border-t border-t-ink/10 py-6 pr-4 transition-colors hover:bg-moss/40 sm:border-l sm:border-t-0 sm:border-l-ink/15 sm:px-6 sm:first:border-l-0"
          >
            <p className="label text-ink/50">
              {String(index + 1).padStart(2, '0')} — {study.sector[lang]}
            </p>
            <p className="font-display text-[9vw] leading-[0.9] tracking-tighter sm:text-[2.1vw]">
              {study.heroMetric.value[lang]}
            </p>
            <span className="flex items-baseline justify-between gap-4">
              <span className="max-w-[22ch] font-display text-sm leading-snug tracking-tight">
                {study.title[lang]}
              </span>
              <span aria-hidden className="text-accent transition-transform duration-300 group-hover:translate-y-1">
                ↓
              </span>
            </span>
          </a>
        ))}
      </nav>

      <div>
        {CASE_STUDIES.map((study, index) => (
          <CaseStudyCard key={study.slug} study={study} index={index} lang={lang} />
        ))}
      </div>

      <p className="micro-copy max-w-[62ch] border-t hairline border-t-ink/20 pt-6">
        {s.footer[lang]}
      </p>

      <div className="mt-16 flex flex-wrap items-center gap-6">
        <TransitionLink
          href="/contact?goal=hospitality"
          cursorMode="link"
          className="group flex items-center gap-4 bg-ink px-7 py-5 text-paper transition-colors hover:bg-accent"
        >
          <span className="font-display text-xl lowercase tracking-tight">
            {s.detailCtaButton[lang]}
          </span>
          <span className="text-2xl leading-none transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </TransitionLink>
        <TransitionLink href="/" cursorMode="link" className="label link-line text-ink/60">
          ← {t('menu.home')}
        </TransitionLink>
      </div>
    </PageWrapper>
  );
}
