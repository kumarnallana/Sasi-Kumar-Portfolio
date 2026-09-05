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

export type GitHubPortfolioData = {
  publicReposCount: number;
  totalStars: number;
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  pinnedRepositories: GitHubRepository[];
  recentRepositories: GitHubRepository[];
};
