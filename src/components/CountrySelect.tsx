import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { COUNTRIES, type Country } from '../lib/countries';

interface CountrySelectProps {
  value: Country;
  onChange: (country: Country) => void;
  /** id of the <label> that names this field (aria-labelledby) */
  labelId: string;
}

const BUTTON_CLASS =
  'mt-2 flex w-full items-center gap-2.5 border border-[color:var(--card-border)] bg-transparent px-3 py-2 text-[0.75rem] focus:border-[var(--accent)] focus:outline-none';

export function CountrySelect({ value, onChange, labelId }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = COUNTRIES.findIndex((c) => c.code === value.code);

  // Close on outside pointer-down or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  function focusOption(index: number): void {
    const clamped = Math.max(0, Math.min(COUNTRIES.length - 1, index));
    const option = listRef.current?.querySelector<HTMLButtonElement>(`[data-index="${clamped}"]`);
    option?.focus();
  }

  function onButtonKeyDown(e: KeyboardEvent<HTMLButtonElement>): void {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusOption(selectedIndex + (e.key === 'ArrowDown' ? 1 : -1)));
    }
  }

  function onListKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    const current = Number((e.target as HTMLElement).getAttribute('data-index'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusOption(current + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusOption(current - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusOption(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusOption(COUNTRIES.length - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        id="contact-country"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={value.name}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={onButtonKeyDown}
        className={BUTTON_CLASS}
      >
        <value.Flag className="h-3.5 w-5 shrink-0" aria-hidden="true" />
        <span className="text-[var(--accent)]">{value.dialCode}</span>
        <span className="min-w-0 flex-1 truncate text-left">{value.name}</span>
        <svg
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          className={`h-3 w-3 shrink-0 text-[var(--muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-labelledby={labelId}
          onKeyDown={onListKeyDown}
          className="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto border border-[color:var(--card-border)] bg-[color:var(--card-bg)] backdrop-blur-sm"
        >
          {COUNTRIES.map((country, index) => {
            const selected = country.code === value.code;
            return (
              <button
                key={country.code}
                type="button"
                role="option"
                aria-selected={selected}
                data-index={index}
                onClick={() => {
                  onChange(country);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.72rem] transition-colors duration-150 focus:outline-none focus:bg-[color:var(--card-border)] ${
                  selected ? 'bg-[color:var(--card-border)] text-[var(--accent)]' : 'text-[var(--fg)]'
                }`}
              >
                <country.Flag className="h-3 w-5 shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{country.name}</span>
                <span className="shrink-0 text-[var(--muted)]">{country.dialCode}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}