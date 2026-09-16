import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@rewire/types", "@rewire/validation", "@rewire/database"],
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
};

export default nextConfig;
