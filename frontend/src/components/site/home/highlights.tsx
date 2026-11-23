import { ArrowLeftRight, CreditCard, Zap, PiggyBank } from "lucide-react";
import { savingsApy } from "@/config/marketing";

/** Product facts, each one backed by a rate or rule the app actually enforces. */
const facts = [
  { icon: PiggyBank, value: savingsApy, unit: "APY¹", label: "on High-Yield Savings" },
  { icon: ArrowLeftRight, value: "$0", unit: "", label: "for standard ACH transfers" },
  { icon: CreditCard, value: "1-Tap", unit: "", label: "instant debit card controls" },
  { icon: Zap, value: "Instant", unit: "", label: "moves between your accounts" },
];

export function Highlights() {
  return (
    <section aria-label="Lindenway Bank in numbers" className="relative z-10 flow-root bg-beige">
      <div className="site-container">
        <ul className="reveal -mt-6 grid grid-cols-2 bg-white shadow-[0_25px_60px_rgb(26_28_35/0.08)] sm:-mt-10 lg:-mt-[60px] lg:grid-cols-4">
          {facts.map((fact, idx) => (
            <li
              key={fact.label}
              className={[
                "flex flex-col items-start gap-3 border-black/5 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-6 lg:gap-5 lg:px-8 lg:py-9",
                idx % 2 === 0 ? "border-r" : "lg:border-r",
                idx < 2 ? "border-b lg:border-b-0" : "",
                idx === 3 ? "lg:border-r-0" : "",
              ].join(" ")}
            >
              <span className="bg-brand-gradient grid size-10 shrink-0 place-items-center text-white sm:size-12 lg:size-14">
                <fact.icon className="size-5 lg:size-6" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-dm text-2xl leading-none font-medium text-navy sm:text-[28px] lg:text-[32px]">
                  {fact.value}
                  {fact.unit && <span className="ml-1 text-xs text-flame sm:text-base">{fact.unit}</span>}
                </span>
                <span className="mt-1.5 block font-body text-xs leading-snug text-stone sm:mt-2 sm:text-sm lg:text-[15px]">{fact.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
