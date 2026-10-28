import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { CountrySelect } from '../components/CountrySelect';
import { DEFAULT_COUNTRY } from '../lib/countries';
import { site } from '../content/site';

/**
 * Contact form. POSTs JSON to the PHP endpoint in `public/contact.php`
 * (VITE_CONTACT_ENDPOINT overrides the path per environment); the honeypot
 * field `website` is dropped server-side. No credentials live in the client.
 */
const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ?? '/contact.php';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'sending' | 'success' | 'error';
type Errors = { name?: string; email?: string; message?: string };
type GoalId = 'digital' | 'hospitality' | 'other';
const GOAL_IDS: GoalId[] = ['digital', 'hospitality', 'other'];

/** The home CTA passes its lane as ?goal=; a direct visit starts at "other". */
function goalFromParam(value: string | null): GoalId {
  return value === 'digital' || value === 'hospitality' ? value : 'other';
}

const FIELD =
  'mt-3 w-full cursor-text border-b border-ink/25 bg-transparent pb-3 pt-2 font-display text-lg lowercase tracking-tight placeholder:text-ink/30 transition-colors focus:border-accent focus:outline-none';

export function ContactPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [searchParams] = useSearchParams();
  const [goal, setGoal] = useState<GoalId>(() => goalFromParam(searchParams.get('goal')));

  // A second CTA click can change the query without remounting this page.
  useEffect(() => {
    setGoal(goalFromParam(searchParams.get('goal')));
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      phone: (() => {
        const digits = String(data.get('phone') ?? '').trim();
        return digits ? `${country.dialCode} ${digits}` : '';
      })(),
      message: String(data.get('message') ?? '').trim(),
      topic: t(`contact.goals.${goal}`),
      website: String(data.get('website') ?? ''), // honeypot
      sentAt: new Date().toISOString(),
    };

    const next: Errors = {};
    if (!payload.name) next.name = t('contact.required');
    if (!EMAIL_RE.test(payload.email)) next.email = t('contact.invalidEmail');
    if (payload.message.length < 10) next.message = t('contact.tooShort');
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus('sending');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`contact endpoint responded ${response.status}`);
      setStatus('success');
      form.reset();
    } catch (error) {
      // Loud in the console, quiet in the UI: the visitor only needs to know
      // the message did not go through and what to do next.
      console.error('Contact form: submission failed', error);
      setStatus('error');
    }
  }

  function reset() {
    setStatus('idle');
    setErrors({});
  }

  return (
    <PageWrapper className="px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <header className="mb-16 max-w-[20ch] sm:mb-24">
        <p className="label mb-6 flex items-center gap-3 text-ink/50">
          <span className="inline-block h-px w-8 bg-ink/30" />
          {t('contact.title')} — {site.location}
        </p>
        <AnimatedText
          as="h1"
          text={t('contact.headline')}
          className="block font-display text-huge lowercase leading-[0.88] tracking-tight"
        />
      </header>

      <div className="grid grid-cols-1 gap-16 border-t hairline border-t-ink/20 pt-10 sm:grid-cols-12 sm:gap-8">
        <aside className="sm:col-span-4">
          <p className="body-copy max-w-[34ch]">{t('contact.intro')}</p>

          <dl className="mt-10 flex flex-col gap-6">
            <div>
              <dt className="label mb-2 text-ink/50">{t('menu.seasonLabel')}</dt>
              <dd className="label text-ink/80">{site.location}</dd>
            </div>
            <div>
              <dt className="label mb-2 text-ink/50">{t('menu.availabilityLabel')}</dt>
              <dd className="label text-ink/80">{t('site.availability')}</dd>
            </div>
          </dl>
        </aside>

        <div className="sm:col-span-7 sm:col-start-6">
          {/* Rendered directly rather than through AnimatePresence: a "wait"
              transition only swaps views once the outgoing animation ends, so a
              throttled tab could leave a sent message sitting on the form. */}
          {status === 'success' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex min-h-[380px] flex-col justify-center"
              >
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-paper">
                  ✓
                </span>
                <p className="font-display text-[8vw] lowercase leading-none tracking-tight sm:text-[2.6vw]">
                  {t('contact.thanks')}
                </p>
                <p className="body-copy mt-5 max-w-[42ch]">{t('contact.form.success')}</p>
                <button type="button" onClick={reset} className="label link-line mt-10 self-start text-accent">
                  {t('contact.again')} →
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-9"
                noValidate
              >
                <input
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                <div>
                  <span className="label text-ink/50">{t('contact.goalLabel')}</span>
                  <div role="group" aria-label={t('contact.goalLabel')} className="mt-3 grid gap-2 sm:grid-cols-3">
                    {GOAL_IDS.map((id) => (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={goal === id}
                        onClick={() => setGoal(id)}
                        className={`label border px-3 py-3 text-left transition-colors ${
                          goal === id
                            ? 'border-accent bg-accent text-ink'
                            : 'border-ink/20 text-ink/60 hover:border-ink/50'
                        }`}
                      >
                        {t(`contact.goals.${id}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-9 sm:grid-cols-2">
                  <label className="block">
                    <span className="label flex items-center justify-between text-ink/50">
                      {t('contact.form.name')}
                      {errors.name && <span className="text-accent">{errors.name}</span>}
                    </span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={t('contact.placeholders.name')}
                      aria-invalid={Boolean(errors.name)}
                      className={FIELD}
                    />
                  </label>

                  <label className="block">
                    <span className="label flex items-center justify-between text-ink/50">
                      {t('contact.form.email')}
                      {errors.email && <span className="text-accent">{errors.email}</span>}
                    </span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={t('contact.placeholders.email')}
                      aria-invalid={Boolean(errors.email)}
                      className={FIELD}
                    />
                  </label>
                </div>

                <div className="grid gap-9 sm:grid-cols-[13rem_1fr]">
                  <div>
                    <span id="contact-country-label" className="label text-ink/50">
                      {t('contact.form.country')}
                    </span>
                    <CountrySelect value={country} onChange={setCountry} labelId="contact-country-label" />
                  </div>
                  <label className="block">
                    <span className="label text-ink/50">{t('contact.form.phone')}</span>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={t('contact.form.phonePlaceholder')}
                      className={FIELD}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="label flex items-center justify-between text-ink/50">
                    {t('contact.form.message')}
                    {errors.message && <span className="text-accent">{errors.message}</span>}
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={t('contact.placeholders.message')}
                    aria-invalid={Boolean(errors.message)}
                    className={`${FIELD} resize-none`}
                  />
                </label>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group mt-2 flex items-center justify-between gap-4 bg-ink px-7 py-5 text-paper transition-colors hover:bg-accent disabled:opacity-70"
                >
                  <span className="font-display text-xl lowercase tracking-tight sm:text-2xl">
                    {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
                  </span>
                  <span className="text-2xl leading-none transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <p aria-live="polite" className="label text-ink/50">
                  {status === 'error' ? (
                    <span className="text-accent">{t('contact.form.error')}</span>
                  ) : null}
                </p>
              </form>
            )}
        </div>
      </div>
    </PageWrapper>
  );
}
