import { cacheLife } from "next/cache";
import { PORTFOLIO_GRAPHQL_QUERY } from "./github.queries";
import { transformPortfolioData } from "./github.transformers";
import type { GitHubPortfolioData } from "./github.types";

const GITHUB_FAILURE_CODES = [
  "AUTH_ERROR",
  "RATE_LIMIT",
  "UPSTREAM_UNAVAILABLE",
  "FETCH_ERROR",
  "GRAPHQL_ERROR",
  "INVALID_RESPONSE",
] as const;

export type GitHubFailureCode = (typeof GITHUB_FAILURE_CODES)[number];

export function getGitHubFailureCode(error: unknown): GitHubFailureCode {
  const message = error instanceof Error ? error.message : "";
  return GITHUB_FAILURE_CODES.find((code) => code === message) ?? "FETCH_ERROR";
}

export async function getGitHubPortfolioData(): Promise<GitHubPortfolioData> {
  // Use Next.js 16 explicit caching directive
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("AUTH_ERROR");
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
    console.warn("[github] GitHub GraphQL returned an error response.");
    throw new Error("GRAPHQL_ERROR");
  }

  return transformPortfolioData(rawData);
}
