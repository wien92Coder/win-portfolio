import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';

// The form POSTs to the open-source PHP endpoint configured via
// VITE_CONTACT_ENDPOINT (see public/contact.php and docs/contact-php/README.md).
// Never put Gmail credentials in the frontend.
const INPUT_CLASS =
  'w-full border border-[color:var(--card-border)] bg-transparent px-3 py-2 text-[0.75rem] focus:border-[var(--accent)] focus:outline-none';

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

type SendStatus = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<SendStatus>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!CONTACT_ENDPOINT) {
      console.warn('Contact form: VITE_CONTACT_ENDPOINT is not set — submission not sent.');
      return;
    }

    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''), // honeypot — contact.php drops filled submissions
      sentAt: new Date().toISOString(),
    };

    setStatus('sending');
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`contact endpoint responded ${response.status}`);
      }
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="py-24">
      <Reveal>
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">{t('nav.contact')}</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] tracking-[0.03em]">
          {t('contact.title')}
        </h2>
      </Reveal>

      <Reveal>
        <form
          onSubmit={handleSubmit}
          className="mt-12 max-w-xl space-y-5 border border-[color:var(--card-border)] bg-[color:var(--card-bg)] p-6"
        >
          {/* Honeypot field — hidden from humans, bots tend to fill it (see contact.php) */}
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div>
            <label htmlFor="contact-name" className="block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
              {t('contact.form.name')}
            </label>
            <input id="contact-name" name="name" type="text" required className={`${INPUT_CLASS} mt-2`} />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
              {t('contact.form.email')}
            </label>
            <input id="contact-email" name="email" type="email" required className={`${INPUT_CLASS} mt-2`} />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
              {t('contact.form.message')}
            </label>
            <textarea id="contact-message" name="message" rows={5} required className={`${INPUT_CLASS} mt-2 resize-none`} />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="border border-[var(--accent)] px-5 py-3 text-[0.62rem] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg)] disabled:cursor-wait disabled:opacity-60"
            >
              {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
            </button>
            {status === 'success' && (
              <p role="status" className="text-[0.7rem] text-[var(--status-ok)]">
                {t('contact.form.success')}
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="text-[0.7rem] text-[var(--status-crit)]">
                {t('contact.form.error')}
              </p>
            )}
          </div>
        </form>
      </Reveal>
    </section>
  );
}
