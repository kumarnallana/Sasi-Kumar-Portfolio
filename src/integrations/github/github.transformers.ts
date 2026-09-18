import type { GitHubPortfolioData } from "./github.types";
import { calculateCurrentStreak } from "./current-streak";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformPortfolioData(rawData: any, currentYear: number): GitHubPortfolioData {
  const user = rawData?.data?.user;
  
  if (!user) {
    throw new Error("INVALID_RESPONSE");
  }

  const currentCalendar = user.currentContributions?.contributionCalendar ?? {};
  const previousCalendar = user.previousContributions?.contributionCalendar ?? {};
  const contributionYears = Array.from(new Set<number>(
    user.currentContributions?.contributionYears ?? [],
  )).filter((year) => Number.isInteger(year) && year <= currentYear);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contributionDays = [currentCalendar, previousCalendar].flatMap((calendar: any) =>
    (calendar?.weeks || []).flatMap((week: any) =>
      (week?.contributionDays || []).map((day: any) => ({
        date: day.date,
        contributionCount: day.contributionCount,
      })),
    ),
  );

  return {
    publicReposCount: user.repositories?.totalCount || 0,
    currentStreak: calculateCurrentStreak(contributionDays),
    company: user.company || null,
    location: user.location || null,
    isHireable: Boolean(user.isHireable),
    contributionYears,
    contributionHistory: [
      {
        year: currentYear,
        totalContributions: currentCalendar.totalContributions || 0,
        weeks: currentCalendar.weeks || [],
      },
      {
        year: currentYear - 1,
        totalContributions: previousCalendar.totalContributions || 0,
        weeks: previousCalendar.weeks || [],
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
