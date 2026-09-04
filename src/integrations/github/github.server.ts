import { cacheLife } from "next/cache";
import { PORTFOLIO_GRAPHQL_QUERY } from "./github.queries";
import { transformPortfolioData } from "./github.transformers";
import type { GitHubPortfolioData } from "./github.types";

export async function getGitHubPortfolioData(): Promise<GitHubPortfolioData> {
  // Use Next.js 16 explicit caching directive
  "use cache";
  cacheLife("hours");

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("GITHUB_TOKEN is not defined in environment variables. Returning empty fallback data.");
    return {
      publicReposCount: 0,
      followersCount: 0,
      totalCommitContributions: 0,
      totalPullRequestContributions: 0,
      pinnedRepositories: [],
      recentRepositories: [],
    };
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: PORTFOLIO_GRAPHQL_QUERY,
      variables: {
        username: "kumarnallana",
      },
    }),
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error("RATE_LIMIT");
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
