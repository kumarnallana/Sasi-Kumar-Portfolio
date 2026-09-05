export const PORTFOLIO_GRAPHQL_QUERY = `
  query PortfolioData($username: String!) {
    user(login: $username) {
      repositories(first: 1) {
        totalCount
      }
      followers {
        totalCount
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            primaryLanguage {
              name
              color
            }
            updatedAt
          }
        }
      }
      recentRepos: repositories(first: 20, orderBy: { field: UPDATED_AT, direction: DESC }, isFork: false) {
        nodes {
          name
          description
          url
          stargazerCount
          primaryLanguage {
            name
            color
          }
          updatedAt
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
      }
    }
  }
`;
