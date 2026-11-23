import { IfSupportEmail, SupportEmailAddress, SupportEmailLink } from "@/components/shared/support-email";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems } from "@/config/marketing";
import { SectionTitle } from "./section-title";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-6 bg-white py-14 sm:py-20 lg:py-[100px]">
      <div className="site-container grid gap-8 sm:gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div>
          <SectionTitle
            title="Questions, Answered"
            subtitle="The things people ask us most before opening an account."
            align="left"
          />
          <IfSupportEmail>
            <p className="reveal mt-6 font-body text-sm text-stone sm:mt-8 sm:text-base">
              Still unsure? Email{" "}
              <SupportEmailLink className="font-medium text-flame underline underline-offset-4">
                <SupportEmailAddress />
              </SupportEmailLink>{" "}
              and we&apos;ll get back to you.
            </p>
          </IfSupportEmail>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0" className="reveal border-t border-black/10">
          {faqItems.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`} className="border-black/10">
              <AccordionTrigger className="py-5 text-left font-dm text-base font-medium text-navy hover:text-flame hover:no-underline data-[state=open]:text-flame sm:py-6 sm:text-xl">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 font-body text-sm leading-relaxed text-stone sm:pb-6 sm:text-base sm:leading-7">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
