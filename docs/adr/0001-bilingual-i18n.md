# Bilingual Site with react-i18next and Client-Side Locale Selection

The portfolio is a single-page React (Vite) + TypeScript + Tailwind app with a brief that explicitly rejected adding a router. To make it fully bilingual (Bahasa/English), we chose **react-i18next** with two static locale JSONs (`id.json`, `en.json`, fallback `en`). The active locale is selected client-side with this precedence: `?lang=` URL parameter → localStorage → browser-language detection (English browsers get EN) → Bahasa default. Language is not part of the URL path.

**Status**: accepted

## Considered Options

- **Custom lightweight i18n** (React context + JSON, ~60 lines, zero deps) — viable given the project's Abstraction Tax philosophy, but rejected: the content is long-form (5 case studies, timeline, calculator chrome) and the site may grow (Phase 2 Lab page); react-i18next is standard, TypeScript-friendly, and lowers risk in a vibe-coded project.
- **Path-based `/id` and `/en` routing** — rejected: contradicts the explicit no-router decision in the content brief; `?lang=` covers shareable/bookmarkable links without one.

## Consequences

One URL serves both languages (no per-locale SEO paths) — acceptable for a portfolio SPA. The locale is not visible in the URL unless `?lang` is present. Proper nouns (company names, SMART Care, timeline job titles, calculator status badges) stay identical in both locales by design.