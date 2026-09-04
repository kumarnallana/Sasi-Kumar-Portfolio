"use client";

import { useQuery } from "@tanstack/react-query";
import { githubClient, type GitHubProfile } from "./github.client";
import { githubKeys } from "./github.keys";

// 10-minute stale time — profile data changes rarely
const PROFILE_STALE_MS = 10 * 60 * 1000;

export function useGithubProfile() {
  return useQuery<GitHubProfile, Error>({
    queryKey: githubKeys.profile(),
    queryFn: githubClient.profile,
    staleTime: PROFILE_STALE_MS,
  });
}
