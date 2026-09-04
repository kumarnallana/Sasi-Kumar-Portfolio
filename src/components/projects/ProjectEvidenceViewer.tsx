"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { sound } from "@/lib/sound";
import { ProjectProduct, ArchitectureStep, ProofItem } from "@/types/projects/project.types";
import { gsap } from "gsap";

type Tab = "PRODUCT" | "ARCHITECTURE" | "PROOF";

export default function ProjectEvidenceViewer({
  projectIndex,
  product,
  architecture,
  proof,
}: {
  projectIndex: number;
  product?: ProjectProduct;
  architecture?: ArchitectureStep[];
  proof?: ProofItem[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("PRODUCT");
  const contentRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const archAnimated = useRef(false);

  // Generate unique IDs for accessibility
  const baseId = `evidence-${projectIndex}`;
  const tabIds = {
    PRODUCT: `${baseId}-tab-product`,
    ARCHITECTURE: `${baseId}-tab-arch`,
    PROOF: `${baseId}-tab-proof`,
  };
  const panelIds = {
    PRODUCT: `${baseId}-panel-product`,
    ARCHITECTURE: `${baseId}-panel-arch`,
    PROOF: `${baseId}-panel-proof`,
  };
  
  // Handle tab switching with sound and basic state update
  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    sound.play("blip");
    setActiveTab(tab);
  };

  // Handle keyboard navigation for tabs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentTab: Tab) => {
    const tabs: Tab[] = [];
    if (product) tabs.push("PRODUCT");
    if (architecture && architecture.length > 0) tabs.push("ARCHITECTURE");
    if (proof && proof.length > 0) tabs.push("PROOF");

    const currentIndex = tabs.indexOf(currentTab);
    let nextIndex = currentIndex;

    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = tabs[nextIndex];
    handleTabChange(nextTab);

    // Focus the next tab
    if (tabListRef.current) {
      const nextButton = tabListRef.current.querySelector<HTMLButtonElement>(`#${tabIds[nextTab]}`);
      nextButton?.focus();
    }
  };

  // Animate content on tab change
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reset animations
    gsap.killTweensOf(el.children);
    
    if (prefersReducedMotion) {
      gsap.set(el.children, { opacity: 1, y: 0 });
      if (activeTab === "ARCHITECTURE") {
        const connectors = el.querySelectorAll(".arch-connector");
        gsap.set(connectors, { opacity: 1, width: "100%", height: "100%" });
      }
      return;
    }

    // Base panel reveal (250-400ms)
    gsap.fromTo(
      el.children,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.05 }
    );

    // Architecture specific animation
    if (activeTab === "ARCHITECTURE") {
      const nodes = el.querySelectorAll(".arch-node");
      const connectors = el.querySelectorAll(".arch-connector");
      
      if (archAnimated.current) {
        gsap.set(nodes, { opacity: 1 });
        gsap.set(connectors, { opacity: 1, scaleX: 1, scaleY: 1 });
        return;
      }

      gsap.set(nodes, { opacity: 0 });
      gsap.set(connectors, { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          archAnimated.current = true;
        }
      });
      
      nodes.forEach((node, i) => {
        // Node appears
        tl.to(node, { opacity: 1, duration: 0.2, ease: "power2.out" });
        
        // Connector draws (if not the last node)
        if (i < connectors.length) {
          const connector = connectors[i] as HTMLElement;
          // Determine if it's horizontal (desktop) or vertical (mobile)
          const isDesktop = window.innerWidth >= 768;
          
          tl.fromTo(
            connector,
            { opacity: 1, scaleX: isDesktop ? 0 : 1, scaleY: isDesktop ? 1 : 0, transformOrigin: isDesktop ? "left center" : "top center" },
            { scaleX: 1, scaleY: 1, duration: 0.35, ease: "power2.inOut" }
          );
        }
      });
    }
  }, [activeTab]);

  return (
    <div className="flex w-full flex-col border border-line-faint bg-ink-900/40">
      
      {/* Evidence Tabs */}
      <div 
        ref={tabListRef}
        role="tablist" 
        aria-label="Project Evidence Modes"
        className="flex w-full overflow-x-auto border-b border-line-faint scrollbar-hide"
      >
        {(["PRODUCT", "ARCHITECTURE", "PROOF"] as Tab[]).map((tab) => {
          // Only show tabs if the data exists
          if (tab === "PRODUCT" && !product) return null;
          if (tab === "ARCHITECTURE" && (!architecture || architecture.length === 0)) return null;
          if (tab === "PROOF" && (!proof || proof.length === 0)) return null;

          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              id={tabIds[tab]}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelIds[tab]}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabChange(tab)}
              onKeyDown={(e) => handleKeyDown(e, tab)}
              onMouseEnter={() => sound.play("hover")}
              className={`flex-1 min-w-[120px] px-4 py-3 font-mono text-[0.65rem] uppercase tracking-wider transition-colors outline-none focus-visible:ring-1 focus-visible:ring-cyan ${
                isActive
                  ? "bg-line-faint/30 text-cyan border-b-2 border-cyan"
                  : "text-paper-dim hover:bg-ink-800 hover:text-paper"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Visual Area with content-aware sizing */}
      <div 
        ref={contentRef} 
        id={panelIds[activeTab]}
        role="tabpanel"
        aria-labelledby={tabIds[activeTab]}
        tabIndex={0}
        className="relative min-h-[250px] w-full p-4 md:p-6 outline-none focus-visible:ring-1 focus-visible:ring-cyan"
      >
        
        {/* PRODUCT VIEW */}
        {activeTab === "PRODUCT" && product && (
          <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
            <div className="relative w-full aspect-[16/10] md:aspect-video overflow-hidden rounded border border-line-faint bg-ink-950 flex flex-col items-center justify-center">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  className="object-cover object-top opacity-90 transition-transform duration-300 hover:scale-[1.015]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 text-paper-dim/60">
                  <span className="font-display text-xl font-semibold text-paper mb-2">{product.alt}</span>
                  <span className="tech-label text-[0.65rem] tracking-widest text-cyan/70">
                    {product.caption || "PRODUCT PREVIEW"}
                  </span>
                </div>
              )}
            </div>
            {product.caption && product.image && (
              <div className="tech-label text-center text-[0.65rem] text-cyan">
                {product.caption}
              </div>
            )}
          </div>
        )}

        {/* ARCHITECTURE VIEW */}
        {activeTab === "ARCHITECTURE" && architecture && (
          <div className="flex h-full w-full flex-col items-center justify-center py-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-start w-full justify-center max-w-3xl mx-auto gap-2 md:gap-0">
              {architecture.map((step, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center md:items-start w-full md:w-auto">
                  
                  {/* Node */}
                  <div className="arch-node flex w-full md:w-48 flex-col border border-line-faint bg-ink-900 px-4 py-3 text-center md:text-left z-10">
                    <span className="tech-label text-[0.55rem] text-cyan mb-1">{step.label}</span>
                    <span className="font-display text-sm font-semibold text-paper mb-2">{step.title}</span>
                    <ul className="flex flex-wrap justify-center md:justify-start gap-1">
                      {step.details.map((detail, j) => (
                        <li key={j} className="text-[0.6rem] text-paper-dim/80 bg-ink-950 px-1.5 py-0.5 rounded-sm">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Connector (Except last item) */}
                  {i < architecture.length - 1 && (
                    <div className="arch-connector flex items-center justify-center my-2 md:my-0 md:mx-2 w-px h-6 md:w-8 md:h-px bg-cyan md:mt-6 shrink-0 opacity-0" />
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROOF VIEW */}
        {activeTab === "PROOF" && proof && (
          <div className="grid h-full w-full grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max items-start">
            {proof.map((item, i) => (
              <div key={i} className="flex flex-col border border-line-faint bg-ink-900/50 p-4 transition-colors hover:border-cyan/50">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display text-2xl font-semibold text-cyan">{item.value}</span>
                  <span className="tech-label text-[0.6rem] text-paper-dim/70 uppercase">{item.label}</span>
                </div>
                <p className="text-xs text-paper-dim leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}
