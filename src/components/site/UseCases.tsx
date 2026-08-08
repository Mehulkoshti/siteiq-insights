import { Briefcase, Search, Terminal, Users } from "lucide-react";
import { Section, SectionHeader, Reveal } from "./Section";

const CASES = [
  {
    icon: Terminal,
    title: "Developers",
    body: "Find technical issues before they become problems.",
    detail: "Header diffs on every deploy, CVE detection across detected libraries, and a JSON export you can wire into CI.",
  },
  {
    icon: Search,
    title: "SEO Teams",
    body: "Turn technical data into actionable SEO improvements.",
    detail: "Crawl depth, canonical integrity, metadata uniqueness and structured data — ranked by modelled traffic impact.",
  },
  {
    icon: Briefcase,
    title: "Agencies",
    body: "Audit and monitor every client website.",
    detail: "Bulk scans, white-labelled reports and daily monitoring across an entire portfolio from one workspace.",
  },
  {
    icon: Users,
    title: "Business Owners",
    body: "Understand website health without technical knowledge.",
    detail: "One score, a plain-language diagnosis, and a short list of what to send your developer this week.",
  },
];

export function UseCases() {
  return (
    <Section id="resources">
      <SectionHeader
        eyebrow="Use Cases"
        title="Built for Everyone Who Owns the Outcome."
        sub="The same intelligence layer, framed for the person reading it."
      />

      <ul className="mt-14 grid gap-px lg:mt-20 lg:grid-cols-2" style={{ background: "var(--border)" }}>
        {CASES.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal
              as="li"
              key={c.title}
              delay={i * 80}
              className="bg-background hover:bg-accent/40 group relative p-8 transition-colors md:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "var(--gradient-iq)" }}
              />
              <Icon className="text-blue size-5" />
              <h3 className="mt-6 text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-[0.95rem] font-medium">{c.body}</p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{c.detail}</p>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
