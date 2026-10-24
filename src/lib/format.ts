import i18n, { normalizeLanguage } from '../i18n/config';
import type { Language } from '../i18n/config';

const LOCALES: Record<Language, Intl.LocalesArgument> = {
  id: 'id-ID',
  en: 'en',
};

/**
 * Formats a Rupiah amount per the active locale:
 * `Rp 75.000` under Bahasa (id-ID), `IDR 75,000` under English.
 */
export function formatRupiah(amount: number, locale: Language = normalizeLanguage(i18n.language)): string {
  return new Intl.NumberFormat(LOCALES[locale], {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export type ParsedStat = {
  /** Number the counter counts up to: `4,8` → 4.8. */
  target: number;
  /** Digits kept after the decimal separator, so `4,8` never becomes `5`. */
  decimals: number;
  /** Punctuation of the source string: `,` under Bahasa, `.` under English. */
  separator: '.' | ',';
  /** Trailing mark that stays put while the number moves: `+`, `%`, `x`. */
  suffix: string;
  /** Renders an in-progress value in the same shape as the source string. */
  format: (value: number) => string;
};

/**
 * Splits a proof stat such as `30+`, `92%`, `4,8`, or `12x` into the number to
 * count up to and the bits that must not change mid-count. Parsing the arrow
 * form (`70% → 92%`) is deliberately unsupported: that value is a before/after
 * pair, not a single number, so it renders as-is.
 */
export function parseStatValue(value: string): ParsedStat {
  // `70% → 92%` is a before/after pair, not one number: leave it static.
  const match = value.includes('→') ? null : /^(\d+(?:[.,]\d+)?)(.*)$/.exec(value.trim());
  if (!match) {
    return {
      target: 0,
      decimals: 0,
      separator: '.',
      suffix: value.trim(),
      format: () => value,
    };
  }

  const [, digits, suffix] = match;
  const separator: '.' | ',' = digits.includes(',') ? ',' : '.';
  const decimals = digits.includes(separator) ? digits.split(separator)[1].length : 0;

  return {
    target: Number(digits.replace(',', '.')),
    decimals,
    separator,
    suffix,
    format: (next) => `${next.toFixed(decimals).replace('.', separator)}${suffix}`,
  };
}