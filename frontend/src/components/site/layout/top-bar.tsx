import { IfSupportEmail, SupportEmailAddress, SupportEmailLink } from "@/components/shared/support-email";
import Link from "next/link";
import { LifeBuoy, Mail, Search } from "lucide-react";

const quickLinks = [
  { href: "/#rates", label: "Rates" },
  { href: "/#wealth", label: "Grow" },
  { href: "/#card", label: "Cards" },
];

export function TopBar() {
  return (
    <div className="hidden border-b border-black/5 lg:block">
      <div className="site-container-wide flex h-[60px] items-center justify-between font-body text-base">
        <div className="flex items-center divide-x divide-black/10">
          <IfSupportEmail>
            <SupportEmailLink className="flex items-center gap-2.5 pr-7 text-navy hover:text-flame">
              <Mail className="size-5" strokeWidth={1.5} aria-hidden="true" />
              <SupportEmailAddress />
            </SupportEmailLink>
          </IfSupportEmail>
          <Link href="/#support" className="flex items-center gap-2.5 pl-7 text-navy hover:text-flame">
            <LifeBuoy className="size-5" strokeWidth={1.5} aria-hidden="true" />
            Help Center
          </Link>
        </div>
        <div className="flex items-center">
          <nav aria-label="Quick links" className="flex items-center gap-6 border-r border-black/10 pr-6">
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-stone hover:text-flame">
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/#support" className="flex items-center gap-2 pl-6 text-navy hover:text-flame">
            <Search className="size-5" strokeWidth={1.5} aria-hidden="true" />
            Find Help
          </Link>
        </div>
      </div>
    </div>
  );
}
