# Portfolio Website — Kerangka & Ide Konten
### Win Winarno — "Hospitality & Healthcare Tech-Operator"
*Dokumen ini siap diberikan ke Claude Code sebagai brief pembangunan.*

---

## 0. Positioning Statement

> Win bukan developer biasa, dan bukan manajer hospitality biasa. Win adalah **operator lapangan senior (30+ tahun) yang memakai kode sebagai alat operasional** — bukan sebaliknya. Portofolio ini harus membuktikan itu lewat *bukti nyata* (studi kasus dengan angka riil dari CV), bukan klaim kosong.

**Fakta biografis yang dipakai (sumber: CV Win_Winarno_Operasional_Manager.docx — jadikan ini rujukan utama, bukan draf-draf brainstorming sebelumnya yang kadang melebih-lebihkan):**

| Fakta | Detail |
|---|---|
| Karier dimulai | 1993, Bellboy & Telephone Operator, Puri Garden Hotel Semarang |
| Total pengalaman hospitality | 33 tahun (1993–2026), "30+ tahun" |
| Jabatan puncak operasional | General Manager, Patuno Resort Wakatobi (Mar 2013–Mei 2014) |
| Pre-opening | Pre-Opening GM, Rumah Kito Resort, Jambi (Jun 2014–Mar 2015) — 80+ staf |
| Konsultan HR rumah sakit | 2015–2024, 6 klien RS (SMC Tlogorejo, RSUD Rembang, Indriati Solo, Santa Elisabeth, Samsoe Hidajat, Brayat Minulya) |
| Head of Operation platform LMS | AJAR Media Digital, Jan 2018–Mar 2022 — kemitraan lintas negara (TAFE Queensland, Dusit Thani, École Hôtelière de Lausanne) |
| Peran sekarang | Operational Manager, Hanania Kitchen and Brew, Semarang (April 2026–sekarang); sebelumnya HR & Operations Consultant di tempat sama (Des 2023–Nov 2025) |
| Sertifikasi | TAE40116 Trainer & Assessor, TAFE Queensland, Australia (2017); Certified Virtual Assistant, SGB-VA Singapore (2025) |
| Kontak | Semarang, Jawa Tengah · linkedin.com/in/win-va |

**Angka pencapaian utama yang dipakai di Hero Proof Strip (lihat §3.1) — spesifik per sumber, tidak lagi digeneralisir:**
- CSI SMC Tlogorejo: **70% → 92%**
- Google Review RS Santa Elisabeth: **4.1 → 4.8 ⭐**
- Staff service-charge earnings, Patuno Resort: **12x lipat** (Rp 75.000 → Rp 900.000/bulan)
- Pengalaman lapangan: **33 tahun** (1993–sekarang)

*Catatan: angka gabungan lama (25%→98% engagement across 6 RS) tidak lagi dipakai di Hero — terlalu generik dan tidak bisa ditelusuri ke satu sumber. Dipertahankan hanya sebagai konteks internal, bukan headline copy.*

---

## 1. Penerapan Design System ke Portofolio

Design system dari CodePen ("Six Faces") dipakai sebagai **kerangka visual**, bukan disalin literal (proyek sumbernya galeri seni, bukan portofolio profesional). Adaptasi:

| Token Sumber | Penerapan di Portofolio |
|---|---|
| `--font-display` (Bebas Neue) | Headline besar (H1 hero, angka statistik case study) — beri kesan tegas & confident |
| `--font-mono` (DM Mono) | Body text, label, navigasi, UI kalkulator — kesan "operator/teknis", cocok dengan identitas *Tech-Operator* |
| `--accent-dark` (emas `#d4a84b`) / `--accent-light` (hijau `#3a6e00`) | **Ganti ke Emerald/Teal** sesuai brief asli (`claude-code-portfolio-spec.md`) — accent teknologi modern, bukan editorial-artistik. Rekomendasi: `--accent-dark: #10b981` (emerald-500), `--accent-light: #047857` (emerald-700, didesaturasi untuk light mode) |
| `--bg` / `--fg` / `--muted` dark & light pair | Dipakai apa adanya — palet dark netral hangat + light krem tetap relevan untuk kesan "premium executive" |
| Hairline border + huruf kapital berjarak lebar | Dipakai untuk label section, badge sertifikasi, nav — cocok dengan kesan "dokumentasi operasional yang presisi" |
| 3-state theme toggle (System/Dark/Light) | Dipertahankan persis — implementasi `data-theme` + `prefers-color-scheme` dari CSS sumber bisa dipakai langsung |
| Reveal-on-scroll (IntersectionObserver) | Dipertahankan untuk transisi antar section, versi lebih ringan (bukan scroll-hijack 3D cube) |

**Rekomendasi tambahan dari audit design system sebelumnya** yang perlu diterapkan di sini:
- Rasionalisasi spacing ke skala 4px (§6 dokumen design-system.md)
- Tambahkan `prefers-reduced-motion` guard pada semua animasi reveal
- Cek kontras teks di kedua mode dengan tool WCAG sebelum final

---

## 2. Sitemap / Struktur Halaman

Single Page Application, 6 section, smooth-scroll nav:

```
1. Hero               — "The Hook"
2. Interactive Playground — Food Cost Calculator (live demo)
3. Case Studies        — 3 studi kasus (tab/card)
4. Dual Competency Grid — Operational vs Tech
5. About / Meet Win     — narasi perjalanan karier
6. Contact              — form + social links
```

---

## 3. Konten Per Section

### 3.1 Hero Section

**Headline (H1, font display):**
> I Don't Just Write Code. I Build Systems That Optimize Operations.

**Sub-headline:**
> Memadukan 30+ tahun kepemimpinan operasional hospitality & healthcare dengan kekuatan Vibe Coding (Claude Code, n8n, Notion, & AI) untuk menciptakan otomatisasi, sistem operasi digital, dan solusi kustom yang menggerakkan profitabilitas bisnis Anda.

**Bridge line (satu kalimat, tampil kecil di bawah sub-headline — ini yang menyatukan dua pilar Operational vs Tech tanpa membuatnya terasa seperti dua orang berbeda):**
> Saya pakai kode sebagai alat operasional — bukan tujuan itu sendiri.

**Proof Strip (stat row, gaya `.stat-num` dari design system — angka besar font-display + label kecil font-mono. Pakai angka spesifik, bukan lagi klaim gabungan generik):**

| Angka | Konteks |
|---|---|
| **70% → 92%** | CSI, SMC Tlogorejo |
| **4.1 → 4.8 ⭐** | Google Review, RS Santa Elisabeth |
| **12x** | Kenaikan pendapatan staf, Patuno Resort Wakatobi |
| **33 tahun** | Pengalaman lapangan (1993–sekarang) |

**Achievement badges (baris horizontal, gaya `.tag` dari design system — uppercase, letter-spacing lebar):**
- 30+ Years Industry Experience
- Certified Trainer & Assessor — TAFE Queensland, Australia
- Certified Virtual Assistant — Singapore

**CTA:**
- Primer: "Coba Demo Kalkulator Saya" → smooth scroll ke §3.2
- Sekunder: "Konsultasi Bersama Win" → WhatsApp/LinkedIn

---

### 3.2 Interactive Playground — Food Cost & Margin Calculator

Widget fungsional penuh, bukan mockup. Ini adalah *proof of work* utama situs.

**Input:**
| Field | Tipe | Default |
|---|---|---|
| Nama Menu | Text | "Kopi Susu Gula Aren" |
| Target Food Cost % | Slider/Input, 10–50% | 30% |
| Target Harga Jual | Number (Rp) | 25.000 |
| Tabel Bahan Baku (dinamis, add/remove row) | — | — |
| &nbsp;&nbsp;↳ Nama Bahan | Text | "Susu UHT" |
| &nbsp;&nbsp;↳ Harga Beli | Number (Rp) | — |
| &nbsp;&nbsp;↳ Volume Kemasan | Number (ml/gr) | — |
| &nbsp;&nbsp;↳ Jumlah Digunakan | Number (ml/gr) | — |
| &nbsp;&nbsp;↳ Yield % | Number | 100 |

**Formula (implementasikan persis):**
```
Cost Per Unit        = Harga Beli / Volume Kemasan
Effective Cost        = (Cost Per Unit × Jumlah Digunakan) / (Yield / 100)
Total Food Cost (HPP) = Σ Effective Cost
Actual Food Cost %    = (Total Food Cost / Target Harga Jual) × 100%
Gross Profit          = Target Harga Jual − Total Food Cost
Gross Profit Margin % = (Gross Profit / Target Harga Jual) × 100%
Rekomendasi Harga Jual = Total Food Cost / (Target Food Cost % / 100)
```

**Output (KPI Cards):**
- Total HPP (Rp)
- Actual Food Cost Ratio % + status badge:
  - 🟢 HEALTHY MARGIN — Actual ≤ Target
  - 🟡 WARNING — Target < Actual ≤ Target+5%
  - 🔴 CRITICAL MARGIN — Actual > Target+5%
- Rekomendasi Harga Jual Ideal (Rp)

*Konteks kredibilitas untuk copy pendukung di sekitar widget:* kalkulator ini terinspirasi langsung dari pekerjaan P&L dan cost-ratio analysis Win di Hanania Kitchen and Brew — bukan template generik.

---

### 3.3 Case Studies

Direstrukturisasi jadi **dua pilar**, selaras dengan Dual Competency Grid (§3.4) — bukan daftar datar. Tiap studi kasus pakai format: **Kondisi Awal → Solusi → Hasil**. Angka gabungan (25%→98% engagement, 65%→90% CSI, 4.1→4.8⭐) yang dipakai di draf sebelumnya sekarang **dipecah per rumah sakit** di bawah ini — jauh lebih kredibel karena tiap RS punya tantangan dan hasil yang benar-benar berbeda, bukan angka generik yang diulang tiga kali.

#### Pilar A — Healthcare Service Culture Transformation
*(3 mini case study, ditampilkan sebagai sub-tab atau accordion dalam satu grup)*

---

**A1. RS SMC Tlogorejo, Semarang**
*RS ambisius yang ingin naik kelas ke standar hotel — transformasi budaya besar-besaran berujung lonjakan CSI dua digit.*

| | |
|---|---|
| **Klien** | RS swasta berbasis yayasan keagamaan, 1.800–2.000 staf |
| **Periode** | Maret 2015 – Mei 2016 (1,5 tahun) |

- **Kondisi Awal:** RS sedang ekspansi gedung baru dan ingin menghadirkan standar layanan setara hotel internasional. Seluruh lini staf dan dokter — meski RS sudah lama berdiri — membutuhkan *refreshment training* menyeluruh di bidang Service Excellence.
- **Solusi:** Merancang dan memimpin pelatihan Train-The-Trainer, Leadership, dan Effective Communication untuk seluruh jajaran Direktur hingga Penanggung Jawab (PJ). Mendampingi para *leader* ini secara langsung untuk mengalirkan pelatihan **SMART Care** ke seluruh karyawan secara bertahap (*cascading*).
- **Hasil:** **CSI naik dari 70% → 92%.** Engagement terhadap pasien, keluarga, dan pengunjung meningkat; teamwork lintas departemen dan ruang membaik. Modul yang diterapkan: *People* & *Process*.

---

**A2. RSUD Rembang**
*RS pemerintah dengan mindset birokratis — pembuktian bahwa perubahan sistemik lebih bernilai daripada angka instan.*

| | |
|---|---|
| **Klien** | RS Pemerintah, 1.000–1.300 karyawan |
| **Periode** | Mei 2016 – Desember 2017 (1,5 tahun) |

- **Kondisi Awal:** Tantangan klasik institusi pemerintah — mindset "bekerja sampai pensiun", motivasi kerja rendah, sistem reward-punishment yang tidak berjalan, dan peran kepemimpinan lini yang sangat lemah.
- **Solusi:** Menerapkan kerangka SMART Care yang sama seperti di Tlogorejo, ditambah *coaching* intensif satu-per-satu untuk seluruh *leader* agar mampu menggerakkan kesadaran perbaikan diri staf mereka sendiri — bukan sekadar instruksi top-down. Turut merombak sistem reservasi pasien yang sebelumnya hanya bisa datang langsung, dipecah menjadi kanal telepon (CS) dan WhatsApp.
- **Hasil:** Perbaikan CSI di sini berjalan lebih bertahap dibanding dua RS lainnya — bukti nyata bahwa mengubah birokrasi butuh waktu lebih panjang dari mengubah institusi swasta. Namun perubahan struktural yang ditanamkan justru lebih tahan lama: **RSUD Rembang kini dikenal sebagai salah satu RSUD dengan pelayanan terbaik di Indonesia**, dengan akses reservasi yang jauh lebih modern. Modul yang diterapkan: *People*, *Process*, sebagian *Product*.

---

**A3. RS Santa Elisabeth**
*RS berusia hampir satu abad dengan disiplin tinggi warisan Belanda — hasil tercepat dan paling memuaskan dari ketiganya.*

| | |
|---|---|
| **Klien** | RS swasta berbasis yayasan keagamaan, berdiri sejak era Hindia Belanda (~100 tahun) |
| **Periode** | November 2023 – November 2024 (1 tahun) |

- **Kondisi Awal:** Standar kerja yang diwariskan turun-temurun sejak era suster-suster Belanda — sangat disiplin, tapi kaku dalam pendekatan layanan. Rating Google Review hanya **4,1 bintang** (November 2023), mengindikasikan banyak keluhan sisi pelayanan meski disiplin operasional tinggi.
- **Solusi:** Kerangka SMART Care yang sama, dijalankan dengan intensitas coaching individual tertinggi — bekerja langsung dan rutin bersama para Direktur dan Suster Kepala.
- **Hasil:** **Google Review naik dari 4,1 → 4,8 bintang** dalam satu tahun. Engagement antara atasan dan bawahan meningkat tajam, teamwork ikut terbentuk kuat. Modul yang diterapkan hanya *People* — namun eksekusinya paling konsisten di antara ketiga RS, menghasilkan dampak paling memuaskan secara keseluruhan.

---

#### Pilar B — Hospitality & Business Operations

**B1. Digitalisasi Operasional Hanania Kitchen and Brew**
- **Klien:** Hanania Kitchen and Brew, Semarang (peran saat ini)
- **Kondisi Awal:** Koordinasi multi-outlet yang kompleks, kebocoran margin dari food waste, fluktuasi biaya utilitas (LPG) yang sulit dipantau.
- **Solusi:** Alih-alih memaksakan software generik, Win merancang tiga tools andalan pelindung margin: **Staggered Shift Payroll Optimizer** (memetakan setiap pola shift di seluruh outlet untuk menghapus pemborosan gaji akibat over- dan under-staffing), **Menu Engineering Worksheet** (menilai setiap menu berdasarkan kontribusi margin riil — mana yang menghasilkan laba dan mana yang diam-diam menggerusnya), dan **Food Cost & Margin Calculator** (menetapkan harga jual ideal menu apa pun dalam hitungan detik — mesin yang sama dengan demo live di halaman ini).
- **Hasil:** Kontrol margin terlindungi, transparansi audit gudang meningkat, waktu administratif manajemen terpangkas signifikan.

**B2. Redesain Insentif Resor (The 12x Earnings Formula)**
- **Klien:** Patuno Resort Wakatobi (GM, Mar 2013–Mei 2014)
- **Kondisi Awal:** Turnover staf tinggi akibat pembagian service charge & insentif yang tidak transparan.
- **Solusi:** Skema insentif performa berbasis lembar kerja otomatis, transparan bagi seluruh lapisan staf.
- **Hasil:** Pendapatan service charge staf naik **12x lipat (Rp 75.000 → Rp 900.000/bulan)**, turnover menurun, tanpa menggerus margin laba resor.

---

### 3.4 Dual Competency Grid

Side-by-side, gaya grid design-system (2 kolom sejajar):

| Operational & People Leadership | Vibe Coding & Tech Stack |
|---|---|
| Cafe, Restaurant & Resort Operations | AI Development — Vibe Coding via Claude Code & OpenClaw |
| SOP & Operational Policy Development | Otomatisasi Alur Kerja — n8n, Google Workspace |
| Financial P&L & Cost Ratio Control | Custom Notion Database & Sistem Operasi Digital |
| Purchasing & Inventory Audits | AI-assisted reporting & prompt engineering |
| Recruitment, Onboarding, Performance Management | Certified Virtual Assistant — Lead Gen & Social Media (Singapore) |
| Certified Master Trainer & Assessor (TAFE Queensland) | LMS/Platform Operations (AJAR Media, 2018–2022) |

---

### 3.5 About — "Meet Win Winarno"

Narasi linear, bisa divisualisasikan sebagai timeline vertikal (cocok dengan estetika hairline dari design system):

```
1993  Bellboy & Telephone Operator — Puri Garden Hotel Semarang
1996  Assistant Front Office Manager — Ibis Rajawali Surabaya
2000  Duty Manager — Novotel Bogor
2002  Night Manager — Ciputra Hotel Semarang
2006  Food Court Manager — Ciputra Mall Semarang
2007  Front Office Manager — Legian Beach Bali / Sentosa Private Villa & Spa / Harris Tuban Bali
2010  Butler — Raffles Makkah Palace, Saudi Arabia
2012  Duty Manager — JW Marriott Surabaya
2013  General Manager — Patuno Resort Wakatobi (12x incentive redesign)
2014  Pre-Opening GM — Rumah Kito Resort, Jambi
2015  Independent HR & Operations Consultant — 6 klien rumah sakit di Jawa Tengah
2018  Head of Operation — AJAR Media Digital (LMS hospitality, kemitraan lintas negara)
2023  HR & Operations Consultant — Hanania Kitchen and Brew
2026  Operational Manager — Hanania Kitchen and Brew (sekarang)
      + Menguasai Vibe Coding: membangun sistem & web app sendiri
```

**Paragraf penutup (nada personal):**
> Dari Bellboy tahun 1993 hingga menjadi Operational Manager yang membangun sistem digitalnya sendiri — perjalanan ini bukan soal ganti profesi, tapi soal terus mencari alat yang paling efektif untuk menyelesaikan masalah operasional nyata. Hari ini, alat itu adalah kode.

---

### 3.6 Contact

- Form pesan (nama, email, negara + nomor handphone dengan pemilih bendera, pesan) — dikirim langsung ke Gmail via endpoint PHP open-source (PHPMailer/SMTP), tanpa layanan berbayar

---

## 4. Ide Konten Tambahan (Opsional — untuk Fase 2)

Dari dokumen-dokumen brainstorming pendukung, ada beberapa ide *product thinking* yang bisa memperkuat posisi Win sebagai bukan cuma "developer yang bisa coding" tapi juga "operator yang bisa merancang produk digital". Bisa dijadikan section terpisah **"Product Concepts"** atau ditunda ke v2 situs:

- **Hotel Rate Shopper SaaS** — konsep tool pemantau harga kompetitor OTA (Traveloka/Tiket.com/Booking.com) untuk hotel independen, lahir dari pengalaman Win sebagai GM
- **AI-Driven Google Review Management SaaS** — konsep tool pembalas ulasan otomatis dengan mode "Hospitality" vs "Healthcare" (empati & privasi medis), lahir dari pencapaian CSI 65%→90%

**Rekomendasi:** jangan masukkan ini ke v1 portofolio (berisiko situs jadi terlalu ramai/belum ada bukti eksekusi nyata). Simpan sebagai draf halaman "Lab" / "Ideas" terpisah kalau nanti salah satu konsep ini benar-benar mulai dibangun.

---

## 5. Keputusan Tech Stack (Final)

**Stack final: React (Vite) + TypeScript + Tailwind CSS + react-router** (v8, ditambahkan saat halaman imersif Web Project `/web-project` dibangun sebagai route terpisah — lihat §3.6/Case Studies). TanStack Query tidak dipasang (tidak ada data server-side yang perlu di-cache); TanStack Router tidak digunakan karena kebutuhan routing saat ini hanya dua route sederhana.

## 6. Instruksi Ringkas untuk Claude Code

```text
Build a complete, responsive single-page portfolio website in React (Vite) + TypeScript
+ Tailwind CSS for Win Winarno, a "Hospitality & Healthcare Tech-Operator".

Design system: dark/light mode via data-theme attribute + prefers-color-scheme, 
3-state toggle (System/Dark/Light). Font-display for headlines/stat numbers, 
font-mono for body/UI. Accent color: emerald/teal (desaturated in light mode). 
Hairline borders (1px), uppercase wide-letter-spacing labels, generous whitespace,
reveal-on-scroll animations with prefers-reduced-motion guard.

Sections (in order): Hero, Interactive Food Cost Calculator (fully functional, 
formulas as specified), Case Studies (Pillar A: 3 hospital case studies, tabbed,
Kondisi Awal→Solusi→Hasil; Pillar B: Hanania & Patuno Resort),
Dual Competency Grid, About/Timeline, Contact form.

Use all copy and data exactly as provided in the content brief. Do not invent 
additional statistics. Mobile-first, production-ready code.
```

---

*Disusun dari: CV resmi Win Winarno, brief `claude-code-portfolio-spec.md`, `The Vibe Coding Portfolio Framework`, `Win Winarno Strategic Portfolio and Food Cost Calculator Design`, `Revitalizing Healthcare Culture case study`, dan design system CodePen yang sudah diaudit sebelumnya. Draf-draf ide SaaS lain (Rate Shopper, Google Review AI) disimpan sebagai catatan Fase 2, tidak dimasukkan ke struktur v1.*
