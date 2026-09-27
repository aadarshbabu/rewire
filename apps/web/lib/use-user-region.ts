"use client";

import { useState, useEffect } from "react";

export type SupportedRegion = "IN" | "US" | "GB" | "AU" | "GLOBAL";

export interface RegionCrisisInfo {
  code: SupportedRegion;
  countryName: string;
  flag: string;
  primaryHelplineName: string;
  primaryNumber: string;
  primaryAction: string;
  secondaryHelplineName?: string;
  secondaryNumber?: string;
  secondaryAction?: string;
  emergencyNumber: string;
  description: string;
}

export const REGION_CRISIS_DATA: Record<SupportedRegion, RegionCrisisInfo> = {
  IN: {
    code: "IN",
    countryName: "India",
    flag: "🇮🇳",
    primaryHelplineName: "Tele-MANAS (Govt of India)",
    primaryNumber: "14416",
    primaryAction: "tel:14416",
    secondaryHelplineName: "Vandrevala Mental Health Foundation",
    secondaryNumber: "+91 9999 666 555",
    secondaryAction: "tel:+919999666555",
    emergencyNumber: "112",
    description: "24/7 free, confidential mental health tele-counseling across 20+ Indian languages (Toll-Free 14416 or 1800-891-4416).",
  },
  US: {
    code: "US",
    countryName: "United States & Canada",
    flag: "🇺🇸",
    primaryHelplineName: "988 Suicide & Crisis Lifeline",
    primaryNumber: "988",
    primaryAction: "tel:988",
    secondaryHelplineName: "Crisis Text Line",
    secondaryNumber: "Text HOME to 741741",
    secondaryAction: "sms:741741?body=HOME",
    emergencyNumber: "911",
    description: "Free, confidential 24/7 support for anyone in suicidal crisis or emotional distress. Call or text 988.",
  },
  GB: {
    code: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    primaryHelplineName: "NHS Mental Health Services",
    primaryNumber: "111",
    primaryAction: "tel:111",
    secondaryHelplineName: "Samaritans UK",
    secondaryNumber: "116 123",
    secondaryAction: "tel:116123",
    emergencyNumber: "999",
    description: "24/7 NHS urgent mental health assessment (dial 111) or confidential emotional listening via Samaritans (116 123).",
  },
  AU: {
    code: "AU",
    countryName: "Australia",
    flag: "🇦🇺",
    primaryHelplineName: "Lifeline Australia",
    primaryNumber: "13 11 14",
    primaryAction: "tel:131114",
    secondaryHelplineName: "Beyond Blue",
    secondaryNumber: "1300 22 4636",
    secondaryAction: "tel:1300224636",
    emergencyNumber: "000",
    description: "24/7 crisis support and suicide prevention services across Australia.",
  },
  GLOBAL: {
    code: "GLOBAL",
    countryName: "International / Worldwide",
    flag: "🌐",
    primaryHelplineName: "Befrienders Worldwide Directory",
    primaryNumber: "Find Local Helpline",
    primaryAction: "https://www.befrienders.org",
    secondaryHelplineName: "Find A Helpline (130+ Countries)",
    secondaryNumber: "findahelpline.com",
    secondaryAction: "https://findahelpline.com",
    emergencyNumber: "112",
    description: "Free, confidential emotional support centers and verified local crisis helplines worldwide.",
  },
};

/**
 * Detects user region based on timezone and locale without external API calls.
 * Defaults to India if timezone indicates IST (+05:30) or Indian locale.
 */
export function detectUserRegion(): SupportedRegion {
  if (typeof window === "undefined") return "IN";

  try {
    const saved = localStorage.getItem("rewire_user_region");
    if (saved && saved in REGION_CRISIS_DATA) {
      return saved as SupportedRegion;
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const languages = navigator.languages || [navigator.language || ""];

    // India detection
    if (
      tz.includes("Calcutta") ||
      tz.includes("Kolkata") ||
      tz === "Asia/Colombo" ||
      languages.some((l) => l.endsWith("-IN") || l.startsWith("hi") || l.startsWith("ta") || l.startsWith("te"))
    ) {
      return "IN";
    }

    // US & Canada detection
    if (
      tz.startsWith("America/") ||
      tz.includes("Honolulu") ||
      tz.includes("Anchorage")
    ) {
      return "US";
    }

    // United Kingdom detection
    if (tz.includes("London") || tz.includes("Belfast")) {
      return "GB";
    }

    // Australia detection
    if (tz.startsWith("Australia/")) {
      return "AU";
    }
  } catch {
    // ignore
  }

  return "IN"; // Default to India as requested
}

export function useUserRegion() {
  const [region, setRegionState] = useState<SupportedRegion>("IN");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const detected = detectUserRegion();
    setRegionState(detected);
    setIsLoaded(true);
  }, []);

  const setRegion = (newRegion: SupportedRegion) => {
    setRegionState(newRegion);
    try {
      localStorage.setItem("rewire_user_region", newRegion);
    } catch {
      // ignore
    }
  };

  return {
    region,
    regionData: REGION_CRISIS_DATA[region],
    allRegions: Object.values(REGION_CRISIS_DATA),
    setRegion,
    isLoaded,
  };
}
