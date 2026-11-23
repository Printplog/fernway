/** Public website copy and navigation. Rates and fees mirror the values the API enforces. */

export const savingsApy = "4.10%";


export const serviceLinks = [
  { href: "/#services", title: "Online Account", description: "Direct deposit, bill pay and simple bank transfers." },
  { href: "/#services", title: "Account Balance", description: `Earn ${savingsApy} APY¹ on your balance.` },
  { href: "/#card", title: "Debit Cards", description: "Physical debit cards with instant controls." },
] as const;

export const aboutLinks = [
  { href: "/#rates", title: "Rates & Fees", description: "What you earn and what moving money costs." },
  { href: "/#support", title: "Service Requests", description: "Card, account and transfer help in one place." },
] as const;

export const transferPricing = [
  { method: "Bank Transfer", fee: "Free", timing: "Manual approval" },
  { method: "Standard ACH", fee: "Free", timing: "1–3 business days" },
  { method: "Same-Day ACH", fee: "$2.00", timing: "Same business day" },
  { method: "Wire Transfer", fee: "$15.00", timing: "Within a few hours" },
] as const;

export const footerColumns = [
  {
    title: "Accounts",
    links: [
      { href: "/#services", label: "Online Account" },
      { href: "/#services", label: "Account Balance" },
      { href: "/#card", label: "Debit Cards" },
    ],
  },
  {
    title: "Rates & Fees",
    links: [
      { href: "/#rates", label: "Account Rates" },
      { href: "/#rates", label: "Transfer Fees" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/#support", label: "Service Requests" },
      { href: "/#faq", label: "FAQ" },
      { href: "/#contact", label: "Get In Touch" },
      { href: "/sign-in", label: "Login" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { href: "/sign-in", label: "Sign In" },
      { href: "/#wealth", label: "Grow Your Money" },
      { href: "/#card", label: "Debit Cards" },
    ],
  },
] as const;

export const faqItems = [
  {
    question: "Can I open a Lindenway Bank account today?",
    answer:
      "Lindenway is invitation only, with accounts opened directly by our team. Contact us to request an invitation.",
  },
  {
    question: "How long do transfers take?",
    answer:
      "Moves between your Lindenway accounts are instant. Standard ACH transfers arrive within 2 business days, same-day ACH arrives the same business day, and wires usually arrive within a few hours.",
  },
  {
    question: "What does it cost to send money?",
    answer:
      "Standard ACH transfers and moves between your own accounts are free. Same-day ACH costs $2.00 and a wire costs $15.00. You always see the fee before you confirm.",
  },
  {
    question: "How do I set up direct deposit?",
    answer:
      "Sign in at lindenwaybank.com, choose Add money on your Overview, and give your employer the routing and account numbers shown there.",
  },
  {
    question: "What happens if I lose my debit card?",
    answer:
      "Sign in and freeze your physical Visa debit card from the Cards screen. No payments or withdrawals can go through until you unfreeze it.",
  },
  {
    question: "How do I reach Lindenway Bank support?",
    answer:
      "Sign in to your online banking dashboard and open the live Support widget in the bottom-right corner anytime to message our banking support team directly.",
  },
] as const;
