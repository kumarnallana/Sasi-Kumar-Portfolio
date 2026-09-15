import "server-only";

import { createHash } from "node:crypto";

const COUNT_KEY = "nsk:portfolio:appreciations:count";
const VISITOR_KEY_PREFIX = "nsk:portfolio:appreciations:visitor:";

type RedisResult<T> = {
  result: T;
  error?: string;
};

function getRedisCredentials() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

function visitorKey(visitorId: string) {
  const digest = createHash("sha256").update(visitorId).digest("hex");
  return `${VISITOR_KEY_PREFIX}${digest}`;
}

async function runRedis<T>(command: (string | number)[]): Promise<T | null> {
  const credentials = getRedisCredentials();
  if (!credentials) return null;

  try {
    const response = await fetch(credentials.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as RedisResult<T>;
    return payload.error ? null : payload.result;
  } catch {
    return null;
  }
}

export function isAppreciationStorageConfigured() {
  return Boolean(getRedisCredentials());
}

export async function getPortfolioAppreciation(visitorId: string) {
  const results = await runRedis<[number | string | null, number]>([
    "EVAL",
    "return {redis.call('GET', KEYS[1]), redis.call('EXISTS', KEYS[2])}",
    2,
    COUNT_KEY,
    visitorKey(visitorId),
  ]);

  if (!results) return null;

  const count = Math.max(0, Number(results[0] ?? 0));
  return {
    count: Number.isFinite(count) ? count : 0,
    appreciated: Number(results[1]) === 1,
  };
}

const APPRECIATE_SCRIPT = `
local added = redis.call('SET', KEYS[2], '1', 'NX')
if added then
  return redis.call('INCR', KEYS[1])
end
return tonumber(redis.call('GET', KEYS[1]) or '0')
`;

const UNDO_SCRIPT = `
local removed = redis.call('DEL', KEYS[2])
local current = tonumber(redis.call('GET', KEYS[1]) or '0')
if removed == 1 and current > 0 then
  return redis.call('DECR', KEYS[1])
end
return current
`;

export async function setPortfolioAppreciation(visitorId: string, appreciated: boolean) {
  const count = await runRedis<number>([
    "EVAL",
    appreciated ? APPRECIATE_SCRIPT : UNDO_SCRIPT,
    2,
    COUNT_KEY,
    visitorKey(visitorId),
  ]);

  if (count === null) return null;
  const numericCount = Number(count);
  if (!Number.isFinite(numericCount)) return null;
  return { count: Math.max(0, numericCount), appreciated };
}
