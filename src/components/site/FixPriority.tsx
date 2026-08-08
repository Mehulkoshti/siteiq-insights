import { useReveal } from "@/hooks/use-reveal";
import { Section, SectionHeader, Reveal } from "./Section";
import { cn } from "@/lib/utils";

const ITEMS = [
  { n: "01", level: "Critical", text: "Missing security headers", detail: "CSP, X-Frame-Options absent on all routes" },
  { n: "02", level: "High", text: "Slow mobile LCP", detail: "4.1s on /pricing — hero image unoptimised" },
  { n: "03", level: "High", text: "Broken canonical tags", detail: "9 pages point to a redirected URL" },
  { n: "04", level: "Medium", text: "Weak metadata", detail: "3 templates share one description" },
  { n: "05", level: "Low", text: "Missing image alt text", detail: "14 decorative images unlabelled" },
];

const LEVEL_STYLE: Record<string, string> = {
  Critical: "bg-danger/10 text-danger",
  High: "bg-warning/15 text-warning",
  Medium: "bg-blue/10 text-blue",
  Low: "bg-muted text-muted-foreground",
};

const IMPACT = [
  { label: "Security", value: 15 },
  { label: "SEO", value: 12 },
  { label: "Performance", value: 8 },
];

export function FixPriority() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);

  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Fix Priority"
        title={
          <>
            Don't Fix Everything.
            <br />
            Fix What Matters.
          </>
        }
        sub="SiteIQ ranks every finding by real impact, so a five-minute fix never sits behind a five-day one."
      />

      <div ref={ref} className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal className="panel overflow-hidden">
          <ol>
            {ITEMS.map((it, i) => (
              <li
                key={it.n}
                className="border-border hover:bg-accent/50 flex items-center gap-4 border-b px-5 py-4 transition-colors last:border-b-0"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <span className="text-muted-foreground font-mono text-xs">{it.n}</span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 font-mono text-[0.65rem] tracking-wider uppercase",
                    LEVEL_STYLE[it.level],
                  )}
                >
                  {it.level}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{it.text}</p>
                  <p className="text-muted-foreground truncate text-xs">{it.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120} className="panel p-6">
          <span className="label-tech">Expected Impact</span>
          <ul className="mt-6 space-y-6">
            {IMPACT.map((im, i) => (
              <li key={im.label}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm">{im.label}</span>
                  <span className="text-success font-display text-lg font-semibold">+{im.value}</span>
                </div>
                <div className="bg-border mt-2 h-1 overflow-hidden rounded-full">
                  <span
                    className="bg-success block h-full rounded-full transition-[width] duration-1000"
                    style={{ width: visible ? `${im.value * 5}%` : 0, transitionDelay: `${i * 120}ms` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground border-border mt-8 border-t pt-6 text-sm leading-relaxed">
            Fixing the top two findings moves overall health from{" "}
            <strong className="text-foreground font-medium">73</strong> to an estimated{" "}
            <strong className="text-foreground font-medium">89</strong>.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
