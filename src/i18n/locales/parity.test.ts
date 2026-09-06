import { describe, expect, it } from 'vitest';
import en from './en.json';
import id from './id.json';

function collectShapes(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) {
    return [`${path}[]`];
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => collectShapes(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

function arrayLengths(value: unknown, path = '', out: Array<[string, number]> = []): Array<[string, number]> {
  if (Array.isArray(value)) {
    out.push([path, value.length]);
  } else if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      arrayLengths(v, path ? `${path}.${k}` : k, out);
    }
  }
  return out;
}

describe('locale key parity', () => {
  it('exposes an identical key structure in both locales', () => {
    expect(collectShapes(en).sort()).toEqual(collectShapes(id).sort());
  });

  it('keeps every array the same length in both locales', () => {
    expect(arrayLengths(en).sort()).toEqual(arrayLengths(id).sort());
  });

  it('actually translates the headline copy', () => {
    expect(en.hero.h1).not.toBe(id.hero.h1);
    expect(en.hero.bridge).not.toBe(id.hero.bridge);
  });

  it('keeps calculator status badges identical by design', () => {
    expect(en.playground.status).toEqual(id.playground.status);
  });
});