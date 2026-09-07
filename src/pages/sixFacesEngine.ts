/**
 * "Six Faces / Walking The Cow" — a scroll-driven 3D cube.
 *
 * Ported from CodePen ZYpyoRV by Luis Alberto Martinez Riancho and adapted
 * for the portfolio:
 *
 *  - Theme follows the site's 3-state theme (no own toggle). Face images
 *    swap between light/dark variants on the `themechange` CustomEvent
 *    dispatched by theme.ts.
 *  - Face images are local assets under public/six-faces/; a missing image
 *    falls back to the design-system face placeholder (grid + label) —
 *    drop in face-01.webp … face-06.webp (+ -dark.webp variants) later
 *    and they appear without touching code.
 *  - prefers-reduced-motion: the wheel hijack and smooth-scroll loop are
 *    disabled; the cube snaps to the current section as the visitor scrolls
 *    (design-system.md §8).
 */

const IMAGE_SRCS = Array.from(
  { length: 6 },
  (_, i) => `${import.meta.env.BASE_URL}six-faces/face-0${i + 1}.webp`,
);

const FACE_NAMES = ['DESCENT', 'REBELLION', 'MOO WALK', 'BAD ART', 'NO RULES', 'SUPER'];

const SWAP_RADIUS = 3;
const N = IMAGE_SRCS.length;

function buildStops(n: number): Array<{ rx: number; ry: number }> {
  const base = [
    { rx: 90, ry: 0 },
    { rx: 0, ry: 0 },
    { rx: 0, ry: -90 },
    { rx: 0, ry: -180 },
    { rx: 0, ry: -270 },
    { rx: -90, ry: -360 },
  ];
  const out = base.slice(0, Math.min(n, 6));
  for (let i = 6; i < n; i++) {
    out.push({ rx: 0, ry: -360 - (i - 6) * 90 });
  }
  return out;
}

const STOPS = buildStops(N);

function stopIndex(s: number): number {
  return Math.min(N - 1, Math.floor(s * (N - 1)));
}

function faceAtStop(i: number): number {
  if (i < 6) return i;
  return 1 + ((i - 2) % 4);
}

const easeIO = (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const dynamicFriction = (v: number): number => (Math.abs(v) > 200 ? 0.8 : 0.9);

export function initSixFaces(root: HTMLElement): () => void {
  const q = <T extends Element>(sel: string): T | null => root.querySelector<T>(sel);
  const qa = <T extends Element>(sel: string): T[] => Array.from(root.querySelectorAll<T>(sel));

  const cube = q<HTMLElement>('#cube');
  const faces = qa<HTMLElement>('.face');
  const hudPct = q<HTMLElement>('#hud_pct');
  const progFill = q<HTMLElement>('#prog_fill');
  const sceneName = q<HTMLElement>('#scene_name');
  const captionNum = q<HTMLElement>('#face_caption_num');
  const captionName = q<HTMLElement>('#face_caption_name');
  const sceneDots = qa<HTMLAnchorElement>('.scene-dot');
  const sections = qa<HTMLElement>('#scroll_container section');

  if (!cube || !hudPct || !progFill || !sceneName || !captionNum || !captionName) {
    return () => {};
  }

  // The site sets `html { scroll-behavior: smooth }`; the cube's own
  // frame-by-frame scrollTo would fight it. Neutralize while mounted.
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';

  const isDark = (): boolean => document.documentElement.getAttribute('data-theme') !== 'light';
  const getDarkSrc = (src: string): string => src.replace(/\.webp$/, '-dark.webp');

  // Warm the cache for every candidate (light + dark); firstAvailable()
  // probes existence before an image is ever attached to a face.
  for (const src of IMAGE_SRCS) {
    const light = new Image();
    light.src = src;
    const dark = new Image();
    dark.src = getDarkSrc(src);
  }

  /** Returns the first URL that actually serves an image (light or dark). */
  async function firstAvailable(urls: string[]): Promise<string | null> {
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        const type = res.headers.get('content-type') ?? '';
        if (res.ok && type.startsWith('image/')) return url;
      } catch {
        // Network hiccup — try the next candidate.
      }
    }
    return null;
  }

  const faceImgIdx = new Array<number>(6).fill(-1);
  let currentStop = -1;
  let lastFaceIdx = -1;

  async function setFaceImage(faceIdx: number, imgIdx: number, force = false): Promise<void> {
    if (!force && faceIdx === faceAtStop(currentStop)) return;
    if (!force && faceImgIdx[faceIdx] === imgIdx) return;
    faceImgIdx[faceIdx] = imgIdx;
    const face = faces[faceIdx];
    if (!face) return;

    const candidates = isDark()
      ? [getDarkSrc(IMAGE_SRCS[imgIdx]), IMAGE_SRCS[imgIdx]]
      : [IMAGE_SRCS[imgIdx], getDarkSrc(IMAGE_SRCS[imgIdx])];
    const src = await firstAvailable(candidates);

    // Superseded by a newer call for this face — stop.
    if (faceImgIdx[faceIdx] !== imgIdx) return;
    if (!src) {
      // No local image yet — keep the design-system face placeholder.
      face.querySelector('img')?.remove();
      return;
    }

    let img = face.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      face.appendChild(img);
    }
    img.alt = FACE_NAMES[imgIdx] ?? '';
    img.style.objectFit = '';
    img.onload = () => {
      img!.onerror = null;
    };
    img.onerror = () => {
      img?.remove();
      if (faceImgIdx[faceIdx] === imgIdx) faceImgIdx[faceIdx] = -1;
    };
    img.src = src;
  }

  const refreshFaceImages = (): void => {
    const snapshot = [...faceImgIdx];
    faceImgIdx.fill(-1);
    snapshot.forEach((imgIdx, faceIdx) => {
      if (imgIdx !== -1) setFaceImage(faceIdx, imgIdx, true);
    });
  };

  function checkImageSwaps(smooth: number): void {
    const base = stopIndex(smooth);
    for (let offset = -SWAP_RADIUS; offset <= SWAP_RADIUS; offset++) {
      if (offset === 0) continue;
      const si = base + offset;
      if (si < 0 || si >= N) continue;
      setFaceImage(faceAtStop(si), si);
    }
  }

  let sectionTops: number[] = [];
  const buildSectionTops = (): void => {
    sectionTops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
  };
  const sectionIndexFromScroll = (y: number): number => {
    const mid = y + innerHeight * 0.5;
    let idx = 0;
    for (let i = 0; i < sectionTops.length; i++) {
      if (mid >= sectionTops[i]) idx = i;
    }
    return Math.min(idx, N - 1);
  };

  const mqSmall = window.matchMedia('(max-width: 56.25em)');
  let maxScroll = 1;
  let lastScrollHeight = 0;
  let lastInnerHeight = 0;
  const resize = (): void => {
    const h = document.documentElement.scrollHeight;
    const vh = innerHeight;
    if (h === lastScrollHeight && vh === lastInnerHeight) return;
    lastScrollHeight = h;
    lastInnerHeight = vh;
    maxScroll = Math.max(1, h - vh);
    buildSectionTops();
  };
  resize();

  const updateHUD = (s: number): void => {
    const p = Math.round(s * 100);
    const si = sectionIndexFromScroll(window.scrollY);
    currentStop = si;
    hudPct.textContent = String(p).padStart(3, '0') + '%';
    progFill.style.width = `${p}%`;
    if (si !== lastFaceIdx) {
      lastFaceIdx = si;
      const name = FACE_NAMES[si] ?? '';
      sceneName.textContent = name;
      captionNum.textContent = String(si + 1).padStart(2, '0');
      captionName.textContent = name;
      sceneDots.forEach((d, i) => d.classList.toggle('active', i === si));
    }
  };

  const setCubeTransform = (s: number): void => {
    if (N < 2 || STOPS.length < 2) return;
    const t = s * (N - 1);
    const i = Math.min(Math.floor(t), N - 2);
    const f = easeIO(t - i);
    const a = STOPS[i];
    const b = STOPS[i + 1];
    const rx = a.rx + (b.rx - a.rx) * f;
    const ry = a.ry + (b.ry - a.ry) * f;
    cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll (design-system.md §5 reveal pattern).
  const revealEls = qa<HTMLElement>('.tag, h1, h2, .body-text, .stat-row, .cta, .cta-back, .h-line');
  let io: IntersectionObserver | null = null;
  if (reducedMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io?.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    revealEls.forEach((el) => io?.observe(el));
  }

  // Initial face images.
  for (let i = 0; i < Math.min(N, 6); i++) {
    if (IMAGE_SRCS[i]) setFaceImage(i, i, true);
  }

  let tgt = 0;
  let smooth = 0;
  let velocity = 0;
  const ease = 0.1;

  let anchorAnim: number | null = null;
  const stopAnchorAnim = (): void => {
    if (anchorAnim !== null) {
      cancelAnimationFrame(anchorAnim);
      anchorAnim = null;
    }
  };
  const smoothScrollToY = (targetY: number, duration = 900): void => {
    stopAnchorAnim();
    velocity = 0;
    const startY = window.scrollY;
    const diff = targetY - startY;
    const start = performance.now();
    const tick = (now: number): void => {
      const p = Math.min(1, (now - start) / duration);
      const y = startY + diff * easeInOutCubic(p);
      window.scrollTo(0, y);
      tgt = y / maxScroll;
      smooth = tgt;
      if (p < 1) {
        anchorAnim = requestAnimationFrame(tick);
      } else {
        anchorAnim = null;
      }
    };
    anchorAnim = requestAnimationFrame(tick);
  };

  const onClick = (e: MouseEvent): void => {
    const anchor = e.target instanceof Element ? e.target.closest('a[href^="#s"]') : null;
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;
    const dest = root.querySelector(href) as HTMLElement | null;
    if (!dest) return;
    e.preventDefault();
    const isHero = href === '#s0';
    const idx = sections.indexOf(dest);
    const baseY =
      idx >= 0 ? sectionTops[idx] : dest.getBoundingClientRect().top + window.scrollY;
    const extraOffset =
      mqSmall.matches && !isHero ? Math.max(0, dest.offsetHeight - innerHeight) : 0;
    const y = Math.max(0, baseY + extraOffset);
    if (reducedMotion) {
      window.scrollTo(0, y);
      const s = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;
      updateHUD(s);
      checkImageSwaps(s);
      setCubeTransform(s);
    } else {
      smoothScrollToY(y);
    }
  };
  document.addEventListener('click', onClick);

  const onResize = (): void => {
    resize();
    tgt = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    smooth = tgt;
  };
  window.addEventListener('resize', onResize);

  let resizePending = false;
  const ro = new ResizeObserver(() => {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(() => {
      resize();
      tgt = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      smooth = tgt;
      resizePending = false;
    });
  });
  ro.observe(document.documentElement);

  let rafId = 0;
  const onScroll = (): void => {
    if (reducedMotion) {
      const s = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      updateHUD(s);
      checkImageSwaps(s);
      setCubeTransform(s);
    } else {
      tgt = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      tgt = Math.max(0, Math.min(1, tgt));
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  let onWheel: ((e: WheelEvent) => void) | null = null;
  if (!reducedMotion) {
    onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const linePx = 16;
      const pagePx = innerHeight * 0.9;
      const delta =
        e.deltaMode === 1
          ? e.deltaY * linePx
          : e.deltaMode === 2
            ? e.deltaY * pagePx
            : e.deltaY;
      if (Math.abs(delta) < 5) return;
      stopAnchorAnim();
      velocity += delta;
      velocity = Math.max(-600, Math.min(600, velocity));
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    let lastNow = performance.now();
    const frame = (now: number): void => {
      rafId = requestAnimationFrame(frame);
      if (document.hidden) {
        lastNow = now;
        return;
      }
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      velocity *= Math.pow(dynamicFriction(velocity), dt * 60);
      if (Math.abs(velocity) < 0.01) velocity = 0;
      if (Math.abs(velocity) > 0.2) {
        const next = Math.max(0, Math.min(window.scrollY + velocity * ease, maxScroll));
        window.scrollTo(0, next);
        tgt = next / maxScroll;
      }
      smooth += (tgt - smooth) * (1 - Math.exp(-dt * 8));
      smooth = Math.max(0, Math.min(1, smooth));
      updateHUD(smooth);
      checkImageSwaps(smooth);
      setCubeTransform(smooth);
    };
    rafId = requestAnimationFrame(frame);
  }

  const onThemeChange = (): void => refreshFaceImages();
  window.addEventListener('themechange', onThemeChange);
  window.addEventListener('touchstart', stopAnchorAnim, { passive: true });
  window.addEventListener('mousedown', stopAnchorAnim, { passive: true });
  window.addEventListener('keydown', stopAnchorAnim);

  return () => {
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    window.removeEventListener('scroll', onScroll);
    if (onWheel) window.removeEventListener('wheel', onWheel);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('touchstart', stopAnchorAnim);
    window.removeEventListener('mousedown', stopAnchorAnim);
    window.removeEventListener('keydown', stopAnchorAnim);
    document.removeEventListener('click', onClick);
    window.removeEventListener('themechange', onThemeChange);
    if (rafId) cancelAnimationFrame(rafId);
    if (anchorAnim !== null) cancelAnimationFrame(anchorAnim);
    ro.disconnect();
    io?.disconnect();
    faces.forEach((face) => face.querySelector('img')?.remove());
  };
}