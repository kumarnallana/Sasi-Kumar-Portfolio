"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { sound } from "@/lib/sound";
import { ProjectProduct, ArchitectureStep, ProofItem } from "@/types/projects/project.types";
import { gsap } from "gsap";

type Tab = "PRODUCT" | "ARCHITECTURE" | "PROOF";

export default function ProjectEvidenceViewer({
  product,
  architecture,
  proof,
}: {
  product?: ProjectProduct;
  architecture?: ArchitectureStep[];
  proof?: ProofItem[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("PRODUCT");
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Handle tab switching with sound and basic state update
  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    sound.play("blip");
    setActiveTab(tab);
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

    // Architecture specific animation (connector draws ~300-500ms)
    if (activeTab === "ARCHITECTURE") {
      const nodes = el.querySelectorAll(".arch-node");
      const connectors = el.querySelectorAll(".arch-connector");
      
      gsap.set(nodes, { opacity: 0 });
      gsap.set(connectors, { opacity: 0 });

      const tl = gsap.timeline();
      
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
      <div className="flex w-full overflow-x-auto border-b border-line-faint scrollbar-hide">
        {(["PRODUCT", "ARCHITECTURE", "PROOF"] as Tab[]).map((tab) => {
          // Only show tabs if the data exists
          if (tab === "PRODUCT" && !product) return null;
          if (tab === "ARCHITECTURE" && (!architecture || architecture.length === 0)) return null;
          if (tab === "PROOF" && (!proof || proof.length === 0)) return null;

          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              onMouseEnter={() => sound.play("hover")}
              className={`flex-1 min-w-[120px] px-4 py-3 font-mono text-[0.65rem] uppercase tracking-wider transition-colors outline-none focus-visible:ring-1 focus-visible:ring-cyan ${
                isActive
                  ? "bg-line-faint/30 text-cyan border-b-2 border-cyan"
                  : "text-paper-dim hover:bg-ink-800 hover:text-paper"
              }`}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Visual Area with stable min-height */}
      <div className="relative min-h-[300px] md:min-h-[400px] p-4 md:p-6" ref={contentRef} role="tabpanel">
        
        {/* PRODUCT VIEW */}
        {activeTab === "PRODUCT" && product && (
          <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
            <div className="relative w-full aspect-video overflow-hidden rounded border border-line-faint bg-ink-950">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                className="object-cover object-top opacity-90 transition-transform duration-1000 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {product.caption && (
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
                <div className="font-display text-sm text-paper mb-1">{item.title}</div>
                <p className="text-xs text-paper-dim leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}
