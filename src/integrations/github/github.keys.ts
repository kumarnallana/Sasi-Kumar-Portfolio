export const githubKeys = {
  all: ["github"] as const,
  portfolio: () => [...githubKeys.all, "portfolio"] as const,
};

