"use client";

import { useQuery } from "@tanstack/react-query";
import { githubClient, type GitHubStarred } from "./github.client";
import { githubKeys } from "./github.keys";

// 15-minute stale time — starred repos rarely change
const STARRED_STALE_MS = 15 * 60 * 1000;

export function useGithubStarred() {
  return useQuery<GitHubStarred[], Error>({
    queryKey: githubKeys.starred(),
    queryFn: githubClient.starred,
    staleTime: STARRED_STALE_MS,
  });
}
