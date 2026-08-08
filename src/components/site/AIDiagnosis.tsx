import { ArrowUpRight } from "lucide-react";
import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { Section, SectionHeader, Reveal } from "./Section";

const ACTIONS = [
  { n: "01", text: "Improve homepage title structure", meta: "3 pages affected" },
  { n: "02", text: "Add internal links to /services", meta: "Depth 5 → 2" },
  { n: "03", text: "Improve H1 hierarchy", meta: "2 duplicate H1s" },
];

export function AIDiagnosis() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.25);
  const seo = useCountUp(71, visible);

  return (
    <Section>
      <SectionHeader
        eyebrow="AI Diagnosis"
        title={
          <>
            Scores Tell You What's Wrong.
            <br />
            AI Tells You Why.
          </>
        }
        sub="SiteIQ reads the relationships between signals and explains them in plain language."
      />

      <div ref={ref} className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Reveal className="panel flex flex-col p-6">
          <span className="label-tech">SEO Score</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-6xl leading-none font-semibold tabular-nums">{seo}</span>
            <span className="text-muted-foreground text-lg">/ 100</span>
          </div>
          <div className="bg-border mt-6 h-1.5 overflow-hidden rounded-full">
            <span
              className="block h-full rounded-full transition-[width] duration-1000"
              style={{ width: visible ? "71%" : 0, background: "var(--gradient-iq)" }}
            />
          </div>
          <dl className="mt-8 space-y-3 text-sm">
            {[
              ["Metadata quality", "Weak"],
              ["Internal link depth", "5 levels"],
              ["Indexable pages", "128 / 141"],
              ["Core Web Vitals", "Passing"],
            ].map(([k, v]) => (
              <div key={k} className="border-border flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-mono text-xs">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120} className="panel flex flex-col p-6 md:p-8">
          <span className="label-tech">AI Diagnosis</span>
          <p className="mt-4 text-lg leading-relaxed md:text-xl">
            Your homepage has strong performance, but you're losing SEO potential because{" "}
            <span className="decoration-cyan underline decoration-2 underline-offset-4">
              3 important pages have weak metadata
            </span>{" "}
            and your internal linking depth is unusually high.
          </p>

          <div className="mt-8">
            <span className="label-tech">Recommended Actions</span>
            <ol className="mt-4 space-y-px">
              {ACTIONS.map((a) => (
                <li
                  key={a.n}
                  className="border-border hover:bg-accent/50 group flex items-center gap-4 border-b py-3.5 transition-colors"
                >
                  <span className="text-muted-foreground font-mono text-xs">{a.n}</span>
                  <span className="text-sm font-medium">{a.text}</span>
                  <span className="text-muted-foreground ml-auto hidden font-mono text-xs sm:block">
                    {a.meta}
                  </span>
                  <ArrowUpRight className="text-muted-foreground group-hover:text-foreground size-4 transition-colors" />
                </li>
              ))}
            </ol>
          </div>

          <div className="border-border mt-8 flex flex-wrap items-center gap-6 border-t pt-6">
            <span className="label-tech">Potential Impact</span>
            <span className="text-success flex items-baseline gap-2 font-mono text-sm">
              SEO <strong className="font-display text-xl font-semibold">+14%</strong>
            </span>
            <span className="text-success flex items-center gap-2 font-mono text-sm">
              Visibility <ArrowUpRight className="size-4" />
            </span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
