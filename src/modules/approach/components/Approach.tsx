"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "@/shared/components/SectionHeader";

gsap.registerPlugin(ScrollTrigger);

const PRINCIPLES = [
  {
    no: "P-01",
    title: "Understand the requirement",
    body: "Before writing code, clearly understand the business requirement and how the interface or workflow serves the actual user.",
  },
  {
    no: "P-02",
    title: "Maintainable components",
    body: "Break complex interfaces and workflows into modular, reusable components. Keep the styling and architecture centralized to prevent technical debt.",
  },
  {
    no: "P-03",
    title: "Data-flow is the product",
    body: "Treat API integration and data-flow behavior as a core part of the experience, not just an afterthought. Validate complete workflows end-to-end.",
  },
  {
    no: "P-04",
    title: "Debug the root cause",
    body: "Look beyond surface symptoms. Use browser DevTools and Network inspection to trace failures down to their origin and solve them definitively.",
  },
];

export default function Approach() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".pr-card", {
        scrollTrigger: { trigger: el, start: "top 78%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="principles"
      ref={ref}
      className="relative mx-auto max-w-6xl px-6 py-24 md:px-10"
    >
      <SectionHeader
        index="01"
        title="OPERATING PRINCIPLES"
        caption="The design constraints behind every system below."
      />
      <div className="grid gap-px border border-line-faint bg-line-faint md:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div
            key={p.no}
            className="pr-card group bg-ink-900 p-7 transition-colors hover:bg-ink-800"
          >
            <div className="flex items-baseline justify-between">
              <span className="tech-label text-amber">{p.no}</span>
              <span className="font-display text-3xl text-line-faint transition-colors group-hover:text-line-dim">
                {p.no.split("-")[1]}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold text-paper">
              {p.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-paper-dim">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
