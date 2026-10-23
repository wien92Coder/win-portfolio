import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

/** Cursor modes the custom cursor can morph into. */
export type CursorMode = 'default' | 'link' | 'view' | 'drag';

type Controls = {
  setCursor: (mode: CursorMode) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const ControlsContext = createContext<Controls | null>(null);

/** The live cursor mode lives in its own context: every hover calls
 *  setCursor, and keeping the value separate means only <Cursor /> re-renders
 *  instead of the header, menu, and every link that merely sets it. */
const CursorModeContext = createContext<CursorMode>('default');

/** Shared UI state: cursor mode + the full-screen menu toggle. */
export function UIProvider({ children }: { children: ReactNode }) {
  const [cursor, setCursor] = useState<CursorMode>('default');
  const [menuOpen, setMenuOpen] = useState(false);
  const controls = useMemo(() => ({ setCursor, menuOpen, setMenuOpen }), [menuOpen]);

  return (
    <ControlsContext.Provider value={controls}>
      <CursorModeContext.Provider value={cursor}>{children}</CursorModeContext.Provider>
    </ControlsContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(ControlsContext);
  if (!ctx) throw new Error('useUI must be used within <UIProvider>');
  return ctx;
}

/** The current cursor mode — read by the cursor itself, nothing else. */
export function useCursorMode() {
  return useContext(CursorModeContext);
}
