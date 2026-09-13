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
    retry: (failureCount, error) => {
      if (error instanceof GitHubClientError && error.code !== "UNAVAILABLE") {
        return false;
      }
      return failureCount < 2;
    },
  });
}
