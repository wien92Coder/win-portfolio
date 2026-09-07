# Contact Form → Gmail (free PHP endpoint)

A single open-source PHP file (`public/contact.php`) that receives the contact
form's POST, validates it, blocks bots with a honeypot, and emails you. No
external service, no recurring cost — it needs only any PHP-capable host
(cPanel/shared hosting, free tiers). PHP cannot run on GitHub Pages / Vercel /
Netlify static hosting.

## 1. Deploy the endpoint

Upload `public/contact.php` to your PHP host (if you deploy the built site to a
PHP host, Vite copies it into `dist/` automatically alongside the app), then
open `https://<your-host>/contact.php` — it should answer `405` JSON (it only
accepts POST), which confirms PHP is running.

## 2. Configure it

Edit the CONFIG block at the top of `contact.php`:

- `RECIPIENT_EMAIL` → your Gmail address (where submissions land)
- `ALLOWED_ORIGIN` → `'*'` to allow any origin, or your site's domain for strict CORS
- `MAIL_TRANSPORT`:
  - `'mail'` (default, zero dependencies) — uses PHP `mail()`. Works on most
    shared hosts, but delivery can land in spam depending on the host's
    reputation. Test a submission and check spam.
  - `'smtp'` — reliable Gmail delivery via PHPMailer (open source, LGPL).
    Run `composer require phpmailer/phpmailer` in the directory above the file
    (the script expects `vendor/autoload.php` next to it), then set
    `SMTP_USER` to your Gmail address and `SMTP_PASS` to a **Google App
    Password** — which requires 2-Step Verification enabled on that Gmail
    account (Google no longer allows plain-password SMTP).

## 3. Point the site at it

Create `.env.local` at the repo root (gitignored):

```
VITE_CONTACT_ENDPOINT=https://<your-host>/contact.php
```

The form then POSTs `{ name, email, phone, message, website, sentAt }`;
`website` is the honeypot field and `phone` is the visitor's number with the
dial code (e.g. `+62 812 3456 7890`) from the country picker. Success/failure
copy is shown to the visitor in the active locale. Until the env var is set,
the form renders but does not send (it logs a warning).