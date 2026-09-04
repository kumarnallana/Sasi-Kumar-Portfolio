"use client";

import { useQuery } from "@tanstack/react-query";
import { githubClient } from "./github.client";
import { githubKeys } from "./github.keys";

// 10-minute stale time
const PORTFOLIO_STALE_MS = 10 * 60 * 1000;

export function useGithubPortfolio() {
  return useQuery({
    queryKey: githubKeys.portfolio(),
    queryFn: githubClient.portfolio,
    staleTime: PORTFOLIO_STALE_MS,
  });
}
