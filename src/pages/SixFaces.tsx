import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { initSixFaces } from './sixFacesEngine';
import './six-faces.css';

const FACES = [
  { face: 'top', label: 'TOP' },
  { face: 'front', label: 'FRONT' },
  { face: 'right', label: 'RIGHT' },
  { face: 'back', label: 'BACK' },
  { face: 'left', label: 'LEFT' },
  { face: 'bottom', label: 'BOTTOM' },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M1 6h10M6 1l5 5-5 5" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M11 6H1M6 11L1 6l5-5" />
    </svg>
  );
}

function Cta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="cta" href={href}>
      {children}
      <ArrowIcon />
    </a>
  );
}

function CtaBack({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="cta-back" href={href}>
      <BackIcon />
      {children}
    </a>
  );
}

export function SixFaces() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Six Faces / Walking The Cow';
    const cleanup = rootRef.current ? initSixFaces(rootRef.current) : () => {};
    return () => {
      cleanup();
      document.title = previousTitle;
    };
  }, []);

  return (
    <div ref={rootRef} className="sixfaces min-h-screen">
      <div id="scene">
        <div id="cube">
          {FACES.map((f, i) => (
            <div key={f.face} className="face" data-face={f.face} data-i={i}>
              <span className="face-ph">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div id="hud">
        <div id="hud_pct">000%</div>
        <div className="progress-bar">
          <div className="progress-fill" id="prog_fill" />
        </div>
        <div className="scene-label" id="scene_name">DESCENT</div>
      </div>

      <div id="scene_strip">
        {Array.from({ length: 6 }, (_, i) => (
          <a key={i} href={`#s${i}`} className={`scene-dot${i === 0 ? ' active' : ''}`} />
        ))}
      </div>

      <div id="face_caption">
        <div id="face_caption_num">01</div>
        <div id="face_caption_name">DESCENT</div>
      </div>

      <div id="scroll_container">
        <section id="s0">
          <div className="text-card">
            <div className="tag">Cube Gallery — Bad Art</div>
            <h1>
              WORK
              <br />
              AGAINST
              <br />
              THE MODEL
            </h1>
            <p className="body-text">
              What happens when you ask AI to do the opposite of what it was built for? Break
              proportion. Flip symmetry. Leave the mistakes in place. Scroll to find out.
            </p>
            <div className="cta-row">
              <Cta href="#s1">Enter</Cta>
            </div>
          </div>
        </section>

        <section id="s1">
          <div className="text-card right">
            <div className="h-line" />
            <div className="tag">01 — Art Rebellion</div>
            <h2>
              FLIP
              <br />
              THE
              <br />
              PROMPT
            </h2>
            <p className="body-text">
              A cow walking a monster instead of a monster walking a cow. That inversion is enough
              to break template thinking. The cape ends up on the wrong body.
            </p>
            <div className="cta-row">
              <CtaBack href="#s0">Back</CtaBack>
              <Cta href="#s2">Turn</Cta>
            </div>
          </div>
        </section>

        <section id="s2">
          <div className="text-card">
            <div className="h-line" />
            <div className="tag">02 — Moo Walk</div>
            <h2>
              NEITHER
              <br />
              LEADS
            </h2>
            <p className="body-text">
              Clashing colors. No balance. A dance with no choreography. When the model works
              against itself something more genuine surfaces.
            </p>
            <div className="cta-row">
              <CtaBack href="#s1">Back</CtaBack>
              <Cta href="#s3">Turn</Cta>
            </div>
          </div>
        </section>

        <section id="s3">
          <div className="text-card right">
            <div className="h-line" />
            <div className="tag">03 — Bad Art</div>
            <h2>
              REVERSE
              <br />
              CREATIVITY
            </h2>
            <p className="body-text">
              AI is trained to polish and regularize. The harder direction is unlearning that. A
              television for a head is not an error. It is the point.
            </p>
            <div className="stat-row" style={{ justifyContent: 'flex-end' }}>
              <div className="stat">
                <span className="stat-num">6</span>
                <span className="stat-label">Works</span>
              </div>
              <div className="stat">
                <span className="stat-num">360</span>
                <span className="stat-label">Degrees</span>
              </div>
              <div className="stat">
                <span className="stat-num">1</span>
                <span className="stat-label">Object</span>
              </div>
            </div>
            <div className="cta-row">
              <CtaBack href="#s2">Back</CtaBack>
              <Cta href="#s4">Turn</Cta>
            </div>
          </div>
        </section>

        <section id="s4">
          <div className="text-card">
            <div className="h-line" />
            <div className="tag">04 — No Rules</div>
            <h2>
              NONSENSE
              <br />
              AT THE
              <br />
              CENTER
            </h2>
            <p className="body-text">
              Dada and the surrealists knew this. Put the absurd at the center and the edges stop
              pretending. Nine heads in the branches. The sun has a face and it approves.
            </p>
            <div className="cta-row">
              <CtaBack href="#s3">Back</CtaBack>
              <Cta href="#s5">Turn</Cta>
            </div>
          </div>
        </section>

        <section id="s5">
          <div className="text-card right">
            <div className="h-line" />
            <div className="tag">05 — Super Monsters</div>
            <h2>
              RAW
              <br />
              NOT
              <br />
              POLISHED
            </h2>
            <p className="body-text">
              Forward creativity takes a sketch and makes it real. This goes the other way.
              Imperfection left in place is closer to something honest.
            </p>
            <div className="cta-row">
              <CtaBack href="#s4">Back</CtaBack>
              <Cta href="#s0">Begin again</Cta>
            </div>
          </div>
        </section>
      </div>

      <Link to="/" className="sixfaces-back">
        <BackIcon />
        {t('sixFaces.back')}
      </Link>

      <div id="credit">
        <a
          href="https://www.linkedin.com/posts/luis-martinez-lr_ai-creativity-reversecreativity-activity-7366853269517651970-zeUD?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFq1dzgByK1x_NMrcq582OMbK-_3q0DthYY"
          target="_blank"
          rel="noopener"
        >
          Reverse Creativity
        </a>
      </div>
    </div>
  );
}