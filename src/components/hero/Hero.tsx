import { systemStats } from "@/data/hero/system-stats.data";
import { identity } from "@/data/profile/profile.data";
import Typewriter from "@/components/shared/Typewriter";
import CapabilityMatrix from "@/components/about/CapabilityMatrix";
import HeroDesktopSystem from "@/components/hero/HeroDesktopSystem";
import HeroPublicReposMetric from "@/components/hero/HeroPublicReposMetric";

export default function Hero() {
  const proofStats = [
    ...systemStats,
    {
      label: "DEPLOYED SYSTEMS",
      value: "03",
    },
  ];

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6 lg:py-16 xl:py-24">
        {/* ---- LEFT: text column ---- */}
        <div className="relative z-10">
          <div className="hero-anim tech-label mb-6 flex items-center gap-3 text-cyan">
            <span className="h-px w-10 bg-cyan" />
            DRAWING NO. NSK-2026 · MASTER SCHEMATIC
          </div>

          <h1 className="hero-anim font-display text-[14vw] font-bold leading-[0.92] tracking-tight sm:text-[10vw] lg:text-[clamp(3.75rem,5.2vw,5.5rem)]">
            NALLANA
            <br />
            <span className="whitespace-nowrap text-line">SASI KUMAR</span>
          </h1>

          <div className="hero-anim mt-5 max-w-xl">
            <p className="min-h-7 font-mono text-base font-medium text-cyan glow-cyan md:min-h-8 md:text-xl">
              <Typewriter
                words={identity.roleFramings}
                className="text-cyan"
              />
            </p>
            <p className="mt-3 text-sm leading-relaxed text-paper-dim md:text-base">
              {identity.tagline}
            </p>
          </div>

          <nav aria-label="Recruiter actions" className="hero-anim mt-6 grid max-w-xl grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <a
              href="#systems"
              className="col-span-2 flex min-h-11 items-center justify-center border border-cyan bg-cyan/10 px-5 font-mono text-xs font-semibold tracking-[0.12em] text-cyan transition-colors hover:bg-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 sm:col-auto"
            >
              VIEW PROJECTS
            </a>
            <a
              href={identity.links.resume}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center justify-center border border-line-faint bg-ink-900/70 px-5 font-mono text-xs font-semibold tracking-[0.12em] text-paper transition-colors hover:border-cyan/70 hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
            >
              RESUME ↗
            </a>
            <a
              href="#comms"
              className="flex min-h-11 items-center justify-center border border-line-faint bg-ink-900/70 px-5 font-mono text-xs font-semibold tracking-[0.12em] text-paper transition-colors hover:border-cyan/70 hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
            >
              CONTACT
            </a>
          </nav>

          {/* stat strip */}
          <div className="hero-anim mt-6 grid max-w-2xl grid-cols-2 gap-px border border-line-faint bg-line-faint sm:grid-cols-4">
            {proofStats.map((s) => (
              <div
                key={s.label}
                className="bg-ink-900/80 px-3 py-2.5 backdrop-blur sm:px-3.5"
              >
                <div className="min-h-6 font-display text-xl font-semibold leading-6 text-cyan glow-cyan">
                  {s.value}
                </div>
                <div className="tech-label mt-0.5 text-[0.58rem] leading-[1.25]">
                  {s.label}
                </div>
              </div>
            ))}
            <HeroPublicReposMetric />
          </div>
        </div>

        {/* CSS chooses the layout before hydration; the hook only gates the globe's work. */}
        <div className="hero-anim w-full md:hidden">
          <CapabilityMatrix compact />
        </div>
        <HeroDesktopSystem />
      </div>

      {/* scroll cue */}
      <div className="hero-anim absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex [@media(max-height:700px)]:hidden">
        <span className="tech-label">DESCEND THROUGH THE SYSTEM</span>
        <span className="h-8 w-px animate-pulse bg-gradient-to-b from-cyan to-transparent" />
      </div>
    </section>
  );
}
