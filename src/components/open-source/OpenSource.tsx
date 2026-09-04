"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { github } from "@/data/github/github-display.data";
import SectionHeader from "@/components/shared/SectionHeader";
import { sound } from "@/lib/sound";
import { useQuery } from "@tanstack/react-query";

gsap.registerPlugin(ScrollTrigger);

// Helper to fetch github data
async function fetchGithubData(endpoint: string) {
  const res = await fetch(`/api/github/${endpoint}`);
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    throw new Error("FETCH_ERROR");
  }
  return res.json();
}

export default function OpenSource() {
  const ref = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"OWNED" | "STARRED">("OWNED");

  // Queries
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, error: profileError } = useQuery({
    queryKey: ["github-profile"],
    queryFn: () => fetchGithubData("profile"),
  });

  const { data: repos, isLoading: isReposLoading, isError: isReposError } = useQuery({
    queryKey: ["github-repos"],
    queryFn: () => fetchGithubData("repos"),
  });

  const { data: starred, isLoading: isStarredLoading, isError: isStarredError } = useQuery({
    queryKey: ["github-starred"],
    queryFn: () => fetchGithubData("starred"),
  });

  // Calculate stats
  const totalStars = repos?.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0) ?? 0;
  const publicRepos = profile?.public_repos ?? 0;

  // Star count animation logic
  const starElRef = useRef<HTMLSpanElement>(null);
  const prevStarsRef = useRef(0);

  useEffect(() => {
    if (totalStars > 0 && starElRef.current) {
      const obj = { v: prevStarsRef.current };
      gsap.to(obj, {
        v: totalStars,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (starElRef.current) starElRef.current.textContent = String(Math.round(obj.v));
        },
      });
      prevStarsRef.current = totalStars;
    }
  }, [totalStars]);

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

  const activeRepos = viewMode === "OWNED" ? repos : starred;
  const isLoading = viewMode === "OWNED" ? isReposLoading : isStarredLoading;
  const isError = viewMode === "OWNED" ? isReposError : isStarredError;

  return (
    <section
      id="signals"
      ref={ref}
      className="relative mx-auto max-w-6xl px-6 py-24 md:px-10"
    >
      <SectionHeader
        index="03"
        title="OPEN-SOURCE SIGNALS"
        caption="Public work on GitHub - built in the open, validated by stars."
      />

      {/* stat bar */}
      <div className="mb-10 grid grid-cols-3 gap-px border border-line-faint bg-line-faint">
        <div className="os-card bg-ink-900 px-5 py-5">
          <div className="font-display text-3xl font-semibold text-amber glow-amber">
            <span ref={starElRef} className="star-count">0</span>★
          </div>
          <div className="tech-label mt-1">TOTAL STARS</div>
        </div>
        <div className="os-card bg-ink-900 px-5 py-5">
          <div className="font-display text-3xl font-semibold text-cyan glow-cyan">
             {isProfileLoading ? (
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

      {/* Tabs */}
      <div className="os-card mb-4 flex gap-4 border-b border-line-faint pb-4">
        <button
          onClick={() => { setViewMode("OWNED"); sound.play("blip"); }}
          className={`tech-label transition-colors ${viewMode === "OWNED" ? "text-cyan glow-cyan" : "text-paper-dim hover:text-paper"}`}
        >
          MY REPOSITORIES
        </button>
        <button
          onClick={() => { setViewMode("STARRED"); sound.play("blip"); }}
          className={`tech-label transition-colors ${viewMode === "STARRED" ? "text-cyan glow-cyan" : "text-paper-dim hover:text-paper"}`}
        >
          STARRED REPOSITORIES
        </button>
      </div>

      {/* repo grid */}
      <div className="grid gap-px border border-line-faint bg-line-faint md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="os-card col-span-full flex min-h-32 flex-col items-center justify-center bg-ink-900 p-5 text-center">
             <span className="tech-label animate-pulse text-cyan">SYNCING GITHUB SIGNALS...</span>
          </div>
        ) : isError ? (
          <div className="os-card col-span-full flex min-h-32 flex-col items-center justify-center bg-ink-900 p-5 text-center border-amber border-opacity-30">
             <span className="tech-label text-amber">
                {profileError?.message === "RATE_LIMIT" ? "GITHUB API RATE LIMIT REACHED" : "UNABLE TO SYNC REPOSITORIES"}
             </span>
             <span className="text-xs text-paper-dim mt-2">Will retry automatically...</span>
          </div>
        ) : activeRepos && activeRepos.length > 0 ? (
          activeRepos.slice(0, 9).map((r: any) => (
            <a
              key={r.id}
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => sound.play("hover")}
              className="os-card group flex flex-col bg-ink-900 p-5 transition-colors hover:bg-ink-800"
            >
              <div className="flex items-center justify-between">
                <span className="tech-label text-cyan">{r.language || "Markdown"}</span>
                <span className="flex items-center gap-1 font-mono text-sm text-paper-dim transition-colors group-hover:text-amber">
                  {r.stargazers_count} ★
                </span>
              </div>
              <h4 className="mt-4 font-display text-lg font-semibold text-paper group-hover:underline">
                {r.name}
              </h4>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-dim">
                {r.description || "No description provided."}
              </p>
              <div className="mt-4 tech-label text-[0.6rem] text-line-dim">
                UPDATED: {new Date(r.updated_at).toLocaleDateString()}
              </div>
            </a>
          ))
        ) : (
          <div className="os-card col-span-full flex min-h-32 flex-col items-center justify-center bg-ink-900 p-5 text-center">
             <span className="tech-label text-paper-dim">NO REPOSITORIES FOUND</span>
          </div>
        )}
      </div>
    </section>
  );
}
