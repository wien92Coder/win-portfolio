# Go-Live v2 — Checklist Eksekusi

> Status: **belum dieksekusi**. Semua langkah di bawah menunggu persetujuanmu.
> Branch: `redesign-v2` (`c52bfd2`, 12 commit di atas `main`)
> Target: `main` (`ff2f009`, = tag `v1.0`) → deploy otomatis ke VPS.
> Audit kondisi produksi: 23 Oktober 2026, `https://win-portfolio.my.id`.

## Aturan main

1. **Tidak ada perubahan server tanpa persetujuan.** Gate C (nginx) dan Gate B
   (endpoint) dijalankan terpisah, bukan sekaligus dengan merge.
2. **Urutannya mengikat:** preflight → endpoint → nginx → merge/deploy → smoke
   test. Nginx dan endpoint sudah benar sebelum trafik v2 masuk.
3. **Rollback selalu tersedia:** tag `v1.0` utuh, backup nginx ber-tanggal, dan
   `config.local.php` tidak pernah tersentuh deploy.
4. Setiap gate punya bukti verifikasi sendiri. Gate yang gagal **tidak**
   dilanjutkan.

---

## 0. Temuan audit produksi (dasar checklist)

Diukur langsung dari server produksi, bukan asumsi:

| Yang diperiksa | Hasil | Artinya |
|---|---|---|
| `GET /work/bliho` | 200, body identik dengan `/` | **Fallback SPA sudah ada.** Deep link tidak 404 — nginx hanya perlu diverifikasi, bukan dirombak |
| `GET /contact.php` | 405 JSON | PHP-FPM hidup, endpoint kontak aktif |
| `GET /stats/` | 401 | Proteksi GoAccess utuh |
| `GET /config.local.php` | 200, body kosong | Tidak bocor, tapi sebaiknya 404 |
| Gzip aset | HTML gzip, **JS/CSS tidak** | `gzip_types` belum mencakup JS/CSS — 448 KB dikirim mentah |
| Header aset | `max-age=2592000` + `public, immutable` (dua header) | Bisa 1 tahun, satu header saja |
| HTTP | HTTP/1.1 | HTTP/2 opsional |
| `www.win-portfolio.my.id` | 200, tanpa redirect | Duplikat konten untuk mesin pencari |
| Variable CI `VITE_CONTACT_ENDPOINT` | `https://win-portfolio.my.id/contact.php` | Sudah benar, form akan mengirim |
| Deploy terakhir | 19 Sep 2026, sukses | `main` sekarang = v1 yang tayang |

Kesimpulan: **tidak ada blocker infrastruktur.** Yang tersisa adalah
pengerasan (gzip, cache, deny config) dan verifikasi, bukan perbaikan darurat.

---

## Gate A — Preflight lokal (tanpa menyentuh server)

Jalankan dari root repo, branch `redesign-v2`:

- [ ] `git branch --show-current` → `redesign-v2`
- [ ] `git status --short` → kosong
- [ ] `npm ci`
- [ ] `npm run typecheck` → bersih
- [ ] `npm test` → **23 test / 4 file lulus**
- [ ] `npm run build` → sukses, tanpa peringatan chunk >500 kB
- [ ] Baseline ukuran: shell `index-*.js` **±311 kB**, CSS **±37,9 kB**,
      lima chunk halaman terpisah (Home, Work, WorkDetail, Studio, Contact)
- [ ] `dist/` **tidak** memuat `config.local.php` hasil build lokal saat
      di-deploy — deploy produksi hanya lewat CI (lihat catatan di bawah)
- [ ] Tidak ada sisa v1 yang dirujuk: `grep -rn "Home.tsx\|CustomCursor\|ThemeToggle" src` → kosong
- [ ] Copy template tidak tersisa: `grep -rni "FORM&CO\|Helio Energy\|60 projects" src public index.html` → kosong

**Catatan penting soal build lokal.** `.env.local` di mesin ini berisi
`VITE_CONTACT_ENDPOINT=http://127.0.0.1:8000/contact.php` dan build lokal ikut
menyalin `public/config.local.php` ke `dist/`. Karena itu **jangan pernah
rsync `dist/` lokal ke VPS**; deploy hanya lewat GitHub Actions, yang build dari
clone bersih tanpa kedua file itu.

Gate A gagal → stop. Tidak ada gunanya menyentuh server.

---

## Gate B — Endpoint form kontak (server, read-only + satu tes kirim)

Endpoint v2 tetap `contact.php` yang sama; yang berubah hanya halaman yang
memanggilnya. Jadi ini gate **verifikasi**, bukan pemasangan baru.

### B.1 Struktur file di VPS

- [ ] `ssh ubuntu@43.129.37.106`
- [ ] `ls -l /var/www/win-portfolio/contact.php` → ada
- [ ] `ls -l /var/www/win-portfolio/config.local.php` → ada (di-*exclude* dari rsync, jadi selamat dari `--delete`)
- [ ] `ls -l /var/www/vendor/autoload.php` → ada
- [ ] `php -v` → PHP 8.x dengan ekstensi `openssl` (`php -m | grep -i openssl`)

`contact.php` mencari PHPMailer di `__DIR__ . '/../vendor/autoload.php'`, yaitu
`/var/www/vendor/` — **di luar** web root, jadi tidak ikut terhapus rsync dan
tidak bisa diakses publik. Jangan memindahkannya ke dalam web root.

### B.2 Isi config (tanpa mencetak password)

- [ ] `php -r '$c = require "/var/www/win-portfolio/config.local.php"; echo $c["recipientEmail"], "\n", $c["mailTransport"], "\n", ($c["smtpPass"] ? "pass: ada\n" : "pass: KOSONG\n");'`
  → email tujuan benar, `smtp`, `pass: ada`
- [ ] Kalau `mailTransport` masih `mail`, form tetap jalan tapi rawan masuk spam.
      Rekomendasi: `smtp` + Google App Password (2FA aktif di akun Gmail).
- [ ] `allowedOrigin` boleh `'*'` (default) atau `https://win-portfolio.my.id`.
      Kalau diisi domain, **harus** persis sama termasuk skema, atau preflight
      akan 403.

### B.3 Tes endpoint (mengirim email sungguhan)

- [ ] Preflight CORS:
      `curl -s -o /dev/null -w '%{http_code}\n' -X OPTIONS https://win-portfolio.my.id/contact.php -H 'Origin: https://win-portfolio.my.id' -H 'Access-Control-Request-Method: POST'`
      → `204`
- [ ] Validasi negatif:
      `curl -s -o /dev/null -w '%{http_code}\n' -X POST https://win-portfolio.my.id/contact.php -H 'Content-Type: application/json' -d '{"name":"x","email":"bukan-email","message":"pendek"}'`
      → `422`
- [ ] Kirim nyata:

  ```bash
  curl -sS -X POST https://win-portfolio.my.id/contact.php \
    -H 'Content-Type: application/json' \
    -H 'Origin: https://win-portfolio.my.id' \
    -d '{"name":"Go-live v2","email":"<email-kamu>","phone":"+62 812 0000 0000","message":"Tes endpoint sebelum go-live v2. Abaikan.","website":"","sentAt":"2026-10-23T00:00:00Z"}'
  ```

  → `{"ok":true}`
- [ ] Email masuk ke inbox (cek juga folder Spam/Promotions) dalam ±1 menit
- [ ] Honeypot: ulangi dengan `"website":"bot"` → tetap `{"ok":true}` tapi
      **tidak ada** email masuk
- [ ] Kalau `{"ok":false,"error":"Could not send"}`: lihat log PHP-FPM
      (`sudo journalctl -u php8.3-fpm -n 50 --no-pager` atau
      `/var/log/php*-fpm.log`), cari baris `contact.php SMTP error`.

**Risiko yang diterima (bukan blocker):** `contact.php` belum punya rate limit.
Kalau spam mulai masuk, tambahkan `limit_req` di nginx untuk `/contact.php`
(tahap terpisah, tidak perlu sebelum go-live).

---

## Gate C — Nginx (butuh persetujuan eksplisit)

Nginx **tidak perlu dirombak**: fallback SPA sudah terbukti jalan. Empat blok
di bawah (plus `gzip_types`) bersifat pengerasan dan semuanya kompatibel mundur
dengan v1, jadi rollback aplikasi tidak menuntut rollback nginx.

### C.1 Backup & inspeksi

- [ ] `sudo cp /etc/nginx/sites-available/win-portfolio /etc/nginx/sites-available/win-portfolio.bak-2026-10-23`
- [ ] `sudo nginx -T | sed -n '/server_name win-portfolio.my.id/,/^}/p'`
      — simpan output ini; semua blok Certbot, `location /stats/`, dan
      `location ~ \.php$` **dipertahankan apa adanya**

### C.2 Patch yang diusulkan

Tambahkan/ sesuaikan **hanya** blok berikut di dalam `server { ... }` untuk
`win-portfolio.my.id`.

```nginx
# 1. Aset ber-hash: cache 1 tahun, dan file hilang harus 404 — bukan HTML.
#    Ganti blok aset yang sekarang (expires 30d + dua header Cache-Control).
location /assets/ {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# 2. index.html tidak boleh di-cache: setiap deploy harus langsung terlihat.
location = /index.html {
    add_header Cache-Control "no-cache";
}

# 3. Config lokal tidak untuk publik. Blok ini HARUS di atas blok PHP,
#    karena nginx memakai regex pertama yang cocok (config.local.php cocok
#    dengan keduanya).
location ~ ^/(config\.local\.php|vendor/) {
    return 404;
}

# 4. Fallback SPA — kemungkinan sudah ada. Jangan diduplikasi.
location / {
    try_files $uri $uri/ /index.html;
}
```

Kompresi (kalau belum ada di `http { }` atau `server { }`):

```nginx
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_types text/css application/javascript application/json
           application/xml image/svg+xml text/plain;
```

Catatan penerapan:

- `location /assets/` mengalahkan `location /` (prefix lebih panjang), jadi
  aman diletakkan berurutan.
- `add_header` di level `location` **membatalkan** `add_header` warisan dari
  `server` untuk location itu. Kalau di `server` ada header keamanan (HSTS,
  `X-Content-Type-Options`, `Referrer-Policy`), ulangi header tersebut di setiap
  blok yang memakai `add_header` — atau pakai `expires -1` untuk `index.html`
  dan `expires 1y` untuk aset, yang tidak memutus pewarisan.
- `gzip_types` yang sekarang hanya mencakup HTML — itulah sebabnya JS/CSS
  terkirim tanpa kompresi. Ini satu-satunya perubahan dengan dampak performa
  nyata: chunk utama v2 311 kB akan turun ke ±99 kB, CSS 37,9 kB ke ±9 kB.
- Jangan sentuh `location /stats/` (alias + `auth_basic`) dan blok
  `fastcgi_pass` untuk PHP.

### C.3 Terapkan & uji

- [ ] `sudo nginx -t` → `syntax is ok` **dan** `test is successful`
- [ ] `sudo systemctl reload nginx` (reload, bukan restart — tanpa downtime)
- [ ] Verifikasi (semua dari mesin lokal):

  ```bash
  for u in / /work /work/bliho /karya /karya/large-private-hospital /studio /contact; do
    printf "%-14s " "$u"
    curl -s -o /dev/null -w "%{http_code} %{content_type}\n" "https://win-portfolio.my.id$u"
  done
  # harapan: 200 text/html untuk kelimanya

  curl -s -o /dev/null -w "assets hilang: %{http_code}\n" https://win-portfolio.my.id/assets/tidak-ada.js
  # harapan: 404 (bukan 200 HTML)

  curl -s -o /dev/null -w "contact.php GET: %{http_code}\n" https://win-portfolio.my.id/contact.php
  # harapan: 405

  curl -s -o /dev/null -w "config: %{http_code}\n" https://win-portfolio.my.id/config.local.php
  # harapan: 404

  curl -s -o /dev/null -w "stats: %{http_code}\n" https://win-portfolio.my.id/stats/
  # harapan: 401

  asset=$(curl -s https://win-portfolio.my.id/ | grep -o '/assets/[^"]*\.js' | head -1)
  curl -sI -H 'Accept-Encoding: gzip' "https://win-portfolio.my.id$asset" | grep -i content-encoding
  # harapan: gzip
  ```

- [ ] Form masih 405/204/422 seperti Gate B setelah nginx diubah
- [ ] Kalau ada yang gagal: `sudo cp ...bak-2026-10-23 ... && sudo nginx -t && sudo systemctl reload nginx`

### C.4 Opsional (keputusanmu, bukan blocker)

- [ ] **HTTP/2**: `listen 443 ssl http2;` (nginx 1.24 mendukung sintaks ini).
      Untung kecil untuk aset kecil, tapi gratis.
- [ ] **Redirect `www` → apex**, supaya tidak ada dua URL untuk konten yang sama.
      Perlu blok `server` terpisah + sertifikat Certbot yang mencakup `www`.
- [ ] **HSTS** (`Strict-Transport-Security`) setelah yakin HTTPS stabil.

---

## Gate D — Merge & deploy (butuh persetujuan)

Deploy **otomatis** setiap push ke `main` (`.github/workflows/deploy.yml`),
jadi langkah ini sekaligus go-live. Tidak ada tombol deploy terpisah.

- [ ] `git checkout main && git pull --ff-only`
- [ ] Pastikan `main` masih `ff2f009` dan = `v1.0` (titik rollback)
- [ ] Merge dengan commit eksplisit supaya rollback satu perintah:

  ```bash
  git merge --no-ff redesign-v2 -m "release: v2 editorial multi-page"
  git push origin main
  ```

- [ ] `gh run watch` → job **Build** dan **Deploy via rsync** hijau
- [ ] `gh run list --limit 1` → status `completed success`

### D.1 Risiko deploy yang perlu diketahui

- `rsync --delete` menghapus aset v1 dari web root segera setelah transfer;
  pengunjung yang masih memegang `index.html` lama bisa gagal memuat chunk lama
  selama beberapa detik.
- Perbaikan kecil yang disarankan (satu baris di `deploy.yml`, perlu persetujuan
  terpisah): ganti `--delete` → `--delete-after`, agar file baru mendarat dulu
  sebelum file lama dihapus.
- `config.local.php` tetap aman karena di-*exclude*. `vendor/` aman karena di
  luar web root.

---

## Gate E — Smoke test produksi (setelah deploy)

Buka `https://win-portfolio.my.id` di jendela **incognito** (hindari cache v1),
lalu:

- [ ] Beranda tampil v2 (pemilih jalur 001/002, wordmark besar, bukan hero LAMA)
- [ ] Pemilih `002 Hospitality & Healthcare` mengganti visual, ticker, karya, layanan, dan tujuan CTA
- [ ] `/work` — empat project, filter/kategori berfungsi
- [ ] `/work/bliho` dibuka **langsung dari address bar** (bukan klik) → tidak 404
- [ ] `/karya` — tiga studi kasus anonim, metrik ketiganya terlihat di desktop
- [ ] `/karya/large-private-hospital` dibuka **langsung dari address bar** → tidak 404
- [ ] Tombol ID/EN mengganti seluruh studi kasus tanpa layout rusak
- [ ] `/work/rekam-jejak-hanania`, `/work/akar-jogja`,
      `/work/revenue-management-system` → semua tampil
- [ ] `/studio` dan `/contact` tampil
- [ ] URL ngawur (`/tidak-ada`) → diarahkan ke beranda (perilaku desain; bukan 404)
- [ ] Bahasa: toggle ID↔EN, lalu reload → pilihan bertahan; `?lang=en` bekerja
- [ ] Form kontak:
  - [ ] validasi kosong/email salah/pesan <10 karakter muncul **dalam bahasa aktif**
  - [ ] kirim sungguhan → status sukses, email masuk
  - [ ] tombol tidak menggantung saat koneksi lambat
- [ ] Kursor kustom muncul di desktop; di perangkat sentuh kursor normal
- [ ] `prefers-reduced-motion` aktif → tidak ada animasi yang memaksa
- [ ] 360px: tidak ada scroll horizontal, menu fullscreen bisa dibuka/tutup
- [ ] Console browser: tanpa error; Network: tanpa 404 (kecuali favicon bila memang tidak ada)
- [ ] Hard refresh (`Ctrl+F5`) setelah deploy berikutnya memuat hash aset baru
      (bukti `index.html` tidak ikut ter-cache)
- [ ] `/stats/` masih meminta password dan angkanya bertambah
- [ ] Cek 404 di log: `sudo grep ' 404 ' /var/log/nginx/access.log | tail -20`

Kalau ada yang merah: **rollback dulu, diagnosis kemudian.**

---

## Gate F — Rollback

### Skenario 1: v2 bermasalah setelah tayang

```bash
git checkout main
git revert -m 1 <sha-merge-v2>
git push origin main        # CI membangun ulang v1 dan menimpa web root
```

Nginx tidak perlu diubah (semua patch kompatibel dengan v1). Setelah hijau,
verifikasi `/` menampilkan v1 dan form masih mengirim.

### Skenario 2: nginx yang bermasalah

```bash
sudo cp /etc/nginx/sites-available/win-portfolio.bak-2026-10-23 \
        /etc/nginx/sites-available/win-portfolio
sudo nginx -t && sudo systemctl reload nginx
```

### Skenario 3: hanya form yang rusak

`contact.php` dan `config.local.php` tidak berubah antara v1 dan v2, jadi
masalahnya hampir selalu konfigurasi server, bukan kode. Cek config + log
PHP-FPM (Gate B.3) sebelum menyentuh aplikasi.

---

## Gate G — Tutup buku (setelah 24 jam stabil)

- [ ] `git tag -a v2.0 -m "v2: editorial multi-page" && git push origin v2.0`
- [ ] Perbarui `CONTEXT.md`: struktur situs masih menyebut section v1
      (Proof Strip, Dual Competency Grid); ganti dengan lima route v2
- [ ] Tambahkan tautan checklist ini dari `docs/deploy.md`
- [ ] Putuskan tiga frame kubus yang belum dipakai di lookbook
      (AZWA, Gilded Sage, Aethel Villa) — pakai atau hapus dari `public/cube/`
- [ ] Catat di `docs/deploy.md` bahwa fallback SPA sudah diverifikasi
      (agar tidak ada yang "memperbaiki" hal yang sudah benar)

---

## Ringkasan urutan eksekusi

| # | Gate | Lokasi | Butuh persetujuan | Perkiraan |
|---|---|---|---|---|
| 1 | A — Preflight | lokal | tidak | 5 menit |
| 2 | B — Endpoint form | VPS (read-only + 1 email) | ya (SSH) | 10 menit |
| 3 | C — Nginx | VPS | **ya, eksplisit** | 15 menit |
| 4 | D — Merge & deploy | lokal + GitHub | ya (push ke `main`) | 5 menit |
| 5 | E — Smoke test | browser | tidak | 15 menit |
| 6 | F/G — Rollback siap, tutup buku | — | ya (tag) | — |

**Titik keputusan sebelum mulai:**

1. Setuju patch nginx C.2 (gzip + cache aset + deny config + fallback
   diverifikasi)?
2. Setuju `--no-ff` merge ke `main`, atau mau lewat PR lebih dulu?
3. Boleh mengirim satu email tes sungguhan ke inbox-mu (Gate B.3)?
4. HTTP/2 dan redirect `www` ikut sekarang, atau ditunda?
