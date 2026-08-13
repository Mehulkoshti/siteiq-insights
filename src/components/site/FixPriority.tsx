import { Sparkles } from "lucide-react";
import { Reveal, Section, SectionHeader } from "./Section";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    n: "01",
    level: "Critical",
    text: "Missing security headers",
    detail: "CSP and X-Frame-Options absent on all routes",
    impact: "High",
  },
  {
    n: "02",
    level: "High",
    text: "Slow mobile performance",
    detail: "LCP 4.1s on /pricing — hero image unoptimised",
    impact: "High",
  },
  {
    n: "03",
    level: "Medium",
    text: "Weak metadata on 6 pages",
    detail: "Duplicate descriptions across template pages",
    impact: "Medium",
  },
];

const LEVEL_STYLE: Record<string, string> = {
  Critical: "bg-danger/10 text-danger",
  High: "bg-warning/15 text-warning",
  Medium: "bg-blue/10 text-blue",
};

export function FixPriority() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Why SiteIQ"
        title={
          <>
            Don't Just Find Problems.
            <br />
            Know What to Fix.
          </>
        }
        sub="Most tools hand you data. SiteIQ hands you direction."
      />

      <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <Reveal className="panel overflow-hidden">
          <div className="border-border flex items-baseline justify-between border-b px-5 py-4">
            <span className="label-tech">17 issues found</span>
            <span className="label-tech">SiteIQ priority</span>
          </div>
          <ol>
            {ITEMS.map((it) => (
              <li
                key={it.n}
                className="border-border hover:bg-accent/50 flex items-center gap-4 border-b px-5 py-5 transition-colors last:border-b-0"
              >
                <span className="text-muted-foreground font-mono text-xs">{it.n}</span>
                <span
                  className={cn(
                    "shrink-0 rounded-md px-2 py-0.5 font-mono text-[0.65rem] tracking-wider uppercase",
                    LEVEL_STYLE[it.level],
                  )}
                >
                  {it.level}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{it.text}</p>
                  <p className="text-muted-foreground truncate text-xs">{it.detail}</p>
                </div>
                <span className="text-muted-foreground hidden shrink-0 font-mono text-[0.65rem] tracking-wider uppercase sm:block">
                  Impact · {it.impact}
                </span>
              </li>
            ))}
          </ol>
          <div className="border-border text-muted-foreground border-t px-5 py-3 font-mono text-[0.68rem] tracking-wider uppercase">
            + 14 lower-priority findings
          </div>
        </Reveal>

        <Reveal delay={120} className="bg-ink rounded-xl p-7 text-white">
          <span className="label-tech flex items-center gap-2 !text-white/40">
            <Sparkles className="text-violet size-3.5" /> AI Recommendation
          </span>
          <p className="mt-5 text-[1.0625rem] leading-relaxed">
            "Fix these three issues first. They have the biggest potential impact on your
            website health."
          </p>
          <div className="mt-7 flex items-baseline gap-3 border-t border-white/10 pt-6">
            <span className="font-display text-3xl font-semibold tabular-nums">73</span>
            <span className="text-white/40">→</span>
            <span className="text-success font-display text-3xl font-semibold tabular-nums">
              89
            </span>
            <span className="ml-auto font-mono text-[0.62rem] tracking-[0.14em] text-white/35 uppercase">
              Projected
            </span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
