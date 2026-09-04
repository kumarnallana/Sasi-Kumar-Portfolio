export const github = {
  handle: "kumarnallana",
  url: "https://github.com/kumarnallana",
  totalStars: 0, // Hydrated by query
  publicRepos: 0, // Hydrated by query
  followers: 0, // Hydrated by query
};

export type Repo = {
  name: string;
  desc: string;
  lang: string;
  stars: number;
  url: string;
  tag: string;
};

// Initial empty/fallback array - will be replaced by TanStack Query
export const repos: Repo[] = [];
