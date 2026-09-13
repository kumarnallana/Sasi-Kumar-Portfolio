import type { GitHubPortfolioData } from "./github.types";

export * from "./github.types";

export type GitHubClientFailureCode = "AUTH_ERROR" | "RATE_LIMIT" | "UNAVAILABLE";

export class GitHubClientError extends Error {
  constructor(public readonly code: GitHubClientFailureCode) {
    super(code);
    this.name = "GitHubClientError";
  }
}

export const githubClient = {
  portfolio: async (): Promise<GitHubPortfolioData> => {
    const res = await fetch("/api/github/graphql", { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 429) {
        throw new GitHubClientError("RATE_LIMIT");
      }
      if (res.status === 401) {
        throw new GitHubClientError("AUTH_ERROR");
      }
      throw new GitHubClientError("UNAVAILABLE");
    }
    return res.json() as Promise<GitHubPortfolioData>;
  },
};
