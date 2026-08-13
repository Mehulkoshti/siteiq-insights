import { ArrowRight, Sparkles } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { Reveal, Section, SectionHeader } from "./Section";
import { cn } from "@/lib/utils";

const COLUMNS = ["You", "Competitor A", "Competitor B"];
const ROWS = [
  { label: "Performance", values: [91, 84, 79] },
  { label: "SEO", values: [88, 93, 81] },
  { label: "Security", values: [96, 88, 90] },
  { label: "Accessibility", values: [94, 86, 88] },
  { label: "Overall", values: [92, 89, 84] },
];

export function CompetitorComparison() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);

  return (
    <Section id="compare" tone="surface">
      <SectionHeader
        eyebrow="Competitive Intelligence"
        title="Your Website Doesn't Exist in a Vacuum."
        sub="See how your website stacks up against the competition."
      />

      <div ref={ref} className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <Reveal className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse text-sm">
              <caption className="sr-only">Website scores compared with two competitors</caption>
              <thead>
                <tr className="border-border border-b">
                  <th scope="col" className="label-tech px-5 py-4 text-left font-normal">
                    Layer
                  </th>
                  {COLUMNS.map((c, i) => (
                    <th
                      key={c}
                      scope="col"
                      className={cn(
                        "px-5 py-4 text-right font-mono text-[0.68rem] tracking-[0.14em] uppercase",
                        i === 0 ? "text-foreground" : "text-muted-foreground font-normal",
                      )}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, r) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-border border-b last:border-b-0",
                      row.label === "Overall" && "bg-accent/40",
                    )}
                  >
                    <th scope="row" className="px-5 py-4 text-left text-sm font-medium">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => {
                      const best = v === Math.max(...row.values);
                      return (
                        <td key={i} className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="bg-border hidden h-1 w-20 overflow-hidden rounded-full sm:block">
                              <span
                                className={cn(
                                  "block h-full rounded-full transition-[width] duration-1000",
                                  i === 0 ? "bg-blue" : "bg-muted-foreground/40",
                                )}
                                style={{
                                  width: visible ? `${v}%` : 0,
                                  transitionDelay: `${r * 90 + i * 60}ms`,
                                }}
                              />
                            </span>
                            <span
                              className={cn(
                                "font-mono tabular-nums",
                                best ? "text-foreground font-medium" : "text-muted-foreground",
                              )}
                            >
                              {v}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={120} className="panel p-6">
          <span className="label-tech flex items-center gap-2">
            <Sparkles className="text-violet size-3.5" /> AI Insight
          </span>
          <p className="mt-4 text-[0.95rem] leading-relaxed">
            "Your website is faster and more secure than both competitors, but Competitor A has
            stronger SEO architecture."
          </p>
          <a
            href="#analyze"
            className="arrow-cta text-blue mt-6 inline-flex items-center gap-2 text-sm font-medium"
          >
            Compare Websites <ArrowRight className="size-4" />
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
