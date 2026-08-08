import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeader, Reveal } from "./Section";

const FAQS = [
  {
    q: "What does SiteIQ actually check?",
    a: "65+ signals across eight layers: security headers, SSL/TLS, email authentication, performance and Core Web Vitals, SEO architecture, accessibility, infrastructure and DNS, and the technology stack itself — including known CVEs in detected libraries.",
  },
  {
    q: "How does the SiteIQ score work?",
    a: "Each layer produces a weighted sub-score from its own signals. The overall score is a weighted composite, biased toward the layers that affect real users first — security and performance carry more weight than cosmetic findings.",
  },
  {
    q: "Why is my SEO score low?",
    a: "Usually architecture rather than content. Duplicate metadata, canonicals pointing at redirects, and pages buried more than three clicks deep are the three causes we see most. SiteIQ names the specific pages instead of the general rule.",
  },
  {
    q: "How does SiteIQ compare with GTmetrix?",
    a: "GTmetrix measures page speed for one URL. SiteIQ measures a whole website across eight layers and then explains how those layers interact — a performance win that costs you a security header is flagged as a net loss.",
  },
  {
    q: "How is SiteIQ different from Screaming Frog?",
    a: "Screaming Frog gives you an exhaustive crawl and expects you to interpret it. SiteIQ crawls, correlates and prioritises — you get a ranked list of what to fix and the estimated impact of fixing it.",
  },
  {
    q: "Can SiteIQ monitor my website?",
    a: "Yes. Sites can be re-scanned daily or on every deploy. SiteIQ diffs each scan against the last known good state and alerts you only when something material changes.",
  },
  {
    q: "Can SiteIQ compare competitors?",
    a: "Yes. Add up to five competitor domains and SiteIQ benchmarks every layer side by side, then explains where the gap actually comes from.",
  },
  {
    q: "Can SiteIQ audit multiple websites?",
    a: "Bulk audit accepts a list or a sitemap of domains, runs them in parallel, and gives you a portfolio view with exportable reports per site.",
  },
  {
    q: "Can SiteIQ check my website's security?",
    a: "It checks TLS configuration and certificate health, security headers and CSP strength, cookie flags, CORS policy, SPF/DKIM/DMARC, exposed paths and known CVEs. It is a configuration audit, not a penetration test.",
  },
];

export function FAQ() {
  return (
    <Section tone="surface">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionHeader
          eyebrow="FAQ"
          title={
            <>
              Questions?
              <br />
              Ask SiteIQ.
            </>
          }
          sub="The things people ask before they paste their first URL."
        />

        <Reveal delay={100}>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-border border-b">
                <AccordionTrigger className="py-5 text-left text-[0.975rem] font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}
