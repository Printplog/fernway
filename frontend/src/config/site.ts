import type { CurrencyCode } from "@/types/banking";

const configuredUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://lindenwaybank.com").trim().replace(/\/+$/, "");

export const siteConfig = {
  name: "Lindenway",
  legalName: "Lindenway Bank",
  alternateNames: [
    "Lindenway",
    "Lindenway Bank",
    "Lindenway Online Banking",
    "Lindenway Banking",
  ],
  domain: "lindenwaybank.com",
  url: configuredUrl,
  supportEmail: "support@lindenwaybank.com",
  tagline: "Online Banking",
  description:
    "Secure online banking, personal accounts, bank transfers, and debit cards with Lindenway Bank.",
  keywords: [
    "Lindenway",
    "Lindenway Bank",
    "Lindenway Online Banking",
    "lindenwaybank.com",
    "online banking",
    "digital banking",
    "personal banking",
    "debit cards",
    "bank transfers",
    "online bank sign in",
  ],
  locale: "en-US",
  defaultCurrency: "USD" satisfies CurrencyCode,
} as const;

export const defaultOgImage = {
  url: "/og-image?v=2",
  width: 1200,
  height: 630,
  alt: `${siteConfig.legalName} — Online Banking`,
} as const;

/** Areas that need a signed-in session. The proxy guards them; outside them a 401 is normal. */
export const signedInAreas = ["/overview", "/transactions", "/transfers", "/cards", "/admin"] as const;

export const isInSignedInArea = (pathname: string) =>
  signedInAreas.some((area) => pathname === area || pathname.startsWith(`${area}/`));

export const navItems = [
  { href: "/overview", label: "Overview", shortLabel: "Home", icon: "overview" },
  { href: "/transactions", label: "Transactions", shortLabel: "Activity", icon: "transactions" },
  { href: "/transfers", label: "Transfers", shortLabel: "Transfers", icon: "transfers" },
  { href: "/cards", label: "Cards", shortLabel: "Cards", icon: "cards" },
] as const;

export type NavItem = (typeof navItems)[number];
export type NavIcon = NavItem["icon"];
