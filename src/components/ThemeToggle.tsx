import { useState } from 'react';
import { getThemeSetting, setTheme, type ThemeSetting } from '../theme';

const OPTIONS: ThemeSetting[] = ['system', 'dark', 'light'];
const LABELS: Record<ThemeSetting, string> = {
  system: 'System',
  dark: 'Dark',
  light: 'Light',
};

export function ThemeToggle() {
  const [setting, setSetting] = useState<ThemeSetting>(getThemeSetting);

  function choose(value: ThemeSetting) {
    setSetting(value);
    setTheme(value);
  }

  return (
    <div className="flex items-stretch border border-[color:var(--card-border)]" role="group" aria-label="Theme">
      {OPTIONS.map((option) => {
        const isActive = option === setting;
        return (
          <button
            key={option}
            type="button"
            onClick={() => choose(option)}
            aria-pressed={isActive}
            title={LABELS[option]}
            className={`px-2 py-1.5 text-[0.55rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
              isActive
                ? 'bg-[color:var(--card-bg)] text-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            {option === 'system' ? 'Sys' : option}
          </button>
        );
      })}
    </div>
  );
}