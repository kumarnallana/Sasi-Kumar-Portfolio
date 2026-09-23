"use client";

import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Clean up legacy #architect anchor if present in URL bar
    if (typeof window !== "undefined" && window.location.hash === "#architect") {
      window.history.replaceState(null, "", "#profile");
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let startToken = 0;

    const stop = () => {
      startToken += 1;
      cleanup?.();
      cleanup = undefined;
    };

    const start = async () => {
      if (cleanup || motionPreference.matches) return;
      const token = ++startToken;
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || motionPreference.matches || token !== startToken) return;

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
    };

    const syncMotionPreference = () => {
      if (motionPreference.matches) {
        stop();
      } else {
        void start();
      }
    };

    motionPreference.addEventListener("change", syncMotionPreference);
    syncMotionPreference();

    return () => {
      cancelled = true;
      motionPreference.removeEventListener("change", syncMotionPreference);
      stop();
    };
  }, []);

  return <>{children}</>;
}
