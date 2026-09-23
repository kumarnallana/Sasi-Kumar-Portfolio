"use client";

import SectionHeader from "@/components/shared/SectionHeader";
import { achievements } from "@/data/profile/achievements.data";
import { experience } from "@/data/profile/experience.data";
import { identity } from "@/data/profile/profile.data";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";
import Certifications from "./Certifications";
import { internshipCredential } from "@/data/profile/certifications.data";
import CapabilityMatrix from "./CapabilityMatrix";
import { revealContent } from "@/lib/contentReveal";
import LivingPortrait from "./LivingPortrait";

gsap.registerPlugin(ScrollTrigger);

let profileVerified = false;

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const profileTraceRef = useRef<SVGPathElement>(null);
  const statusDotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".about-reveal").forEach((node) => {
        revealContent(node, {
          scrollTrigger: { trigger: node, start: "top 85%", once: true },
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
        });
      });
      // Profile Verification Trace
      const media = gsap.matchMedia();
      media.add({
        reduce: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)"
      }, context => {
        if (profileTraceRef.current && statusDotRef.current) {
          const path = profileTraceRef.current;
          
          if (context.conditions?.reduce) {
            gsap.set(path, { opacity: 0.65, strokeDashoffset: 0 });
            return;
          }

          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

          const traceTl = gsap.timeline({ paused: true });
          
          traceTl.to(path, {
            strokeDashoffset: 0,
            duration: 2,
            delay: 0.15,
            ease: "power1.inOut",
          }).to(statusDotRef.current, {
            boxShadow: "0 0 7px rgba(82, 217, 255, 0.95), 0 0 14px rgba(82, 217, 255, 0.5)",
            backgroundColor: "#fff",
            duration: 0.18,
            yoyo: true,
            repeat: 1,
          }).to(path, {
            opacity: 0.65,
            duration: 0.4,
            ease: "power1.out"
          }, "-=0.36");

          ScrollTrigger.create({
            trigger: ".portrait-container",
            start: "top 65%",
            once: true,
            onEnter: () => {
              if (profileVerified) {
                traceTl.progress(1);
              } else {
                profileVerified = true;
                traceTl.play();
              }
            }
          });
        }
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="profile"
      ref={ref}
      className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 md:px-10 md:py-24"
    >
      {/* Anchor alias to ensure backward compatibility with lingering #architect URL hashes */}
      <span id="architect" className="sr-only pointer-events-none absolute -top-24" aria-hidden="true" />
      <SectionHeader
        index="04"
        title="PROFILE"
        caption="Experience and learning behind the demonstrated signal."
      />

      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        
        {/* Portrait & Core Identity */}
        <div className="portrait-container about-reveal relative mx-auto h-fit w-full max-w-none sm:max-w-sm lg:max-w-none border border-line-faint bg-ink-800/40 p-1">
          
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full z-10"
            viewBox="0 0 400 700"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Base Frame */}
            <path
              d="M 200 0 L 400 0 L 400 700 L 0 700 L 0 0 L 200 0"
              fill="none"
              stroke="rgba(82, 217, 255, 0.20)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {/* Active Trace */}
            <path
              ref={profileTraceRef}
              d="M 200 0 L 400 0 L 400 700 L 0 700 L 0 0 L 200 0"
              fill="none"
              stroke="#52D9FF"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              style={{ filter: "drop-shadow(0 0 4px rgba(82, 217, 255, 1)) drop-shadow(0 0 12px rgba(82, 217, 255, 0.65)) drop-shadow(0 0 24px rgba(82, 217, 255, 0.3))" }}
            />
          </svg>
          
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4]">
            <LivingPortrait
              portraitSrc="/logos/sasi-portrait-new-trimmed.webp"
              alt="Sasi Kumar Nallana"
            >
              {/* Tech annotations over portrait */}
              <div className="absolute bottom-4 left-4 border border-cyan/30 bg-ink-900/80 px-2 py-1 backdrop-blur">
                <span className="font-mono text-[0.65rem] text-cyan">ID: {identity.callsign}</span>
              </div>
              <div className="absolute right-4 top-4 flex items-center gap-2 border border-line-faint bg-ink-900/80 px-2 py-1 backdrop-blur z-20">
                <span ref={statusDotRef} className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_6px_var(--cyan)]" />
                <span className="font-mono text-[0.65rem] text-amber">STATUS: ONLINE</span>
              </div>
            </LivingPortrait>
          </div>
          
          <div className="border-t border-line-faint bg-ink-900 p-5">
            <h3 className="font-display text-2xl font-bold text-paper">{identity.name}</h3>
            <p className="tech-label mt-1 text-cyan">{identity.role}</p>
            <p className="mt-2 text-sm text-paper-dim">{identity.location}</p>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={identity.links.resume} target="_blank" rel="noreferrer" className="tech-label border border-line-faint px-3 py-1.5 transition-colors hover:bg-ink-800 hover:text-cyan">
                RESUME
              </a>
              <a href={identity.links.github} target="_blank" rel="noreferrer" className="tech-label border border-line-faint px-3 py-1.5 transition-colors hover:bg-ink-800 hover:text-cyan">
                GITHUB
              </a>
              <a href={identity.links.linkedin} target="_blank" rel="noreferrer" className="tech-label border border-line-faint px-3 py-1.5 transition-colors hover:bg-ink-800 hover:text-cyan">
                LINKEDIN
              </a>
            </div>
          </div>
        </div>

        {/* Narrative & Experience */}
        <div className="flex flex-col gap-12">
          
          <div className="about-reveal">
            <div className="tech-label mb-5 text-cyan">PROFESSIONAL NARRATIVE</div>
            <p className="text-base leading-relaxed text-paper-dim md:text-lg">
              I build web applications with React, Next.js, Node.js, and REST APIs, backed by practical experience on a production corporate platform.
            </p>
            <p className="mt-4 text-base leading-relaxed text-paper-dim md:text-lg">
              At Zylxy Technology Pvt. Ltd., I translated requirements into reusable interfaces, lead-generation workflows, REST API integrations, and tested application behavior.
            </p>
            <p className="mt-4 text-base leading-relaxed text-paper-dim md:text-lg">
              I am currently expanding my Python backend skills through <span className="text-amber">FastAPI, Pydantic, and SQLAlchemy</span> while pursuing a B.Tech in Artificial Intelligence and Data Science.
            </p>
          </div>

          <div className="about-reveal">
            <div className="tech-label mb-5">SERVICE HISTORY · LOG</div>
            <ol className="relative space-y-8 border-l border-line-faint pl-6">
              {experience.map((e) => (
                <li key={e.role + e.company} className="relative">
                  <span className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full border border-cyan bg-ink-900" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-lg font-semibold text-paper">
                      {e.role}
                    </h4>
                    <span className="tech-label text-cyan">{e.period}</span>
                  </div>
                  <div className="text-sm text-amber">
                    {e.company} · {e.mode}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-paper-dim">
                        <span className="mt-1.5 h-1 w-1 shrink-0 bg-line-dim" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  {e.company === internshipCredential.company && e.role === internshipCredential.role && (
                    <a href={internshipCredential.image} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs text-cyan underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan" aria-label="View Zylxy internship certificate (new tab)">
                      INTERNSHIP CREDENTIAL <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>

      {/* skills as subsystems */}
      <div className="about-reveal mt-12 hidden md:block md:mt-16">
        <CapabilityMatrix />
      </div>
      
      {/* Education / Foundation */}
      <div className="about-reveal mt-12 border border-line-faint bg-ink-900/50 p-5 md:mt-16 md:p-6">
        <div className="tech-label mb-5 text-paper">EDUCATION & FOUNDATION</div>
        <div className="grid gap-6 md:grid-cols-2">
          {achievements.map((ach, idx) => (
             <div key={idx} className="flex flex-col">
               <span className="text-sm text-cyan">{ach.date}</span>
               <span className="font-display text-lg font-semibold text-paper mt-1">{ach.title}</span>
               <span className="text-sm text-paper-dim mt-1">{ach.org}</span>
             </div>
          ))}
        </div>
        <Certifications />
      </div>

    </section>
  );
}
