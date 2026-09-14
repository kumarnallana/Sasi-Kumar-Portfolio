import { CONTRIBUTION_YEAR_GRAPHQL_QUERY, PORTFOLIO_GRAPHQL_QUERY } from "./github.queries";
import { transformPortfolioData } from "./github.transformers";
import type { GitHubContributionYear, GitHubPortfolioData } from "./github.types";

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

function yearRange(year: number, now = new Date()) {
  const currentYear = now.getUTCFullYear();
  return {
    from: new Date(Date.UTC(year, 0, 1)).toISOString(),
    to: year === currentYear
      ? now.toISOString()
      : new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)).toISOString(),
  };
}

async function requestGitHub(query: string, variables: Record<string, unknown>, revalidate: number) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("AUTH_ERROR");

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
      body: JSON.stringify({ query, variables }),
      cache: "force-cache",
      next: { revalidate },
      signal: AbortSignal.timeout(6_000),
    });
  } catch {
    throw new Error("UPSTREAM_UNAVAILABLE");
  }

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) throw new Error("RATE_LIMIT");
    if (response.status === 401) throw new Error("AUTH_ERROR");
    throw new Error("FETCH_ERROR");
  }

  const rawData = await response.json();
  if (rawData.errors) {
    console.warn("[github] GitHub GraphQL returned an error response.");
    throw new Error("GRAPHQL_ERROR");
  }
  return rawData;
}

export async function getGitHubPortfolioData(): Promise<GitHubPortfolioData> {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const current = yearRange(currentYear, now);
  const previous = yearRange(currentYear - 1, now);
  const rawData = await requestGitHub(PORTFOLIO_GRAPHQL_QUERY, {
    username: "kumarnallana",
    currentFrom: current.from,
    currentTo: current.to,
    previousFrom: previous.from,
    previousTo: previous.to,
  }, 600);
  return transformPortfolioData(rawData, currentYear);
}

export async function getGitHubContributionYear(year: number): Promise<GitHubContributionYear> {
  const currentYear = new Date().getUTCFullYear();
  if (!Number.isInteger(year) || year < 2008 || year > currentYear) throw new Error("INVALID_RESPONSE");
  const range = yearRange(year);
  const rawData = await requestGitHub(CONTRIBUTION_YEAR_GRAPHQL_QUERY, {
    username: "kumarnallana",
    from: range.from,
    to: range.to,
  }, 3600);
  const calendar = rawData?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("INVALID_RESPONSE");
  return { year, totalContributions: calendar.totalContributions || 0, weeks: calendar.weeks || [] };
}
