"use client";

import { useQuery } from "@tanstack/react-query";
import { githubClient, type GitHubRepo } from "./github.client";
import { githubKeys } from "./github.keys";

// 5-minute stale time — repos update more frequently
const REPOS_STALE_MS = 5 * 60 * 1000;

export function useGithubRepos() {
  return useQuery<GitHubRepo[], Error>({
    queryKey: githubKeys.repos(),
    queryFn: githubClient.repos,
    staleTime: REPOS_STALE_MS,
  });
}
