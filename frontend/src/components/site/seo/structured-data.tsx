import { faqItems, savingsApy } from "@/config/marketing";
import { siteConfig } from "@/config/site";

/**
 * Schema.org JSON-LD structured data for Lindenway Bank (lindenwaybank.com).
 * Emits Organization, FinancialService, WebSite, WebPage, and FAQPage entities
 * in a single @graph so search engines understand the brand, products, and FAQs.
 */
export function SiteStructuredData() {
  const baseUrl = siteConfig.url;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: siteConfig.legalName,
        alternateName: [...siteConfig.alternateNames],
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/apple-touch-icon.png`,
          width: 180,
          height: 180,
        },
        image: `${baseUrl}/og-image`,
        email: siteConfig.supportEmail,
        description: siteConfig.description,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: siteConfig.supportEmail,
            availableLanguage: ["English"],
          },
        ],
      },
      {
        "@type": "FinancialService",
        "@id": `${baseUrl}/#service`,
        name: `${siteConfig.legalName} Online Banking`,
        alternateName: siteConfig.name,
        url: baseUrl,
        image: `${baseUrl}/og-image`,
        description: siteConfig.description,
        currenciesAccepted: "USD",
        areaServed: {
          "@type": "Country",
          name: "United States",
        },
        provider: {
          "@id": `${baseUrl}/#organization`,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Lindenway Bank Accounts & Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "FinancialProduct",
                name: "Online Checking Account & Physical Visa Debit Card",
                description:
                  "Everyday checking with direct deposit, bill pay, $0 standard ACH transfers, and a physical Visa debit card with instant freeze controls.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "FinancialProduct",
                name: "High-Yield Savings Account",
                description: `Earn ${savingsApy} APY variable rate on savings with free, instant transfers to checking.`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "FinancialProduct",
                name: "Same-Day ACH & Wire Transfers",
                description:
                  "Send money with $0 standard ACH, $2.00 same-day ACH, or $15.00 domestic wire transfers with transparent upfront fees.",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: siteConfig.legalName,
        alternateName: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.locale,
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl,
        name: `${siteConfig.legalName} | Online Banking`,
        description: siteConfig.description,
        inLanguage: siteConfig.locale,
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        about: {
          "@id": `${baseUrl}/#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${baseUrl}/og-image`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
