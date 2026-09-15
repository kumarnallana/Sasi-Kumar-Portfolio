import type { GitHubPortfolioData } from "./github.types";

type ContributionCalendar = {
  weeks?: Array<{ contributionDays?: Array<{ date?: string; contributionCount?: number }> }>;
};

function previousUtcDay(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function calculateCurrentStreak(
  calendars: ContributionCalendar[],
  today = new Date().toISOString().slice(0, 10),
) {
  const contributions = new Map<string, number>();
  for (const calendar of calendars) {
    for (const week of calendar?.weeks ?? []) {
      for (const day of week?.contributionDays ?? []) {
        if (day.date) contributions.set(day.date, Number(day.contributionCount) || 0);
      }
    }
  }

  let cursor = contributions.get(today) ? today : previousUtcDay(today);
  let streak = 0;
  while ((contributions.get(cursor) ?? 0) > 0) {
    streak += 1;
    cursor = previousUtcDay(cursor);
  }
  return streak;
}

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

  return {
    publicReposCount: user.repositories?.totalCount || 0,
    currentStreak: calculateCurrentStreak([currentCalendar, previousCalendar]),
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
