"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";
import { useIsMobile } from "@/hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

// Suppress known upstream library deprecation warnings outside user control (e.g. R3F's THREE.Clock deprecation)
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("THREE.Clock: This module has been deprecated")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile(false);

  useEffect(() => {
    // If mobile detection isn't finished yet, assume nothing
    if (isMobile === null) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Completely destroy and disable on mobile or if reduced motion is preferred
    if (reduce || isMobile) {
      setLenis(null);
      return;
    }

    // Clean up legacy #architect anchor if present in URL bar
    if (typeof window !== "undefined" && window.location.hash === "#architect") {
      window.history.replaceState(null, "", "#profile");
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    setLenis(lenis);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [isMobile]);

  return <>{children}</>;
}
