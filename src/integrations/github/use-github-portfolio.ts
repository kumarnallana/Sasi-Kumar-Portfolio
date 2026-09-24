"use client";

import { useQuery } from "@tanstack/react-query";
import { GitHubClientError, githubClient } from "./github.client";
import { githubKeys } from "./github.keys";

// 10-minute stale time
const PORTFOLIO_STALE_MS = 10 * 60 * 1000;

export function useGithubPortfolio() {
  return useQuery({
    queryKey: githubKeys.portfolio(),
    queryFn: githubClient.portfolio,
    staleTime: PORTFOLIO_STALE_MS,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => query.state.status === "error" ? 60_000 : false,
    // The API already classifies failures and retries once per minute while
    // unavailable. Avoid repeating an expensive timed-out request immediately.
    retry: (failureCount, error) =>
      !(error instanceof GitHubClientError) && failureCount < 2,
  });
}
