"use client";

import { useQuery } from "@tanstack/react-query";
import { GitHubClientError, githubClient } from "./github.client";
import { githubKeys } from "./github.keys";

export function useGitHubContributionYear(year: number | null, enabled: boolean) {
  return useQuery({
    queryKey: githubKeys.contributionYear(year ?? 0),
    queryFn: () => githubClient.contributionYear(year!),
    enabled: enabled && year !== null,
    staleTime: 60 * 60 * 1000,
    refetchOnReconnect: true,
    retry: (count, error) => !(error instanceof GitHubClientError && error.code !== "UNAVAILABLE") && count < 2,
  });
}
