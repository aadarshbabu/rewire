import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@rewire/types", "@rewire/validation"],
};

export default nextConfig;
