import type { Metadata } from "next";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  LifeBuoy,
  PhoneCall,
  Globe,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "24/7 Mental Health Crisis Resources & Support Hotlines (India, US, UK & Worldwide)",
  description:
    "Free, confidential, 24/7 mental health crisis helplines including India's Tele-MANAS (14416), Vandrevala Foundation, US 988, UK NHS 111, and worldwide emergency services.",
  alternates: {
    canonical: "/crisis-resources",
  },
  openGraph: {
    title: "Crisis Support Directory — HeyRewire",
    description: "Immediate 24/7 support hotlines and crisis intervention resources in India, US, UK, and globally.",
  },
};

const crisisJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "24/7 Crisis Helplines & Mental Health Emergency Directory",
  description:
    "Comprehensive directory of verified emergency hotlines, suicide prevention lifelines, and free crisis text services in India, US, Canada, UK, Australia, and worldwide.",
  url: "https://heyrewire.com/crisis-resources",
};

interface Hotline {
  region: string;
  name: string;
  phone: string;
  action: string;
  description: string;
  badge?: string;
  url?: string;
}

const CRISIS_HOTLINES: Hotline[] = [
  // India
  {
    region: "India 🇮🇳",
    name: "Tele-MANAS (National Tele Mental Health Programme)",
    phone: "14416 or 1800-891-4416",
    action: "tel:14416",
    description: "Free, confidential 24/7 mental health tele-counseling by the Government of India, available in 20+ regional Indian languages.",
    badge: "24/7 Toll-Free • Govt of India",
    url: "https://telemanas.mohfw.gov.in",
  },
  {
    region: "India 🇮🇳",
    name: "Vandrevala Foundation for Mental Health",
    phone: "+91 9999 666 555",
    action: "tel:+919999666555",
    description: "24/7 free, confidential crisis intervention and psychological counseling via phone call and WhatsApp chat.",
    badge: "24/7 • WhatsApp & Call",
    url: "https://www.vandrevalafoundation.com",
  },
  {
    region: "India 🇮🇳",
    name: "KIRAN Mental Health Rehabilitation Helpline",
    phone: "1800-599-0019",
    action: "tel:18005990019",
    description: "24/7 toll-free helpline by Ministry of Social Justice & Empowerment offering psychological first-aid and support.",
    badge: "24/7 Toll-Free",
    url: "http://depwd.gov.in",
  },
  {
    region: "India 🇮🇳",
    name: "National Emergency Number (Police, Medical, Fire)",
    phone: "112",
    action: "tel:112",
    description: "All-in-one emergency response service across all states in India.",
    badge: "Immediate Emergency",
  },

  // US & Canada
  {
    region: "United States & Canada 🇺🇸 🇨🇦",
    name: "988 Suicide & Crisis Lifeline",
    phone: "988",
    action: "tel:988",
    description: "Free, confidential 24/7 support for anyone in suicidal crisis or emotional distress. Call or text.",
    badge: "24/7 • Free",
    url: "https://988lifeline.org",
  },
  {
    region: "United States & Canada 🇺🇸 🇨🇦",
    name: "Crisis Text Line",
    phone: "Text HOME to 741741",
    action: "sms:741741?body=HOME",
    description: "Connect with a trained crisis counselor via SMS anytime. Completely confidential.",
    badge: "Text Support",
    url: "https://www.crisistextline.org",
  },
  {
    region: "United States 🇺🇸",
    name: "The Trevor Project (LGBTQ Youth)",
    phone: "1-866-488-7386",
    action: "tel:18664887386",
    description: "24/7 crisis intervention and suicide prevention services for LGBTQ young people.",
    badge: "Specialized",
    url: "https://www.thetrevorproject.org",
  },

  // UK
  {
    region: "United Kingdom 🇬🇧",
    name: "Samaritans UK",
    phone: "116 123",
    action: "tel:116123",
    description: "Whatever you're going through, a Samaritan will face it with you. 24 hours a day, 365 days a year.",
    badge: "24/7 UK",
    url: "https://www.samaritans.org",
  },
  {
    region: "United Kingdom 🇬🇧",
    name: "NHS Mental Health Services",
    phone: "111",
    action: "tel:111",
    description: "Free NHS mental health triage for urgent advice and assessment in England, Wales, and Scotland.",
    badge: "NHS",
    url: "https://www.nhs.uk/mental-health",
  },

  // Australia
  {
    region: "Australia 🇦🇺",
    name: "Lifeline Australia",
    phone: "13 11 14",
    action: "tel:131114",
    description: "National charity providing all Australians experiencing emotional distress with access to 24-hour crisis support.",
    badge: "24/7 AU",
    url: "https://www.lifeline.org.au",
  },

  // International
  {
    region: "International & Worldwide 🌐",
    name: "Befrienders Worldwide",
    phone: "Global Directory",
    action: "https://www.befrienders.org",
    description: "Volunteer emotional support centers worldwide for those struggling with suicide or loneliness.",
    badge: "Worldwide",
    url: "https://www.befrienders.org",
  },
];

export default function CrisisResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={crisisJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-20 px-6">
        <article className="mx-auto max-w-4xl space-y-12">
          {/* Header */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>Free &bull; Confidential &bull; 24/7 Access</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Emergency & Crisis Directory
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              If you or someone you care about is experiencing intense emotional distress, depression, or thoughts of self-harm, please remember you are not alone. Caring human help is free and available right now.
            </p>
          </header>

          {/* Quick Dial Banners */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* India Action */}
            <div className="rounded-3xl border border-rose-300 bg-rose-50/80 p-6 dark:border-rose-900/60 dark:bg-rose-950/30 text-center space-y-3 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-2xl mb-1">🇮🇳</div>
                <h2 className="text-lg font-bold text-rose-900 dark:text-rose-200">
                  India Crisis Action
                </h2>
                <p className="text-xs text-rose-800 dark:text-rose-300 mt-1">
                  Tele-MANAS (Govt of India): <strong>14416</strong> or <strong>1800-891-4416</strong><br />
                  Vandrevala Foundation: <strong>+91 9999 666 555</strong>
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="tel:14416"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Call Tele-MANAS (14416)</span>
                </a>
                <a
                  href="tel:+919999666555"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-600/20 dark:bg-zinc-900 dark:border-rose-800 dark:text-rose-300 transition-colors"
                >
                  <span>Call Vandrevala (+91 9999 666 555)</span>
                </a>
              </div>
            </div>

            {/* US & International Action */}
            <div className="rounded-3xl border border-rose-300 bg-rose-50/80 p-6 dark:border-rose-900/60 dark:bg-rose-950/30 text-center space-y-3 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-2xl mb-1">🇺🇸 🇨🇦 🇬🇧 🌐</div>
                <h2 className="text-lg font-bold text-rose-900 dark:text-rose-200">
                  US, UK & International
                </h2>
                <p className="text-xs text-rose-800 dark:text-rose-300 mt-1">
                  US & Canada: Call or text <strong>988</strong><br />
                  United Kingdom: Call <strong>111</strong> or <strong>116 123</strong>
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="tel:988"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Call 988 (US & Canada)</span>
                </a>
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-600/20 dark:bg-zinc-900 dark:border-rose-800 dark:text-rose-300 transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Worldwide Directory (130+ Countries)</span>
                </a>
              </div>
            </div>
          </section>

          {/* Hotline Grid */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span>Full Helplines Directory</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CRISIS_HOTLINES.map((hotline, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {hotline.region}
                      </span>
                      {hotline.badge && (
                        <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                          {hotline.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {hotline.name}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {hotline.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                    <a
                      href={hotline.action}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>{hotline.phone}</span>
                    </a>
                    {hotline.url && (
                      <a
                        href={hotline.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 inline-flex items-center gap-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Safety Reminder */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 md:p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              When should you seek emergency medical assistance?
            </h3>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>&bull; You feel an urge or have an active plan to harm yourself or others.</li>
              <li>&bull; You are unable to care for your basic physical needs or safety.</li>
              <li>&bull; In India: Dial <strong>112</strong> immediately. In US/Canada: Dial <strong>911</strong>. In UK: Dial <strong>999</strong>.</li>
            </ul>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
