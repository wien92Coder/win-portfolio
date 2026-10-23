import { useTranslation } from 'react-i18next';
import { site } from '../content/site';
import { NAV_ITEMS } from '../content/nav';
import { TransitionLink } from './TransitionLink';
import { MagneticButton } from './MagneticButton';
import { useTransition } from '../context/TransitionContext';

/** Persistent footer — editorial colophon closing on the oversized wordmark. */
export function Footer() {
  const { t } = useTranslation();
  const { navigateTo } = useTransition();

  return (
    <footer className="border-t border-t-ink/15 bg-paper px-5 pb-8 pt-20 sm:px-8">
      <div className="mb-20 flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-end">
        <div>
          <p className="label mb-5 text-ink/50">{t('menu.haveProject')}</p>
          <h2 className="max-w-[16ch] font-display text-[10vw] lowercase leading-[0.9] tracking-tight sm:text-[4.5vw]">
            {t('menu.ctaTitle')}
          </h2>
        </div>
        <MagneticButton
          onClick={() => navigateTo('/contact')}
          strength={0.5}
          className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-ink text-ink"
        >
          <span className="text-2xl leading-none" aria-hidden>
            →
          </span>
          <span className="sr-only">{t('menu.contact')}</span>
        </MagneticButton>
      </div>

      <div className="grid grid-cols-2 gap-y-12 border-t border-t-ink/15 pt-12 sm:grid-cols-12">
        <div className="col-span-1 sm:col-span-3">
          <p className="label mb-5 text-ink/50">{t('menu.index')}</p>
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="label link-line hover:text-accent">
                  {t(item.key)}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-1 sm:col-span-3">
          <p className="label mb-5 text-ink/50">{t('menu.studioLabel')}</p>
          <ul className="flex flex-col gap-2">
            <li className="label text-ink/80">{site.location}</li>
            <li className="label text-ink/80">{site.est}</li>
            <li className="label text-ink/80">{site.season}</li>
          </ul>
        </div>

        <div className="col-span-2 sm:col-span-3">
          <p className="label mb-5 text-ink/50">{t('menu.availabilityLabel')}</p>
          <p className="label max-w-[24ch] text-ink/80">{site.availability}</p>
        </div>

        <div className="col-span-2 sm:col-span-3">
          <p className="label mb-5 text-ink/50">{t('menu.colophon')}</p>
          <p className="micro-copy max-w-[28ch]">{site.descriptor}</p>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-t-ink/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="label text-ink/50">
          © {new Date().getFullYear()} {site.brand} — {t('menu.rights')}
        </p>
        <p className="font-display text-[18vw] lowercase leading-[0.78] tracking-tighter sm:text-[13vw]">
          {site.word}
          <span className="text-accent">.</span>
        </p>
      </div>
    </footer>
  );
}
