import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redisClient?: Redis;
};

export function getRedisClient(): Redis {
  if (globalForRedis.redisClient) {
    return globalForRedis.redisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  const host = process.env.REDIS_HOST || "127.0.0.1";
  const port = Number(process.env.REDIS_PORT) || 6379;
  const password = process.env.REDIS_PASSWORD;

  const client = redisUrl
    ? new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 3,
      })
    : new Redis({
        host,
        port,
        password: password || undefined,
        lazyConnect: true,
        maxRetriesPerRequest: 3
      });

  client.on("error", (err) => {
    // Prevent unhandled error crashes in case Redis is momentarily offline
    console.warn(`[Redis] Connection error: ${err.message}`);
  });

  if (process.env.NODE_ENV !== "production") {
    globalForRedis.redisClient = client;
  }

  return client;
}

export const redis = getRedisClient();
