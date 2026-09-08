import { Fragment, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { initWebProject } from './webProjectEngine';
import './web-project.css';

const FACE_KEYS = ['top', 'front', 'right', 'back', 'left', 'bottom'] as const;

type Scene = {
  tag: string;
  title: string[];
  description: string;
  link?: string;
};

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

function Cta({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      className="cta"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
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

export function WebProject() {
  const { t, i18n } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);

  const faces = t('webProject.faces', { returnObjects: true }) as string[];
  const scenes = t('webProject.scenes', { returnObjects: true }) as Scene[];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = t('webProject.documentTitle');
    return () => {
      document.title = previousTitle;
    };
  }, [i18n.language, t]);

  useEffect(() => {
    return rootRef.current ? initWebProject(rootRef.current) : () => {};
  }, []);

  return (
    <div ref={rootRef} className="sixfaces min-h-screen">
      <div id="scene">
        <div id="cube">
          {FACE_KEYS.map((face, i) => (
            <div key={face} className="face" data-face={face} data-i={i}>
              <span className="face-ph">{faces[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div id="hud">
        <div id="hud_pct">000%</div>
        <div className="progress-bar">
          <div className="progress-fill" id="prog_fill" />
        </div>
        <div className="scene-label" id="scene_name">HANANIA</div>
      </div>

      <div id="scene_strip">
        {scenes.map((_, i) => (
          <a key={i} href={`#s${i}`} className={`scene-dot${i === 0 ? ' active' : ''}`} />
        ))}
      </div>

      <div id="face_caption">
        <div id="face_caption_num">01</div>
        <div id="face_caption_name">HANANIA</div>
      </div>

      <div id="scroll_container">
        {scenes.map((scene, i) => {
          const isFirst = i === 0;
          const isLast = i === scenes.length - 1;
          const hasStats = i === 3;
          const TitleTag = isFirst ? 'h1' : 'h2';
          return (
            <section key={i} id={`s${i}`}>
              <div className={`text-card${i % 2 === 1 ? ' right' : ''}`}>
                {!isFirst && <div className="h-line" />}
                <div className="tag">{scene.tag}</div>
                <TitleTag>
                  {scene.title.map((line, li) => (
                    <Fragment key={li}>
                      {li > 0 && <br />}
                      {line}
                    </Fragment>
                  ))}
                </TitleTag>
                <p className="body-text">{scene.description}</p>
                {hasStats && (
                  <div className="stat-row" style={{ justifyContent: 'flex-end' }}>
                    <div className="stat">
                      <span className="stat-num">6</span>
                      <span className="stat-label">{t('webProject.stats.works')}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-num">360</span>
                      <span className="stat-label">{t('webProject.stats.degrees')}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-num">1</span>
                      <span className="stat-label">{t('webProject.stats.object')}</span>
                    </div>
                  </div>
                )}
                <div className="cta-row">
                  {isFirst ? (
                    <Cta href={scene.link ?? '#'} external>
                      {t('webProject.enter')}
                    </Cta>
                  ) : (
                    <>
                      <CtaBack href={`#s${i - 1}`}>{t('webProject.back')}</CtaBack>
                      <Cta href={isLast ? '#s0' : `#s${i + 1}`}>
                        {isLast ? t('webProject.beginAgain') : t('webProject.turn')}
                      </Cta>
                    </>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <Link to="/" className="sixfaces-back">
        <BackIcon />
        {t('webProject.back')}
      </Link>

      <div id="credit">
        <a
          href="https://www.linkedin.com/posts/luis-martinez-lr_ai-creativity-reversecreativity-activity-7366853269517651970-zeUD?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFq1dzgByK1x_NMrcq582OMbK-_3q0DthYY"
          target="_blank"
          rel="noopener"
        >
          {t('webProject.credit')}
        </a>
      </div>
    </div>
  );
}