import { SiteFooter } from "@/components/site/layout/site-footer";
import { SiteHeader } from "@/components/site/layout/site-header";
import { StickyHeader } from "@/components/site/layout/sticky-header";
import { TopBar } from "@/components/site/layout/top-bar";

/** Public website. Always light, with its own palette and fonts, independent of the app theme. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-white font-body text-stone">
      <TopBar />
      <SiteHeader />
      <StickyHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
