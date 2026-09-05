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
  architectureFlow?: ArchitectureStage[];
}

// Stagger timing for 3 stages:
//   node 0:        0ms
//   connector 0→1: 110ms
//   node 1:        200ms
//   connector 1→2: 310ms
//   node 2:        400ms
// Animation duration ~150ms → total ≈ 550ms ✓
const NODE_STAGGER = 200;      // ms between nodes
const CONNECTOR_OFFSET = 110;  // ms after previous node

function nodeDelay(index: number) {
  return index * NODE_STAGGER;
}

function connectorDelay(index: number) {
  // connector before node[index] (index > 0)
  return (index - 1) * NODE_STAGGER + CONNECTOR_OFFSET;
}

export default function ProjectVisual({
  name,
  image,
  liveUrl,
  architectureFlow,
}: ProjectVisualProps) {
  // PREVIEW is the default — real screenshot is primary evidence
  const [activeTab, setActiveTab] = useState<"PREVIEW" | "ARCHITECTURE">("PREVIEW");

  // assembled stays true permanently after first Architecture open — no replay
  const [assembled, setAssembled] = useState(false);

  const isMobile = useIsMobile();

  // effectiveView: mobile always shows PREVIEW regardless of tab state
  const effectiveView = isMobile ? "PREVIEW" : activeTab;

  const tablistRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion once (stable across renders)
  const prefersReducedMotion = useRef<boolean>(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // Trigger one-time assembly when ARCHITECTURE is first opened
  const openArchitecture = useCallback(() => {
    if (activeTab === "ARCHITECTURE") return;
    sound.play("blip");
    setActiveTab("ARCHITECTURE");
    if (!assembled) {
      // Reduced-motion: show immediately; otherwise let CSS stagger run
      if (prefersReducedMotion.current) {
        setAssembled(true);
      } else {
        // Small rAF so the panel is painted before transitions start
        requestAnimationFrame(() => setAssembled(true));
      }
    }
  }, [activeTab, assembled]);

  const openPreview = useCallback(() => {
    if (activeTab === "PREVIEW") return;
    sound.play("blip");
    setActiveTab("PREVIEW");
  }, [activeTab]);

  // Keyboard navigation
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

  return (
    <div className="relative flex w-full flex-col overflow-hidden border border-line-faint bg-ink-900/60">

      {/* ── Tab bar ────────────────────────────────────────────────── */}
      <div className="flex h-10 shrink-0 items-center border-b border-line-faint bg-ink-900/80">

        {/* Mobile: label only, no tabs */}
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

        {/* Desktop: PREVIEW | ARCHITECTURE — preview first */}
        {!isMobile && (
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Project Views"
            className="hidden w-full h-full md:flex"
          >
            {/* PREVIEW tab */}
            <button
              role="tab"
              id="tab-preview"
              aria-selected={activeTab === "PREVIEW"}
              aria-controls="panel-preview"
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

            {/* ARCHITECTURE tab */}
            <button
              role="tab"
              id="tab-architecture"
              aria-selected={activeTab === "ARCHITECTURE"}
              aria-controls="panel-architecture"
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
      <div className="relative flex aspect-video w-full min-w-0 overflow-hidden bg-ink-900">

        {/* ── PREVIEW PANEL ──────────────────────────────────────── */}
        <div
          id="panel-preview"
          role="tabpanel"
          aria-labelledby="tab-preview"
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            effectiveView === "PREVIEW" ? "flex opacity-100" : "hidden opacity-0"
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
              {/* Live site CTA — shown only for verified deployments */}
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
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-20" />
              <div className="relative flex flex-col items-center justify-center text-center px-4">
                <span className="font-display text-xl font-semibold text-paper-dim/80">{name}</span>
                <span className="mt-2 text-xs font-mono text-paper-dim/50">
                  Preview image not yet available
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── ARCHITECTURE PANEL — not mounted on mobile ─────────── */}
        {!isMobile && (
          <div
            id="panel-architecture"
            role="tabpanel"
            aria-labelledby="tab-architecture"
            className={`absolute inset-0 w-full h-full flex-col items-center justify-center px-6 py-5 transition-opacity duration-300 ${
              effectiveView === "ARCHITECTURE" ? "flex opacity-100" : "hidden opacity-0"
            }`}
          >
            {/* Subtle grid backdrop */}
            <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-10" />

            {/* Three-stage vertical flow — uses full available width, never clips */}
            <div className="relative flex w-full min-w-0 flex-col items-stretch gap-0">
              {architectureFlow?.map((stage, index) => (
                <div key={stage.label} className="flex min-w-0 flex-col items-center">

                  {/* Connector + arrowhead before every node except the first */}
                  {index > 0 && (
                    <div
                      className="flex flex-col items-center py-1"
                      style={{
                        opacity: assembled ? 1 : 0,
                        transform: assembled ? "scaleY(1)" : "scaleY(0)",
                        transformOrigin: "top",
                        transition: assembled
                          ? `opacity 120ms ease ${connectorDelay(index)}ms, transform 120ms ease ${connectorDelay(index)}ms`
                          : "none",
                      }}
                    >
                      <div className="w-px h-4 bg-line-dim/60" />
                      <div className="h-1.5 w-1.5 rotate-45 border-b border-r border-line-dim/60 -mt-0.5" />
                    </div>
                  )}

                  {/* Stage node — full width, never fixed */}
                  <div
                    className="w-full min-w-0 flex flex-col items-center border border-line-faint bg-ink-900/90 px-4 py-3 hover:border-cyan/30 transition-colors duration-200"
                    style={{
                      opacity: assembled ? 1 : 0,
                      transform: assembled ? "translateY(0)" : "translateY(8px)",
                      transition: assembled
                        ? `opacity 150ms ease ${nodeDelay(index)}ms, transform 150ms ease ${nodeDelay(index)}ms`
                        : "none",
                    }}
                  >
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-cyan">
                      {stage.label}
                    </span>
                    <span className="mt-1 font-mono text-[0.65rem] text-paper-dim text-center leading-snug break-words">
                      {stage.stack}
                    </span>
                  </div>
                </div>
              ))}

              {(!architectureFlow || architectureFlow.length === 0) && (
                <p className="text-center font-mono text-xs text-line-dim">
                  Architecture flow not defined
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
