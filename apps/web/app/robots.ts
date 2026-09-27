import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://heyrewire.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/disclaimer",
          "/privacy",
          "/terms",
          "/crisis-resources",
          "/offload",
          "/tools/*",
          "/techniques/*",
        ],
        disallow: [
          "/api/*",
          "/chat/*",
          "/auth/*",
          "/trpc/*",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
