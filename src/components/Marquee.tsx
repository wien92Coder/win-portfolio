import { useTranslation } from 'react-i18next';

/** Infinite horizontal ticker (LUMEN marquee): the content is duplicated
 *  once and the track slides -50% over 22s, so the loop is perfectly
 *  seamless. Swap the strings in MARQUEE_ITEMS to change the content. */
const MARQUEE_ITEMS = [
  'Win Winarno',
  'Hospitality Ops',
  'Healthcare IT',
  'Vibe Coding',
  'Digital Operating Systems',
  '30+ Years Experience',
  'Automation',
];

export function Marquee() {
  const { t } = useTranslation();
  const label = t('marquee.ariaLabel', 'Highlights');

  const half = (
    <>
      {MARQUEE_ITEMS.map((text, index) => (
        <span key={index}>
          {text}
          <span className="marquee-accent" aria-hidden="true">
            {' '}
            ◆
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className="marquee-strip" aria-label={label}>
      <div className="marquee-inner" aria-hidden="true">
        {half}
        {half}
      </div>
    </div>
  );
}
