/**
 * 3-state theme (System → Dark → Light) per design-system.md §7.1:
 * - Default follows prefers-color-scheme on first load.
 * - A manual toggle choice overrides the system preference and persists.
 * - data-theme + color-scheme are set on <html> so all components and the
 *   browser's native UI (scrollbar, form controls) switch together.
 */

export type Theme = 'dark' | 'light';
export type ThemeSetting = Theme | 'system';

export const THEME_STORAGE_KEY = 'portfolio.theme';

const SETTINGS = new Set<string>(['system', 'dark', 'light']);
const mq = window.matchMedia('(prefers-color-scheme: dark)');

export function systemTheme(): Theme {
  return mq.matches ? 'dark' : 'light';
}

export function effectiveTheme(setting: ThemeSetting): Theme {
  return setting === 'system' ? systemTheme() : setting;
}

export function getThemeSetting(): ThemeSetting {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored && SETTINGS.has(stored) ? (stored as ThemeSetting) : 'system';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  // Notify theme-aware consumers (e.g. the Six Faces cube swapping
  // light/dark face images) without them having to poll data-theme.
  window.dispatchEvent(new CustomEvent<Theme>('themechange', { detail: theme }));
}

export function setTheme(setting: ThemeSetting): void {
  window.localStorage.setItem(THEME_STORAGE_KEY, setting);
  applyTheme(effectiveTheme(setting));
}

export function initTheme(): void {
  applyTheme(effectiveTheme(getThemeSetting()));
  // While the visitor stays on "system", follow OS theme changes live.
  mq.addEventListener('change', () => {
    if (getThemeSetting() === 'system') {
      applyTheme(systemTheme());
    }
  });
}