// Centralised TanStack Query keys for GitHub data.
// Using const objects prevents key typos across the codebase.

export const githubKeys = {
  all: ["github"] as const,
  profile: () => [...githubKeys.all, "profile"] as const,
  repos: () => [...githubKeys.all, "repos"] as const,
  starred: () => [...githubKeys.all, "starred"] as const,
};
