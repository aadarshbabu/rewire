import type { Metadata, Viewport } from "next";
import { TRPCReactProvider } from "@/trpc/client";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://heyrewire.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d9488" },
    { media: "(prefers-color-scheme: dark)", color: "#042f2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "HeyRewire — Break Overthinking Spirals, Relieve Stress & Track Mood",
    template: "%s | HeyRewire Mental Health Companion",
  },
  description:
    "Overcome overthinking, navigate depression, and calm stress with HeyRewire. Grounded in CBT techniques, featuring an empathetic AI chat companion, private brain dump journaling, and longitudinal mood analytics.",
  keywords: [
    "heyrewire",
    "stop overthinking",
    "how to stop overthinking at night",
    "anxiety grounding exercises",
    "CBT thought reframing",
    "brain dump journal",
    "depression mood tracker",
    "AI mental health companion",
    "box breathing technique",
    "stress relief exercises",
    "tele-manas online self-care",
    "emotional regulation tool",
  ],
  authors: [{ name: "HeyRewire Mental Health Team", url: APP_URL }],
  creator: "HeyRewire",
  publisher: "HeyRewire",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "HeyRewire",
    title: "HeyRewire — AI Mental Health Companion for Overthinking & Stress",
    description:
      "Grounded in CBT techniques to break rumination loops, calm racing thoughts, and track emotional wellness over time.",
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "HeyRewire - Mental Health Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeyRewire — Break Overthinking Spirals & Calm Stress",
    description:
      "Interactive mental health companion with CBT-grounded journaling, guided breathing, and mood analytics.",
    images: ["/web-app-manifest-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const globalStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${APP_URL}/#app`,
      "name": "HeyRewire Mental Health Companion",
      "url": APP_URL,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All modern web browsers, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "featureList": [
        "Interactive Brain Dump & Cognitive Offloading",
        "CBT-grounded Conversational AI Companion",
        "Longitudinal Mood Tracking and Visual Graphs",
        "Guided Box Breathing Widget for Acute Anxiety",
        "Multi-Regional 24/7 Crisis Hotline Quick Escalation (India Tele-MANAS 14416, US 988, UK 111)",
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": "Individuals struggling with overthinking, depression, stress, and anxiety",
      },
    },
    {
      "@type": "MedicalOrganization",
      "@id": `${APP_URL}/#org`,
      "name": "HeyRewire Mental Wellness",
      "url": APP_URL,
      "description":
        "Provider of accessible, evidence-informed digital tools for cognitive reframing, emotional regulation, and stress management.",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "14416",
          "contactType": "Emergency Tele-MANAS Crisis Support (India)",
          "availableLanguage": ["English", "Hindi"],
        },
        {
          "@type": "ContactPoint",
          "telephone": "988",
          "contactType": "Emergency Crisis Lifeline Support (US & Canada)",
          "availableLanguage": ["English", "Spanish"],
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <JsonLd data={globalStructuredData} />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
