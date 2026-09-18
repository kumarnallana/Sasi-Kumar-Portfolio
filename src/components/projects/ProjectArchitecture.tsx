"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ArchitectureStage {
  label: string;
  stack: string;
}

interface ProjectArchitectureProps {
  architectureVariant?: "linear" | "branch" | "split-converge";
  architectureFlow?: ArchitectureStage[];
}

// The original connector stays untouched. Only its exposed span carries a packet.
// Sampling in screen pixels also keeps speed/packet length steady across the
// non-uniformly scaled SVG viewBox, without changing any layout coordinates.
function traceSpan(path: SVGPathElement, source: HTMLElement, target: HTMLElement) {
  const matrix = path.getScreenCTM();
  if (!matrix) return [];
  const length = path.getTotalLength();
  const sourceBox = source.getBoundingClientRect();
  const targetBox = target.getBoundingClientRect();
  const inside = (x: number, y: number, box: DOMRect) =>
    x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
  const points: { x: number; y: number; distance: number }[] = [];
  let previous: DOMPoint | undefined;
  let distance = 0;
  for (let i = 0; i <= 300; i++) {
    const point = path.getPointAtLength(length * i / 300);
    const screen = point.matrixTransform(matrix);
    if (inside(screen.x, screen.y, sourceBox)) continue;
    if (inside(screen.x, screen.y, targetBox)) break;
    if (previous) distance += Math.hypot(screen.x - previous.x, screen.y - previous.y);
    points.push({ x: point.x, y: point.y, distance });
    previous = screen;
  }
  return points;
}

function paintTracer(tracer: SVGPathElement, points: ReturnType<typeof traceSpan>, progress: number) {
  if (points.length < 2) return;
  const length = points[points.length - 1].distance;
  const size = Math.min(12, length * 0.35);
  const start = (length - size) * progress;
  const end = start + size;
  const at = (distance: number) => {
    if (distance >= length) return points[points.length - 1];
    const index = points.findIndex(point => point.distance >= distance);
    if (index <= 0) return points[0];
    const before = points[index - 1];
    const after = points[index];
    const ratio = (distance - before.distance) / (after.distance - before.distance);
    return { x: before.x + (after.x - before.x) * ratio, y: before.y + (after.y - before.y) * ratio };
  };
  const first = at(start);
  const last = at(end);
  const middle = points.filter(point => point.distance > start && point.distance < end);
  tracer.setAttribute("d", `M ${first.x} ${first.y} ${[...middle, last].map(point => `L ${point.x} ${point.y}`).join(" ")}`);
}

function ArchNode({
  stage,
  id,
  delay,
}: {
  stage: ArchitectureStage;
  id: number;
  delay: number;
}) {
  if (!stage) return null;
  return (
    <div
      data-arch-node={id}
      data-assembly-delay={delay}
      className="z-10 flex w-full max-w-[180px] flex-col items-center justify-center border border-line-faint bg-ink-900 px-3 py-2 shadow-lg transition-all duration-300"
      style={{ transition: "none" }}
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
  source,
  target,
  phase,
  delay,
  duration = 200,
}: {
  d: string;
  source: number;
  target: number;
  phase: number;
  delay: number;
  duration?: number;
}) {
  return (
    <g data-arch-edge data-source={source} data-target={target} data-phase={phase}>
      <path
        d={d}
        data-arch-base
        data-assembly-delay={delay}
        data-assembly-duration={duration}
        className="stroke-cyan/20 stroke-[1.5px] fill-none"
        style={{ vectorEffect: "non-scaling-stroke" }}
      />
      <path
        data-arch-tracer
        d=""
        fill="none"
        stroke="var(--cyan-bright, #7fe0ff)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ vectorEffect: "non-scaling-stroke", opacity: 0 }}
      />
    </g>
  );
}

export default function ProjectArchitecture({
  architectureVariant,
  architectureFlow,
}: ProjectArchitectureProps) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const assembledRef = useRef(false);

  useLayoutEffect(() => {
    const root = containerRef.current;
    // The shared hook initially defaults to desktop; do not start a mobile
    // observer or timeline while it resolves the actual viewport.
    if (!root || isMobile || window.innerWidth < 768) return;
    const media = gsap.matchMedia();
    media.add({
      reduce: "(prefers-reduced-motion: reduce)",
      motion: "(prefers-reduced-motion: no-preference)",
    }, context => {
      const nodes = [...root.querySelectorAll<HTMLElement>("[data-arch-node]")];
      const bases = [...root.querySelectorAll<SVGPathElement>("[data-arch-base]")];
      const tracers = [...root.querySelectorAll<SVGPathElement>("[data-arch-tracer]")];
      if (context.conditions?.reduce) {
        gsap.set(nodes, { opacity: 1 });
        bases.forEach(base => {
           const len = base.getTotalLength();
           gsap.set(base, { strokeDasharray: len, strokeDashoffset: 0 });
        });
        gsap.set(tracers, { opacity: 0 });
        assembledRef.current = true;
        root.dataset.assembled = "true";
        root.dataset.playback = "static";
        root.dataset.phase = "idle";
        return;
      }

      let edges: {
        base: SVGPathElement;
        tracer: SVGPathElement;
        source: HTMLElement;
        target: HTMLElement;
        phase: number;
        points: ReturnType<typeof traceSpan>;
        position: { value: number };
        ready: boolean;
      }[] = [];

      const discoverEdges = () => {
        edges = [...root.querySelectorAll<SVGGElement>("[data-arch-edge]")]
          .filter(edge => (edge.ownerSVGElement?.getBoundingClientRect().width ?? 0) > 0)
          .map(edge => {
            const base = edge.querySelector<SVGPathElement>("[data-arch-base]")!;
            const tracer = edge.querySelector<SVGPathElement>("[data-arch-tracer]")!;
            const source = nodes.find(node => node.dataset.archNode === edge.dataset.source)!;
            const target = nodes.find(node => node.dataset.archNode === edge.dataset.target)!;
            // Retain existing position if already discovered
            const existing = edges.find(e => e.base === base);
            return {
              base,
              tracer,
              source,
              target,
              phase: Number(edge.dataset.phase),
              points: traceSpan(base, source, target),
              position: existing ? existing.position : { value: 0 },
              ready: true,
            };
          });
      };

      const measure = () => {
        discoverEdges();
        edges.forEach(edge => {
          if (edge.ready) paintTracer(edge.tracer, edge.points, edge.position.value);
        });
      };

      const transaction = gsap.timeline({ repeat: -1, paused: true });
      for (const phase of [0, 1]) {
        // We defer active edge resolution to the callbacks, so it picks up dynamically discovered edges
        transaction
          .set(root, { attr: { "data-phase": String(phase) } })
          .call(() => {
            const active = edges.filter(edge => edge.phase === phase);
            active.forEach(edge => {
              edge.position.value = 0;
              if (edge.ready) paintTracer(edge.tracer, edge.points, 0);
            });
            gsap.set(active.map(edge => edge.tracer), { opacity: 1 });
          })
          .to({}, {
            duration: 0.95,
            ease: "none",
            onUpdate: function() {
              const active = edges.filter(edge => edge.phase === phase);
              active.forEach(edge => {
                edge.position.value = this.progress();
                if (edge.ready) paintTracer(edge.tracer, edge.points, edge.position.value);
              });
            }
          })
          .call(() => {
            const active = edges.filter(edge => edge.phase === phase);
            gsap.set(active.map(edge => edge.tracer), { opacity: 0 });
            
            const destinations = [...new Set(active.map(edge => edge.target))];
            const original = destinations.map(node => ({
              borderColor: getComputedStyle(node).borderColor,
              boxShadow: getComputedStyle(node).boxShadow,
            }));
            
            gsap.set(destinations, { borderColor: "var(--cyan)", boxShadow: "0 0 8px rgba(67, 201, 255, 0.25)" });
            gsap.to(destinations, {
              borderColor: (i: number) => original[i].borderColor,
              boxShadow: (i: number) => original[i].boxShadow,
              duration: 0.18, ease: "power1.out",
            });
          });
      }
      transaction.set(root, { attr: { "data-phase": "idle" } }).to({}, { duration: 0.9 });

      const startTracers = () => {
        assembledRef.current = true;
        root.dataset.assembled = "true";
        measure();
        transaction.play();
      };

      let isVisible = false;
      const sync = () => {
        const playing = isVisible && !document.hidden;
        root.dataset.playback = playing ? "playing" : "paused";
        if (assembledRef.current) transaction.paused(!playing);
      };

      const timeline = gsap.timeline({ paused: true });
      if (!assembledRef.current) {
        gsap.set(nodes, { opacity: 0 });
        bases.forEach(base => {
           const len = base.getTotalLength();
           gsap.set(base, { strokeDasharray: len, strokeDashoffset: len });
           timeline.to(base, { strokeDashoffset: 0, duration: Number(base.dataset.assemblyDuration) / 1000, ease: "none" }, Number(base.dataset.assemblyDelay) / 1000);
        });
        nodes.forEach(node => timeline.to(node, {
          opacity: 1, duration: 0.25, ease: "power1.out",
        }, Number(node.dataset.assemblyDelay) / 1000));
        timeline.call(startTracers);
      } else {
        gsap.set(nodes, { opacity: 1 });
        bases.forEach(base => {
           const len = base.getTotalLength();
           gsap.set(base, { strokeDasharray: len, strokeDashoffset: 0 });
        });
      }

      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) measure();
        if (isVisible && !assembledRef.current) timeline.play();
        sync();
      }, { threshold: 0.3 });
      
      const resize = new ResizeObserver(measure);
      observer.observe(root);
      resize.observe(root);
      document.addEventListener("visibilitychange", sync);

      return () => {
        observer.disconnect();
        resize.disconnect();
        document.removeEventListener("visibilitychange", sync);
        timeline.kill();
        transaction.kill();
      };
    }, root);
    return () => media.revert();
  }, [isMobile, architectureVariant, architectureFlow]);

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
        <ArchEdge d="M 50 16.6 L 50 50" source={0} target={1} phase={0} delay={200} />
        <ArchEdge d="M 50 50 L 50 83.3" source={1} target={2} phase={1} delay={600} />
      </svg>
      {/* Desktop horizontal SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
      >
        <ArchEdge d="M 16.6 50 L 50 50" source={0} target={1} phase={0} delay={200} />
        <ArchEdge d="M 50 50 L 83.3 50" source={1} target={2} phase={1} delay={600} />
      </svg>
      
      <div className="flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} id={0} delay={0} /></div>
      <div className="flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} id={1} delay={400} /></div>
      <div className="flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} id={2} delay={800} /></div>
    </div>
  );

  const renderBranch = () => (
    <div className="relative w-full grid grid-cols-2 grid-rows-3 place-items-center h-[260px] md:h-[280px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <ArchEdge d="M 50 16.6 L 50 50" source={0} target={1} phase={0} delay={200} duration={200} />
        {/* Branching Outwards */}
        <ArchEdge d="M 50 50 L 50 66.6 L 25 66.6 L 25 83.3" source={1} target={2} phase={1} delay={600} duration={250} />
        <ArchEdge d="M 50 50 L 50 66.6 L 75 66.6 L 75 83.3" source={1} target={3} phase={1} delay={600} duration={250} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} id={0} delay={0} /></div>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} id={1} delay={400} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} id={2} delay={850} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[3]} id={3} delay={850} /></div>
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
        <ArchEdge d="M 50 16.6 L 50 33.3 L 25 33.3 L 25 50" source={0} target={1} phase={0} delay={150} duration={250} />
        <ArchEdge d="M 50 16.6 L 50 33.3 L 75 33.3 L 75 50" source={0} target={2} phase={0} delay={150} duration={250} />
        
        {/* Converging Inwards */}
        <ArchEdge d="M 25 50 L 25 66.6 L 50 66.6 L 50 83.3" source={1} target={3} phase={1} delay={600} duration={250} />
        <ArchEdge d="M 75 50 L 75 66.6 L 50 66.6 L 50 83.3" source={2} target={3} phase={1} delay={600} duration={250} />
      </svg>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[0]} id={0} delay={0} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[1]} id={1} delay={400} /></div>
      <div className="col-span-1 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[2]} id={2} delay={400} /></div>
      <div className="col-span-2 flex justify-center items-center w-full px-2"><ArchNode stage={architectureFlow[3]} id={3} delay={850} /></div>
    </div>
  );

  return (
    <div className="relative hidden w-full md:block" ref={containerRef} data-arch-root>
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
