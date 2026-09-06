export function HeroPortrait() {
  return (
    <figure className="relative w-full max-w-[19rem]">
      {/* Offset ghost frame — hairline mat behind the portrait */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-2.5 translate-y-2.5 border border-[color:var(--card-border)]"
      />
      {/* Hairline frame in the theme accent */}
      <div className="relative border border-[color:color-mix(in_srgb,var(--accent)_55%,transparent)]">
        <img
          src="/portrait.jpg"
          alt="Win Winarno — Hospitality Operations & Technology Consultant"
          width={509}
          height={482}
          className="block h-auto w-full [filter:var(--portrait-filter)]"
        />
      </div>
      <figcaption className="mt-5 text-center">
        <span className="block font-[family-name:var(--font-display)] text-[clamp(1.7rem,3vw,2.4rem)] leading-none tracking-[0.04em] text-[var(--accent)]">
          Win Winarno
        </span>
        <span className="mt-2 block text-[0.6rem] uppercase tracking-[0.2em] text-[var(--muted)]">
          Hospitality Operations
        </span>
        <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-[var(--muted)]">
          &amp; Technology Consultant
        </span>
      </figcaption>
    </figure>
  );
}
