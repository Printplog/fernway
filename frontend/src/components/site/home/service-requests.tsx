"use client";

import { IfSupportEmail, SupportEmailAddress, SupportEmailLink } from "@/components/shared/support-email";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CreditCard,
  Headset,
  type LucideIcon,
  MonitorSmartphone,
  ArrowRightLeft,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./section-title";

const categories: Array<{ key: string; icon: LucideIcon; title: string; requests: string[] }> = [
  {
    key: "cards",
    icon: CreditCard,
    title: "Cards",
    requests: ["Freeze Your Debit Card", "Turn Off Online Payments", "Get a Virtual Card", "Set a Monthly Card Limit"],
  },
  {
    key: "online",
    icon: MonitorSmartphone,
    title: "App & Insights",
    requests: ["See Spending by Category", "Track a Savings Goal", "Search Your Transactions", "Hide Balances on Screen"],
  },
  {
    key: "details",
    icon: UserCog,
    title: "Account Details",
    requests: ["Find Your Routing Number", "Find Your Account Number", "See Upcoming Bills", "Check Your Available Balance"],
  },
  {
    key: "transfers",
    icon: ArrowRightLeft,
    title: "Transfers & Wires",
    requests: ["Send Money by ACH or Wire", "Move Money Between Accounts", "Save a Recipient", "Track Transfer Status"],
  },
];

export function ServiceRequests() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = categories[activeIndex];
  const step = (by: number) => setActiveIndex((index) => (index + by + categories.length) % categories.length);

  return (
    <section id="support" className="scroll-mt-6 bg-beige py-14 sm:py-20 lg:py-[100px]">
      <div className="site-container">
        <SectionTitle title="Service Requests" subtitle="Everything you can do yourself in the Lindenway app." />

        <div className="relative mt-10 sm:mt-12 lg:mt-14">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous category"
            className="absolute top-[60px] -left-[65px] hidden size-[50px] place-items-center rounded-full border border-black/10 text-navy hover:bg-white xl:grid"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div role="tablist" aria-label="Request categories" className="grid grid-cols-2 gap-y-5 md:grid-cols-4 md:gap-y-0">
            {categories.map((category, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={category.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="support-panel"
                  onClick={() => setActiveIndex(index)}
                  className="flex flex-col items-center border-black/10 px-3 pb-2 text-center md:border-l md:px-4 md:pb-4 md:last:border-r"
                >
                  <span
                    className={cn(
                      "grid size-16 place-items-center rounded-full transition-colors sm:size-20 md:size-[90px]",
                      selected ? "bg-white text-flame shadow-sm" : "border border-black/10 text-navy",
                    )}
                  >
                    <category.icon className="size-7 sm:size-8 md:size-9" strokeWidth={1.3} aria-hidden="true" />
                  </span>
                  <span className="mt-3 max-w-[160px] font-dm text-sm leading-snug font-medium text-navy sm:mt-5 sm:text-base md:mt-6 md:max-w-[180px] md:text-lg md:leading-7">{category.title}</span>
                  <ChevronDown className={cn("mt-1.5 size-5 text-flame md:mt-2 md:size-6", selected ? "visible" : "invisible")} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next category"
            className="absolute top-[60px] -right-[65px] hidden size-[50px] place-items-center rounded-full border border-black/10 text-navy hover:bg-white xl:grid"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>

        <div id="support-panel" role="tabpanel" className="reveal mt-8 grid gap-6 sm:mt-10 lg:mt-12 lg:grid-cols-2 lg:gap-[30px]">
          <ul className="bg-white">
            {active.requests.map((request) => (
              <li key={request} className="border-b border-black/5 last:border-0">
                <Link
                  href="/sign-in"
                  className="group flex min-h-[60px] items-center justify-between font-dm text-base font-medium text-navy sm:h-[71px] sm:text-lg"
                >
                  <span className="px-5 py-3 sm:px-[30px] sm:py-0">{request}</span>
                  <span className="grid w-14 shrink-0 self-stretch place-items-center border-l border-black/5 text-stone transition-colors group-hover:bg-flame group-hover:text-white sm:w-[70px]">
                    <ArrowRight className="size-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <IfSupportEmail>
            <div className="relative isolate grid min-h-[284px] overflow-hidden bg-navy sm:grid-cols-[1fr_1fr]">
              <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center text-white">
                <Headset className="size-12" strokeWidth={1.3} aria-hidden="true" />
                <p className="mt-2 font-dm text-lg font-medium">Talk to</p>
                <p className="font-dm text-2xl font-medium">Our Support Team</p>
                <SupportEmailLink className="mt-3 font-dm text-xl font-medium text-amber hover:underline">
                  <SupportEmailAddress />
                </SupportEmailLink>
              </div>
              <div className="relative hidden sm:block">
                <Image src="/images/site/support-agent.jpg" alt="Lindenway Bank customer support team member" fill sizes="285px" className="object-cover" />
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 -left-px w-16 bg-navy [clip-path:polygon(0_0,100%_0,0_50%,100%_100%,0_100%)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-1/2 w-16 bg-ember [clip-path:polygon(0_0,100%_0,0_100%)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-1/2 w-16 bg-ember [clip-path:polygon(0_0,0_100%,100%_100%)]"
                />
              </div>
            </div>
          </IfSupportEmail>
        </div>
      </div>
    </section>
  );
}
