import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@rewire/database";

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
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
