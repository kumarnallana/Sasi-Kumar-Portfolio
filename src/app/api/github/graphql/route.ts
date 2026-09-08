import {
  EMPTY_GITHUB_PORTFOLIO,
  getGitHubPortfolioData,
} from "@/integrations/github/github.server";
import { connection, NextResponse } from "next/server";

export async function GET() {
  // GitHub availability is a request-time concern. Avoid baking a temporary
  // upstream outage into the production build's prerendered route response.
  await connection();

  try {
    const data = await getGitHubPortfolioData();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    console.warn(`[github] ${reason}; serving temporary fallback data.`);

    // GitHub data enhances the portfolio but is not required for the page.
    // A successful fallback prevents client retries from amplifying a brief
    // upstream outage. no-store ensures the fallback itself is never cached.
    return NextResponse.json(
      EMPTY_GITHUB_PORTFOLIO,
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-GitHub-Data": "fallback",
        },
      },
    );
  }
}
