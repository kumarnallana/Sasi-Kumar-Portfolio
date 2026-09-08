import { cacheLife } from "next/cache";
import { PORTFOLIO_GRAPHQL_QUERY } from "./github.queries";
import { transformPortfolioData } from "./github.transformers";
import type { GitHubPortfolioData } from "./github.types";

export const EMPTY_GITHUB_PORTFOLIO: GitHubPortfolioData = {
  publicReposCount: 0,
  totalStars: 0,
  totalCommitContributions: 0,
  totalPullRequestContributions: 0,
  pinnedRepositories: [],
  recentRepositories: [],
};

export async function getGitHubPortfolioData(): Promise<GitHubPortfolioData> {
  // Use Next.js 16 explicit caching directive
  "use cache";
  cacheLife("hours");

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("GITHUB_TOKEN is not defined in environment variables. Returning empty fallback data.");
    return EMPTY_GITHUB_PORTFOLIO;
  }

  let response: Response;
  try {
    response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        "User-Agent": "sasi-portfolio",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: PORTFOLIO_GRAPHQL_QUERY,
        variables: {
          username: "kumarnallana",
        },
      }),
      signal: AbortSignal.timeout(6_000),
    });
  } catch {
    throw new Error("UPSTREAM_UNAVAILABLE");
  }

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    if (response.status === 401) {
      throw new Error("AUTH_ERROR");
    }
    throw new Error("FETCH_ERROR");
  }

  const rawData = await response.json();
  if (rawData.errors) {
    console.error("GitHub GraphQL Errors:", rawData.errors);
    throw new Error("GRAPHQL_ERROR");
  }

  return transformPortfolioData(rawData);
}
