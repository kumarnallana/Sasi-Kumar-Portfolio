import type { GitHubPortfolioData } from "./github.types";

export * from "./github.types";

export const githubClient = {
  portfolio: async (): Promise<GitHubPortfolioData> => {
    const res = await fetch("/api/github/graphql");
    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        throw new Error("RATE_LIMIT");
      }
      throw new Error("FETCH_ERROR");
    }
    return res.json() as Promise<GitHubPortfolioData>;
  },
};
