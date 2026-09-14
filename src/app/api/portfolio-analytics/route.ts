import { getPortfolioAnalytics } from "@/integrations/analytics/portfolio-analytics.server";
import { connection, NextResponse } from "next/server";

export async function GET() {
  await connection();

  const analytics = await getPortfolioAnalytics();
  return NextResponse.json(
    analytics ?? { available: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}
