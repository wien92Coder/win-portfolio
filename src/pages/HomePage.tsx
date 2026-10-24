import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedText } from '../components/AnimatedText';
import { Lookbook } from '../components/Lookbook';
import { Marquee } from '../components/Marquee';
import { TransitionLink } from '../components/TransitionLink';
import { useProjects } from '../content/projects';
import { site } from '../content/site';
import { CASE_STUDIES } from '../content/caseStudies';
import {
  GOALS,
  HOME_COPY,
  LANES,
  PROOF_STATS,
  laneById,
  type LaneId,
} from '../content/lanes';

const EASE = [0.76, 0, 0.24, 1] as const;

function laneFromHash(): LaneId {
  return window.location.hash.replace('#', '') === 'hospitality' ? 'hospitality' : 'digital';
}

/**
 * Home — one site, two lanes. The visitor chooses Digital & Web or Hospitality
 * & Healthcare; the hero visual, ticker, work list, services and the CTA's
 * pre-selected goal all follow. The lane lives in the URL hash so a LinkedIn
 * link can open the right one.
 */
export function HomePage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';
  const projects = useProjects();
  const reducedMotion = useReducedMotion();

  const [laneId, setLaneId] = useState<LaneId>(() => laneFromHash());
  const [goal, setGoal] = useState<LaneId | 'other'>(() =>
    laneFromHash() === 'hospitality' ? 'hospitality' : 'digital',
  );

  // Keep the lane in sync when the visitor follows a #hospitality link or uses
  // the back button. `replaceState` (not location.hash) avoids a scroll jump.
  useEffect(() => {
    const onHash = () => {
      const next = laneFromHash();
      setLaneId(next);
      setGoal(next);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function selectLane(next: LaneId) {
    setLaneId(next);
    setGoal(next);
    window.history.replaceState(null, '', `#${next}`);
  }

  const lane = laneById(laneId);
  const laneNumber = laneId === 'digital' ? '01' : '02';

  // Work list is lane-dependent. Digital entries come from the project data;
  // hospitality entries are the anonymised case studies.
  const works =
    laneId === 'digital'
      ? projects.map((project) => ({
          key: project.slug,
          href: `/work/${project.slug}`,
          index: project.index,
          name: project.name,
          kind: project.tech[0],
          metric: project.badge ?? 'live',
          image: project.image,
        }))
      : CASE_STUDIES.map((study, i) => ({
          key: study.slug,
          href: `/karya/${study.slug}`,
          index: String(i + 1).padStart(2, '0'),
          name: study.title[lang],
          kind: study.sector[lang],
          metric: study.heroMetric.value[lang],
          image: study.image,
        }));

  return (
    <PageWrapper>
      {/* ── 01 HERO + LANE SELECTOR ────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-12 sm:gap-8">
          <div className="sm:col-span-7">
            <p className="label mb-5 flex items-center gap-3 text-ink/55">
              <span className="inline-block h-px w-8 bg-ink/30" />
              {site.brand} — {site.tagline}
            </p>

            <h1 className="font-display text-mega leading-[0.78] tracking-tighter text-ink">
              <AnimatedText text={`${site.word}.`} stagger={0} delay={0.1} />
              <span className="sr-only">
                {site.brand} — {site.tagline}
              </span>
            </h1>

            <p className="mt-8 max-w-[20ch] font-display text-[8vw] lowercase leading-[1.02] tracking-tight sm:mt-10 sm:text-[2.8vw]">
              {HOME_COPY.heroLine[lang]}
            </p>

            <div className="mt-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 md:whitespace-nowrap">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="label text-ink/80">{t('site.availability')}</span>
              </span>
            </div>

            {/* Lane selector — a radio group, not links: it changes this page. */}
            <div
              role="radiogroup"
              aria-label="Pilih jalur / Choose a lane"
              className="mt-8 border-t hairline border-t-ink/20 sm:mt-10 lg:w-[82%]"
            >
              {LANES.map((item) => {
                const active = item.id === laneId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => selectLane(item.id)}
                    className={`group flex w-full items-center gap-3 border-b hairline border-b-ink/20 px-2 py-3.5 text-left transition-colors duration-300 sm:gap-5 sm:px-4 sm:py-4 ${
                      active ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/5'
                    }`}
                  >
                    <span className={`label w-7 shrink-0 ${active ? 'text-paper/55' : 'text-ink/40'}`}>
                      {item.index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block whitespace-nowrap font-display text-[clamp(0.95rem,2.2vw,2.5rem)] lowercase leading-[0.95] tracking-tight">
                        {item.name[lang]}
                      </span>
                      <span
                        className={`label mt-1.5 block ${active ? 'text-paper/55' : 'text-ink/45'}`}
                      >
                        {item.note[lang]}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`shrink-0 text-lg transition-transform duration-500 sm:text-xl ${
                        active ? 'translate-x-0 text-accent' : '-translate-x-1 text-ink/35 group-hover:translate-x-0'
                      }`}
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lane visual — counter and caption follow the selected lane. */}
          <div className="sm:col-span-4 sm:col-start-9">
            <div className="relative">
              <div className="relative">
                {/* Accent stripe: 46% of the frame height, starting 38% down,
                    so it reads as a horizontal band behind the photo rather
                    than a panel the same height as the image. */}
                <motion.div
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
                  style={{ originX: 1 }}
                  className="absolute -left-[12%] -right-[3%] top-[38%] h-[46%] bg-accent sm:-left-[20%] lg:-left-[28%]"
                />
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  {/* Clip-path wipe plus a slow Ken-Burns settle, copied from the
                      hero slider so a lane change feels like the same gallery. */}
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={lane.id}
                      src={lane.image}
                      alt={lane.imageAlt[lang]}
                      width={900}
                      height={1200}
                      referrerPolicy="no-referrer"
                      initial={
                        reducedMotion
                          ? false
                          : { clipPath: 'inset(0 0 100% 0)', scale: 1.2 }
                      }
                      animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                      exit={reducedMotion ? undefined : { opacity: 0 }}
                      transition={{
                        clipPath: { duration: 0.9, ease: EASE },
                        scale: { duration: 6, ease: 'linear' },
                        opacity: { duration: 0.4, delay: 0.55 },
                      }}
                      className="img-editorial absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="label min-w-0 text-ink/55">
                  {lane.name[lang]}
                  <span className="hidden min-[1680px]:inline"> — {lane.note[lang]}</span>
                </p>
                <p className="label shrink-0 text-ink/55">
                  {laneNumber} / {String(LANES.length).padStart(2, '0')}
                </p>
                <p className="label w-full text-ink/40 min-[1680px]:hidden">{lane.note[lang]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={lane.keywords[lang]} />

      {/* ── 02 STATEMENT ───────────────────────────────────────────────── */}
      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-12">
          <p className="label flex items-center gap-3 text-ink/50 sm:col-span-3">
            <span className="inline-block h-px w-8 bg-ink/30" />
            02 — {lang === 'id' ? 'Pernyataan' : 'Statement'}
          </p>
          <div className="sm:col-span-9">
            <AnimatedText
              as="h2"
              text={HOME_COPY.statementTitle[lang]}
              className="block max-w-[22ch] font-display text-[8vw] lowercase leading-[1.02] tracking-tight sm:text-[3.4vw]"
              stagger={0.02}
            />
            <div className="mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
              {HOME_COPY.statementBody.map((paragraph) => (
                <p key={paragraph.id} className="body-copy">
                  {paragraph[lang]}
                </p>
              ))}
            </div>
            {laneId === 'digital' ? (
              <TransitionLink
                href="/karya/large-private-hospital"
                cursorMode="link"
                className="label link-line mt-10 inline-flex max-w-[52ch] items-baseline gap-2 text-ink/70 hover:text-accent"
              >
                <span>{HOME_COPY.proofLink[lang]}</span>
                <span aria-hidden>→</span>
              </TransitionLink>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── 03 SELECTED WORK — lane-dependent ──────────────────────────── */}
      <section className="px-5 pb-10 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-t hairline border-t-ink/20 pt-6">
          <AnimatedText
            as="h2"
            text={lane.worksLabel[lang]}
            className="block font-display text-huge lowercase leading-[0.85] tracking-tight"
          />
          <p className="label text-ink/50">
            [ {works.length} — {laneId === 'digital' ? HOME_COPY.worksCount[lang] : HOME_COPY.casesCount[lang]} ]
          </p>
        </div>

        <ul>
          {works.map((work, i) => (
            <li key={work.key} className="border-b hairline border-b-ink/20">
              <TransitionLink
                href={work.href}
                cursorMode="view"
                className="group grid grid-cols-12 items-center gap-3 py-5 sm:gap-4 sm:py-6"
              >
                <span className="label col-span-2 text-ink/40 sm:col-span-1">{work.index}</span>
                <span
                  className={`col-span-10 font-display text-[7.5vw] leading-[1.02] tracking-tight transition-transform duration-500 group-hover:translate-x-1 sm:col-span-5 sm:text-[2.4vw] ${
                    laneId === 'digital' ? 'lowercase' : ''
                  }`}
                >
                  {work.name}
                </span>
                <span className="col-span-1 hidden sm:block" />
                <span className="label col-span-6 col-start-3 mt-1 text-ink/55 sm:col-span-2 sm:col-start-auto sm:mt-0">
                  {work.kind}
                </span>
                <span className="label col-span-4 col-start-9 mt-1 text-right text-ink/70 sm:col-span-2 sm:col-start-auto sm:text-left">
                  {work.metric}
                </span>
                <span className="col-span-2 col-start-11 block justify-self-end sm:col-span-1 sm:col-start-auto">
                  <span className="block h-12 w-20 overflow-hidden bg-ink/5">
                    <img
                      src={work.image}
                      alt=""
                      loading={i === 0 ? 'eager' : 'lazy'}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                </span>
                <span className="label hidden items-center gap-2 text-ink/45 sm:col-span-1 sm:col-start-auto sm:flex sm:justify-end">
                  <span className="text-accent" aria-hidden>
                    →
                  </span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <TransitionLink href={lane.worksHref} cursorMode="link" className="label link-line text-ink/70">
            {lane.worksLink[lang]} — {works.length} →
          </TransitionLink>
        </div>
      </section>

      <Lookbook />

      {/* ── 05 SERVICES ────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-8 border-t hairline border-t-ink/20 pt-8 sm:grid-cols-12">
          <p className="label text-ink/50 sm:col-span-3">05 — {HOME_COPY.servicesEyebrow[lang]}</p>
          <div className="sm:col-span-9">
            {lane.services.map((service, i) => (
              <motion.div
                key={`${lane.id}-${service.n}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1], delay: i * 0.04 }}
                className="grid grid-cols-12 items-baseline gap-2 border-b hairline border-b-ink/15 py-7 sm:py-9"
              >
                <span className="col-span-2 font-display text-lg text-accent sm:col-span-1 sm:text-xl">
                  {service.n}
                </span>
                <h3 className="col-span-10 font-display text-[6.5vw] lowercase leading-none tracking-tight sm:col-span-6 sm:text-[2.4vw]">
                  {service.title[lang]}
                </h3>
                <p className="body-copy col-span-10 col-start-3 mt-2 !text-[14px] text-ink/60 sm:col-span-4 sm:col-start-8 sm:mt-0">
                  {service.note[lang]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF NUMBERS ──────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-y-12 px-5 py-20 sm:grid-cols-4 sm:px-8 sm:py-28">
        {PROOF_STATS.map((stat, i) => (
          <motion.div
            key={stat.label.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            className="border-l hairline border-l-ink/15 pl-4 sm:pl-6"
          >
            <p className="font-display text-[13vw] leading-[0.85] tracking-tighter sm:text-[3.6vw]">
              {stat.value[lang]}
            </p>
            <p className="label mt-3 max-w-[20ch] text-ink/50">{stat.label[lang]}</p>
          </motion.div>
        ))}
      </section>

      {/* ── 06 CTA + GOAL ─────────────────────────────────────────────── */}
      <section className="bg-ink px-5 py-24 text-paper sm:px-8 sm:py-32">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <p className="label mb-6 text-paper/45">06 — {HOME_COPY.ctaEyebrow[lang]}</p>
            <h2 className="max-w-[18ch] font-display text-[9vw] lowercase leading-[0.95] tracking-tight sm:text-[3.6vw]">
              {HOME_COPY.ctaTitle[lang]}{' '}
              <span className="text-accent">{HOME_COPY.ctaLead[lang]}</span>
            </h2>
          </div>

          <div className="sm:col-span-5 sm:col-start-8 sm:self-end">
            <p className="label mb-4 text-paper/45">{HOME_COPY.ctaGoalLabel[lang]}</p>
            <div className="flex flex-col gap-3">
              {GOALS.map((item) => {
                const active = goal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setGoal(item.id)}
                    className={`flex items-center justify-between gap-4 border px-4 py-3 text-left transition-colors ${
                      active
                        ? 'border-accent bg-accent text-ink'
                        : 'border-paper/25 text-paper hover:border-paper/60'
                    }`}
                  >
                    <span>
                      <span className="font-display text-base lowercase leading-none tracking-tight">
                        {item.label[lang]}
                      </span>
                      <span
                        className={`label mt-1.5 block ${
                          active ? 'text-ink/60' : 'text-paper/45'
                        }`}
                      >
                        {item.note[lang]}
                      </span>
                    </span>
                    <span aria-hidden className={active ? 'text-ink' : 'text-accent'}>
                      {active ? '●' : '○'}
                    </span>
                  </button>
                );
              })}
            </div>

            <TransitionLink
              href={`/contact?goal=${goal}`}
              cursorMode="link"
              className="group mt-5 flex items-center justify-between gap-4 bg-accent px-5 py-4 text-ink transition-colors hover:bg-paper"
            >
              <span className="font-display text-xl lowercase tracking-tight">
                {HOME_COPY.ctaButton[lang]}
              </span>
              <span className="text-2xl leading-none transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </TransitionLink>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
