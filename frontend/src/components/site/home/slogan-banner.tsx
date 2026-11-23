import { IfSupportEmail, SupportEmailLink } from "@/components/shared/support-email";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export function SloganBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div className="absolute inset-y-0 right-0 -z-20 hidden w-[62%] md:block">
        <Image src="/images/site/slogan-friends.jpg" alt="" fill sizes="62vw" className="object-cover opacity-60 grayscale" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
      <div className="site-container flex min-h-[200px] flex-col justify-center gap-6 py-12 sm:min-h-[229px] sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-dm text-2xl leading-tight font-medium text-white sm:text-3xl lg:text-[40px]">Your Money, Right in Your Pocket.</h2>
          <p className="mt-2.5 font-body text-sm text-white/75 sm:mt-3 sm:text-base">Online banking, debit cards and transfers, available on any device.</p>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-5">
          <Link
            href="/sign-in"
            className="inline-flex h-12 items-center gap-2.5 bg-white px-6 font-dm text-base font-medium text-navy transition-colors hover:bg-beige sm:h-[55px] sm:gap-3 sm:px-[30px] sm:text-lg"
          >
            <ArrowRight className="size-4 text-flame sm:size-5" aria-hidden="true" />
            Sign In
          </Link>
          <IfSupportEmail>
            <SupportEmailLink className="inline-flex h-12 items-center gap-2.5 bg-flame px-6 font-dm text-base font-medium text-white transition-colors hover:bg-ember sm:h-[55px] sm:gap-3 sm:px-[30px] sm:text-lg">
              <Mail className="size-4 sm:size-5" aria-hidden="true" />
              Contact Us
            </SupportEmailLink>
          </IfSupportEmail>
        </div>
      </div>
    </section>
  );
}
