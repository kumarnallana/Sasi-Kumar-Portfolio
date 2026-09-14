export const PORTFOLIO_GRAPHQL_QUERY = `
  query PortfolioData($username: String!) {
    user(login: $username) {
      company
      location
      isHireable
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 1) {
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
      allRepos: repositories(first: 100, isFork: false) {
        nodes {
          stargazerCount
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`;
