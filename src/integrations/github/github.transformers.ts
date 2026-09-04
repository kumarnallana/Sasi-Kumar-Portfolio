import type { GitHubPortfolioData } from "./github.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformPortfolioData(rawData: any): GitHubPortfolioData {
  const user = rawData?.data?.user;
  
  if (!user) {
    throw new Error("Invalid GitHub GraphQL response structure");
  }

  return {
    publicReposCount: user.public_repos?.totalCount || 0,
    followersCount: user.followers?.totalCount || 0,
    totalCommitContributions: user.contributionsCollection?.totalCommitContributions || 0,
    totalPullRequestContributions: user.contributionsCollection?.totalPullRequestContributions || 0,
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
    recentRepositories: (user.repositories?.nodes || []).map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stargazerCount: repo.stargazerCount,
      primaryLanguage: repo.primaryLanguage,
      updatedAt: repo.updatedAt,
    })),
  };
}
