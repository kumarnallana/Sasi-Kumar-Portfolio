"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { github } from "@/data/github/github-display.data";
import SectionHeader from "@/components/shared/SectionHeader";
import { sound } from "@/lib/sound";
import { useGithubPortfolio } from "@/integrations/github/use-github-portfolio";
import AnimatedMetric from "@/components/shared/AnimatedMetric";
import { revealContent } from "@/lib/contentReveal";

gsap.registerPlugin(ScrollTrigger);

export default function OpenSource() {
  const ref = useRef<HTMLDivElement>(null);

  // Single typed query via integration hook
  const { data, isPending, isError } = useGithubPortfolio();

  const hasRepositories = Boolean(
    data && (data.pinnedRepositories.length > 0 || data.recentRepositories.length > 0),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      revealContent(".os-card", {
        scrollTrigger: { trigger: el, start: "top 80%" },
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="signals"
      ref={ref}
      className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24"
    >
      <SectionHeader
        index="03"
        title="OPEN-SOURCE SIGNALS"
        caption="Public repositories and activity sourced directly from GitHub."
      />

      {/* stat bar */}
      <div
        className="mb-10 grid grid-cols-2 gap-px border border-line-faint bg-line-faint sm:grid-cols-3"
        aria-busy={isPending}
        aria-live="polite"
      >
        <div className="os-card bg-ink-900 px-5 py-5">
          <div className="font-display text-3xl font-semibold text-amber glow-amber">
            {isPending || isError ? (
              <span className={isPending ? "animate-pulse" : ""} aria-label={isPending ? "Loading total stars" : "Total stars unavailable"}>—</span>
            ) : (
              <AnimatedMetric value={`${data.totalStars}★`} className="star-count" />
            )}
          </div>
          <div className="tech-label mt-1">TOTAL STARS</div>
        </div>
        <div className="os-card bg-ink-900 px-5 py-5">
          <div className="font-display text-3xl font-semibold text-cyan glow-cyan">
             {isPending || isError ? (
               <span className={isPending ? "animate-pulse" : ""} aria-label={isPending ? "Loading public repositories" : "Public repository count unavailable"}>—</span>
             ) : (
               <AnimatedMetric value={data.publicReposCount} />
             )}
          </div>
          <div className="tech-label mt-1">PUBLIC REPOS</div>
        </div>
        <a
          href={github.url}
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => sound.play("hover")}
          className="os-card group col-span-2 flex flex-col justify-between bg-ink-900 px-5 py-5 transition-colors hover:bg-ink-800 sm:col-span-1"
        >
          <div className="font-display text-lg font-semibold text-paper transition-colors group-hover:text-cyan">
            @{github.handle}
          </div>
          <div className="tech-label mt-1 flex items-center gap-1">
            VIEW PROFILE
            <span className="transition-transform group-hover:translate-x-0.5">
              ↗
            </span>
          </div>
        </a>
      </div>

      {isPending ? (
        <div className="os-card grid min-h-64 gap-px border border-line-faint bg-line-faint md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading GitHub repositories">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex min-h-48 flex-col justify-between bg-ink-900 p-5">
              <span className="h-3 w-24 animate-pulse bg-line-faint" />
              <span className="h-5 w-3/4 animate-pulse bg-line-faint" />
              <span className="h-3 w-full animate-pulse bg-line-faint" />
            </div>
          ))}
          <span className="sr-only">Syncing GitHub signals</span>
        </div>
      ) : isError ? (
        <div className="os-card flex min-h-64 flex-col items-center justify-center border border-line-faint bg-ink-900 p-5 text-center" role="status">
           <span className="tech-label text-amber">LIVE GITHUB SIGNAL TEMPORARILY UNAVAILABLE</span>
           <span className="mt-2 max-w-md text-sm leading-relaxed text-paper-dim">The portfolio remains available while this section reconnects automatically.</span>
        </div>
      ) : (
        <>
          {/* Repositories Display Logic */}
          {data?.pinnedRepositories && data.pinnedRepositories.length > 0 ? (
            <div className="mb-12">
              <h3 className="mb-4 font-display text-xl font-semibold text-paper">Featured Repositories</h3>
              <div className="grid gap-px border border-line-faint bg-line-faint md:grid-cols-2 lg:grid-cols-3">
                {data.pinnedRepositories.map((r) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => sound.play("hover")}
                    className="os-card group flex flex-col bg-ink-900 p-5 transition-colors hover:bg-ink-800 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                      <div className="absolute top-2 -right-6 w-24 transform rotate-45 bg-amber bg-opacity-20 text-center text-[0.5rem] font-bold tracking-widest text-amber py-0.5 border-y border-amber border-opacity-30">
                        PINNED
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="tech-label flex items-center gap-2 text-cyan">
                        {r.primaryLanguage?.color && (
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: r.primaryLanguage.color }}></span>
                        )}
                        {r.primaryLanguage?.name ?? "LANGUAGE NOT REPORTED"}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-sm text-paper-dim transition-colors group-hover:text-amber">
                        {r.stargazerCount} ★
                      </span>
                    </div>
                    <h4 className="mt-4 font-display text-lg font-semibold text-paper group-hover:underline">
                      {r.name}
                    </h4>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-dim">
                      {r.description || "No description provided."}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ) : data?.recentRepositories && data.recentRepositories.length > 0 ? (
            <div>
              <h3 className="mb-4 font-display text-lg font-medium text-paper-dim">Recent Activity</h3>
              <div className="grid gap-px border border-line-faint bg-line-faint md:grid-cols-2 lg:grid-cols-3 opacity-90">
                {data.recentRepositories.slice(0, 6).map((r) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => sound.play("hover")}
                    className="os-card group flex flex-col bg-ink-900 p-5 transition-colors hover:bg-ink-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="tech-label flex items-center gap-2 text-paper-dim group-hover:text-cyan transition-colors">
                        {r.primaryLanguage?.color && (
                          <span className="w-1.5 h-1.5 rounded-full inline-block opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: r.primaryLanguage.color }}></span>
                        )}
                        {r.primaryLanguage?.name ?? "LANGUAGE NOT REPORTED"}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-sm text-paper-dim transition-colors group-hover:text-amber">
                        {r.stargazerCount} ★
                      </span>
                    </div>
                    <h4 className="mt-4 font-display text-md font-semibold text-paper-dim group-hover:text-paper group-hover:underline transition-colors">
                      {r.name}
                    </h4>
                    <div className="mt-4 tech-label text-[0.6rem] text-line-dim">
                      UPDATED: {new Date(r.updatedAt).toLocaleDateString()}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : !hasRepositories ? (
            <div className="os-card flex min-h-64 flex-col items-center justify-center border border-line-faint bg-ink-900 p-5 text-center" role="status">
               <span className="tech-label text-paper-dim">NO PUBLIC REPOSITORY ACTIVITY</span>
               <span className="mt-2 max-w-md text-sm leading-relaxed text-paper-dim">GitHub responded successfully, but no public repositories are available for this account.</span>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
