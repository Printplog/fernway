import type { Metadata } from "next";
import { AppShowcase } from "@/components/site/home/app-showcase";
import { BankingNeeds } from "@/components/site/home/banking-needs";
import { BetterTomorrow } from "@/components/site/home/better-tomorrow";
import { CardPromo } from "@/components/site/home/card-promo";
import { Faq } from "@/components/site/home/faq";
import { GrowWealth } from "@/components/site/home/grow-wealth";
import { HeroSlider } from "@/components/site/home/hero-slider";
import { Highlights } from "@/components/site/home/highlights";
import { RatesBoard } from "@/components/site/home/rates-board";
import { ServiceRequests } from "@/components/site/home/service-requests";
import { SloganBanner } from "@/components/site/home/slogan-banner";
import { SiteStructuredData } from "@/components/site/seo/structured-data";
import { defaultOgImage, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.legalName} | Online Banking` },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.legalName,
    url: siteConfig.url,
    title: `${siteConfig.legalName} | Online Banking`,
    description: siteConfig.description,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.legalName} | Online Banking`,
    description: siteConfig.description,
    images: [defaultOgImage.url],
  },
};

export default function HomePage() {
  return (
    <>
      <SiteStructuredData />
      <HeroSlider />
      <Highlights />
      <BetterTomorrow />
      <BankingNeeds />
      <GrowWealth />
      <ServiceRequests />
      <CardPromo />
      <AppShowcase />
      <RatesBoard />
      <Faq />
      <SloganBanner />
    </>
  );
}
