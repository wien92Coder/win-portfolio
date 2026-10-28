import { describe, expect, it } from 'vitest';
import { formatRupiah, parseStatValue } from './format';

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

describe('parseStatValue', () => {
  it('keeps a trailing mark while the number counts', () => {
    const plus = parseStatValue('30+');
    expect(plus.target).toBe(30);
    expect(plus.suffix).toBe('+');
    expect(plus.format(0)).toBe('0+');
    expect(plus.format(30)).toBe('30+');

    expect(parseStatValue('92%').format(92)).toBe('92%');
    expect(parseStatValue('12x').format(12)).toBe('12x');
  });

  it('honours the decimal separator of each language', () => {
    const id = parseStatValue('4,8');
    expect(id.target).toBe(4.8);
    expect(id.decimals).toBe(1);
    expect(id.separator).toBe(',');
    expect(id.format(3.4)).toBe('3,4');
    expect(id.format(4.8)).toBe('4,8');

    const en = parseStatValue('4.8');
    expect(en.target).toBe(4.8);
    expect(en.format(4.8)).toBe('4.8');
  });

  it('leaves a before/after pair alone instead of counting only the first number', () => {
    const arrow = parseStatValue('70% → 92%');
    expect(arrow.target).toBe(0);
    expect(arrow.format(35)).toBe('70% → 92%');
  });
});