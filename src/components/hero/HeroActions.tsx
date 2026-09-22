"use client";

import { identity } from "@/data/profile/profile.data";
import { scrollToSection } from "@/lib/lenis";
import { sound } from "@/lib/sound";

export default function HeroActions() {
  return (
    <nav aria-label="Recruiter actions" className="hero-anim mt-6 grid max-w-xl grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <a
        href="#systems"
        onClick={(event) => {
          event.preventDefault();
          sound.play("skill-confirm");
          scrollToSection("systems", { updateHash: true });
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && sound.play("hover")}
        className="col-span-2 flex min-h-11 items-center justify-center border border-cyan bg-cyan/10 px-5 font-mono text-xs font-semibold tracking-[0.12em] text-cyan transition-colors hover:bg-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 sm:col-auto"
      >
        VIEW PROJECTS
      </a>
      <a
        href={identity.links.resume}
        target="_blank"
        rel="noreferrer"
        onClick={() => sound.play("skill-confirm")}
        onPointerEnter={(e) => e.pointerType === "mouse" && sound.play("hover")}
        className="flex min-h-11 items-center justify-center border border-line-faint bg-ink-900/70 px-5 font-mono text-xs font-semibold tracking-[0.12em] text-paper transition-colors hover:border-cyan/70 hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
      >
        RESUME ↗
      </a>
      <a
        href="#comms"
        onClick={(event) => {
          event.preventDefault();
          sound.play("skill-confirm");
          scrollToSection("comms", { updateHash: true });
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && sound.play("hover")}
        className="flex min-h-11 items-center justify-center border border-line-faint bg-ink-900/70 px-5 font-mono text-xs font-semibold tracking-[0.12em] text-paper transition-colors hover:border-cyan/70 hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
      >
        CONTACT
      </a>
    </nav>
  );
}
