"use client";

import { useGithubPortfolio } from "@/integrations/github/use-github-portfolio";

export default function HeroPublicReposMetric() {
  const { data } = useGithubPortfolio();

  return (
    <div
      data-testid="hero-public-repos"
      className="bg-ink-900/80 px-4 py-3 backdrop-blur"
    >
      <div
        aria-live="polite"
        className="min-h-8 font-display text-2xl font-semibold text-cyan glow-cyan"
      >
        {data ? data.publicReposCount.toLocaleString() : "—"}
      </div>
      <div className="tech-label mt-1">PUBLIC REPOS</div>
    </div>
  );
}
