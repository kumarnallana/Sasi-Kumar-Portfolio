import type { PortfolioAnalytics } from "./portfolio-analytics.types";

type VercelCountResponse = {
  data?: {
    pageviews?: number;
    visitors?: number;
  };
};

export async function getPortfolioAnalytics(): Promise<PortfolioAnalytics | null> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_ANALYTICS_PROJECT_ID;
  const teamId = process.env.VERCEL_ANALYTICS_TEAM_ID;

  if (!token || !projectId) return null;

  const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/count");
  url.searchParams.set("projectId", projectId);
  if (teamId) url.searchParams.set("teamId", teamId);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "force-cache",
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6_000),
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const payload = (await response.json()) as VercelCountResponse;
  const pageviews = payload.data?.pageviews;
  const visitors = payload.data?.visitors;

  if (!Number.isFinite(pageviews) || !Number.isFinite(visitors)) return null;

  return { pageviews: pageviews!, visitors: visitors! };
}
