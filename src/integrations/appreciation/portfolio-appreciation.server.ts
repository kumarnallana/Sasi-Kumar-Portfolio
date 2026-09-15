import "server-only";

import { createHash } from "node:crypto";

type AppreciationState = {
  count: number;
  appreciated: boolean;
};

function getSupabaseCredentials() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey
    ? { url: url.replace(/\/$/, ""), serviceRoleKey }
    : null;
}

function visitorHash(visitorId: string) {
  return createHash("sha256").update(visitorId).digest("hex");
}

async function callSupabaseRpc(
  functionName: "get_portfolio_appreciation" | "set_portfolio_appreciation",
  body: Record<string, unknown>,
): Promise<AppreciationState | null> {
  const credentials = getSupabaseCredentials();
  if (!credentials) return null;

  try {
    const response = await fetch(`${credentials.url}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: credentials.serviceRoleKey,
        Authorization: `Bearer ${credentials.serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;

    const value = (await response.json()) as Partial<AppreciationState>;
    const count = Number(value.count);
    if (!Number.isFinite(count) || typeof value.appreciated !== "boolean") return null;
    return { count: Math.max(0, count), appreciated: value.appreciated };
  } catch {
    return null;
  }
}

export function isAppreciationStorageConfigured() {
  return Boolean(getSupabaseCredentials());
}

export function getPortfolioAppreciation(visitorId: string) {
  return callSupabaseRpc("get_portfolio_appreciation", {
    p_visitor_hash: visitorHash(visitorId),
  });
}

export function setPortfolioAppreciation(visitorId: string, appreciated: boolean) {
  return callSupabaseRpc("set_portfolio_appreciation", {
    p_visitor_hash: visitorHash(visitorId),
    p_appreciated: appreciated,
  });
}
