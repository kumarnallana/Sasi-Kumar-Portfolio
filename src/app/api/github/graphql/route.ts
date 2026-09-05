import { getGitHubPortfolioData } from "@/integrations/github/github.server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getGitHubPortfolioData();
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === "RATE_LIMIT") {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Failed to load GitHub data" },
      { status: 500 },
    );
  }
}
