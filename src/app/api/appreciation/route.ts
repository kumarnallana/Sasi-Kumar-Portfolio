import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  getPortfolioAppreciation,
  isAppreciationStorageConfigured,
  setPortfolioAppreciation,
} from "@/integrations/appreciation/portfolio-appreciation.server";

const VISITOR_COOKIE = "nsk_appreciation_visitor";
const ONE_YEAR = 60 * 60 * 24 * 365;

async function getVisitor() {
  const cookieStore = await cookies();
  return cookieStore.get(VISITOR_COOKIE)?.value ?? randomUUID();
}

function withVisitorCookie(response: NextResponse, visitorId: string) {
  response.cookies.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_YEAR,
    path: "/",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function GET() {
  if (!isAppreciationStorageConfigured()) {
    return NextResponse.json({ available: false }, { headers: { "Cache-Control": "no-store" } });
  }

  const visitorId = await getVisitor();
  const appreciation = await getPortfolioAppreciation(visitorId);
  const response = NextResponse.json(
    appreciation ? { available: true, ...appreciation } : { available: false },
  );
  return withVisitorCookie(response, visitorId);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return NextResponse.json({ available: false }, { status: 403 });
  }
  if (!isAppreciationStorageConfigured()) {
    return NextResponse.json({ available: false }, { status: 503 });
  }

  let appreciated: boolean;
  try {
    const body = (await request.json()) as { appreciated?: unknown };
    if (typeof body.appreciated !== "boolean") throw new Error("Invalid body");
    appreciated = body.appreciated;
  } catch {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  const visitorId = await getVisitor();
  const result = await setPortfolioAppreciation(visitorId, appreciated);
  const response = NextResponse.json(
    result ? { available: true, ...result } : { available: false },
    { status: result ? 200 : 503 },
  );
  return withVisitorCookie(response, visitorId);
}
