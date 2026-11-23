"use client";

import Link from "next/link";
import { Check, Percent, ShieldCheck, Wallet } from "lucide-react";
import { CardFace } from "@/components/shared/card-face";
import type { PaymentCard } from "@/types/banking";

const showcaseCard: PaymentCard = {
  id: "promo",
  accountId: "promo",
  label: "Debit card",
  brand: "visa",
  kind: "physical",
  last4: "3391",
  expiry: "09/29",
  holderName: "YOUR NAME",
  frozen: false,
  onlinePayments: true,
  currency: "USD",
  monthlyLimit: 0,
  spentThisMonth: 0,
};

const badges = [
  { icon: Percent, className: "top-4 left-2 sm:top-10 sm:left-0" },
  { icon: ShieldCheck, className: "top-1/2 right-2 -translate-y-1/2 sm:right-0 sm:translate-y-0" },
  { icon: Wallet, className: "bottom-2 left-1/2 -translate-x-1/2 sm:bottom-0 sm:translate-x-0" },
];

export function CardPromo() {
  return (
    <section id="card" className="scroll-mt-6 overflow-x-clip bg-white py-14 sm:py-20 lg:py-[100px]">
      <div className="site-container grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        <div aria-hidden="true" className="reveal relative mx-auto h-[320px] w-full max-w-[340px] sm:h-[430px] sm:max-w-[480px] lg:h-[470px] lg:max-w-[540px]">
          <div className="absolute inset-y-0 right-10 left-8 bg-beige sm:right-16 sm:left-10" />
          <div className="absolute top-6 left-1/2 h-[260px] w-[145px] -translate-x-1/2 rotate-[20deg] rounded-[28px] border-[7px] border-navy bg-[#d6d2cc] shadow-2xl sm:top-10 sm:h-[360px] sm:w-[200px] sm:rotate-[26deg] sm:rounded-[34px] sm:border-[9px] lg:top-12 lg:h-[400px] lg:w-[220px] lg:rotate-[28deg] lg:rounded-[38px] lg:border-[10px]" />
          <div className="absolute top-[98px] left-1/2 w-[225px] -translate-x-1/2 rotate-[20deg] sm:top-[136px] sm:w-[290px] sm:-translate-x-[56%] sm:rotate-[26deg] lg:top-[150px] lg:w-[320px] lg:-translate-x-[58%] lg:rotate-[28deg]">
            <CardFace card={showcaseCard} tone="accent" />
          </div>
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`absolute grid size-14 place-items-center rounded-full bg-white text-navy shadow-[0_10px_30px_rgb(0_0_0/0.1)] sm:size-20 lg:size-[100px] ${badge.className}`}
            >
              <badge.icon className="size-6 sm:size-8 lg:size-10" strokeWidth={1.3} />
            </span>
          ))}
        </div>

        <div>
          <h2 className="font-dm text-[28px] leading-[1.18] font-medium text-navy sm:text-4xl lg:text-5xl lg:leading-[53px]">
            Get a Debit Card That Works as Hard as You Do
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-stone sm:mt-6 sm:text-lg">
            A physical Visa debit card for everyday spending, controlled directly from your account.
          </p>
          <ul className="mt-5 flex flex-col gap-3 font-body text-sm text-stone sm:mt-6 sm:text-base">
            {["Freeze and unfreeze your card in one tap", "Turn online payments off when you don't need them"].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-flame" strokeWidth={3} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <Link
            href="/sign-in"
            className="mt-8 inline-flex h-12 items-center border border-black/10 bg-white px-7 font-dm text-base font-medium text-navy shadow-[0_10px_30px_rgb(0_0_0/0.08)] transition-colors hover:border-flame hover:bg-flame hover:text-white sm:mt-10 sm:h-[60px] sm:px-[30px] sm:text-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
