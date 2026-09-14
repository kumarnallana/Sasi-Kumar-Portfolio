const CONTRIBUTION_CALENDAR_FIELDS = `
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
`;

export const PORTFOLIO_GRAPHQL_QUERY = `
  query PortfolioData(
    $username: String!
    $currentFrom: DateTime!
    $currentTo: DateTime!
    $previousFrom: DateTime!
    $previousTo: DateTime!
  ) {
    user(login: $username) {
      company
      location
      isHireable
      followers { totalCount }
      following { totalCount }
      repositories(first: 1) { totalCount }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            primaryLanguage { name color }
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
          primaryLanguage { name color }
          updatedAt
        }
      }
      allRepos: repositories(first: 100, isFork: false) {
        nodes { stargazerCount }
      }
      currentContributions: contributionsCollection(from: $currentFrom, to: $currentTo) {
        contributionYears
        ${CONTRIBUTION_CALENDAR_FIELDS}
      }
      previousContributions: contributionsCollection(from: $previousFrom, to: $previousTo) {
        ${CONTRIBUTION_CALENDAR_FIELDS}
      }
    }
  }
`;

export const CONTRIBUTION_YEAR_GRAPHQL_QUERY = `
  query ContributionYear($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        ${CONTRIBUTION_CALENDAR_FIELDS}
      }
    }
  }
`;
