"use client";

import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ArchitectureStage {
  label: string;
  stack: string;
}

interface ProjectArchitectureProps {
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
      className="z-10 flex w-full max-w-[180px] flex-col items-center justify-center border border-line-faint bg-ink-900 px-3 py-2 shadow-lg transition-all"
      style={{
        opacity: assembled ? 1 : 0,
        transform: assembled ? "translateY(0)" : "translateY(8px)",
        transition: assembled
          ? `opacity 250ms ease ${delay}ms, transform 250ms ease ${delay}ms`
          : "none",
        animation: assembled ? `node-activate 400ms ease ${delay}ms` : "none",
      }}
    >
      <span className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.16em] text-cyan text-center">
        {stage.label}
      </span>
      <span className="mt-1 break-words text-center font-mono text-[0.6rem] leading-snug text-paper-dim">
        {stage.stack}
      </span>
    </div>
  );
}

function ArchPath({
  d,
  assembled,
  isVisible,
  delay,
  duration = 200,
  flowDuration = 2000,
}: {
  d: string;
  assembled: boolean;
  isVisible: boolean;
  delay: number;
  duration?: number;
  flowDuration?: number;
}) {
  return (
    <g>
      {/* Base structural layer */}
      <path
        d={d}
        pathLength="100"
        strokeDasharray="100"
        strokeDashoffset={assembled ? 0 : 100}
        className="stroke-cyan/20 stroke-[1.5px] fill-none"
        style={{
          vectorEffect: "non-scaling-stroke",
          transition: assembled
            ? `stroke-dashoffset ${duration}ms linear ${delay}ms`
            : "none",
        }}
      />
      {/* Moving signal layer */}
      <path
        d={d}
        pathLength="100"
        strokeDasharray="2 6"
        className="stroke-cyan stroke-[1.5px] fill-none"
        style={{
          vectorEffect: "non-scaling-stroke",
          opacity: assembled && isVisible ? 0.7 : 0,
          animation: assembled && isVisible 
            ? `flow-telemetry ${flowDuration}ms linear ${assembled ? delay + duration : 0}ms infinite` 
            : "none",
          transition: "opacity 400ms ease",
        }}
      />
    </g>
  );
}

export default function ProjectArchitecture({
  architectureVariant,
  architectureFlow,
}: ProjectArchitectureProps) {
  const [assembled, setAssembled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !assembled) {
          if (prefersReducedMotion.current) {
            setAssembled(true);
          } else {
            setAssembled(true);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile, assembled]);

  if (isMobile || !architectureVariant || !architectureFlow || architectureFlow.length === 0) {
    return null;
  }

  const renderLinear = () => (
    <div className="relative w-full grid grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-1 gap-y-8 place-items-center h-[220px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 md:hidden"
      >
        <ArchPath d="M 50 16.6 L 50 50" assembled={assembled} isVisible={isVisible} delay={200} />
        <ArchPath d="M 50 50 L 50 83.3" assembled={assembled} isVisible={isVisible} delay={600} />
      </svg>
      {/* Desktop horizontal SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
      >
        <ArchPath d="M 16.6 50 L 50 50" assembled={assembled} isVisible={isVisible} delay={200} flowDuration={2400} />
        <ArchPath d="M 50 50 L 83.3 50" assembled={assembled} isVisible={isVisible} delay={600} flowDuration={2400} />
      </svg>
      
      <div className="flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={400} /></div>
      <div className="flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={800} /></div>
    </div>
  );

  const renderBranch = () => (
    <div className="relative w-full grid grid-cols-2 grid-rows-3 place-items-center h-[260px] md:h-[280px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <ArchPath d="M 50 16.6 L 50 50" assembled={assembled} isVisible={isVisible} delay={200} duration={200} />
        {/* Branching Outwards */}
        <ArchPath d="M 50 50 L 50 66.6 L 25 66.6" assembled={assembled} isVisible={isVisible} delay={600} duration={150} flowDuration={1800} />
        <ArchPath d="M 50 50 L 50 66.6 L 75 66.6" assembled={assembled} isVisible={isVisible} delay={600} duration={150} flowDuration={1800} />
        <ArchPath d="M 25 66.6 L 25 83.3" assembled={assembled} isVisible={isVisible} delay={750} duration={100} flowDuration={1400} />
        <ArchPath d="M 75 66.6 L 75 83.3" assembled={assembled} isVisible={isVisible} delay={750} duration={100} flowDuration={1400} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={400} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={850} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[3]} assembled={assembled} delay={850} /></div>
    </div>
  );

  const renderSplitConverge = () => (
    <div className="relative w-full grid grid-cols-2 grid-rows-3 place-items-center h-[280px] md:h-[310px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        {/* Splitting Outwards */}
        <ArchPath d="M 50 16.6 L 50 33.3 L 25 33.3" assembled={assembled} isVisible={isVisible} delay={150} duration={150} />
        <ArchPath d="M 50 16.6 L 50 33.3 L 75 33.3" assembled={assembled} isVisible={isVisible} delay={150} duration={150} />
        <ArchPath d="M 25 33.3 L 25 50" assembled={assembled} isVisible={isVisible} delay={300} duration={100} flowDuration={1400} />
        <ArchPath d="M 75 33.3 L 75 50" assembled={assembled} isVisible={isVisible} delay={300} duration={100} flowDuration={1400} />
        
        {/* Converging Inwards */}
        <ArchPath d="M 25 50 L 25 66.6 L 50 66.6" assembled={assembled} isVisible={isVisible} delay={600} duration={150} flowDuration={1800} />
        <ArchPath d="M 75 50 L 75 66.6 L 50 66.6" assembled={assembled} isVisible={isVisible} delay={600} duration={150} flowDuration={1800} />
        <ArchPath d="M 50 66.6 L 50 83.3" assembled={assembled} isVisible={isVisible} delay={750} duration={100} flowDuration={1400} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={400} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={400} /></div>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[3]} assembled={assembled} delay={850} /></div>
    </div>
  );

  return (
    <div className="w-full relative" ref={containerRef}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flow-telemetry {
          to { stroke-dashoffset: -8; }
        }
        @keyframes node-activate {
          0% { border-color: var(--color-line-faint); box-shadow: none; }
          30% { border-color: var(--color-cyan); box-shadow: 0 0 12px rgba(67, 201, 255, 0.25); }
          100% { border-color: var(--color-line-faint); box-shadow: none; }
        }
      `}} />
      <div className="tech-label mb-6 flex items-center justify-between text-cyan border-t border-line-faint/50 pt-8">
        <span>SYS.ARCHITECTURE</span>
      </div>
      
      <div className="relative w-full">
        {architectureVariant === "linear" && renderLinear()}
        {architectureVariant === "branch" && renderBranch()}
        {architectureVariant === "split-converge" && renderSplitConverge()}
      </div>
    </div>
  );
}
