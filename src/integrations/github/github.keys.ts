export const githubKeys = {
  all: ["github"] as const,
  portfolio: () => [...githubKeys.all, "portfolio"] as const,
  contributionYear: (year: number) => [...githubKeys.all, "contributions", year] as const,
};
