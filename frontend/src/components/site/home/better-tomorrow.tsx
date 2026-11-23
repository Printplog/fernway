import Link from "next/link";
import { ArrowRight, Check, CreditCard, Landmark, type LucideIcon, PiggyBank } from "lucide-react";
import { savingsApy } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./section-title";
import { TrianglePattern } from "@/components/shared/triangle-pattern";

interface Feature {
  icon: LucideIcon;
  label: string;
  stat: string;
  statNote: string;
  title: string;
  text: string;
  points: string[];
  href: string;
  cta: string;
  featured?: boolean;
}

const features: Feature[] = [
  {
    icon: Landmark,
    label: "Checking Account",
    stat: "$0",
    statNote: "standard ACH transfers",
    title: "Everyday Money With No Surprises",
    text: "Direct deposit, bill pay and transfers from one account, with your numbers ready the day you open.",
    points: ["A debit card plus virtual cards", "Same-day ACH for $2, wires for $15"],
    href: "/#services",
    cta: "Explore checking",
  },
  {
    icon: PiggyBank,
    label: "High-Yield Savings",
    stat: savingsApy,
    statNote: "APY¹, variable rate",
    title: "Let Every Dollar Earn More",
    text: "Grow your balance with a competitive variable rate and move money to checking instantly, any time.",
    points: ["Set a goal and track your progress", "Free, instant moves between accounts"],
    href: "/#rates",
    cta: "See savings rates",
    featured: true,
  },
  {
    icon: CreditCard,
    label: "Debit Cards",
    stat: "Visa",
    statNote: "physical debit card",
    title: "Spend Anywhere With Full Control",
    text: "A physical Visa debit card linked directly to your balance, with instant freeze and spending controls from your dashboard.",
    points: ["Freeze or unfreeze in one tap", "Set custom monthly spend limits"],
    href: "/#card",
    cta: "Explore debit cards",
  },
];

export function BetterTomorrow() {
  return (
    <section className="relative isolate overflow-hidden bg-beige py-14 sm:py-20 lg:py-[100px]">
      <TrianglePattern className="absolute -top-10 -right-10 -z-10 h-[420px] w-[520px] opacity-[0.07]" />
      <TrianglePattern className="absolute -bottom-16 -left-24 -z-10 h-[360px] w-[440px] rotate-180 opacity-[0.05]" />

      <div className="site-container">
        <SectionTitle title="Money For A Better Tomorrow" subtitle="Checking, high-yield savings, and debit cards in one secure sign-in." />

        <div className="mt-10 grid items-stretch gap-5 sm:mt-12 sm:gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-[30px]">
          {features.map((feature) => (
            <article
              key={feature.label}
              className={cn(
                "reveal group relative flex flex-col overflow-hidden p-6 transition duration-300 hover:-translate-y-2 sm:p-8 lg:p-10",
                feature.featured
                  ? "bg-navy text-white shadow-[0_30px_60px_rgb(26_28_35/0.25)] lg:-my-4 lg:py-14"
                  : "bg-white text-navy shadow-[0_15px_40px_rgb(26_28_35/0.06)] hover:shadow-[0_25px_50px_rgb(26_28_35/0.12)]",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "bg-brand-gradient absolute inset-x-0 top-0 h-1 origin-left transition-transform duration-500",
                  feature.featured ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />

              <div className="flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "grid size-14 place-items-center transition-transform duration-300 group-hover:scale-105",
                    feature.featured ? "bg-amber text-navy" : "bg-brand-gradient text-white",
                  )}
                >
                  <feature.icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="text-right">
                  <span className={cn("block font-dm text-[34px] leading-none font-medium", feature.featured ? "text-amber" : "text-flame")}>
                    {feature.stat}
                  </span>
                  <span className={cn("mt-1 block font-body text-xs", feature.featured ? "text-white/60" : "text-stone")}>
                    {feature.statNote}
                  </span>
                </span>
              </div>

              <p className={cn("mt-8 font-dm text-base font-medium tracking-wide", feature.featured ? "text-amber" : "text-flame")}>
                {feature.label}
              </p>
              <h3 className="mt-2 font-dm text-[26px] leading-tight font-medium">{feature.title}</h3>
              <p className={cn("mt-4 font-body text-base leading-[26px]", feature.featured ? "text-white/70" : "text-stone")}>
                {feature.text}
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 font-body text-[15px]">
                    <span
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                        feature.featured ? "bg-amber/15 text-amber" : "bg-flame/10 text-flame",
                      )}
                    >
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className={feature.featured ? "text-white/85" : "text-navy/80"}>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <div className={cn("border-t pt-6", feature.featured ? "border-white/10" : "border-black/5")}>
                <Link
                  href={feature.href}
                  className={cn(
                    "inline-flex items-center gap-2 font-dm text-lg font-medium transition-colors",
                    feature.featured ? "text-white hover:text-amber" : "text-navy hover:text-flame",
                  )}
                >
                  {feature.cta}
                  <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
