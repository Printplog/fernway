"use client";

import { IfSupportEmail, SupportEmailLink } from "@/components/shared/support-email";
import Image from "next/image";
import { AlignRight, ArrowLeftRight, BadgeDollarSign, Landmark, PiggyBank, Zap } from "lucide-react";
import { savingsApy, transferPricing } from "@/config/marketing";
import { SectionTitle } from "./section-title";

const bankingIcons = [PiggyBank, ArrowLeftRight, Landmark, Zap, BadgeDollarSign];

function RateCard({
  media,
  title,
  rows,
  className,
}: {
  media: React.ReactNode;
  title: string;
  rows: Array<[string, string]>;
  className?: string;
}) {
  return (
    <div className={`flex flex-col border border-white/15 bg-navy/40 text-white ${className ?? ""}`}>
      <div className="flex flex-col items-center gap-3 px-3 pt-5 pb-4 sm:gap-4 sm:px-4 sm:pt-[30px] sm:pb-6">
        {media}
        <p className="text-center font-dm text-base font-medium sm:text-lg">{title}</p>
      </div>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex items-center justify-between gap-2 border-t border-white/10 bg-white/5 px-3 py-2.5 font-body text-xs sm:px-4 sm:py-3.5 sm:text-sm lg:text-base"
        >
          <span className="shrink-0 text-white/75">{label}</span>
          <span className="hidden text-white/40 sm:inline">:</span>
          <span className="text-right font-medium tabular-nums">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function RatesBoard() {
  return (
    <section id="rates" className="relative isolate scroll-mt-6 overflow-hidden bg-navy py-14 sm:py-20 lg:pt-[100px] lg:pb-[70px]">
      <Image src="/images/site/rates-bg.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30 grayscale" />
      <div className="absolute inset-0 -z-10 bg-navy/80" />
      <div className="site-container">
        <SectionTitle
          title="Rates & Fees"
          subtitle="Understanding what you earn and what you pay is key. Here are our account and transfer rates, in plain numbers."
          tone="light"
          className="max-w-5xl"
        />

        <div className="mt-6 flex flex-wrap items-end justify-end gap-4 sm:mt-10">
          <IfSupportEmail>
            <SupportEmailLink className="flex items-center gap-2 font-dm text-base font-medium text-white hover:text-amber sm:text-lg">
              <AlignRight className="size-5 text-amber" aria-hidden="true" />
              Click to Get Assistance
            </SupportEmailLink>
          </IfSupportEmail>
        </div>

        <div className="reveal mt-6 sm:mt-[36px]">
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-[30px]">
            <RateCard
              className="col-span-2 md:col-span-1"
              media={<RateIcon icon={bankingIcons[0]} />}
              title="Account Yield"
              rows={[
                ["APY¹", savingsApy],
                ["Paid", "Monthly"],
              ]}
            />
            {transferPricing.map((row, index) => (
              <RateCard
                key={row.method}
                media={<RateIcon icon={bankingIcons[index + 1]} />}
                title={row.method}
                rows={[
                  ["Fee", row.fee],
                  ["Speed", row.timing.replace(" business days", " days").replace("Same business day", "Same day").replace("Within a few hours", "Few hours")],
                ]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RateIcon({ icon: Icon }: { icon: typeof PiggyBank }) {
  return (
    <span className="grid size-12 place-items-center rounded-full border-4 border-white/10 bg-brand-gradient text-white sm:size-16 lg:size-[70px]">
      <Icon className="size-5 sm:size-7 lg:size-8" strokeWidth={1.5} aria-hidden="true" />
    </span>
  );
}
