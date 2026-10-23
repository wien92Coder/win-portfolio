import { Navigate, Route, Routes } from 'react-router';
import { Providers } from './components/Providers';
import { LocaleHygiene } from './i18n/LocaleHygiene';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { WorkDetailPage } from './pages/WorkDetailPage';
import { StudioPage } from './pages/StudioPage';
import { ContactPage } from './pages/ContactPage';

/** v2 is a multi-page editorial site: home, work index, case study detail,
 *  studio profile, and contact. The wipe, cursor, and smooth scroll live in
 *  <Providers /> so they survive every route change. */
function App() {
  return (
    <Providers>
      {/* Keeps <html lang> and the document title in step with the locale.
          Mounted here, not per page, so every route inherits it. */}
      <LocaleHygiene />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<WorkDetailPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Providers>
  );
}

export default App;
