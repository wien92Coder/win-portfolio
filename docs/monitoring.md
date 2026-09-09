# Monitoring Pengunjung — Panduan Lengkap

> GoAccess membaca log nginx (`/var/log/nginx/access.log`) dan menyajikannya
> sebagai dashboard HTML (browser) atau dashboard interaktif (terminal).
> Terpasang di VPS, data tidak bocor ke pihak ketiga.

## Cara melihat statistik

### 1. Dashboard di browser (password)

Buka **https://win-portfolio.my.id/stats/**

- User: `statsadmin`
- Password: yang dibuat saat `htpasswd` (jika lupa, lihat "Reset password" di bawah)
- Laporan ter-update otomatis **setiap 30 menit** (cron), berisi negara,
  browser, referrer, halaman terpopuler, dst.

### 2. Dashboard real-time di terminal

Login ke VPS lalu ketik:

```bash
ssh ubuntu@43.129.37.106
stats
```

Alias `stats` sudah terpasang di `~/.bashrc` dan setara dengan:

```bash
goaccess /var/log/nginx/access.log --log-format=COMBINED --ignore-crawlers
```

Navigasi: `1`–`9` pindah panel · panah + Enter perbesar · Tab panel
berikutnya · `q` keluar · `F1` bantuan. Dashboard mengikuti pengunjung secara
live — buka situs di tab lain dan angkanya langsung berubah.

### 3. Update laporan HTML manual

```bash
goaccess /var/log/nginx/access.log -o /var/www/stats/index.html --log-format=COMBINED -q --ignore-crawlers
```

## Bagaimana ini bekerja

| Bagian | Lokasi / perintah |
|---|---|
| Log nginx | `/var/log/nginx/access.log` (format COMBINED, terbaca tanpa sudo karena user `ubuntu` di grup `adm`) |
| Laporan HTML | `/var/www/stats/index.html` |
| Route web | `location /stats/` di `/etc/nginx/sites-available/win-portfolio` (backup: `.bak`), alias ke `/var/www/stats/` |
| Proteksi password | `auth_basic` di route tsb; file user: `/etc/nginx/.htpasswd-stats` |
| Update otomatis | `/etc/cron.d/goaccess-stats` — tiap menit ke-0 dan ke-30 |
| Filter bot | Flag `--ignore-crawlers` (bot/crawler tidak dihitung sebagai pengunjung) |

## Reset password halaman stats

```bash
sudo htpasswd /etc/nginx/.htpasswd-stats statsadmin
```

(Ketik password baru 2x — langsung berlaku, tanpa reload nginx.)

## Catatan

- Angka adalah **estimasi pengunjung manusia** — bot Google dkk. sudah difilter.
- Laporan membaca log yang **saat ini ada**; jika log di-rotate, data lama tidak
  ikut terhitung (belum ada mode persistensi).
- Halaman `/stats/` dilindungi password; jangan hilangkan blok `auth_basic`.

## Troubleshooting

| Gejala | Penyebab / Solusi |
|---|---|
| `/stats/` menolak akses (401) | Itu normal — masukkan user `statsadmin` + password. |
| Lupa password | Reset dengan perintah htpasswd di atas. |
| Laporan lama/tidak berubah | Tunggu cron berikutnya, atau generate manual (perintah #3). |
| Angka tampak aneh | Pastikan flag `--ignore-crawlers` dipakai di cron & perintah manual. |