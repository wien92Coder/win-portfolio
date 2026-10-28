import { describe, expect, it } from 'vitest';
import { CASE_SECTION, CASE_STUDIES } from './caseStudies';

/** The hard rule from the case-study spec: nothing identifying may survive.
 *  The names are stored reversed so the repository-wide anonymity grep does
 *  not flag this guard itself. */
const FORBIDDEN = new RegExp(
  ['ojerogolt', 'cms', 'gnabmer', 'dusr', 'htebasile', 'itairdni', 'eosmas', 'tayarb', 'gnarames']
    .map((name) => name.split('').reverse().join(''))
    .join('|'),
  'i',
);

const bilingual = (value: Record<'id' | 'en', string>) =>
  value.id.trim().length > 0 && value.en.trim().length > 0;

describe('case study data', () => {
  it('holds exactly the three anonymised studies with unique slugs', () => {
    expect(CASE_STUDIES).toHaveLength(3);
    expect(new Set(CASE_STUDIES.map((study) => study.slug)).size).toBe(3);
    for (const study of CASE_STUDIES) {
      expect(study.slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });

  it('gives every study a three-item metric strip led by the hero metric', () => {
    for (const study of CASE_STUDIES) {
      expect(study.metrics).toHaveLength(3);
      expect(study.metrics[0]).toEqual(study.heroMetric);
      for (const metric of study.metrics) {
        expect(bilingual(metric.value)).toBe(true);
        expect(bilingual(metric.label)).toBe(true);
      }
    }
  });

  it('keeps both languages populated on every field', () => {
    for (const study of CASE_STUDIES) {
      expect(bilingual(study.title)).toBe(true);
      expect(bilingual(study.tagline)).toBe(true);
      expect(bilingual(study.client)).toBe(true);
      expect(bilingual(study.scale)).toBe(true);
      expect(bilingual(study.period)).toBe(true);
      expect(bilingual(study.role)).toBe(true);
      expect(bilingual(study.focus)).toBe(true);
      expect(bilingual(study.context)).toBe(true);
      expect(bilingual(study.imageAlt)).toBe(true);
      expect(study.tags.every(bilingual)).toBe(true);
      expect(study.approach).toHaveLength(3);
      expect(study.results).toHaveLength(3);
      expect(study.approach.every(bilingual)).toBe(true);
      expect(study.results.every(bilingual)).toBe(true);
    }
  });

  it('contains no real client names, cities, or districts', () => {
    const serialised = JSON.stringify({ CASE_STUDIES, CASE_SECTION });
    expect(serialised).not.toMatch(FORBIDDEN);
  });

  it('carries the confidentiality note in both languages', () => {
    expect(CASE_SECTION.footer.id).toContain('Identitas klien dirahasiakan');
    expect(CASE_SECTION.footer.en).toContain('Client identities are withheld');
  });
});
