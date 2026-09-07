import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, expect, it, beforeAll } from 'vitest';
import '../i18n/config';
import { SixFaces } from './SixFaces';

// Opt into React's act() environment (no @testing-library/react here).
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom doesn't implement these browser APIs the cube needs.
beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;

  class StubIntersectionObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): [] {
      return [];
    }
  }
  window.IntersectionObserver = StubIntersectionObserver as unknown as typeof IntersectionObserver;

  class StubResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  window.ResizeObserver = StubResizeObserver as unknown as typeof ResizeObserver;
});

describe('SixFaces page', () => {
  it('renders the immersive cube experience on /six-faces', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/six-faces']}>
          <Routes>
            <Route path="/six-faces" element={<SixFaces />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    expect(container.querySelector('#scene')).not.toBeNull();
    expect(container.querySelector('#cube')).not.toBeNull();
    expect(container.querySelectorAll('.face')).toHaveLength(6);
    expect(container.querySelectorAll('.text-card')).toHaveLength(6);
    expect(container.querySelector('.sixfaces-back')?.textContent).toContain('Back');

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});