# DESIGN.md — Portfolio v2

Sumber kebenaran arah desain untuk branch `redesign-v2`.
**Baca file ini di awal setiap sesi sebelum mengubah apa pun.**

| Item | Nilai |
|---|---|
| Branch produksi (v1) | `main` — jangan disentuh selama redesign |
| Branch redesign (v2) | `redesign-v2` |
| Titik aman v1 | tag `v1.0` (commit `ff2f009`) |
| Status | **v2 belum dimulai** — menunggu persetujuan arah desain |
| Acuan tampilan | `git worktree add ../portfolio-v1-ref v1.0` (read-only) |

Dokumen pendukung: [design-system.md](docs/supports/design-system.md) (spesifikasi LUMEN asli, 3 lapis token),
[portfolio-framework.md](docs/supports/portfolio-framework.md) (positioning & isi), [CONTEXT.md](CONTEXT.md).

---

## 1. Aturan main v2

1. **Token dulu, komponen kemudian.** Semua warna, font, dan spacing wajib lewat variabel
   CSS (`--bg`, `--accent`, `--font-display`, …) atau utility Tailwind. **Tidak ada hex/px
   hardcode di komponen** — itu yang membuat ganti tema v2 nanti murah.
2. **Satu perubahan visual per commit.** Pisahkan commit desain (`style:`) dari konten (`content:`).
3. **Jangan ubah tanpa persetujuan:** keluarga font, palet warna inti, dan urutan section.
   Ketiganya sudah ditetapkan di §2–§4 dan hanya boleh berubah lewat revisi file ini.
4. **Guardrail aksesibilitas tidak boleh dikorbankan demi estetika** (§7).
5. Kalau ada hal yang tidak tercakup file ini, **tanyakan dulu** — jangan improvisasi.

---

## 2. Mood & nuansa (warisan v1, dipertahankan kecuali diputuskan lain)

Editorial gelap yang tenang dan presisi: permukaan near-black, teks hangat seperti kertas tua,
aksen amber tipis, hairline 6% putih, grain halus di seluruh halaman. Kesan yang dituju:
**studio arsip** — mahal, sunyi, dan sengaja tidak ramai, bukan startup SaaS.

Tiga bahan yang membentuk karakter ini dan sebaiknya tidak dibuang di v2:

- **Kontras serif × mono** — heading Cormorant besar vs body DM Mono kecil ber-tracking lebar.
- **Ritme band selang-seling** `--bg` / `--bg2` antar section (bukan satu latar rata).
- **Detail kecil yang mahal** — rail amber 2px saat hover baris, glow-card radial, grain.

---

## 3. Palet warna

### Dark (default, `:root`)

| Token | Nilai | Peran |
|---|---|---|
| `--bg` | `#060608` | permukaan utama |
| `--bg2` | `#0d0d12` | band alternatif |
| `--bg3` | `#12121a` | kartu / baris hover |
| `--border` / `--card-border` | `rgba(255,255,255,0.06)` | hairline |
| `--fg` | `#d4cfc8` | teks body |
| `--warm` | `#f0e8d8` | teks paling terang (logo, heading) |
| `--muted` | `#6b6870` | label, metadata |
| `--accent` | `#f5c97a` | amber — aksen utama |
| `--accent-dim` | `#a8823a` | amber redup |
| `--accent-glow` | `rgba(245,201,122,0.15)` | halo |
| `--card-bg` | `rgba(6,6,8,0.8)` | kartu transparan (nav sticky) |
| `--status-ok` / `--status-warn` / `--status-crit` | `#4ade80` / `#fbbf24` / `#f87171` | badge kalkulator, label "in development" |

### Light (`:root[data-theme="light"]`)

| Token | Nilai |
|---|---|
| `--bg` / `--bg2` / `--bg3` | `#f0ece3` / `#e7e2d7` / `#ded8cb` |
| `--fg` / `--warm` | `#0d0d14` |
| `--muted` | `#9a9aaa` |
| `--accent` / `--accent-dim` | `#3a6e00` (hijau tua, sengaja beda dari dark) |
| `--border` | `rgba(13,13,20,0.12)` |
| `--status-warn` | `#b45309` |

**Aturan:** setiap warna baru di v2 harus punya padanan di **kedua** tema dan otomatis terbaca
di atas `--bg`/`--bg2`/`--bg3`. Jangan menambah warna yang hanya ada di satu tema.

---

## 4. Tipografi

Self-hosted di `public/fonts/` (10 file woff2, subset latin, ±155 KB). **Jangan** memuat font
dari Google CDN — pernah gagal resolve di sebagian ISP Indonesia dan diam-diam jatuh ke fallback.

| Keluarga | Token | Variasi terpasang | Dipakai untuk |
|---|---|---|---|
| **Cormorant Garamond** (serif) | `--font-display` | 300 n/i, 400 n/i | heading section besar, angka hero |
| **Syne** (sans geometris) | `--font-accent` | 600, 700, 800 | logo, nama project, title kartu case study |
| **DM Mono** (mono) | `--font-mono` | 400 n/i, 500 | body, deskripsi, badge tech, nomor urut, nav, label |

Skala yang berlaku sekarang (utamakan `clamp()` agar tidak perlu breakpoint font):

| Peran | Ukuran | Catatan |
|---|---|---|
| Heading section (Cormorant) | `clamp(2.2rem, 6vw, 3.8rem)` | tracking `0.04em`, leading `0.95` |
| Title kartu case study (Syne) | `clamp(1.05rem, 2.2vw, 1.5rem)` | **uppercase**, `leading-snug` |
| Nama project (Syne) | `clamp(1.15rem, 2.5vw, 1.6rem)` | uppercase, weight 700 |
| Body / deskripsi | `0.78rem` | DM Mono, `leading-[1.8]` |
| Label / eyebrow | `0.55–0.62rem` | uppercase, tracking `0.18–0.25em` |

---

## 5. Spacing & layout

- Container section: `max-w-5xl px-6 py-24` — konsisten di semua section.
- Grid: 1 kolom mobile, `lg:grid-cols-2` untuk pasangan kartu.
- Tinggi minimum target sentuh 44px; hairline `--hairline: 0.0625rem`.
- Band: `<Band tone="bg2">` membungkus section; urutan nada **wajib** selang-seling
  (lihat §6) — jangan menambah dua band senada berurutan.
- Breakpoint mengikuti Tailwind v4 (`sm 40rem`, `md 48rem`, `lg 64rem`, `xl 80rem`).
  Nav desktop muncul di `md`; di bawah itu burger + overlay full-screen.

---

## 6. Inventaris section (`src/Home.tsx`)

| # | Section | Komponen | Band | Anchor |
|---|---|---|---|---|
| 1 | Hero + portrait | `Hero.tsx`, `HeroPortrait.tsx` | `--bg` | `#hero` |
| 2 | Marquee ticker | `Marquee.tsx` | `--bg2` (nyambung ke #3) | — |
| 3 | Playground / Food Cost Calculator | `FoodCostCalculator.tsx` | `--bg2` | `#playground` |
| 4 | **Projects** (daftar baris + float image) | `Projects.tsx` | `--bg` | `#projects` |
| 5 | Case Studies (Pillar A & B) | `CaseStudies.tsx` | `--bg2` | `#case-studies` |
| 6 | Competency Grid | `CompetencyGrid.tsx` | `--bg` | `#competency` |
| 7 | About / Timeline | `Timeline.tsx` | `--bg2` | `#about` |
| 8 | Contact (form) | `Contact.tsx` | `--bg` | `#contact` |
| 9 | Footer | inline di `Home.tsx` | `--bg2` | — |

Section mana pun yang **dihapus/ditambah** di v2 harus memperbarui `LINKS` di `Nav.tsx`
dan key `nav.*` di `src/i18n/locales/{en,id}.json` pada commit yang sama.

---

## 7. Komponen & pola yang ada

| Pola | Lokasi | Catatan |
|---|---|---|
| `.glow-card` | `index.css` | border hairline + radial glow `::before` saat hover; mati saat reduced-motion |
| `.project-item` | `index.css` | grid `3rem / 1fr / auto / auto`, rail amber `::before` scaleY on hover |
| `.project-float` | `index.css` | preview 280×180 mengikuti kursor, lerp frame-rate-independent |
| `.tech-badge`, `.project-badge` | `index.css` | DM Mono 0.55rem uppercase; badge status pakai `--status-warn` |
| `.nav-link` | `index.css` | underline `::after` tumbuh dari kiri |
| `Reveal` | `components/Reveal.tsx` | fade + 18px rise saat masuk viewport (`once`) |
| `CustomCursor` | `components/CustomCursor.tsx` | dot + ring, hanya `pointer: fine` |

**Guardrail aksesibilitas (non-negosiasi):**

- Setiap animasi transform/layout harus punya jalur `prefers-reduced-motion` — sudah
  ditangani global oleh `<MotionConfig reducedMotion="user">` + blok CSS terpisah.
- Elemen interaktif butuh label (`aria-label`/teks), fokus terlihat, dan target ≥ 44px.
- Kontras teks body minimal 4.5:1 — cek ulang setiap kali `--fg`/`--muted` diubah.
- Gambar dekoratif `aria-hidden`, gambar konten punya `alt` bermakna.

---

## 8. Yang akan diubah di v2

> **BELUM DIPUTUSKAN.** Isi bagian ini sebelum menulis kode v2, lalu tunggu persetujuan
> pengguna. Format yang diharapkan:

```
- [ ] Hero:        <apa yang berubah, mengapa>
- [ ] Projects:    <…>
- [ ] Case Studies:<…>
- [ ] Tipografi:   <tetap / ganti ke …>
- [ ] Palet:       <tetap / arah baru …>
- [ ] Motion:      <tetap / lebih tenang / lebih hidup …>
```

Yang **tidak** boleh berubah tanpa keputusan eksplisit: identitas `Win Winarno®`,
struktur bilingual `en`/`id`, form kontak + endpoint PHP, dan token di §3–§5.

---

## 9. Verifikasi sebelum usul merge (Langkah 5)

- [ ] `npm run typecheck` bersih
- [ ] `npm test` lulus
- [ ] `npm run build` sukses
- [ ] Dicek di desktop **dan** mobile (360px)
- [ ] Dicek di ≥ 2 browser
- [ ] Semua link, gambar, dan form berfungsi
- [ ] Dark **dan** light mode sama-sama benar
- [ ] Tidak ada teks/bahasa Inggris yang bocor di locale `id` (dan sebaliknya)
