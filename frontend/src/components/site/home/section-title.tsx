import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle: string;
  tone?: "dark" | "light";
  align?: "center" | "left";
  className?: string;
}

export function SectionTitle({ title, subtitle, tone = "dark", align = "center", className }: SectionTitleProps) {
  return (
    <div className={cn("reveal", align === "center" ? "mx-auto text-center" : "", "max-w-3xl", className)}>
      <h2
        className={cn(
          "font-dm text-[28px] leading-[1.18] font-medium tracking-normal sm:text-4xl lg:text-5xl lg:leading-[58px]",
          tone === "dark" ? "text-navy" : "text-white",
        )}
      >
        {title}
      </h2>
      <p className={cn("mt-3 font-body text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-stone" : "text-white/70")}>{subtitle}</p>
    </div>
  );
}
