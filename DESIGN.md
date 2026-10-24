# DESIGN.md — Portfolio v2

> **Arah v2 (disetujui 23 Okt 2026):** visual & layout dari template **FORM&CO**
> (`~/Desktop/my-portfolio`, lisensi *DiMaac Free Template* — boleh personal & komersial,
> tanpa wajib atribusi; dilarang mendistribusikan ulang source-nya sebagai template).
> **Konten tetap milik v1.** Integrasi: porting ke React + Vite, bukan pindah framework.
> Spesifikasi lengkap v2 ada di §9; §3–§7 adalah baseline v1 yang diarsipkan.

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

Arah sudah diputuskan: **visual, layout, dan motion dari FORM&CO; konten dari v1.**
Rincian teknis di §9. Ringkasan per section:

```
- [x] Palet:       gelap amber → terang ivory + cobalt #2f50f2
- [x] Tipografi:   Cormorant/Syne/DM Mono → Archivo Black/Archivo/Space Mono
- [x] Hero:        portrait + glow → kolase editorial (wordmark mega, band cobalt, slider)
- [x] Projects:    daftar baris + float hover → grid 2 kolom staggered grayscale→warna
- [x] Motion:      Reveal fade biasa → Lenis + mask text reveal + page wipe
- [x] Dark mode:   dibuang — situs terang saja (keputusan 23 Okt 2026)
- [x] Routing:     multi-halaman ala template (react-router v8)
```

Yang **tidak** boleh berubah tanpa keputusan eksplisit: identitas `Win Winarno®`,
struktur bilingual `en`/`id`, form kontak + endpoint PHP, dan konten 4 project
(Rekam Jejak Hanania, Akar Jogja, Bliho, RMS) beserta case study-nya.

---

## 9. Spesifikasi v2 — diturunkan dari FORM&CO

Diekstrak dari `tailwind.config.ts` + `app/globals.css` template. **Nilai di bawah
menggantikan §3–§5 untuk v2.** Template memakai Tailwind v4.3.3 — sama dengan repo ini,
sehingga tidak perlu penyesuaian sintaks v3→v4.

### 9.1 Palet

| Token | Nilai | Peran |
|---|---|---|
| `--paper` | `#faf9f6` | latar utama (ivory hangat) |
| `--ink` | `#101014` | teks & near-black |
| `--accent` | `#2f50f2` | cobalt elektrik — satu-satunya warna kuat |
| `--moss` | `#e8ecff` | tint cobalt untuk fill halus |
| `--muted` | `rgba(16,16,20,0.55)` | teks sekunder |
| hairline | `rgba(16,16,20,0.13)` | garis pemisah 1px |

Aturan: tidak ada warna lain. Semua penekanan memakai cobalt atau opacity ink.

### 9.2 Tipografi (self-hosted, wajib)

| Keluarga | Token | Weight | Peran |
|---|---|---|---|
| **Archivo Black** | `--font-display` | 400 | wordmark mega, heading lowercase, angka besar |
| **Archivo** | `--font-sans` | 400/500/600 | body copy, UI |
| **Space Mono** | `--font-mono` | 400/700 | label 10–11px uppercase, micro-copy |

Template memuatnya via `next/font/google`; di Vite kita **unduh woff2 latin ke
`public/fonts/`** dan deklarasikan `@font-face` — alasan sama dengan §4 (CDN Google
tidak reliabel di sebagian ISP Indonesia). Tidak ada dependensi `next/font`.

Skala: `text-mega` = `clamp(4.5rem, 18vw, 16rem)`, `text-huge` = `clamp(3rem, 9vw, 8rem)`,
label `10px`/`11px` + `tracking: 0.22em`, body `15px`/`17px` `leading 1.6`.

### 9.3 Utility wajib (pindahkan ke `src/index.css`)

`.label` · `.micro-copy` · `.body-copy` · `.link-line` (underline wipe) ·
`.img-editorial` (grayscale → warna, 900ms expo) · `.grain` (fixed, opacity .05,
tanpa `mix-blend-mode` karena memicu repaint tiap frame) · `.no-scrollbar` ·
`.reveal-mask` (clip untuk text reveal).

### 9.4 Motion

| Kurva | Nilai | Pakai untuk |
|---|---|---|
| `editorial` | `cubic-bezier(0.76,0,0.24,1)` | wipe, reveal simetris |
| `expo` | `cubic-bezier(0.16,1,0.3,1)` | hover feedback, zoom |

Tambahan dependensi: **`lenis`** (smooth scroll) + `motion` (sudah ada, v13 — API
kompatibel dengan `framer-motion` v11 template). Semua animasi tetap tunduk pada
`prefers-reduced-motion` seperti §7.

### 9.5 Pemetaan halaman v1 → v2

| Route v2 | Isi v1 | Setara di template |
|---|---|---|
| `/` | Hero, 4 project terpilih, services/competency, stats, CTA | `app/page.tsx` |
| `/work` | Daftar lengkap 4 project + filter/kategori | `app/work/page.tsx` |
| `/work/:slug` | Case study per project (Pillar A/B v1) | `app/work/[slug]` |
| `/about` | About + Timeline + kompetensi lengkap | `app/studio/page.tsx` |
| `/contact` | Form kontak + CountrySelect + endpoint PHP | `app/contact/page.tsx` |

Slug: `rekam-jejak-hanania`, `akar-jogja`, `bliho`, `revenue-management-system`.
Komponen lintas halaman: `Header`, `FullscreenMenu`, `Footer`, `Cursor`,
`PageWrapper`, `LenisProvider`, `TransitionLink` + `TransitionContext` (page wipe).

**Konsekuensi deploy (wajib sebelum go-live):** SPA multi-halaman butuh nginx
mengarahkan deep link ke `index.html`:

```nginx
location / { try_files $uri $uri/ /index.html; }
```

File: `/etc/nginx/sites-available/win-portfolio` di VPS. Tanpa baris ini,
membuka `https://win-portfolio.my.id/work/bliho` langsung akan 404. Perubahan
nginx **butuh persetujuan pengguna** (guardrail 3) dan diverifikasi setelah deploy.
Alternatif bila nginx tidak boleh diubah: router mode hash (URL jadi `/#/work`).

### 9.6 Aset & lisensi

- Gambar demo Pexels template **tidak dipakai** — semua diganti aset project v1
  (`public/projects/*.webp`) plus foto tambahan milik sendiri.
- Jangan menyalin teks, nama klien, atau angka dari template (Helio Energy, 60 project,
  14 awards, dst.). Semua copy dari `src/i18n/locales/`.
- `node_modules`, `.next`, dan `package-lock.json` template tidak disalin.

### 9.7 Urutan commit yang direncanakan

1. `chore: token & font v2 (Archivo/Space Mono, palet ivory-cobalt)` + hapus dark mode
2. `feat: shell multi-halaman (router, header, menu, footer, cursor, Lenis, wipe)`
3. `feat: hero kolase editorial`
4. `feat: marquee + intro + grid selected work`
5. `feat: lookbook drag-rail + services + stats + CTA`
6. `feat: halaman /work + /work/:slug dari case study v1`
7. `feat: /studio + /contact (form PHP & CountrySelect)`
8. `chore: hapus komponen v1 yang tidak terpakai`

Setiap commit harus lolos `npm run typecheck` sebelum lanjut.

### 9.8 Tidak ikut diporting dari v1

`ThemeToggle`, `theme.ts`, token `:root[data-theme="light"]`, `--portrait-filter`,
`CustomCursor` v1 (diganti `Cursor` template), `Marquee` v1, `Projects.tsx`
(daftar baris + float image), `.project-*` CSS, `reveal` fade v1 (diganti mask reveal).
Hapus pada commit terakhir setelah semua section v2 terbukti jalan.

---

## 10. Verifikasi sebelum usul merge (Langkah 5)

- [ ] `npm run typecheck` bersih
- [ ] `npm test` lulus
- [ ] `npm run build` sukses
- [ ] Dicek di desktop **dan** mobile (360px)
- [ ] Dicek di ≥ 2 browser
- [ ] Semua link, gambar, dan form berfungsi
- [ ] Deep link `/work/bliho` dibuka langsung (bukan lewat klik) dan tidak 404
- [ ] Form kontak benar-benar mengirim (endpoint `contact.php`)
- [ ] Teks template (`FORM&CO`, Pexels, 60 projects) tidak tersisa di mana pun
- [ ] Tidak ada teks/bahasa Inggris yang bocor di locale `id` (dan sebaliknya)
