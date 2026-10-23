import { useTranslation } from 'react-i18next';

/**
 * Top ticker. The word list is rendered twice inside one track; the CSS
 * `marquee-slide` animation moves it -50%, so the seam is invisible and the
 * loop costs no main-thread work. Words come from the locale files.
 */
export function Marquee() {
  const { t } = useTranslation();
  const items = t('marquee.items', { returnObjects: true }) as string[];

  return (
    <section className="border-y hairline border-y-ink/15 py-4">
      <div className="flex overflow-hidden whitespace-nowrap" aria-label={t('marquee.ariaLabel')}>
        <div className="marquee-track flex w-max shrink-0" aria-hidden>
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0">
              {items.map((word, i) => (
                <span key={`${dup}-${i}`} className="flex items-center gap-10 pr-10">
                  <span className="font-display text-2xl lowercase tracking-tight">{word}</span>
                  <span className="text-accent">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
