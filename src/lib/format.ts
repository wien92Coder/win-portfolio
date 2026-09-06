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