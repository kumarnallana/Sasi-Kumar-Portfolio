"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { sound } from "@/lib/sound";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ArchitectureStage {
  label: string;
  stack: string;
}

interface ProjectVisualProps {
  name: string;
  image?: string;
  liveUrl?: string;
  architectureVariant?: "linear" | "branch" | "split-converge";
  architectureFlow?: ArchitectureStage[];
}

function ArchNode({
  stage,
  assembled,
  delay,
}: {
  stage: ArchitectureStage;
  assembled: boolean;
  delay: number;
}) {
  if (!stage) return null;
  return (
    <div
      className="z-10 flex w-[180px] max-w-full flex-col items-center justify-center border border-line-faint bg-ink-900 px-4 py-3 shadow-lg transition-colors duration-200 hover:border-cyan/30"
      style={{
        opacity: assembled ? 1 : 0,
        transform: assembled ? "translateY(0)" : "translateY(8px)",
        transition: assembled
          ? `opacity 250ms ease ${delay}ms, transform 250ms ease ${delay}ms`
          : "none",
      }}
    >
      <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-cyan text-center">
        {stage.label}
      </span>
      <span className="mt-1 break-words text-center font-mono text-[0.65rem] leading-snug text-paper-dim">
        {stage.stack}
      </span>
    </div>
  );
}

function ArchPath({
  d,
  assembled,
  delay,
  duration = 200,
}: {
  d: string;
  assembled: boolean;
  delay: number;
  duration?: number;
}) {
  return (
    <path
      d={d}
      pathLength="100"
      strokeDasharray="100"
      strokeDashoffset={assembled ? 0 : 100}
      className="stroke-cyan/50 stroke-[1.5px] fill-none"
      style={{
        vectorEffect: "non-scaling-stroke",
        transition: assembled
          ? `stroke-dashoffset ${duration}ms linear ${delay}ms`
          : "none",
      }}
    />
  );
}

export default function ProjectVisual({
  name,
  image,
  liveUrl,
  architectureVariant = "linear",
  architectureFlow = [],
}: ProjectVisualProps) {
  const [activeTab, setActiveTab] = useState<"PREVIEW" | "ARCHITECTURE">("PREVIEW");
  const [assembled, setAssembled] = useState(false);
  const isMobile = useIsMobile();

  const effectiveView = isMobile ? "PREVIEW" : activeTab;
  const tablistRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useRef<boolean>(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  const openArchitecture = useCallback(() => {
    if (activeTab === "ARCHITECTURE") return;
    sound.play("blip");
    setActiveTab("ARCHITECTURE");
    if (!assembled) {
      if (prefersReducedMotion.current) {
        setAssembled(true);
      } else {
        requestAnimationFrame(() => setAssembled(true));
      }
    }
  }, [activeTab, assembled]);

  const openPreview = useCallback(() => {
    if (activeTab === "PREVIEW") return;
    sound.play("blip");
    setActiveTab("PREVIEW");
  }, [activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!tablistRef.current) return;
    const tabs = Array.from(
      tablistRef.current.querySelectorAll('[role="tab"]')
    ) as HTMLButtonElement[];
    const currentIndex = tabs.findIndex(
      (t) => t.getAttribute("aria-selected") === "true"
    );
    let nextIndex = currentIndex;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  };

  const renderLinear = () => (
    <div className="relative w-full h-full grid grid-cols-1 grid-rows-3 gap-y-8 place-items-center">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <ArchPath d="M 50 16.6 L 50 50" assembled={assembled} delay={200} />
        <ArchPath d="M 50 50 L 50 83.3" assembled={assembled} delay={600} />
      </svg>
      <div className="flex justify-center items-center h-full w-full"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="flex justify-center items-center h-full w-full"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={400} /></div>
      <div className="flex justify-center items-center h-full w-full"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={800} /></div>
    </div>
  );

  const renderBranch = () => (
    <div className="relative w-full h-full grid grid-cols-2 grid-rows-3 gap-y-8 gap-x-4 place-items-center">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        {/* CLIENT to API */}
        <ArchPath d="M 50 16.6 L 50 50" assembled={assembled} delay={200} duration={200} />
        {/* API stem down */}
        <ArchPath d="M 50 50 L 50 66.6" assembled={assembled} delay={600} duration={100} />
        {/* Horizontal left and right */}
        <ArchPath d="M 50 66.6 L 25 66.6" assembled={assembled} delay={700} duration={100} />
        <ArchPath d="M 50 66.6 L 75 66.6" assembled={assembled} delay={700} duration={100} />
        {/* Vertical down to AUTH and DATA */}
        <ArchPath d="M 25 66.6 L 25 83.3" assembled={assembled} delay={800} duration={150} />
        <ArchPath d="M 75 66.6 L 75 83.3" assembled={assembled} delay={800} duration={150} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full h-full"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="col-span-2 flex justify-center items-center w-full h-full"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={400} /></div>
      <div className="col-span-1 flex justify-center items-center w-full h-full"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={950} /></div>
      <div className="col-span-1 flex justify-center items-center w-full h-full"><ArchNode stage={architectureFlow[3]} assembled={assembled} delay={950} /></div>
    </div>
  );

  const renderSplitConverge = () => (
    <div className="relative w-full h-full grid grid-cols-2 grid-rows-3 gap-y-8 gap-x-4 place-items-center">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        {/* PRODUCT stem down */}
        <ArchPath d="M 50 16.6 L 50 33.3" assembled={assembled} delay={150} duration={100} />
        {/* Horizontal left and right */}
        <ArchPath d="M 50 33.3 L 25 33.3" assembled={assembled} delay={250} duration={100} />
        <ArchPath d="M 50 33.3 L 75 33.3" assembled={assembled} delay={250} duration={100} />
        {/* Vertical down to INTERACTION and STATE */}
        <ArchPath d="M 25 33.3 L 25 50" assembled={assembled} delay={350} duration={100} />
        <ArchPath d="M 75 33.3 L 75 50" assembled={assembled} delay={350} duration={100} />
        
        {/* Vertical down from INTERACTION and STATE */}
        <ArchPath d="M 25 50 L 25 66.6" assembled={assembled} delay={650} duration={100} />
        <ArchPath d="M 75 50 L 75 66.6" assembled={assembled} delay={650} duration={100} />
        {/* Convergence horizontal */}
        <ArchPath d="M 25 66.6 L 50 66.6" assembled={assembled} delay={750} duration={100} />
        <ArchPath d="M 75 66.6 L 50 66.6" assembled={assembled} delay={750} duration={100} />
        {/* Stem down to VERIFICATION */}
        <ArchPath d="M 50 66.6 L 50 83.3" assembled={assembled} delay={850} duration={100} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full h-full"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="col-span-1 flex justify-center items-center w-full h-full"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={450} /></div>
      <div className="col-span-1 flex justify-center items-center w-full h-full"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={450} /></div>
      <div className="col-span-2 flex justify-center items-center w-full h-full"><ArchNode stage={architectureFlow[3]} assembled={assembled} delay={950} /></div>
    </div>
  );

  return (
    <div className="relative flex w-full flex-col overflow-hidden border border-line-faint bg-ink-900/60">
      {/* ── Tab bar ────────────────────────────────────────────────── */}
      <div className="flex h-10 shrink-0 items-center border-b border-line-faint bg-ink-900/80">
        <div className="flex w-full items-center px-3 md:hidden">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-line-faint" />
            <div className="h-2 w-2 rounded-full bg-line-faint" />
            <div className="h-2 w-2 rounded-full bg-line-faint" />
          </div>
          <div className="ml-3 flex-1 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper-dim/50">
            SYS.PREVIEW
          </div>
        </div>

        {!isMobile && (
          <div
            ref={tablistRef}
            role="tablist"
            className="hidden w-full h-full md:flex"
          >
            <button
              role="tab"
              id="tab-preview"
              aria-selected={activeTab === "PREVIEW"}
              tabIndex={activeTab === "PREVIEW" ? 0 : -1}
              onClick={openPreview}
              onMouseEnter={() => sound.play("hover")}
              onKeyDown={handleKeyDown}
              className={`flex-1 flex items-center justify-center font-mono text-[0.6rem] uppercase tracking-[0.15em] transition-colors focus:outline-none focus-visible:bg-ink-800 ${
                activeTab === "PREVIEW"
                  ? "text-cyan border-b-2 border-cyan bg-ink-900/50"
                  : "text-paper-dim/50 border-b-2 border-transparent hover:text-paper-dim hover:bg-ink-900/20"
              }`}
            >
              PREVIEW
            </button>
            <div className="w-px h-full bg-line-faint" />
            <button
              role="tab"
              id="tab-architecture"
              aria-selected={activeTab === "ARCHITECTURE"}
              tabIndex={activeTab === "ARCHITECTURE" ? 0 : -1}
              onClick={openArchitecture}
              onMouseEnter={() => sound.play("hover")}
              onKeyDown={handleKeyDown}
              className={`flex-1 flex items-center justify-center font-mono text-[0.6rem] uppercase tracking-[0.15em] transition-colors focus:outline-none focus-visible:bg-ink-800 ${
                activeTab === "ARCHITECTURE"
                  ? "text-cyan border-b-2 border-cyan bg-ink-900/50"
                  : "text-paper-dim/50 border-b-2 border-transparent hover:text-paper-dim hover:bg-ink-900/20"
              }`}
            >
              ARCHITECTURE
            </button>
          </div>
        )}
      </div>

      {/* ── Viewport shell ─────────────────────────────────────────── */}
      <div className="relative flex w-full min-w-0 bg-ink-900 transition-[height] duration-300">
        
        {/* ── PREVIEW PANEL ──────────────────────────────────────── */}
        <div
          id="panel-preview"
          role="tabpanel"
          className={`relative aspect-video w-full h-full transition-opacity duration-300 ${
            effectiveView === "PREVIEW" ? "flex opacity-100 z-10" : "opacity-0 absolute inset-0 pointer-events-none"
          }`}
        >
          {image ? (
            <div className="group/preview relative w-full h-full">
              <Image
                src={image}
                alt={`${name} preview`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top opacity-90 transition-all duration-300 ease-out group-hover/preview:scale-[1.01] group-hover/preview:opacity-100"
              />
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.play("blip")}
                  className="absolute inset-0 flex items-center justify-center bg-ink-900/0 opacity-0 transition-all duration-300 ease-out group-hover/preview:bg-ink-900/55 group-hover/preview:opacity-100 focus-visible:opacity-100 focus-visible:bg-ink-900/55"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper border border-paper/30 px-4 py-2 bg-ink-900/60 transition-colors hover:text-cyan hover:border-cyan">
                    VIEW LIVE SITE ↗
                  </span>
                </a>
              )}
            </div>
          ) : (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-20" />
              <div className="relative flex flex-col items-center justify-center text-center px-4">
                <span className="font-display text-xl font-semibold text-paper-dim/80">
                  {name}
                </span>
                <span className="mt-2 text-xs font-mono text-paper-dim/50">
                  Preview image not yet available
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── ARCHITECTURE PANEL ─────────────────────────────────── */}
        {!isMobile && (
          <div
            id="panel-architecture"
            role="tabpanel"
            className={`w-full transition-opacity duration-300 ${
              effectiveView === "ARCHITECTURE" ? "flex opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
            } md:min-h-[360px] lg:min-h-[420px] xl:min-h-[440px]`}
          >
            <div className="absolute inset-0 pointer-events-none blueprint-grid opacity-10" />
            <div className="relative w-full h-full px-6 py-6 flex flex-col justify-center">
              {architectureVariant === "linear" && renderLinear()}
              {architectureVariant === "branch" && renderBranch()}
              {architectureVariant === "split-converge" && renderSplitConverge()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
