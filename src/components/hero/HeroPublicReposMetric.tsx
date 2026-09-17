"use client";

import { useGithubPortfolio } from "@/integrations/github/use-github-portfolio";

export default function HeroPublicReposMetric() {
  const { data } = useGithubPortfolio();

  return (
    <div
      data-testid="hero-public-repos"
      className="bg-ink-900/80 px-3 py-2.5 backdrop-blur sm:px-3.5"
    >
      <div
        aria-live="polite"
        className="min-h-6 font-display text-xl font-semibold leading-6 text-cyan glow-cyan"
      >
        {data ? data.publicReposCount.toLocaleString() : "—"}
      </div>
      <div className="tech-label mt-0.5 text-[0.58rem] leading-[1.25]">
        PUBLIC REPOS
      </div>
    </div>
  );
}
