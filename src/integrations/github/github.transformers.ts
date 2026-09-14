import type { GitHubPortfolioData } from "./github.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformPortfolioData(rawData: any, currentYear: number): GitHubPortfolioData {
  const user = rawData?.data?.user;
  
  if (!user) {
    throw new Error("INVALID_RESPONSE");
  }

  return {
    publicReposCount: user.repositories?.totalCount || 0,
    followersCount: user.followers?.totalCount || 0,
    followingCount: user.following?.totalCount || 0,
    company: user.company || null,
    location: user.location || null,
    isHireable: Boolean(user.isHireable),
    contributionYears: Array.from(new Set<number>([
      currentYear,
      currentYear - 1,
      ...(user.currentContributions?.contributionYears || []),
    ])).filter((year) => Number.isInteger(year) && year <= currentYear),
    contributionHistory: [
      {
        year: currentYear,
        totalContributions: user.currentContributions?.contributionCalendar?.totalContributions || 0,
        weeks: user.currentContributions?.contributionCalendar?.weeks || [],
      },
      {
        year: currentYear - 1,
        totalContributions: user.previousContributions?.contributionCalendar?.totalContributions || 0,
        weeks: user.previousContributions?.contributionCalendar?.weeks || [],
      },
    ],
    // Sum stargazerCount across all owned public repos (up to 100)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    totalStars: (user.allRepos?.nodes || []).reduce((sum: number, r: any) => sum + (r.stargazerCount || 0), 0),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pinnedRepositories: (user.pinnedItems?.nodes || []).map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stargazerCount: repo.stargazerCount,
      primaryLanguage: repo.primaryLanguage,
      updatedAt: repo.updatedAt,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentRepositories: (user.recentRepos?.nodes || []).map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stargazerCount: repo.stargazerCount,
      primaryLanguage: repo.primaryLanguage,
      updatedAt: repo.updatedAt,
    })),
  };
}
