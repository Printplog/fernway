"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Megaphone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { aboutLinks, savingsApy, serviceLinks } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { SiteLogo } from "./site-logo";

const navLink =
  "inline-flex h-[50px] items-center px-5 font-dm text-lg font-medium text-navy transition-colors hover:text-flame focus-visible:text-flame focus-visible:outline-none";

function MenuList({ items }: { items: ReadonlyArray<{ href: string; title: string; description: string }> }) {
  return (
    <ul className="grid w-[300px] gap-0.5 p-2">
      {items.map((item) => (
        <li key={item.title}>
          <NavigationMenuLink asChild>
            <Link href={item.href} className="flex flex-col gap-1 rounded-md p-3">
              <span className="font-dm text-base font-medium text-navy">{item.title}</span>
              <span className="font-body text-sm text-stone">{item.description}</span>
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30">
      {/* Desktop: logo block, menu row and the updates strip, laid out as one 1340px band. */}
      <div className="site-container-wide hidden pt-[30px] lg:block">
        <div className="flex">
          <Link
            href="/"
            className="bg-brand-gradient flex h-[140px] w-[250px] shrink-0 items-center justify-center outline-none focus-visible:ring-4 focus-visible:ring-flame/40"
          >
            <SiteLogo />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-20 items-center justify-end">
              <NavigationMenu viewport={false}>
                <NavigationMenuList className="gap-0">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navLink}>
                      <Link href="/">
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(navLink, "bg-transparent pr-4 hover:bg-transparent data-[state=open]:bg-transparent")}>
                      Services
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <MenuList items={serviceLinks} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(navLink, "bg-transparent pr-4 hover:bg-transparent data-[state=open]:bg-transparent")}>
                      About
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <MenuList items={aboutLinks} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navLink}>
                      <Link href="/#contact">
                        Get In Touch
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navLink}>
                      <Link href="/sign-in">
                        Login
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="bg-brand-gradient flex h-[60px] items-center justify-center gap-5 px-8 font-body text-base text-white">
              <span className="flex items-center gap-2 font-dm text-lg font-medium">
                <Megaphone className="size-5" aria-hidden="true" />
                Updates:
              </span>
              <span className="truncate text-white/85">Earn {savingsApy} APY¹ on High-Yield Savings with Lindenway</span>
              <Link href="/#rates" className="flex shrink-0 items-center gap-1 font-dm text-lg font-medium hover:underline">
                <ChevronRight className="size-4" aria-hidden="true" />
                More Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and tablet */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white/95 backdrop-blur lg:hidden">
        <Link href="/" className="bg-brand-gradient flex h-[64px] items-center px-4 sm:h-[72px] sm:px-5">
          <SiteLogo className="gap-2.5 [&_svg]:size-8 [&_span:last-child]:text-xl sm:[&_svg]:size-10 sm:[&_span:last-child]:text-2xl" />
        </Link>
        <div className="flex items-center gap-2 pr-2 sm:gap-3 sm:pr-3">
          <Link
            href="/sign-in"
            className="bg-brand-gradient inline-flex h-10 items-center px-4 font-dm text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Sign In
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="text-navy" aria-label="Open menu">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs font-body">
              <SheetHeader>
                <SheetTitle className="font-dm text-xl">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Site" className="flex flex-col gap-1 px-4" onClick={() => setOpen(false)}>
                <Link href="/" className="rounded-md px-2 py-2.5 font-dm text-lg text-navy hover:bg-beige">
                  Home
                </Link>
                {[...serviceLinks, ...aboutLinks].map((item) => (
                  <Link key={item.title} href={item.href} className="rounded-md px-2 py-2.5 text-navy hover:bg-beige">
                    {item.title}
                  </Link>
                ))}
                <Link href="/#contact" className="rounded-md px-2 py-2.5 text-navy hover:bg-beige">
                  Get In Touch
                </Link>
                <Separator className="my-2" />
                <Button asChild size="lg" className="h-12 rounded-none bg-flame text-white hover:bg-ember">
                  <Link href="/sign-in">Login</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="bg-brand-gradient flex items-center justify-center gap-2 px-3 py-2 text-center font-body text-xs text-white sm:px-4 sm:py-2.5 sm:text-sm lg:hidden">
        <Megaphone className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
        <span>
          Earn {savingsApy} APY¹ on High-Yield Savings.{" "}
          <Link href="/#rates" className="font-medium whitespace-nowrap underline underline-offset-2">
            More Details
          </Link>
        </span>
      </div>
    </header>
  );
}
