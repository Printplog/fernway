"use client";

import { IfSupportEmail, SupportEmailLink } from "@/components/shared/support-email";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CirclePlay } from "lucide-react";
import { savingsApy } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { TrianglePattern } from "@/components/shared/triangle-pattern";

const slides = [
  {
    image: "/images/site/gen/hero-card.png",
    alt: "Lindenway Bank physical Visa debit card and online banking account",
    title: "A Smarter Way to Spend, Save and Send",
    text: "Checking, high-yield savings and transfers in one Lindenway Bank account, built around the way you manage money.",
  },
  {
    image: "/images/site/hero-handover.jpg",
    alt: "Lindenway Bank high-yield savings account earning competitive annual yield",
    title: `Earn ${savingsApy} APY¹ on Every Dollar You Save`,
    text: "Grow your savings with a competitive rate and move money to checking instantly whenever you need it.",
  },
  {
    image: "/images/site/hero-online.jpg",
    alt: "Lindenway Bank fast same-day ACH transfers and mobile card controls",
    title: "Money That Moves as Fast as You Do",
    text: "Send money the same business day, freeze your card in one tap and see every payment as it happens.",
  },
];

const AUTOPLAY_MS = 7000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((step: number) => setIndex((current) => (current + step + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, go]);

  return (
    <section aria-roledescription="carousel" aria-label="Highlights" className="mx-auto w-full max-w-[1920px] px-0 lg:px-[50px]">
      <div
        className="relative isolate h-[540px] overflow-hidden bg-navy sm:h-[620px] lg:h-[731px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.image}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${slides.length}`}
            aria-hidden={slideIndex !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
              slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={slideIndex === 0}
              sizes="(min-width: 1440px) 1340px, 100vw"
              className={cn("-z-20 object-cover object-center lg:object-left", slideIndex === index && "animate-ken-burns")}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/80 via-navy/70 to-navy/85 lg:bg-gradient-to-r lg:from-navy/35 lg:via-navy/55 lg:to-navy/75" />
            <TrianglePattern className="absolute inset-y-0 right-0 -z-10 hidden h-full w-[58%] lg:block" />

            <div className="flex h-full items-center px-5 pt-6 pb-36 sm:px-10 sm:pb-40 lg:pt-0 lg:pb-16 lg:pl-[585px]">
              <div
                className={cn(
                  "max-w-[670px]",
                  slideIndex === index && "animate-in fade-in slide-in-from-bottom-8 duration-700 motion-reduce:animate-none",
                )}
              >
                {slideIndex === 0 ? (
                  <h1 className="font-dm text-[32px] leading-[1.15] font-medium text-white sm:text-5xl lg:text-[60px] lg:leading-[72px]">
                    {slide.title}
                  </h1>
                ) : (
                  <h2 className="font-dm text-[32px] leading-[1.15] font-medium text-white sm:text-5xl lg:text-[60px] lg:leading-[72px]">
                    {slide.title}
                  </h2>
                )}
                <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg">{slide.text}</p>
                <Link
                  href="/sign-in"
                  tabIndex={slideIndex === index ? 0 : -1}
                  className="mt-7 inline-flex h-12 items-center bg-white px-7 font-dm text-base font-medium text-navy transition-colors hover:bg-flame hover:text-white sm:mt-10 sm:h-[60px] sm:px-[30px] sm:text-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute right-8 bottom-[100px] hidden items-center gap-5 lg:flex" aria-hidden="true">
          <span className="font-dm text-lg font-medium text-white">
            {String(index + 1).padStart(2, "0")}
            <span className="text-white/50"> / {String(slides.length).padStart(2, "0")}</span>
          </span>
          <span className="flex gap-2">
            {slides.map((slide, barIndex) => (
              <span key={slide.image} className="h-[3px] w-12 overflow-hidden bg-white/25">
                {barIndex === index && (
                  <span
                    key={index}
                    className="block h-full origin-left bg-white"
                    style={{
                      animation: `progress-fill ${AUTOPLAY_MS}ms linear both`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
                {barIndex < index && <span className="block h-full bg-white" />}
              </span>
            ))}
          </span>
        </div>

        <div className="absolute inset-x-5 bottom-8 flex items-end justify-between gap-3 sm:inset-x-10 sm:bottom-12 lg:inset-x-auto lg:bottom-[84px] lg:left-5 lg:justify-start lg:gap-5">
          <div className="flex flex-col gap-2">
            <Link
              href="/sign-in"
              className="flex h-11 items-center justify-between gap-3 bg-ember px-4 font-dm text-sm font-medium whitespace-nowrap text-white sm:h-[50px] sm:w-[230px] sm:px-5 sm:text-lg"
            >
              Make a Transfer
              <CirclePlay className="size-4 shrink-0 text-white/75 sm:size-5" aria-hidden="true" />
            </Link>
            <IfSupportEmail>
              <SupportEmailLink className="flex h-11 items-center justify-between gap-3 bg-flame px-4 font-dm text-sm font-medium whitespace-nowrap text-white sm:h-[50px] sm:w-[230px] sm:px-5 sm:text-lg">
                Make an Enquiry
                <CirclePlay className="size-4 shrink-0 text-white/90 sm:size-5" aria-hidden="true" />
              </SupportEmailLink>
            </IfSupportEmail>
          </div>
          <div className="flex shrink-0 gap-2 sm:gap-4 lg:gap-5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="grid size-11 place-items-center bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy sm:size-[60px]"
            >
              <ChevronLeft className="size-6 sm:size-7" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="grid size-11 place-items-center bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy sm:size-[60px]"
            >
              <ChevronRight className="size-6 sm:size-7" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
