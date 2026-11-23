"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { SectionTitle } from "./section-title";

const items = [
  {
    title: "Instant Transfers",
    image: "/images/site/gen/wealth-crypto.png",
    text: "Send money directly to external bank accounts with transparent status updates from start to finish.",
    gradient: "from-[#065f46] to-[#10b981]",
  },
  {
    title: "High-Yield Savings",
    image: "/images/site/wealth-growth.jpg",
    text: "Let your money grow with a competitive variable rate and access your balance any time.",
    gradient: "from-[#064e3b] to-[#059669]",
  },
  {
    title: "Mobile App",
    image: "/images/site/wealth-phone.jpg",
    text: "Check balances, send money and control your cards from your phone, wherever you are.",
    gradient: "from-[#065f46] to-[#10b981]",
  },
  {
    title: "Spending Insights",
    image: "/images/site/wealth-analytics.jpg",
    text: "See where your money goes each month with cash-flow charts and spending by category.",
    gradient: "from-[#064e3b] to-[#059669]",
  },
  {
    title: "Physical Debit Cards",
    image: "/images/site/hero-online.jpg",
    text: "Manage your physical Visa debit card, monthly limits, and freeze controls in one tap.",
    gradient: "from-[#065f46] to-[#10b981]",
  },
];

export function GrowWealth() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <section id="wealth" className="scroll-mt-6 overflow-hidden bg-white py-14 sm:py-20 lg:py-[100px]">
      <div className="site-container">
        <SectionTitle title="Grow Your Money" subtitle="Don't just make a deposit, make your money work for you." />

        <Carousel setApi={setApi} opts={{ align: "start", loop: false }} className="mt-10 sm:mt-12 lg:mt-14">
          <CarouselContent className="-ml-4 overflow-visible sm:-ml-8 lg:-ml-[60px]">
            {items.map((item) => (
              <CarouselItem key={item.title} className="basis-[88%] pl-4 sm:basis-1/2 sm:pl-8 lg:basis-1/3 lg:pl-[60px]">
                <article className="group sm:pr-5 lg:pr-[30px]">
                  <div className="relative">
                    <div className="relative aspect-[4/3.6] w-full overflow-hidden sm:aspect-[341/350]">
                      <Image src={item.image} alt={`Lindenway Bank ${item.title}`} fill sizes="(min-width: 1024px) 341px, 85vw" className="object-cover saturate-[0.85] transition duration-700 group-hover:scale-105 group-hover:saturate-100" />
                    </div>
                    <Link
                      href="/sign-in"
                      className={`absolute inset-x-4 bottom-4 flex min-h-[52px] items-center justify-between gap-3 overflow-hidden bg-gradient-to-r px-5 font-dm text-lg font-medium text-white sm:right-[-24px] sm:bottom-6 sm:left-6 sm:h-[60px] sm:px-6 sm:text-[22px] lg:right-[-30px] lg:bottom-[30px] lg:left-[30px] lg:px-[30px] ${item.gradient}`}
                    >
                      <span className="relative z-10 truncate">{item.title}</span>
                      <ArrowRight className="relative z-10 size-5 shrink-0 sm:size-6" aria-hidden="true" />
                      <span aria-hidden="true" className="absolute top-0 right-16 h-full w-14 skew-x-[-30deg] bg-white/15 sm:right-24 sm:w-16" />
                    </Link>
                  </div>
                  <p className="bg-white p-5 font-body text-sm leading-relaxed text-stone shadow-[0_15px_40px_rgb(0_0_0/0.07)] sm:p-6 sm:text-base sm:leading-[26px] lg:p-[30px]">
                    {item.text}
                  </p>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex items-end justify-between border-b border-black/10 pb-0 sm:mt-10">
          <div className="flex gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous"
              className="grid size-11 place-items-center border border-black/10 text-navy transition-colors hover:bg-flame hover:text-white sm:size-[50px]"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label="Next"
              className="grid size-11 place-items-center border border-black/10 text-navy transition-colors hover:bg-flame hover:text-white sm:size-[50px]"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
          <p className="pb-2 font-dm text-2xl font-medium text-navy sm:text-3xl" aria-live="polite">
            {current}/<span className="text-base text-stone-light sm:text-lg"> {items.length}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
