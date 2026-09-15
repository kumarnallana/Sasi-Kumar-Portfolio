"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import HeroStackGlobe from "@/components/stack-story/three/HeroStackGlobe";
import { stackStory } from "@/data/stack-story/stack-story.data";

const StackStory = dynamic(
  () => import("@/components/stack-story/StackStory"),
  { ssr: false },
);

const STACK_LEN = stackStory.layers.length;
const STACK_MAX = STACK_LEN - 1;

export default function HeroDesktopSystemInner() {
  const [storyOpen, setStoryOpen] = useState(false);
  const activeRef = useRef(STACK_MAX);

  useEffect(() => {
    activeRef.current = storyOpen ? -1.2 : STACK_MAX;
  }, [storyOpen]);

  return (
    <>
      <div className="hero-globe group relative hidden h-[42vh] min-h-[320px] w-full md:block lg:h-[78vh]">
        <HeroStackGlobe activeRef={activeRef} onOpen={() => setStoryOpen(true)} />
        <div className="pointer-events-none absolute inset-0 grid-vignette" />
        <div className="pointer-events-none absolute left-3 top-3 tech-label text-cyan/70">STACK GRAPH · ONLINE</div>
        <div className="pointer-events-none absolute right-3 top-3 tech-label text-paper-dim">
          {String(STACK_LEN).padStart(2, "0")} LAYERS · LIVE
        </div>
        <button
          onClick={() => setStoryOpen(true)}
          className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap border border-cyan/40 bg-ink-900/80 px-3 py-1.5 backdrop-blur transition-all duration-300 hover:border-cyan hover:bg-cyan/10 hover:shadow-[0_0_12px_rgba(67,201,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
          aria-label="Explore the stack story"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
          <span className="tech-label text-[0.55rem] text-cyan">DOUBLE-TAP GLOBE OR CLICK TO EXPLORE STACK</span>
        </button>
      </div>
      {storyOpen && <StackStory open onClose={() => setStoryOpen(false)} />}
    </>
  );
}
