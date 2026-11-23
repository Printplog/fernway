import { IfSupportEmail, SupportEmailAddress, SupportEmailLink } from "@/components/shared/support-email";
import Link from "next/link";
import { FileText, MessageSquareText } from "lucide-react";
import { footerColumns, savingsApy } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { SiteLogo } from "./site-logo";

export function SiteFooter() {
  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-navy font-body text-white">
      <FooterShapes />
      <div className="site-container grid grid-cols-2 gap-x-6 gap-y-8 pt-14 pb-10 sm:gap-10 lg:grid-cols-4 lg:pt-[100px] lg:pb-[50px]">
        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="font-dm text-lg font-medium sm:text-[22px]">{column.title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm sm:mt-6 sm:gap-3 sm:text-base">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="site-container grid items-center gap-6 py-10 sm:gap-8 lg:grid-cols-3 lg:gap-10 lg:pt-20 lg:pb-[70px]">
          <div className="flex flex-col gap-3 sm:gap-5">
            <SiteLogo tone="brand" />
            <p className="text-sm text-white/60 sm:text-base">
              Copyright © <span className="font-medium text-white">{siteConfig.name}</span>
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:gap-5">
            <IfSupportEmail>
              <div>
                <SupportEmailLink className="font-dm text-xl font-medium break-all hover:text-amber sm:text-2xl">
                  <SupportEmailAddress />
                </SupportEmailLink>
                <p className="mt-1 text-sm text-white/60 sm:text-base">Customer Care</p>
              </div>
            </IfSupportEmail>
          </div>
          <div className="flex flex-col gap-3 sm:gap-5">
            <Link
              href="/#rates"
              className="flex h-12 items-center justify-between border border-white/15 px-4 font-dm text-base font-medium hover:border-white/40 sm:h-[54px] sm:px-5 sm:text-lg"
            >
              Rates & Fee Schedule
              <FileText className="size-5 text-white/70" aria-hidden="true" />
            </Link>
            <IfSupportEmail>
              <SupportEmailLink
                subject="Complaint"
                className="flex h-12 items-center justify-between border border-white/15 px-4 font-dm text-base font-medium hover:border-white/40 sm:h-[54px] sm:px-5 sm:text-lg"
              >
                Register Your Complaint
                <MessageSquareText className="size-5 text-white/70" aria-hidden="true" />
              </SupportEmailLink>
            </IfSupportEmail>
          </div>
        </div>
      </div>

      <div className="bg-navy-deep">
        <div className="site-container flex flex-col gap-3 pt-6 pb-16 text-xs text-white/55 sm:gap-4 sm:py-7 sm:text-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75 sm:gap-x-7 sm:text-base">
            <Link href="/#services" className="hover:text-white">
              All Accounts
            </Link>
            <Link href="/#rates" className="hover:text-white">
              Rates & Fees
            </Link>
            <Link href="/sign-in" className="hover:text-white">
              Login
            </Link>
          </div>
          <p>
            ¹ {savingsApy} Annual Percentage Yield (APY) on High-Yield Savings. APYs are variable and can change at any time.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterShapes() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 780"
      preserveAspectRatio="none"
      className="absolute inset-0 -z-10 h-full w-full text-white/[0.03]"
    >
      <polygon points="0,0 220,0 0,260" fill="currentColor" />
      <polygon points="120,120 340,420 120,420" fill="currentColor" />
      <polygon points="1440,80 1220,320 1440,560" fill="currentColor" />
      <polygon points="1250,420 1440,780 1060,780" fill="currentColor" />
    </svg>
  );
}
