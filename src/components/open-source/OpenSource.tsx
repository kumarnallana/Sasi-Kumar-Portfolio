"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { github } from "@/data/github/github-display.data";
import SectionHeader from "@/components/shared/SectionHeader";
import { sound } from "@/lib/sound";
import { useGithubPortfolio } from "@/integrations/github/use-github-portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function OpenSource() {
  const ref = useRef<HTMLDivElement>(null);

  // Single typed query via integration hook
  const { data, isLoading, isError, error } = useGithubPortfolio();

  // Animated stat counters
  const totalStars = (data?.pinnedRepositories || []).reduce((acc, r) => acc + (r.stargazerCount ?? 0), 0) + 
                     (data?.recentRepositories || []).reduce((acc, r) => acc + (r.stargazerCount ?? 0), 0); // Approximation if we don't have global star count
  
  // Using publicReposCount from data
  const publicRepos = data?.publicReposCount ?? 0;
  const followers = data?.followersCount ?? 0;

  const starElRef = useRef<HTMLSpanElement>(null);
  const prevStarsRef = useRef(0);

  useEffect(() => {
    // We don't have an exact total star count in the new API response without a complex query, 
    // so we'll animate the followers count instead as a meaningful metric of reach.
    if (followers > 0 && starElRef.current) {
      const obj = { v: prevStarsRef.current };
      gsap.to(obj, {
        v: followers,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (starElRef.current) starElRef.current.textContent = String(Math.round(obj.v));
        },
      });
      prevStarsRef.current = followers;
    }
  }, [followers]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".os-card", {
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
      className="relative mx-auto max-w-6xl px-6 py-24 md:px-10"
    >
      <SectionHeader
        index="03"
        title="OPEN-SOURCE SIGNALS"
        caption="Public repositories and project work available for technical review on GitHub."
      />

      {/* stat bar */}
      <div className="mb-10 grid grid-cols-3 gap-px border border-line-faint bg-line-faint">
        <div className="os-card bg-ink-900 px-5 py-5">
          <div className="font-display text-3xl font-semibold text-amber glow-amber">
            <span ref={starElRef} className="star-count">0</span>
          </div>
          <div className="tech-label mt-1">FOLLOWERS</div>
        </div>
        <div className="os-card bg-ink-900 px-5 py-5">
          <div className="font-display text-3xl font-semibold text-cyan glow-cyan">
             {isLoading ? (
               <span className="animate-pulse">---</span>
             ) : (
               publicRepos
             )}
          </div>
          <div className="tech-label mt-1">PUBLIC REPOS</div>
        </div>
        <a
          href={github.url}
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => sound.play("hover")}
          className="os-card group flex flex-col justify-between bg-ink-900 px-5 py-5 transition-colors hover:bg-ink-800"
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

      {isLoading ? (
        <div className="os-card flex min-h-32 flex-col items-center justify-center border border-line-faint bg-ink-900 p-5 text-center">
           <span className="tech-label animate-pulse text-cyan">SYNCING GITHUB SIGNALS...</span>
        </div>
      ) : isError ? (
        <div className="os-card flex min-h-32 flex-col items-center justify-center border border-amber border-opacity-30 bg-ink-900 p-5 text-center">
           <span className="tech-label text-amber">
              {error?.message === "RATE_LIMIT" ? "GITHUB API RATE LIMIT REACHED" : "UNABLE TO SYNC REPOSITORIES"}
           </span>
           <span className="mt-2 text-xs text-paper-dim">Will retry automatically...</span>
        </div>
      ) : (
        <>
          {/* Pinned Repositories */}
          {data?.pinnedRepositories && data.pinnedRepositories.length > 0 && (
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
                        {r.primaryLanguage?.name || "Markdown"}
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
          )}

          {/* Recent Repositories */}
          {data?.recentRepositories && data.recentRepositories.length > 0 && (
            <div>
              <h3 className="mb-4 font-display text-lg font-medium text-paper-dim">Recent Activity</h3>
              <div className="grid gap-px border border-line-faint bg-line-faint md:grid-cols-2 lg:grid-cols-3 opacity-90">
                {data.recentRepositories.filter(r => !data.pinnedRepositories?.some(p => p.name === r.name)).slice(0, 6).map((r) => (
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
                        {r.primaryLanguage?.name || "Markdown"}
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
          )}
        </>
      )}
    </section>
  );
}
