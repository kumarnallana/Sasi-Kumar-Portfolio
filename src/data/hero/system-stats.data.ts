export const systemStats = [
  { label: "INTERNSHIP", value: "3 MO" },
  { label: "MENTORED", value: "60+" },
  // GitHub stats will be dynamically populated in components via TanStack Query
  { label: "GITHUB STARS", value: "LIVE", isDynamic: true, queryKey: "stars" },
  { label: "PUBLIC REPOS", value: "LIVE", isDynamic: true, queryKey: "repos" },
];
