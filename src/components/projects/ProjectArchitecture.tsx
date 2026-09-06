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

function useTransactionScheduler(isVisible: boolean, assembled: boolean, prefersReducedMotion: boolean) {
  const [phase, setPhase] = useState<number>(-1);

  useEffect(() => {
    if (!isVisible || !assembled || prefersReducedMotion) {
      setPhase(-1);
      return;
    }

    let isSubscribed = true;
    let timer: NodeJS.Timeout;

    const runCycle = async () => {
      // Small initial delay before starting loops
      await new Promise((r) => { timer = setTimeout(r, 400); });
      
      while (isSubscribed) {
        setPhase(0); // Phase 1 Tracers
        await new Promise((r) => { timer = setTimeout(r, 800); });
        if (!isSubscribed) break;
        
        setPhase(1); // Phase 2 Tracers + Phase 1 Node Arrival
        await new Promise((r) => { timer = setTimeout(r, 800); });
        if (!isSubscribed) break;
        
        setPhase(2); // Idle + Phase 2 Node Arrival
        await new Promise((r) => { timer = setTimeout(r, 1000); });
      }
    };

    runCycle();

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [isVisible, assembled, prefersReducedMotion]);

  return phase;
}

function ArchNode({
  stage,
  assembled,
  delay,
  isArriving,
}: {
  stage: ArchitectureStage;
  assembled: boolean;
  delay: number;
  isArriving?: boolean;
}) {
  if (!stage) return null;
  return (
    <div
      className="z-10 flex w-full max-w-[180px] flex-col items-center justify-center border border-line-faint bg-ink-900 px-3 py-2 shadow-lg transition-all duration-300"
      style={{
        opacity: assembled ? 1 : 0,
        transform: assembled ? "translateY(0)" : "translateY(8px)",
        transition: assembled
          ? `opacity 250ms ease ${delay}ms, transform 250ms ease ${delay}ms`
          : "none",
        animation: isArriving ? "node-arrival 250ms ease-out" : "none",
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

function ArchEdge({
  d,
  assembled,
  isActive,
  delay,
  duration = 200,
}: {
  d: string;
  assembled: boolean;
  isActive: boolean;
  delay: number;
  duration?: number;
}) {
  return (
    <g>
      {/* Layer A: Base Blueprint Path */}
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
      {/* Layer C: Transaction Tracer */}
      <path
        d={d}
        pathLength="100"
        strokeDasharray="8 100"
        className="stroke-cyan stroke-[2px] fill-none"
        style={{
          vectorEffect: "non-scaling-stroke",
          opacity: isActive ? 1 : 0,
          strokeDashoffset: isActive ? -100 : 8,
          transition: isActive ? "stroke-dashoffset 800ms linear, opacity 100ms ease" : "none",
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
          setAssembled(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile, assembled]);

  const phase = useTransactionScheduler(isVisible, assembled, prefersReducedMotion.current);

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
        <ArchEdge d="M 50 16.6 L 50 50" assembled={assembled} isActive={phase === 0} delay={200} />
        <ArchEdge d="M 50 50 L 50 83.3" assembled={assembled} isActive={phase === 1} delay={600} />
      </svg>
      {/* Desktop horizontal SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
      >
        <ArchEdge d="M 16.6 50 L 50 50" assembled={assembled} isActive={phase === 0} delay={200} />
        <ArchEdge d="M 50 50 L 83.3 50" assembled={assembled} isActive={phase === 1} delay={600} />
      </svg>
      
      <div className="flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={400} isArriving={phase === 1} /></div>
      <div className="flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={800} isArriving={phase === 2} /></div>
    </div>
  );

  const renderBranch = () => (
    <div className="relative w-full grid grid-cols-2 grid-rows-3 place-items-center h-[260px] md:h-[280px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <ArchEdge d="M 50 16.6 L 50 50" assembled={assembled} isActive={phase === 0} delay={200} duration={200} />
        {/* Branching Outwards */}
        <ArchEdge d="M 50 50 L 50 66.6 L 25 66.6 L 25 83.3" assembled={assembled} isActive={phase === 1} delay={600} duration={250} />
        <ArchEdge d="M 50 50 L 50 66.6 L 75 66.6 L 75 83.3" assembled={assembled} isActive={phase === 1} delay={600} duration={250} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={400} isArriving={phase === 1} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={850} isArriving={phase === 2} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[3]} assembled={assembled} delay={850} isArriving={phase === 2} /></div>
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
        <ArchEdge d="M 50 16.6 L 50 33.3 L 25 33.3 L 25 50" assembled={assembled} isActive={phase === 0} delay={150} duration={250} />
        <ArchEdge d="M 50 16.6 L 50 33.3 L 75 33.3 L 75 50" assembled={assembled} isActive={phase === 0} delay={150} duration={250} />
        
        {/* Converging Inwards */}
        <ArchEdge d="M 25 50 L 25 66.6 L 50 66.6 L 50 83.3" assembled={assembled} isActive={phase === 1} delay={600} duration={250} />
        <ArchEdge d="M 75 50 L 75 66.6 L 50 66.6 L 50 83.3" assembled={assembled} isActive={phase === 1} delay={600} duration={250} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={400} isArriving={phase === 1} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={400} isArriving={phase === 1} /></div>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[3]} assembled={assembled} delay={850} isArriving={phase === 2} /></div>
    </div>
  );

  return (
    <div className="w-full relative" ref={containerRef}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes node-arrival {
          0% { border-color: var(--color-cyan); box-shadow: 0 0 12px rgba(67, 201, 255, 0.4); }
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
