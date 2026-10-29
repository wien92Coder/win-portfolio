# Credits

## Photography

The case-study photographs are served locally (no hotlinking). They are
captioned as illustrations and are **not** presented as client premises.

| File | Source | Licence |
|------|--------|---------|
| `public/images/case-large-private-v2.jpg` | added by Win — source to confirm | pending |
| `public/images/case-regional-government-v2.jpg` | added by Win — source to confirm | pending |
| `public/images/case-heritage-v2.jpg` | added by Win — source to confirm | pending |

The `-v2` files replaced three Unsplash placeholders:
[1518005020951-eccb494ad742](https://unsplash.com/photos/1518005020951-eccb494ad742),
[1486406146926-c627a92ad1ab](https://unsplash.com/photos/1486406146926-c627a92ad1ab),
and [1524230572899-a752b3835840](https://unsplash.com/photos/1524230572899-a752b3835840).
Those links record where the earlier photos came from; they do not describe the
current artwork, so confirm the source (and the caption under each figure)
before treating the licence as settled.

The `-v2` suffix is also a cache-buster: nginx serves `/images/` with
`max-age=2592000, immutable`, so a replaced photo only reaches visitors who
already hold the old file if its URL changes. Bump the suffix whenever one of
these files is swapped.

## Other imagery

- `public/projects/*.webp` — screenshots of Win Winarno's own projects.
- `public/cube/face-*.webp` — hero frames of Win's projects, carried over from v1.
- `public/portrait.jpg`, `public/photo.jpg` — supplied by Win.
- `public/arrow.svg` — supplied by Win; the hand-drawn pointer in the hero,
  loaded as an image and nudged by the `.hero-arrow` CSS loop.
- `public/og-cover.jpg` — the 1200×630 social share card, composed from
  `public/images/resort.jpg` (supplied by Win) using the site's own type and
  palette. Regenerate it from that photo if the brand palette changes.
- `public/about.jpg`, `public/images/hanania-1.jpg`, and the photographs in
  `public/images/` used by the menu, lanes, and lookbook — supplied by Win.
  Photographs are capped at 1600px on the long side and re-encoded so the
  deployed site ships kilobytes, not tens of megabytes.

## Type

- Archivo Black, Archivo, Space Mono — SIL Open Font License 1.1, self-hosted in
  `public/fonts/`.
- Marck Script (Google Fonts) — SIL Open Font License 1.1, self-hosted in
  `public/fonts/`. Used only for the hand-written hero annotation.

## Template

The v2 layout was adapted from a free portfolio template. Its licence permits
personal and commercial use without a required attribution, and no template
demo content, imagery, or code-specific assets remain in this repository.
