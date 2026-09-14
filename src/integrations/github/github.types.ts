export type GitHubLanguage = {
  name: string;
  color: string;
};

export type GitHubRepository = {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage: GitHubLanguage | null;
  updatedAt: string;
};

export type GitHubContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export type GitHubContributionDay = {
  contributionCount: number;
  contributionLevel: GitHubContributionLevel;
  date: string;
  weekday: number;
};

export type GitHubContributionWeek = {
  contributionDays: GitHubContributionDay[];
};

export type GitHubPortfolioData = {
  publicReposCount: number;
  totalStars: number;
  followersCount: number;
  followingCount: number;
  company: string | null;
  location: string | null;
  isHireable: boolean;
  totalContributions: number;
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  contributionWeeks: GitHubContributionWeek[];
  pinnedRepositories: GitHubRepository[];
  recentRepositories: GitHubRepository[];
};
