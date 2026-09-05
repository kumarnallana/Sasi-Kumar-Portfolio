"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects/projects.data";
import type { Project } from "@/types/projects/project.types";
import ProjectVisual from "@/components/projects/ProjectVisual";
import SectionHeader from "@/components/shared/SectionHeader";
import { sound } from "@/lib/sound";
import AnimatedMetric from "@/components/shared/AnimatedMetric";

gsap.registerPlugin(ScrollTrigger);



function ProjectBlock({ project, i }: { project: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reverse = i % 2 === 1;
  const [stackExpanded, setStackExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".proj-reveal", {
        scrollTrigger: { trigger: el, start: "top 78%" },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="grid items-start gap-10 border-t border-line-faint py-20 lg:grid-cols-2 lg:gap-16"
    >
      {/* details */}
      <div className={reverse ? "lg:order-2" : ""}>
        <div className="proj-reveal flex items-center gap-3">
          <span className="tech-label text-amber">{project.index}</span>
          <span className="h-px flex-1 bg-line-faint" />
          <span className="tech-label">{project.year}</span>
        </div>

        <h3 className="proj-reveal mt-4 font-display text-3xl font-bold md:text-4xl">
          {project.name}
        </h3>
        <div className="proj-reveal mt-1 tech-label text-cyan">
          {project.classification} · {project.client}
        </div>

        <p className="proj-reveal mt-5 max-w-lg text-sm leading-relaxed text-paper-dim">
          {project.summary}
        </p>

        {/* metrics */}
        <div className="proj-reveal mt-6 flex flex-wrap gap-px border border-line-faint bg-line-faint">
          {project.metrics.map((m) => (
            <div key={m.label} className="flex-1 bg-ink-900 px-4 py-3">
              <div className="font-display text-xl font-semibold text-cyan glow-cyan">
                <AnimatedMetric value={m.value} />
              </div>
              <div className="tech-label mt-0.5 text-[0.55rem]">{m.label}</div>
            </div>
          ))}
        </div>

        {/* highlights */}
        <ul className="proj-reveal mt-6 space-y-1.5">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2.5 text-sm text-paper">
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-amber" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* stack */}
        <div className="proj-reveal mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="border border-line-faint px-2.5 py-1 text-xs text-paper-dim"
            >
              {s}
            </span>
          ))}
        </div>

        {/* expanded stack */}
        {project.expandedStack && (
          <div className="proj-reveal mt-4">
            <button
              onClick={() => {
                sound.play("blip");
                setStackExpanded(!stackExpanded);
              }}
              className="tech-label text-[0.6rem] text-cyan hover:text-cyan-bright transition-colors"
            >
              {stackExpanded ? "[-] HIDE COMPLETE STACK" : "[+] VIEW COMPLETE STACK"}
            </button>
            {stackExpanded && (
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs border border-line-faint bg-ink-900/40 p-4">
                {Object.entries(project.expandedStack).map(([category, items]) => (
                  <div key={category}>
                    <div className="tech-label text-[0.55rem] text-paper-dim/70 mb-1">{category}</div>
                    <div className="text-paper">{items.join(", ")}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* preview/diagram container */}
      <div className={`proj-reveal ${reverse ? "lg:order-1" : ""}`}>
        <div className="tech-label mb-3 flex items-center justify-between text-cyan">
          <span>SYS.PREVIEW</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
            ONLINE
          </span>
        </div>
        <ProjectVisual
          name={project.name}
          image={project.image}
          liveUrl={project.links?.live}
          architectureFlow={project.architectureFlow}
        />
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="systems"
      className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10"
    >
      <SectionHeader
        index="02"
        title="DEPLOYED SYSTEMS"
        caption="Self-assembling architecture schematics - drawn as you read."
      />
      <div>
        {projects.map((p, i) => (
          <ProjectBlock key={p.id} project={p} i={i} />
        ))}
      </div>
    </section>
  );
}
