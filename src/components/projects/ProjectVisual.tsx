"use client";

import { useState, useRef, useEffect } from "react";
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
  architectureFlow?: ArchitectureStage[];
}

// Each stage produces: node + (connector before it if index > 0)
// Item indices for stagger:
//   node 0        → itemIndex 0  → delay 0ms
//   connector 0→1 → itemIndex 1  → delay 120ms
//   node 1        → itemIndex 2  → delay 220ms
//   connector 1→2 → itemIndex 3  → delay 340ms
//   node 2        → itemIndex 4  → delay 440ms
//   connector 2→3 → itemIndex 5  → delay 560ms
//   node 3        → itemIndex 6  → delay 660ms
// Animation duration 150ms ⇒ total ≈ 810ms ✓
const STAGGER_MS = 120;

function getItemDelay(stageIndex: number, isConnector: boolean) {
  // itemIndex: node at stage i = 2*i, connector before stage i = 2*i - 1
  const itemIndex = isConnector ? 2 * stageIndex - 1 : 2 * stageIndex;
  return itemIndex * STAGGER_MS;
}

export default function ProjectVisual({
  name,
  image,
  liveUrl,
  architectureFlow,
}: ProjectVisualProps) {
  // ARCHITECTURE is the default desktop tab
  const [activeTab, setActiveTab] = useState<"ARCHITECTURE" | "PREVIEW">(
    "ARCHITECTURE"
  );
  const [assembled, setAssembled] = useState(false);
  const isMobile = useIsMobile();
  // Compute the effective panel to display — mobile always shows PREVIEW
  // regardless of tab state, preventing a blank flash during hydration.
  const effectiveView = isMobile ? "PREVIEW" : activeTab;
  const containerRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);

  // One-time scroll-triggered assembly
  useEffect(() => {
    if (isMobile) return;

    // Respect prefers-reduced-motion: show immediately, no animation
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setAssembled(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAssembled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  // Keyboard navigation for tablist
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!tablistRef.current) return;
    const tabs = Array.from(
      tablistRef.current.querySelectorAll('[role="tab"]')
    ) as HTMLButtonElement[];
    const currentIndex = tabs.findIndex(
      (tab) => tab.getAttribute("aria-selected") === "true"
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

  return (
    <div
      ref={containerRef}
      className="group relative flex w-full flex-col overflow-hidden border border-line-faint bg-ink-900/60"
    >
      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <div className="flex h-10 items-center border-b border-line-faint bg-ink-900/80">
        {/* Mobile: simple label only */}
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

        {/* Desktop: ARCHITECTURE | PREVIEW — architecture first */}
        {!isMobile && (
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Project Views"
            className="hidden w-full h-full md:flex"
          >
            {/* ARCHITECTURE tab */}
            <button
              role="tab"
              aria-selected={activeTab === "ARCHITECTURE"}
              aria-controls="panel-architecture"
              id="tab-architecture"
              tabIndex={activeTab === "ARCHITECTURE" ? 0 : -1}
              onClick={() => {
                if (activeTab !== "ARCHITECTURE") sound.play("blip");
                setActiveTab("ARCHITECTURE");
              }}
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

            <div className="w-px h-full bg-line-faint" />

            {/* PREVIEW tab */}
            <button
              role="tab"
              aria-selected={activeTab === "PREVIEW"}
              aria-controls="panel-preview"
              id="tab-preview"
              tabIndex={activeTab === "PREVIEW" ? 0 : -1}
              onClick={() => {
                if (activeTab !== "PREVIEW") sound.play("blip");
                setActiveTab("PREVIEW");
              }}
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
          </div>
        )}
      </div>

      {/* ── Viewport shell ──────────────────────────────────────────────── */}
      <div className="relative flex aspect-video w-full bg-ink-900 overflow-hidden">

        {/* ARCHITECTURE PANEL — not mounted on mobile */}
        {!isMobile && (
          <div
            id="panel-architecture"
            role="tabpanel"
            aria-labelledby="tab-architecture"
            className={`absolute inset-0 w-full h-full flex-col items-center justify-center px-10 py-6 ${
              activeTab === "ARCHITECTURE" ? "flex" : "hidden"
            }`}
          >
            {/* Subtle grid background */}
            <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-10" />

            {/* Architecture flow */}
            <div className="relative flex flex-col items-center w-full max-w-xs">
              {architectureFlow?.map((stage, index) => (
                <div
                  key={stage.label}
                  className="flex flex-col items-center w-full"
                >
                  {/* Connector line + arrowhead before node (except first) */}
                  {index > 0 && (
                    <div
                      className="flex flex-col items-center my-1.5"
                      style={{
                        opacity: assembled ? 1 : 0,
                        transform: assembled ? "none" : "scaleY(0)",
                        transformOrigin: "top",
                        transition: assembled
                          ? `opacity 120ms ease ${getItemDelay(index, true)}ms, transform 120ms ease ${getItemDelay(index, true)}ms`
                          : "none",
                      }}
                    >
                      <div className="w-px h-5 bg-line-dim/60" />
                      <div className="w-1.5 h-1.5 border-r border-b border-line-dim/60 rotate-45 -mt-1" />
                    </div>
                  )}

                  {/* Stage node */}
                  <div
                    className="w-full flex flex-col items-center border border-line-faint bg-ink-900/90 px-5 py-3 hover:border-cyan/40 transition-colors duration-200"
                    style={{
                      opacity: assembled ? 1 : 0,
                      transform: assembled
                        ? "translateY(0)"
                        : "translateY(6px)",
                      transition: assembled
                        ? `opacity 150ms ease ${getItemDelay(index, false)}ms, transform 150ms ease ${getItemDelay(index, false)}ms`
                        : "none",
                    }}
                  >
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-cyan">
                      {stage.label}
                    </span>
                    <span className="mt-1 font-mono text-[0.7rem] text-paper-dim">
                      {stage.stack}
                    </span>
                  </div>
                </div>
              ))}

              {(!architectureFlow || architectureFlow.length === 0) && (
                <div className="text-center font-mono text-xs text-line-dim">
                  Architecture flow not defined
                </div>
              )}
            </div>
          </div>
        )}

        {/* PREVIEW PANEL — always available */}
        <div
          id="panel-preview"
          role="tabpanel"
          aria-labelledby="tab-preview"
          className={`absolute inset-0 w-full h-full ${
            // effectiveView guarantees mobile always gets PREVIEW,
            // independent of which desktop tab was last active.
            effectiveView === "PREVIEW" ? "flex" : "hidden"
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
              {/* Live site CTA — only for projects with a verified URL */}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.play("blip")}
                  className="absolute inset-0 flex items-center justify-center bg-ink-900/0 opacity-0 transition-all duration-300 ease-out group-hover/preview:bg-ink-900/55 group-hover/preview:opacity-100 focus-visible:opacity-100 focus-visible:bg-ink-900/55"
                  aria-label={`View ${name} live site`}
                >
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper border border-paper/30 px-4 py-2 bg-ink-900/60 transition-colors hover:text-cyan hover:border-cyan">
                    VIEW LIVE SITE ↗
                  </span>
                </a>
              )}
            </div>
          ) : (
            <div className="relative flex h-full w-full items-center justify-center bg-ink-900 overflow-hidden">
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

        {/* Tab-switch fade overlay — purely cosmetic, runs once per switch */}
        <div
          className="pointer-events-none absolute inset-0 bg-ink-900"
          style={{ opacity: 0, transition: "opacity 250ms ease" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
