// GitHub API client — thin typed wrapper over the Next.js route handlers
// All fetches go through /api/github/* to protect the token server-side

export type GitHubProfile = {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
};

export type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  fork: boolean;
};

export type GitHubStarred = GitHubRepo;

async function ghFetch<T>(endpoint: "profile" | "repos" | "starred"): Promise<T> {
  const res = await fetch(`/api/github/${endpoint}`);
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    throw new Error("FETCH_ERROR");
  }
  return res.json() as Promise<T>;
}

export const githubClient = {
  profile: () => ghFetch<GitHubProfile>("profile"),
  repos: () => ghFetch<GitHubRepo[]>("repos"),
  starred: () => ghFetch<GitHubStarred[]>("starred"),
};
