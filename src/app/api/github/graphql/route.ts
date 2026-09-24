import {
  getGitHubFailureCode,
  getGitHubPortfolioData,
} from "@/integrations/github/github.server";
import { connection, NextResponse } from "next/server";

export async function GET() {
  // GitHub availability is a request-time concern. Avoid baking a temporary
  // upstream outage into the production build's prerendered route response.
  await connection();

  try {
    const data = await getGitHubPortfolioData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch (error: unknown) {
    const reason = getGitHubFailureCode(error);
    console.warn(`[github] ${reason}; live data is temporarily unavailable.`);

    return NextResponse.json(
      { available: false },
      {
        status: reason === "RATE_LIMIT" ? 429 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
