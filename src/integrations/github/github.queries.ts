export const PORTFOLIO_GRAPHQL_QUERY = `
  query PortfolioData($username: String!) {
    user(login: $username) {
      public_repos: repositories(privacy: PUBLIC) {
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
      repositories(first: 20, orderBy: { field: UPDATED_AT, direction: DESC }, privacy: PUBLIC, isFork: false) {
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
