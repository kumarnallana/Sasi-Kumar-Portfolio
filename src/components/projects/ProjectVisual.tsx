"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { sound } from "@/lib/sound";

interface ArchitectureStage {
  label: string;
  stack: string;
}

interface ProjectVisualProps {
  name: string;
  image?: string;
  architectureFlow?: ArchitectureStage[];
}

export default function ProjectVisual({ name, image, architectureFlow }: ProjectVisualProps) {
  const [activeTab, setActiveTab] = useState<"PREVIEW" | "ARCHITECTURE">("PREVIEW");
  
  // Ref for tablist to manage keyboard navigation
  const tablistRef = useRef<HTMLDivElement>(null);
  
  // Focus management for accessible tabs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!tablistRef.current) return;
    const tabs = Array.from(tablistRef.current.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
    const currentIndex = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
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
    <div className="group relative flex w-full flex-col overflow-hidden border border-line-faint bg-ink-900/60">
      
      {/* Top Bar with Tabs (Hidden on mobile < 768px) */}
      <div className="flex h-10 items-center border-b border-line-faint bg-ink-900/80">
        
        {/* Mobile-only header (simple) */}
        <div className="flex w-full items-center px-3 md:hidden">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-line-faint transition-colors duration-300" />
            <div className="h-2 w-2 rounded-full bg-line-faint transition-colors duration-300" />
            <div className="h-2 w-2 rounded-full bg-line-faint transition-colors duration-300" />
          </div>
          <div className="ml-3 flex-1 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper-dim/50">
            SYS.PREVIEW
          </div>
        </div>

        {/* Desktop-only Tablist */}
        <div 
          ref={tablistRef}
          role="tablist" 
          aria-label="Project Views"
          className="hidden w-full h-full md:flex"
        >
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
          
          <div className="w-px h-full bg-line-faint" />
          
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
        </div>
      </div>

      {/* Common Viewport Shell */}
      <div className="relative flex aspect-video w-full items-center justify-center bg-ink-900 overflow-hidden">
        
        {/* PREVIEW PANEL */}
        <div
          id="panel-preview"
          role="tabpanel"
          aria-labelledby="tab-preview"
          className={`absolute inset-0 w-full h-full md:flex ${activeTab === "PREVIEW" ? "flex" : "hidden md:hidden"}`}
        >
          {image ? (
            <Image
              src={image}
              alt={`${name} preview`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top opacity-90 transition-all duration-500 ease-out hover:scale-[1.02] hover:opacity-100"
            />
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

        {/* ARCHITECTURE PANEL */}
        <div
          id="panel-architecture"
          role="tabpanel"
          aria-labelledby="tab-architecture"
          // Always hidden on mobile via CSS, toggled by state on desktop
          className={`absolute inset-0 w-full h-full hidden md:${activeTab === "ARCHITECTURE" ? "flex" : "hidden"} flex-col justify-center px-8 py-6`}
        >
          <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-10" />
          
          <div className="relative flex flex-col justify-between h-full w-full max-w-sm mx-auto">
            {architectureFlow?.map((stage, index) => (
              <div key={stage.label} className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: `${index * 100}ms` }}>
                
                {/* Connector from previous stage */}
                {index > 0 && (
                  <div className="flex flex-col items-center justify-center h-4 my-2">
                    <div className="w-px h-full bg-line-dim/50" />
                    <div className="w-1.5 h-1.5 border-r border-b border-line-dim/50 rotate-45 transform translate-y-[-2px]" />
                  </div>
                )}
                
                {/* Stage Node */}
                <div className="w-full flex flex-col items-center justify-center border border-line-faint bg-ink-900/80 px-4 py-2.5 hover:border-line-dim transition-colors">
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-cyan">
                    {stage.label}
                  </span>
                  <span className="mt-1 font-display text-xs text-paper-dim">
                    {stage.stack}
                  </span>
                </div>
              </div>
            ))}
            
            {(!architectureFlow || architectureFlow.length === 0) && (
              <div className="m-auto text-center font-mono text-xs text-line-dim">
                Architecture flow not defined
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
