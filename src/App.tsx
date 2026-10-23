import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Providers } from './components/Providers';
import { LocaleHygiene } from './i18n/LocaleHygiene';

/** Pages are split per route: the shell (chrome, motion, i18n) stays eager, so
 *  the first paint does not carry the case-study and studio code. Named
 *  exports are mapped to `default` for lazy(). */
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const WorkPage = lazy(() => import('./pages/WorkPage').then((m) => ({ default: m.WorkPage })));
const WorkDetailPage = lazy(() =>
  import('./pages/WorkDetailPage').then((m) => ({ default: m.WorkDetailPage })),
);
const StudioPage = lazy(() => import('./pages/StudioPage').then((m) => ({ default: m.StudioPage })));
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);

/** v2 is a multi-page editorial site: home, work index, case study detail,
 *  studio profile, and contact. The wipe, cursor, and smooth scroll live in
 *  <Providers /> so they survive every route change. */
function App() {
  return (
    <Providers>
      {/* Keeps <html lang> and the document title in step with the locale.
          Mounted here, not per page, so every route inherits it. */}
      <LocaleHygiene />
      {/* Paper-coloured placeholder: a split page lands onto the same ground it
          will paint, so the swap never flashes white. */}
      <Suspense fallback={<div className="min-h-[100svh] bg-paper" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Providers>
  );
}

export default App;
