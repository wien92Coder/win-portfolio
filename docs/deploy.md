# Deploy ke VPS — Panduan Lengkap

> Runbook setup auto-deploy: setiap push ke `main` → build otomatis di GitHub
> Actions → upload ke VPS via rsync/SSH. Tidak perlu upload manual lagi.

## Ringkasan alur

```
push ke main ──► GitHub Actions (npm ci + npm run build)
                     │
                     ▼
              rsync dist/ ──► VPS (nginx, /var/www/win-portfolio)
```

File workflow: `.github/workflows/deploy.yml` (sudah commit di repo).

## Komponen penting

| Komponen | Nilai |
|---|---|
| Repo GitHub | `wien92Coder/win-portfolio` |
| VPS | `43.129.37.106` (user: `ubuntu`, Ubuntu 24.04, nginx) |
| Domain | `win-portfolio.my.id` (http → redirect 301 ke https, SSL via Certbot) |
| Web root di VPS | `/var/www/win-portfolio` |
| SSH key (lokal) | `C:\Users\coebe-coder\.ssh\id_ed25519` (jangan pernah dibagikan) |

## Secrets & variable GitHub

Tempat: **Settings → Secrets and variables → Actions** di repo.

Secrets (tab **Secrets** → New repository secret):

| Nama | Isi |
|---|---|
| `VPS_HOST` | `43.129.37.106` |
| `VPS_USER` | `ubuntu` |
| `VPS_SSH_KEY` | seluruh isi file `id_ed25519` (mulai `-----BEGIN OPENSSH PRIVATE KEY-----`) |
| `DEPLOY_PATH` | `/var/www/win-portfolio` |

Variable (tab **Variables** → New repository variable):

| Nama | Isi |
|---|---|
| `VITE_CONTACT_ENDPOINT` | `https://win-portfolio.my.id/contact.php` |

`VITE_CONTACT_ENDPOINT` dipakai build (di-*bake* ke JS) supaya form kontak
mengirim email. Tanpa variable ini form tampil tapi tidak mengirim.
⚠️ `.env.local` di lokal berisi placeholder dev (`127.0.0.1:8000`) dan di-gitignore
— jangan dijadikan acuan untuk produksi.

## Setup sekali saja (sudah dikerjakan — untuk referensi jika pindah VPS)

### 1. SSH key

```cmd
ssh-keygen -t ed25519 -C "github-deploy"   :: Enter, passphrase kosong (Enter 2x)
```

Copy public key ke VPS (CMD di Windows — `ssh-copy-id` tidak tersedia):

```cmd
type %USERPROFILE%\.ssh\id_ed25519.pub | ssh ubuntu@43.129.37.106 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

Verifikasi login tanpa password: `ssh ubuntu@43.129.37.106`.

### 2. Izin web root

Agar user `ubuntu` bisa menulis hasil deploy (nginx tetap bisa baca):

```bash
sudo chown -R ubuntu:www-data /var/www/win-portfolio
```

### 3. Workflow

File `.github/workflows/deploy.yml` berisi:

- **Trigger:** push ke `main` + tombol manual "Run workflow" (tab Actions)
- **Build:** `npm ci` → `npm run build` (tsc + vite build), dengan
  `VITE_CONTACT_ENDPOINT` diambil dari variable GitHub
- **Deploy:** `rsync -avz --delete --exclude=config.local.php dist/ → DEPLOY_PATH`

## Yang perlu diperhatikan

- **`--delete`** — file di web root yang tidak ada di build akan dihapus.
  `DEPLOY_PATH` harus tepat menunjuk web root situs saja.
- **`--exclude=config.local.php`** — `config.local.php` (config SMTP form
  kontak) sengaja dikecualikan: dia di-gitignore dan berbeda per server, jadi
  tidak ada di build CI. Jangan hapus pengecualian ini.
- **Deploy pertama** bisa diuji lewat tombol "Run workflow" sebelum push.

## Troubleshooting

| Gejala | Penyebab / Solusi |
|---|---|
| Gagal di step "Deploy via rsync", *permission denied* | Belum `chown` web root ke user SSH. Jalankan perintah chown di atas, lalu **Re-run jobs**. |
| Gagal di step Build | Lihat error run-nya; umumnya error TypeScript atau dependency. |
| Form kontak tidak mengirim | Variable `VITE_CONTACT_ENDPOINT` kosong/salah di GitHub. |
| Situs tidak berubah setelah deploy | Hard refresh browser (**Ctrl+F5**) — cache aset 30 hari. |
| Ingin tahu isi file nginx | `/etc/nginx/sites-available/win-portfolio` (backup: `.bak`). |