import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@rewire/database";
import { redis } from "./redis";

const getBaseURL = () => {
  if (process.env.VERCEL_ENV === "production" && process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://*.vercel.app",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
      ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((o) => o.trim())
      : []),
  ],
  secondaryStorage: {
    get: async (key: string) => {
      try {
        return await redis.get(key);
      } catch {
        return null;
      }
    },
    set: async (key: string, value: string, ttl?: number) => {
      try {
        if (ttl) {
          await redis.set(key, value, "EX", ttl);
        } else {
          await redis.set(key, value);
        }
      } catch (err) {
        console.warn("[BetterAuth] Redis set error:", err);
      }
    },
    delete: async (key: string) => {
      try {
        await redis.del(key);
      } catch (err) {
        console.warn("[BetterAuth] Redis delete error:", err);
      }
    },
    getAndDelete: async (key: string) => {
      try {
        const val = await redis.get(key);
        if (val !== null) {
          await redis.del(key);
        }
        return val;
      } catch {
        return null;
      }
    },
    increment: async (key: string, ttl: number) => {
      try {
        const val = await redis.incr(key);
        if (val === 1 && ttl) {
          await redis.expire(key, ttl);
        }
        return val;
      } catch {
        return 1;
      }
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: "secondary-storage",
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
      "/api/auth/sign-in/email": { window: 60, max: 5 },
      "/api/auth/sign-up/email": { window: 60, max: 3 },
      "/forget-password": { window: 300, max: 3 },
      "/reset-password": { window: 300, max: 5 },
      "/api/auth/forget-password": { window: 300, max: 3 },
      "/api/auth/reset-password": { window: 300, max: 5 },
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
      disableIpTracking: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
