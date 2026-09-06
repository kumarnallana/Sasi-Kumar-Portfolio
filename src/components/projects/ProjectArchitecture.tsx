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
      className="z-10 flex w-full max-w-[180px] flex-col items-center justify-center border border-line-faint bg-ink-900 px-3 py-2 shadow-lg transition-colors duration-200 hover:border-cyan/30"
      style={{
        opacity: assembled ? 1 : 0,
        transform: assembled ? "translateY(0)" : "translateY(8px)",
        transition: assembled
          ? `opacity 250ms ease ${delay}ms, transform 250ms ease ${delay}ms`
          : "none",
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

export default function ProjectArchitecture({
  architectureVariant,
  architectureFlow,
}: ProjectArchitectureProps) {
  const [assembled, setAssembled] = useState(false);
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
        if (entry.isIntersecting) {
          if (prefersReducedMotion.current) {
            setAssembled(true);
          } else {
            setAssembled(true);
          }
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile]);

  if (isMobile || !architectureVariant || !architectureFlow || architectureFlow.length === 0) {
    return null;
  }

  const renderLinear = () => (
    <div className="relative w-full grid grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-1 gap-y-8 place-items-center h-[220px]">
      {/* Mobile vertical SVG (failsafe since isMobile usually catches it) */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 md:hidden"
      >
        <ArchPath d="M 50 16.6 L 50 50" assembled={assembled} delay={200} />
        <ArchPath d="M 50 50 L 50 83.3" assembled={assembled} delay={600} />
      </svg>
      {/* Desktop horizontal SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
      >
        <ArchPath d="M 16.6 50 L 50 50" assembled={assembled} delay={200} />
        <ArchPath d="M 50 50 L 83.3 50" assembled={assembled} delay={600} />
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
        <ArchPath d="M 50 16.6 L 50 50" assembled={assembled} delay={200} duration={200} />
        <ArchPath d="M 50 50 L 50 66.6" assembled={assembled} delay={600} duration={100} />
        <ArchPath d="M 50 66.6 L 25 66.6" assembled={assembled} delay={700} duration={100} />
        <ArchPath d="M 50 66.6 L 75 66.6" assembled={assembled} delay={700} duration={100} />
        <ArchPath d="M 25 66.6 L 25 83.3" assembled={assembled} delay={800} duration={150} />
        <ArchPath d="M 75 66.6 L 75 83.3" assembled={assembled} delay={800} duration={150} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={400} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={950} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[3]} assembled={assembled} delay={950} /></div>
    </div>
  );

  const renderSplitConverge = () => (
    <div className="relative w-full grid grid-cols-2 grid-rows-3 place-items-center h-[280px] md:h-[310px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <ArchPath d="M 50 16.6 L 50 33.3" assembled={assembled} delay={150} duration={100} />
        <ArchPath d="M 50 33.3 L 25 33.3" assembled={assembled} delay={250} duration={100} />
        <ArchPath d="M 50 33.3 L 75 33.3" assembled={assembled} delay={250} duration={100} />
        <ArchPath d="M 25 33.3 L 25 50" assembled={assembled} delay={350} duration={100} />
        <ArchPath d="M 75 33.3 L 75 50" assembled={assembled} delay={350} duration={100} />
        
        <ArchPath d="M 25 50 L 25 66.6" assembled={assembled} delay={650} duration={100} />
        <ArchPath d="M 75 50 L 75 66.6" assembled={assembled} delay={650} duration={100} />
        <ArchPath d="M 25 66.6 L 50 66.6" assembled={assembled} delay={750} duration={100} />
        <ArchPath d="M 75 66.6 L 50 66.6" assembled={assembled} delay={750} duration={100} />
        <ArchPath d="M 50 66.6 L 50 83.3" assembled={assembled} delay={850} duration={100} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} assembled={assembled} delay={0} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} assembled={assembled} delay={450} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} assembled={assembled} delay={450} /></div>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[3]} assembled={assembled} delay={950} /></div>
    </div>
  );

  return (
    <div className="w-full relative" ref={containerRef}>
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
