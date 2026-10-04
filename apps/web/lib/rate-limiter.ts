import { redis } from "@/lib/redis";

export interface RateLimitOptions {
  /** Unique key prefix / identifier, e.g. "ai:burst:user_123" */
  key: string;
  /** Maximum number of allowed requests in the window */
  limit: number;
  /** Sliding window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfter: number; // in seconds
}

/**
 * Atomic sliding-window rate limiter powered by Redis.
 *
 * Uses a Redis sorted set (ZSET) with score = timestamp.
 * Old entries are pruned, current count is checked, and if allowed,
 * the current request timestamp is recorded atomically.
 */
const SLIDING_WINDOW_LUA = `
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local now = tonumber(ARGV[2])
local window_ms = tonumber(ARGV[3])
local clear_before = now - window_ms

-- 1. Remove expired timestamps outside the current sliding window
redis.call('ZREMRANGEBYSCORE', key, 0, clear_before)

-- 2. Count requests in active window
local count = redis.call('ZCARD', key)

if count < limit then
  -- Allow: record this request with current timestamp
  redis.call('ZADD', key, now, now .. '-' .. math.random(1, 100000))
  redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
  return { 1, limit - count - 1, 0 }
else
  -- Blocked: find timestamp of earliest entry to compute accurate Retry-After
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local retry_after = 1
  if oldest and #oldest >= 2 then
    local oldest_time = tonumber(oldest[2])
    retry_after = math.max(1, math.ceil(((oldest_time + window_ms) - now) / 1000))
  end
  return { 0, 0, retry_after }
end
`;

export async function checkRateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  try {
    const rawResult = (await redis.eval(
      SLIDING_WINDOW_LUA,
      1,
      key,
      limit,
      now,
      windowMs
    )) as [number, number, number] | null;

    if (!rawResult) {
      // In case Redis returns empty unexpectedly, allow gracefully
      return { success: true, limit, remaining: limit - 1, retryAfter: 0 };
    }

    const [allowed, remaining, retryAfter] = rawResult;

    return {
      success: allowed === 1,
      limit,
      remaining: Math.max(0, remaining),
      retryAfter: Math.max(0, retryAfter),
    };
  } catch (error) {
    // Fail-open: If Redis is temporarily unreachable, do not hard-crash user requests.
    console.warn(`[RateLimiter] Redis rate limit check failed for key "${key}":`, error);
    return {
      success: true,
      limit,
      remaining: 1,
      retryAfter: 0,
    };
  }
}

/**
 * Helper to extract client IP from incoming request headers
 */
export function getClientIp(reqOrHeaders: Request | Headers): string {
  const headers = reqOrHeaders instanceof Request ? reqOrHeaders.headers : reqOrHeaders;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Helper to extract client country from Edge headers (Vercel, Cloudflare, CloudFront)
 */
export function getClientCountry(reqOrHeaders: Request | Headers): string {
  const headers = reqOrHeaders instanceof Request ? reqOrHeaders.headers : reqOrHeaders;
  return (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("cloudfront-viewer-country") ||
    "UNKNOWN"
  );
}
