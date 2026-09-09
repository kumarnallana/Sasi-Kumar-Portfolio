"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/sound";
import { scrollToSection } from "@/lib/lenis";
import { NAV_SECTIONS as SECTIONS } from "@/lib/sections";

// the navigation IS the depth axis - each section is a station at its true
// scroll depth, so spacing itself reads as a schematic of the descent.
type Pt = { id: string; label: string; frac: number };
type SectionId = (typeof SECTIONS)[number]["id"];

const MOBILE_LABELS: Record<SectionId, string> = {
  operations: "Operations",
  principles: "Principles",
  systems: "Projects",
  signals: "Open Source",
  profile: "Profile",
  comms: "Contact",
};

export default function DepthNav() {
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pts, setPts] = useState<Pt[]>(() =>
    SECTIONS.map((s, i) => ({ ...s, frac: (i + 1) / (SECTIONS.length + 1) })),
  );

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const denom = max > 0 ? max : 1;
      setPts(
        SECTIONS.map((s) => {
          const el = document.getElementById(s.id);
          const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
          return { ...s, frac: Math.max(0, Math.min(1, top / denom)) };
        }),
      );
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0);
    };

    measure();
    onScroll();
    // re-measure after late layout shifts (fonts, the 3D canvas, images)
    const t1 = setTimeout(measure, 400);
    const t2 = setTimeout(measure, 1400);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  // active = the deepest station we've descended past (-1 = still at the hero)
  let active = -1;
  for (let i = 0; i < pts.length; i++) {
    if (progress + 0.02 >= pts[i].frac) active = i;
  }

  const go = (id: string) => {
    sound.play("blip");
    setMobileOpen(false);
    scrollToSection(id);
  };

  const currentMobileLabel = active >= 0
    ? MOBILE_LABELS[pts[active].id as SectionId]
    : "Overview";

  return (
    <>
      {/* ---- desktop: the depth axis is the nav ---- */}
      <div className="pointer-events-none fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        <button
          onClick={() => go("operations")}
          className="tech-label pointer-events-auto [writing-mode:vertical-rl] text-paper-dim transition-colors hover:text-cyan"
        >
          DEPTH
        </button>

        <div className="relative h-[58vh] max-h-[560px] w-px bg-line-faint">
          {/* descent progress fill */}
          <div
            className="absolute left-0 top-0 w-px bg-cyan"
            style={{ height: `${progress * 100}%` }}
          />

          {/* section stations */}
          {pts.map((p, i) => {
            const isActive = i === active;
            return (
              <div
                key={p.id}
                className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${p.frac * 100}%` }}
              >
                <span
                  className={`tech-label pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap text-[0.6rem] transition-all duration-200 ${
                    isActive
                      ? "translate-x-0 text-cyan opacity-100"
                      : "-translate-x-1 text-paper-dim opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                  }`}
                >
                  {p.label}
                </span>
                <button
                  onClick={() => go(p.id)}
                  onMouseEnter={() => sound.play("hover")}
                  aria-label={p.label}
                  className="pointer-events-auto -m-2 block rounded-full p-2"
                >
                  <span
                    className={`block h-1.5 w-1.5 rounded-full border transition-all ${
                      isActive
                        ? "scale-125 border-cyan bg-cyan shadow-[0_0_8px_var(--cyan)]"
                        : "border-line-dim bg-ink-900 group-hover:border-cyan"
                    }`}
                  />
                </button>
              </div>
            );
          })}

          {/* you-are-here marker rides the axis */}
          <div
            className="pointer-events-none absolute -left-[3.5px] z-10 h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]"
            style={{ top: `calc(${progress * 100}% - 4px)` }}
          />
        </div>

        <span className="tech-label tabular-nums text-cyan">
          {String(Math.round(progress * 100)).padStart(3, "0")}
        </span>
      </div>

      {/* ---- mobile: labeled section menu with phone-sized touch targets ---- */}
      <nav
        aria-label="Section navigation"
        className={`pointer-events-auto fixed inset-x-4 z-50 md:hidden ${
          mobileOpen
            ? "bottom-[calc(4rem+env(safe-area-inset-bottom))]"
            : "bottom-[calc(1rem+env(safe-area-inset-bottom))]"
        }`}
      >
        <div className={`mx-auto w-full ${mobileOpen ? "max-w-sm" : "max-w-[13rem]"}`}>
          {mobileOpen && (
            <div
              id="mobile-section-menu"
              className="mb-2 border border-line-faint bg-ink-900/95 p-2 shadow-[0_0_30px_rgba(0,0,0,0.55)] backdrop-blur"
            >
              <div className="tech-label px-2 pb-2 pt-1 text-[0.55rem] text-paper-dim">
                JUMP TO SECTION
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => go("top")}
                  aria-label="Go to Overview"
                  aria-current={active === -1 ? "page" : undefined}
                  className={`col-span-2 flex min-h-11 items-center justify-between border px-3 text-left transition-colors ${
                    active === -1
                      ? "border-cyan bg-cyan/10 text-cyan"
                      : "border-line-faint text-paper hover:border-cyan/60"
                  }`}
                >
                  <span className="tech-label text-[0.55rem]">00</span>
                  <span className="font-display text-sm">Overview</span>
                </button>
                {pts.map((p, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => go(p.id)}
                      aria-label={`Go to ${MOBILE_LABELS[p.id as SectionId]}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-11 items-center justify-between gap-2 border px-3 text-left transition-colors ${
                        isActive
                          ? "border-cyan bg-cyan/10 text-cyan"
                          : "border-line-faint text-paper hover:border-cyan/60"
                      }`}
                    >
                      <span className="tech-label text-[0.55rem]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-sm">
                        {MOBILE_LABELS[p.id as SectionId]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-section-menu"
            aria-label={mobileOpen ? "Close section navigation" : "Open section navigation"}
            className="flex min-h-12 w-full items-center justify-between border border-line-faint bg-ink-900/95 px-4 text-left shadow-[0_0_24px_rgba(0,0,0,0.45)] backdrop-blur"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
              <span className="truncate font-display text-sm text-paper">
                {currentMobileLabel}
              </span>
            </span>
            <span className="tech-label shrink-0 text-[0.55rem] text-cyan">
              {mobileOpen ? "CLOSE" : "MENU"}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
