import { connection, NextResponse } from "next/server";
import { getGitHubContributionYear, getGitHubFailureCode } from "@/integrations/github/github.server";

export async function GET(_request: Request, { params }: { params: Promise<{ year: string }> }) {
  await connection();
  const year = Number((await params).year);
  try {
    return NextResponse.json(await getGitHubContributionYear(year), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const reason = getGitHubFailureCode(error);
    return NextResponse.json({ available: false }, {
      status: reason === "RATE_LIMIT" ? 429 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
