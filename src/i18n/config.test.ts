import { beforeEach, describe, expect, it } from 'vitest';
import { detectLanguage, setLanguage, STORAGE_KEY } from './config';

function setUrl(query: string): void {
  window.history.replaceState({}, '', query || '/');
}

function setBrowserLanguage(lang: string): void {
  Object.defineProperty(window.navigator, 'language', { value: lang, configurable: true });
}

beforeEach(() => {
  window.localStorage.clear();
  setUrl('/');
  setBrowserLanguage('id-ID');
});

describe('detectLanguage precedence', () => {
  it('defaults to Bahasa for non-English browsers', () => {
    expect(detectLanguage()).toBe('id');
  });

  it('selects English for English browsers', () => {
    setBrowserLanguage('en-GB');
    expect(detectLanguage()).toBe('en');
  });

  it('lets the stored preference beat browser detection', () => {
    setBrowserLanguage('en-US');
    setLanguage('id');
    expect(detectLanguage()).toBe('id');
  });

  it('lets the ?lang= URL parameter beat the stored preference', () => {
    setLanguage('id');
    setUrl('/?lang=en');
    expect(detectLanguage()).toBe('en');
  });

  it('ignores invalid ?lang= values and falls back to the stored preference', () => {
    window.localStorage.setItem(STORAGE_KEY, 'id');
    setUrl('/?lang=fr');
    expect(detectLanguage()).toBe('id');
  });

  it('ignores invalid ?lang= values and falls back to browser detection', () => {
    setUrl('/?lang=fr');
    setBrowserLanguage('en-US');
    expect(detectLanguage()).toBe('en');
  });
});

describe('locale persistence', () => {
  it('persists the chosen language to localStorage', () => {
    setLanguage('en');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('en');
  });

  it('round-trips a persisted choice back through detection', () => {
    setLanguage('en');
    setBrowserLanguage('id-ID');
    setUrl('/');
    expect(detectLanguage()).toBe('en');
  });
});