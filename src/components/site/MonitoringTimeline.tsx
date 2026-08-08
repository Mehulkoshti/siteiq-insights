import { ArrowRight, ArrowDown, ArrowUp, ShieldAlert } from "lucide-react";
import { Section, SectionHeader, Reveal } from "./Section";
import { cn } from "@/lib/utils";

const EVENTS = [
  { date: "Mon Aug 04", layer: "SEO", value: "82", trend: "flat" as const, note: "Baseline established" },
  { date: "Tue Aug 05", layer: "SEO", value: "79", trend: "down" as const, note: "3 canonicals repointed to a redirect" },
  { date: "Wed Aug 06", layer: "SEO", value: "91", trend: "up" as const, note: "Metadata regenerated across 27 pages" },
  { date: "Thu Aug 07", layer: "Security", value: "94 → 71", trend: "critical" as const, note: "CSP header removed in deploy 4f21a" },
];

export function MonitoringTimeline() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Continuous Monitoring"
        title={
          <>
            Your Website Changes.
            <br />
            SiteIQ Notices.
          </>
        }
        sub="Every deploy, DNS edit and third-party script is re-scanned and diffed against the last known good state."
      />

      <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Reveal className="panel p-2">
          <ol>
            {EVENTS.map((e, i) => (
              <li
                key={e.date}
                className={cn(
                  "hover:bg-accent/50 relative flex items-center gap-4 rounded-lg px-4 py-4 transition-colors",
                  i < EVENTS.length - 1 && "border-border border-b",
                )}
              >
                <span className="label-tech w-24 shrink-0">{e.date}</span>
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    e.trend === "critical" ? "bg-danger" : e.trend === "up" ? "bg-success" : e.trend === "down" ? "bg-warning" : "bg-border",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{e.layer}</span>
                    <span className="font-display text-base font-semibold tabular-nums">{e.value}</span>
                    {e.trend === "up" ? <ArrowUp className="text-success size-3.5" /> : null}
                    {e.trend === "down" ? <ArrowDown className="text-warning size-3.5" /> : null}
                  </div>
                  <p className="text-muted-foreground truncate text-xs">{e.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120} className="border-danger/30 bg-danger/[0.04] rounded-xl border p-6">
          <span className="text-danger flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.16em] uppercase">
            <ShieldAlert className="size-3.5" /> Critical change detected
          </span>
          <p className="mt-4 text-lg leading-relaxed">
            Your Content Security Policy header disappeared.
          </p>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Present on Aug 06 at 14:02, absent on Aug 07 at 09:18 across all six route groups.
            Correlated with deploy <span className="font-mono text-xs">4f21a</span>. Security
            dropped 23 points in one release.
          </p>
          <button
            type="button"
            className="arrow-cta bg-foreground text-background mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-transform duration-200 hover:-translate-y-px"
          >
            Investigate <ArrowRight className="size-4" />
          </button>
        </Reveal>
      </div>
    </Section>
  );
}
