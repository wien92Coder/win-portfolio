import { describe, expect, it } from 'vitest';
import { formatRupiah } from './format';

// Intl.NumberFormat separates currency from amount with a narrow no-break
// space (U+202F), which is typographically correct but invisible in a literal.
// Normalize it so the assertions compare the visible string.
function visible(value: string): string {
  return value.replace(/[\u202f\u00a0]/g, ' ');
}

describe('formatRupiah', () => {
  it('formats Rupiah with Indonesian punctuation', () => {
    expect(visible(formatRupiah(75000, 'id'))).toBe('Rp 75.000');
    expect(visible(formatRupiah(900000, 'id'))).toBe('Rp 900.000');
    expect(visible(formatRupiah(25000, 'id'))).toBe('Rp 25.000');
  });

  it('formats Rupiah with international punctuation', () => {
    expect(visible(formatRupiah(75000, 'en'))).toBe('IDR 75,000');
    expect(visible(formatRupiah(900000, 'en'))).toBe('IDR 900,000');
  });
});