# Design System — "Six Faces" (Sumber: CodePen luis-lessrain/ZYpyoRV)
### Disusun untuk Portofolio Pribadi

> Disusun berdasarkan arsitektur token tiga lapis (Primitive → Semantic → Component) sesuai *Rencana Arsitektur Design Tokens Tiga Lapis*. Sistem ini sudah mendukung **Dark Mode** dan **Light Mode** secara native.

---

## 1. Ringkasan Sistem

Proyek sumber menggunakan pendekatan tema berbasis **CSS Custom Properties** dengan satu set token primitif untuk masing-masing mode (dark/light), yang di-*alias*-kan ke token semantik netral (`--bg`, `--fg`, `--muted`, `--accent`). Perpindahan tema dilakukan lewat atribut `data-theme` di elemen `<html>`, sehingga seluruh komponen otomatis ikut berubah tanpa perlu override manual di tiap class.

Karakter visual: editorial/monospace, minim warna, aksen tunggal, banyak *whitespace*, garis tipis (*hairline*) sebagai elemen dekoratif dominan.

---

## 2. Lapis 1 — Primitive Tokens

Nilai mentah, tanpa makna kontekstual. Ini adalah "kontrak dasar" yang seharusnya jarang berubah.

### 2.1 Warna Primitif

| Token Name | Value | Mode |
|---|---|---|
| `--dark-bg` | `#1c1814` | Dark |
| `--dark-fg` | `#ede8df` | Dark |
| `--dark-muted` | `#8a7b6e` | Dark |
| `--accent-dark` | `#d4a84b` | Dark |
| `--light-bg` | `#f0ece3` | Light |
| `--light-fg` | `#0d0d14` | Light |
| `--light-muted` | `#9a9aaa` | Light |
| `--accent-light` | `#3a6e00` | Light |

Catatan: kedua mode memakai palet warna yang *berbeda karakter*, bukan sekadar inversi hitam-putih — dark mode pakai warna hangat (coklat gelap + emas), light mode pakai warna dingin/organik (krem + hijau tua). Ini penting untuk menghindari efek "visual vibration" saat pindah tema.

### 2.2 Tipografi Primitif

| Token Name | Value |
|---|---|
| `--font-display` | `"Bebas Neue", sans-serif` |
| `--font-mono` | `"DM Mono", monospace` |

### 2.3 Spacing & Sizing Primitif

| Token Name | Value | Kegunaan |
|---|---|---|
| `--ui-inset` | `2rem` | Jarak elemen UI fixed ke tepi layar |
| `--hairline` | `0.0625rem` (1px) | Ketebalan semua garis/border |
| `--reveal-offset` | `0.625rem` | Jarak translate animasi masuk elemen |
| `--reveal-duration` | `0.5s` | Durasi animasi reveal |
| `--z-ui` | `10` | Z-index lapisan UI tetap |

---

## 3. Lapis 2 — Semantic Tokens

Alias fungsional yang dirujuk oleh komponen. **Inilah token yang benar-benar dipakai di kode** — perubahan tema hanya mengganti mapping di lapisan ini, komponen tidak disentuh sama sekali.

```css
/* Default (Dark) */
--bg: var(--dark-bg);
--fg: var(--dark-fg);
--muted: var(--dark-muted);
--accent: var(--accent-dark);

--card-bg: rgba(28, 24, 20, 0.82);
--card-border: rgba(212, 168, 75, 0.2);
```

```css
/* Saat data-theme="light" */
--bg: var(--light-bg);
--fg: var(--light-fg);
--muted: var(--light-muted);
--accent: var(--accent-light);

--card-bg: rgba(240, 236, 227, 0.08);
--card-border: rgba(58, 110, 0, 0.14);
```

| Token Semantik | Peran (Intent) |
|---|---|
| `color.background` (`--bg`) | Latar utama halaman |
| `color.foreground` (`--fg`) | Teks utama / warna kontras terhadap bg |
| `color.muted` (`--muted`) | Teks sekunder, elemen non-primer (dot, label) |
| `color.accent` (`--accent`) | Warna interaktif/penekanan — CTA, progress bar, angka statistik |
| `color.surface.card` (`--card-bg`) | Latar panel/card mengambang di atas scene |
| `color.border.card` (`--card-border`) | Garis tepi card, selaras dengan aksen tema |

Perhatikan pola *desaturasi brand*: `--accent-dark` (`#d4a84b`, emas) lebih hangat & bersaturasi tinggi cocok untuk latar gelap, sedangkan `--accent-light` (`#3a6e00`, hijau tua) sengaja lebih redup agar tidak silau di latar terang — sesuai prinsip "desaturasi aksen di dark→light transition" pada panduan strategi dark mode kamu.

---

## 4. Lapis 3 — Component Tokens

Token yang terikat ke satu komponen spesifik. Di proyek ini jumlahnya sengaja sedikit (sesuai prinsip menghindari *token sprawl*) — sebagian besar komponen cukup memakai token semantik langsung.

| Token Name | Value | Komponen |
|---|---|---|
| `--nav-x` | `calc(var(--ui-inset) + 0.125rem)` | Posisi X navigasi titik-titik (`#scene_strip`) & tombol tema |

Elemen lain yang secara *implisit* menjadi "component token" (nilai hardcoded lokal, kandidat untuk dinaikkan jadi token resmi bila sistem berkembang):

- **Button CTA primer** (`.cta`): border `var(--accent)`, hover → invert (bg accent, teks bg)
- **Button CTA sekunder** (`.cta-back`): border `color-mix(var(--muted) 45%, transparent)`
- **Theme toggle**: bg `color-mix(var(--muted) 35%, transparent)`, hover `55%`
- **Progress bar**: track `var(--muted)`, fill `var(--accent)`

---

## 5. Tipografi — Skala Lengkap

| Elemen | Font | Ukuran | Letter-spacing | Line-height |
|---|---|---|---|---|
| H1 (Hero) | Display | `clamp(3rem, 8vw, 6.5rem)` | `0.03em` | `0.92` |
| H2 (Section) | Display | `clamp(2.2rem, 5vw, 4rem)` | `0.03em` | `0.92` |
| Face placeholder | Display | `clamp(2rem, 8vw, 5rem)` | `0.04em` | – |
| Caption nama scene | Display | `clamp(1.8rem, 5vw, 3.5rem)` | `0.08em` | `1` |
| Stat number | Display | `2.2rem` | – | `1` |
| Body text | Mono | `0.78rem` | – | `1.8` |
| Tag/label | Mono | `0.6rem` | `0.25em` (uppercase) | – |
| CTA button text | Mono | `0.62rem` | `0.18em` (uppercase) | – |
| Stat label | Mono | `0.58rem` | `0.2em` (uppercase) | – |
| HUD text | Mono | `0.65rem` | `0.15em` (uppercase) | – |

**Pola:** font *display* (Bebas Neue) khusus untuk elemen besar/emosional (judul, angka besar); font *mono* (DM Mono) untuk semua teks fungsional/UI. Semua label kecil selalu uppercase + letter-spacing lebar (0.15–0.28em) — jadi identitas visual yang konsisten.

---

## 6. Spacing Scale (terobservasi dari kode)

`0.15rem · 0.4rem · 0.5rem · 0.75rem · 1.1rem · 1.2rem · 1.25rem · 1.75rem · 2rem · 2.25rem · 2.5rem`

Tidak memakai skala geometris ketat (bukan 4px/8px murni) — lebih ke *editorial spacing* yang disesuaikan per konteks. **Rekomendasi untuk portofolio kamu:** rasionalisasi ke skala 4px-based agar lebih maintainable, misal:
`spacing-1: 4px · spacing-2: 8px · spacing-3: 12px · spacing-4: 16px · spacing-5: 20px · spacing-6: 24px · spacing-8: 32px · spacing-10: 40px`

---

## 7. Strategi Dark Mode & Light Mode

### 7.1 Mekanisme Switching

```javascript
// 3-state: System → Dark → Light (toggle manual overrides system)
const mq = window.matchMedia("(prefers-color-scheme: dark)");
document.documentElement.setAttribute("data-theme", theme); // "dark" | "light"
document.documentElement.style.colorScheme = theme;
```

- Default mengikuti `prefers-color-scheme` (System) saat pertama load.
- Klik tombol toggle → override manual, lepas dari system preference.
- `color-scheme` CSS property ikut di-set agar native UI browser (scrollbar, form control) menyesuaikan otomatis.

### 7.2 Kepatuhan Prinsip Dark Mode Premium

| Prinsip | Implementasi di proyek ini |
|---|---|
| **Anti-smearing** | Tidak pakai hitam murni — bg dark `#1c1814` (abu-coklat gelap), bukan `#000000` |
| **Desaturasi brand** | Aksen light mode (`#3a6e00`) jauh lebih redup dibanding aksen dark mode (`#d4a84b`) |
| **Transisi halus** | `transition: background 0.3s ease, color 0.3s ease` di level body & card |
| **Konsistensi ikon** | Icon sun/moon fade + rotate saat switch, bukan potong langsung |
| **Aset visual ikut tema** | Gambar tekstur (`.face`) punya varian `-dark.webp` terpisah per gambar — bukan cuma warna UI yang berubah, tapi juga konten visual |

**Catatan untuk portofolio:** proyek ini **tidak** memakai *layered surfaces* (elevation berlapis) untuk dark mode — hanya satu level card di atas background. Kalau portofolio kamu punya banyak level UI (modal, dropdown, nested card), pertimbangkan menambah token elevasi seperti `--surface-1`, `--surface-2`, dst., sesuai rekomendasi di panduan arsitektur kamu.

---

## 8. Aksesibilitas — Catatan Audit Cepat

Merujuk ke checklist WCAG 2.2 di panduan kamu:

| Kriteria | Status di proyek sumber | Rekomendasi |
|---|---|---|
| Kontras teks 4.5:1 | Body text pakai `color-mix(fg 55%, transparent)` — **perlu dicek manual**, berpotensi di bawah ambang di beberapa kombinasi | Ukur dengan tool kontras sebelum dipakai final |
| Target sentuh 24×24px | Tombol tema `2rem × 2rem` (32px) ✅ | Aman |
| Dot navigasi (`.scene-dot`) | Visual hanya `0.25rem` (4px), tapi ada hit-area invisible `::before { inset: -0.2rem }` | Perbesar hit-area lagi untuk mobile jika dipakai di portofolio |
| Reduced motion | Tidak ada `prefers-reduced-motion` guard pada animasi reveal/scroll | **Tambahkan** — proyek ini scroll-hijack berat, wajib ada fallback |

---

## 9. Token Siap Pakai (CSS Custom Properties)

```css
:root {
  color-scheme: dark;

  /* Primitive */
  --dark-bg: #1c1814;
  --dark-fg: #ede8df;
  --dark-muted: #8a7b6e;
  --light-bg: #f0ece3;
  --light-fg: #0d0d14;
  --light-muted: #9a9aaa;
  --accent-dark: #d4a84b;
  --accent-light: #3a6e00;

  /* Semantic (default: dark) */
  --bg: var(--dark-bg);
  --fg: var(--dark-fg);
  --muted: var(--dark-muted);
  --accent: var(--accent-dark);
  --card-bg: rgba(28, 24, 20, 0.82);
  --card-border: rgba(212, 168, 75, 0.2);

  /* Typography */
  --font-display: "Bebas Neue", sans-serif;
  --font-mono: "DM Mono", monospace;

  /* Primitive spacing/misc */
  --hairline: 0.0625rem;
  --ui-inset: 2rem;
  --reveal-offset: 0.625rem;
  --reveal-duration: 0.5s;
  --z-ui: 10;
}

:root[data-theme="light"] {
  color-scheme: light;
  --bg: var(--light-bg);
  --fg: var(--light-fg);
  --muted: var(--light-muted);
  --accent: var(--accent-light);
  --card-bg: rgba(240, 236, 227, 0.08);
  --card-border: rgba(58, 110, 0, 0.14);
}
```

---

## 10. Rekomendasi Lanjutan untuk Portofolio Kamu

1. **Rasionalisasi spacing** ke skala 4px agar konsisten (lihat §6).
2. **Naikkan warna hardcoded** (`#14100d`, `#ddd8cf` di background face) jadi token resmi — saat ini "bocor" dari sistem token.
3. **Tambahkan `prefers-reduced-motion`** guard sebelum dipakai produksi.
4. **Cek kontras** body-text vs background di kedua mode dengan tool WCAG contrast checker.
5. Kalau portofolio kamu butuh lebih dari 1 elemen mengambang (card di atas card), tambahkan token elevasi bertingkat, karena proyek sumber ini hanya 1 level.

---

*Disusun dari kode sumber CodePen "Six Faces / Walking The Cow" oleh Luis Alberto Martinez Riancho, dipetakan ke kerangka arsitektur token tiga lapis.*
