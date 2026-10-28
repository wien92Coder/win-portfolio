/** Brand constants shared by header, menu, footer, and page metadata.
 *  Only facts that already exist in the v1 content — nothing invented. */
export const site = {
  /** Wordmark, rendered as `win.` (the dot is the accent). */
  word: 'win',
  brand: 'Win Winarno',
  tagline: 'Hospitality & Healthcare Tech-Operator',
  descriptor:
    '30+ years of hospitality and healthcare operations, now building the systems that run them — automation, digital operating systems, and custom web apps.',
  season: 'Semarang · Worldwide',
  location: 'Semarang, Central Java, Indonesia',
  est: 'Since 1993',
  availability: 'Open for consulting & build projects',
  /** Canonical origin, used for absolute links and structured data. */
  url: 'https://win-portfolio.my.id',
  linkedin: 'https://linkedin.com/in/win-va',
} as const;
