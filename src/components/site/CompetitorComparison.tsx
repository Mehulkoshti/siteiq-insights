import { ArrowRight, Sparkles } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { Section, SectionHeader, Reveal } from "./Section";
import { cn } from "@/lib/utils";

const COLUMNS = ["You", "Competitor A", "Competitor B"];
const ROWS = [
  { label: "Performance", values: [91, 84, 79] },
  { label: "SEO", values: [88, 93, 81] },
  { label: "Security", values: [96, 88, 90] },
  { label: "Accessibility", values: [94, 86, 88] },
  { label: "Infrastructure", values: [97, 92, 85] },
  { label: "Overall", values: [91, 87, 84] },
];

export function CompetitorComparison() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);

  return (
    <Section>
      <SectionHeader
        eyebrow="Competitor Intelligence"
        title={
          <>
            Don't Just Audit Your Website.
            <br />
            Know Where You Stand.
          </>
        }
        sub="Benchmark every layer against the sites you actually compete with."
      />

      <div ref={ref} className="mt-14 lg:mt-20">
        <Reveal className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <caption className="sr-only">Website intelligence comparison against two competitors</caption>
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
                        "px-5 py-4 text-left text-xs font-medium tracking-[0.14em] uppercase",
                        i === 0 ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-border hover:bg-accent/40 border-b transition-colors last:border-b-0",
                      row.label === "Overall" && "bg-accent/30",
                    )}
                  >
                    <th scope="row" className="px-5 py-4 text-left font-medium">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => {
                      const best = v === Math.max(...row.values);
                      return (
                        <td key={i} className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "font-display w-8 text-lg font-semibold tabular-nums",
                                best ? "text-foreground" : "text-muted-foreground",
                              )}
                            >
                              {v}
                            </span>
                            <span className="bg-border h-1 w-full max-w-[120px] overflow-hidden rounded-full">
                              <span
                                className="block h-full rounded-full transition-[width] duration-1000"
                                style={{
                                  width: visible ? `${v}%` : 0,
                                  transitionDelay: `${ri * 60 + i * 40}ms`,
                                  background: i === 0 ? "var(--gradient-iq)" : "var(--muted-foreground)",
                                  opacity: i === 0 ? 1 : 0.35,
                                }}
                              />
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

          <div className="border-border bg-accent/30 flex flex-wrap items-center gap-4 border-t px-5 py-4">
            <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
              <Sparkles className="text-violet mr-1.5 inline size-3.5 align-[-2px]" />
              You're faster than both competitors, but Competitor A has stronger SEO architecture —
              their category pages sit two clicks from the homepage, yours sit five.
            </p>
            <button
              type="button"
              className="arrow-cta border-border bg-surface hover:shadow-panel inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all"
            >
              Compare Websites <ArrowRight className="size-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
