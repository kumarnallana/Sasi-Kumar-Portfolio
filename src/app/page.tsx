"use client";

import { useState } from "react";
import SmoothScroll from "@/components/scroll/SmoothScroll";
import BootSequence from "@/components/shell/BootSequence";
import HudFrame from "@/components/shell/HudFrame";
import DepthNav from "@/components/navigation/DepthNav";
import ScrollSnap from "@/components/navigation/ScrollSnap";
import Hero from "@/components/hero/Hero";
import Operations from "@/components/operations/Operations";
import Approach from "@/components/approach/Approach";
import Projects from "@/components/projects/Projects";
import OpenSource from "@/components/open-source/OpenSource";
import About from "@/components/about/About";
import Contact from "@/components/contact/Contact";

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
