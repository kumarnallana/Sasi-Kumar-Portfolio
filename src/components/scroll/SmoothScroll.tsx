"use client";

import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Clean up legacy #architect anchor if present in URL bar
    if (typeof window !== "undefined" && window.location.hash === "#architect") {
      window.history.replaceState(null, "", "#profile");
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void Promise.all([
      import("lenis"),
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.07,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        syncTouch: false,
        autoResize: true,
        allowNestedScroll: false,
        gestureOrientation: "vertical",
      });
      lenis.on("scroll", ScrollTrigger.update);
      setLenis(lenis);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        setLenis(null);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
