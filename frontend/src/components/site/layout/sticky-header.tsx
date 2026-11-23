"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Guilloche } from "@/components/shared/guilloche";
import { siteConfig } from "@/config/site";
import { useScrolledPast } from "@/hooks/use-scrolled-past";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#wealth", label: "Grow" },
  { href: "/#support", label: "Help" },
  { href: "/#rates", label: "Rates" },
  { href: "/#contact", label: "Contact" },
];

/** Compact header that slides in once the full header has scrolled away, plus a back-to-top button. */
export function StickyHeader() {
  const visible = useScrolledPast(320);

  return (
    <>
      <div
        aria-hidden={!visible}
        className={cn(
          "fixed inset-x-0 top-0 z-40 hidden border-b border-black/5 bg-white/95 shadow-[0_8px_30px_rgb(0_0_0/0.06)] backdrop-blur transition-transform duration-300 lg:block",
          visible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="site-container-wide flex h-[76px] items-center gap-10">
          <Link href="/" tabIndex={visible ? 0 : -1} className="flex items-center gap-3">
            <span className="bg-brand-gradient grid size-11 place-items-center">
              <Guilloche variant="mark" className="size-7 text-white" />
            </span>
            <span className="font-dm text-xl font-medium text-navy">{siteConfig.name}</span>
          </Link>
          <nav aria-label="Sections" className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={visible ? 0 : -1}
                className="font-dm text-base font-medium text-navy transition-colors hover:text-flame"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/sign-in"
              tabIndex={visible ? 0 : -1}
              className="bg-brand-gradient inline-flex h-11 items-center px-6 font-dm text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
        className={cn(
          "bg-brand-gradient fixed right-4 bottom-4 z-40 grid size-10 place-items-center rounded-full text-white shadow-lg transition-all duration-300 sm:right-6 sm:bottom-6 sm:size-12 sm:rounded-none",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ArrowUp className="size-4 sm:size-5" />
      </button>
    </>
  );
}
