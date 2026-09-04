export const github = {
  handle: "kumarnallana",
  url: "https://github.com/kumarnallana",
  totalStars: 0, // Hydrated by query
  publicRepos: 0, // Hydrated by query
  followers: 0, // Hydrated by query
};

import type { Repo } from "@/types/github/github.types";
// Initial empty/fallback array - will be replaced by TanStack Query
export const repos: Repo[] = [];
