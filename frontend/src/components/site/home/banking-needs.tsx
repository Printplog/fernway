"use client";

import { IfSupportEmail, SupportEmailLink } from "@/components/shared/support-email";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  ChevronDown,
  Landmark,
  type LucideIcon,
  MessagesSquare,
  PiggyBank,
  ShieldCheck,
  Smartphone,
  Target,
} from "lucide-react";
import { savingsApy } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./section-title";

interface ServiceCard {
  icon: LucideIcon;
  title: string;
  text: string;
  note: string;
}

const groups: Array<{ key: string; eyebrow: string; title: string; cards: ServiceCard[] }> = [
  {
    key: "everyday",
    eyebrow: "Built for",
    title: "Everyday Money",
    cards: [
      {
        icon: Landmark,
        title: "Checking & Debit Card",
        text: "Get paid by direct deposit, pay bills and spend with a debit card, all from one account.",
        note: "No fee for standard ACH transfers",
      },
      {
        icon: Smartphone,
        title: "Online & Mobile",
        text: "Manage your money anywhere with a secure app, instant card controls and live transactions.",
        note: "Freeze a card in one tap",
      },
      {
        icon: ArrowRightLeft,
        title: "Same-Day Transfers",
        text: "Send money by standard ACH, same-day ACH or wire, and see the fee before you confirm.",
        note: "Same-day ACH for $2.00",
      },
    ],
  },
  {
    key: "growing",
    eyebrow: "Built for",
    title: "Saving & Security",
    cards: [
      {
        icon: PiggyBank,
        title: "High-Yield Savings",
        text: "Earn a competitive rate on your savings and move money to checking instantly, any time.",
        note: `Interest rate ${savingsApy} APY¹`,
      },
      {
        icon: Target,
        title: "Savings Goals",
        text: "Set a target for your emergency fund or next big purchase and watch your progress grow.",
        note: "Track progress in the app",
      },
      {
        icon: ShieldCheck,
        title: "Card Security Controls",
        text: "Manage monthly spending limits, online payment toggles, and instant card freeze directly from your dashboard.",
        note: "Included with every account",
      },
    ],
  },
];

export function BankingNeeds() {
  const [active, setActive] = useState(groups[0].key);
  const group = groups.find((item) => item.key === active) ?? groups[0];

  return (
    <section id="services" className="relative isolate scroll-mt-6 overflow-hidden bg-navy py-14 sm:py-20 lg:py-[100px]">
      <Image src="/images/site/services-bg.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-40 grayscale" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/70 via-navy/80 to-navy" />
      <div className="site-container">
        <div className="flex items-start justify-between gap-6">
          <SectionTitle
            title="Built For Your Needs"
            subtitle="Everyday checking, savings and transfers, all in one place."
            tone="light"
            align="left"
          />
          <IfSupportEmail>
            <SupportEmailLink
              aria-label="Chat with us by email"
              className="hidden size-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-flame to-ember text-white shadow-lg sm:grid"
            >
              <MessagesSquare className="size-8" />
            </SupportEmailLink>
          </IfSupportEmail>
        </div>

        <div role="tablist" aria-label="Service groups" className="mt-8 grid gap-2.5 sm:mt-12 md:grid-cols-2 lg:mt-14">
          {groups.map((item) => {
            const selected = item.key === active;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`services-${item.key}`}
                id={`services-tab-${item.key}`}
                onClick={() => setActive(item.key)}
                className={cn(
                  "flex min-h-[82px] items-center justify-between gap-4 px-5 py-4 text-left transition-colors sm:min-h-[112px] sm:px-8 md:h-[140px] md:px-10",
                  selected ? "border border-white/15 bg-navy text-white" : "bg-white text-navy",
                )}
              >
                <span>
                  <span className={cn("block font-body text-sm sm:text-base lg:text-lg", selected ? "text-white/70" : "text-stone")}>{item.eyebrow}</span>
                  <span className="mt-0.5 block font-dm text-2xl leading-tight font-medium sm:mt-1 sm:text-3xl lg:text-4xl">{item.title}</span>
                </span>
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center sm:size-[50px]",
                    selected ? "bg-white text-navy" : "bg-beige text-stone-light",
                  )}
                >
                  <ChevronDown className="size-5 sm:size-6" />
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`services-${group.key}`}
          aria-labelledby={`services-tab-${group.key}`}
          className="reveal mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3 lg:mt-[60px] lg:gap-[30px]"
        >
          {group.cards.map((card) => (
            <Link
              key={card.title}
              href="/sign-in"
              className="group relative flex flex-col border border-white/10 bg-navy/90 p-6 text-white transition-colors hover:border-white/30 sm:p-8 lg:p-10"
            >
              <span className="absolute top-5 right-5 grid size-9 place-items-center border border-white/30 transition-colors group-hover:bg-white group-hover:text-navy sm:size-10">
                <ArrowRight className="size-4 sm:size-5" />
              </span>
              <card.icon className="size-8 sm:size-10" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-5 font-dm text-xl font-medium sm:mt-6 sm:text-[22px]">{card.title}</h3>
              <span className="mt-4 flex h-[3px] sm:mt-5">
                <span className="w-[50px] bg-flame" />
                <span className="flex-1 bg-white/20" />
              </span>
              <p className="mt-5 font-body text-sm leading-relaxed text-white/70 sm:mt-7 sm:text-base sm:leading-[26px]">{card.text}</p>
              <p className="mt-3 font-body text-sm text-white/80 sm:mt-4 sm:text-base">
                <span className="text-amber">* </span>
                {card.note}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:mt-12 lg:mt-[60px]">
          <Link
            href="/sign-in"
            className="inline-flex h-12 items-center bg-white px-7 font-dm text-base font-medium text-navy transition-colors hover:bg-flame hover:text-white sm:h-[60px] sm:px-[30px] sm:text-lg"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
