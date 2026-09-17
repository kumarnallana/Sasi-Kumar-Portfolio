import SmoothScroll from "@/components/scroll/SmoothScroll";
import BootSequence from "@/components/shell/BootSequence";
import HudFrame from "@/components/shell/HudFrame";
import DepthNav from "@/components/navigation/DepthNav";
import Hero from "@/components/hero/Hero";
import DeferredSections from "@/components/shell/DeferredSections";
import QueryProvider from "@/providers/query-provider";

export default function Home() {
  return (
    <SmoothScroll>
      {/* fixed console backdrop - grid + edge vignette stay put while content scrolls */}
      <div className="pointer-events-none fixed inset-0 -z-10 blueprint-grid" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--ink-900)_100%)]" />

      <BootSequence />
      <HudFrame />
      <DepthNav />

      <QueryProvider>
        <main className="relative">
          <Hero />
          <DeferredSections />
        </main>
      </QueryProvider>
    </SmoothScroll>
  );
}
