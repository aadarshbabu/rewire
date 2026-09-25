import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rewire - Modern Full-Stack App",
  description: "Next.js application with Better Auth, tRPC, and Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
