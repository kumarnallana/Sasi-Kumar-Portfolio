"use client";

import { useState } from "react";
import SmoothScroll from "@/core/scroll/SmoothScroll";
import BootSequence from "@/core/shell/BootSequence";
import HudFrame from "@/core/shell/HudFrame";
import DepthNav from "@/core/navigation/DepthNav";
import ScrollSnap from "@/core/navigation/ScrollSnap";
import Hero from "@/modules/hero/components/Hero";
import Operations from "@/modules/operations/components/Operations";
import Approach from "@/modules/approach/components/Approach";
import Projects from "@/modules/projects/components/Projects";
import OpenSource from "@/modules/open-source/components/OpenSource";
import About from "@/modules/about/components/About";
import Contact from "@/modules/contact/components/Contact";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <SmoothScroll>
      {/* fixed console backdrop - grid + edge vignette stay put while content scrolls */}
      <div className="pointer-events-none fixed inset-0 -z-10 blueprint-grid" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--ink-900)_100%)]" />

      <BootSequence onDone={() => setBooted(true)} />
      <HudFrame />
      <DepthNav />
      <ScrollSnap />

      <main className="relative">
        <Hero started={booted} />
        <Operations />
        <Approach />
        <Projects />
        <OpenSource />
        <About />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
