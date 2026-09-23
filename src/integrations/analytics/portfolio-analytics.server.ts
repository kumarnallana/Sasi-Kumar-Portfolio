import type { PortfolioAnalytics } from "./portfolio-analytics.types";

type VercelAggregateResponse = {
  data?: Array<{
    pageviews?: number;
    visitors?: number;
  }>;
};

const PORTFOLIO_ANALYTICS_START_AT = "2026-09-23T16:50:44+05:30";

export async function getPortfolioAnalytics(): Promise<PortfolioAnalytics | null> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_ANALYTICS_PROJECT_ID;
  const teamId = process.env.VERCEL_ANALYTICS_TEAM_ID;

  if (!token || !projectId) return null;

  const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/aggregate");
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("by", "environment");
  url.searchParams.set("since", PORTFOLIO_ANALYTICS_START_AT);
  url.searchParams.set("until", new Date().toISOString());
  url.searchParams.set("filter", "environment eq 'production'");
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

  const payload = (await response.json()) as VercelAggregateResponse;
  if (!Array.isArray(payload.data)) return null;

  const totals = payload.data.reduce<PortfolioAnalytics>(
    (sum, row) => ({
      pageviews: sum.pageviews + (typeof row.pageviews === "number" && Number.isFinite(row.pageviews) ? row.pageviews : 0),
      visitors: sum.visitors + (typeof row.visitors === "number" && Number.isFinite(row.visitors) ? row.visitors : 0),
    }),
    { pageviews: 0, visitors: 0 },
  );

  return totals;
}
