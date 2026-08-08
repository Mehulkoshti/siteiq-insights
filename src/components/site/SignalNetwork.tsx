import { useState } from "react";
import { Section, SectionHeader, Reveal } from "./Section";
import { cn } from "@/lib/utils";

type Node = { id: string; checks: number; items: string[]; x: number; y: number };

const NODES: Node[] = [
  { id: "Security", checks: 12, items: ["SSL", "Headers", "CSP", "Cookies", "CORS", "HSTS"], x: 50, y: 6 },
  { id: "Performance", checks: 10, items: ["LCP", "CLS", "TTFB", "Bundle size", "Caching"], x: 88, y: 24 },
  { id: "SEO", checks: 14, items: ["Metadata", "Canonicals", "Sitemap", "Headings", "Schema"], x: 92, y: 66 },
  { id: "Accessibility", checks: 9, items: ["Contrast", "Alt text", "ARIA", "Focus order"], x: 66, y: 94 },
  { id: "Infrastructure", checks: 8, items: ["DNS", "CDN", "Hosting", "HTTP/3", "Redirects"], x: 34, y: 94 },
  { id: "SSL/TLS", checks: 6, items: ["Cert chain", "Expiry", "TLS 1.3", "Ciphers"], x: 8, y: 66 },
  { id: "Email Security", checks: 5, items: ["SPF", "DKIM", "DMARC", "MX"], x: 12, y: 24 },
  { id: "CVE Detection", checks: 7, items: ["Library CVEs", "CMS version", "Exposed paths"], x: 50, y: 50 - 44 + 44 },
];

export function SignalNetwork() {
  const [active, setActive] = useState<string | null>("Security");
  const current = NODES.find((n) => n.id === active) ?? null;

  return (
    <Section id="solutions">
      <SectionHeader
        eyebrow="Intelligence Network"
        title={
          <>
            One Website. 65+ Signals.
            <br />
            One Intelligence Layer.
          </>
        }
        sub="Every signal feeds a single model of your website — not eight disconnected reports."
      />

      <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        <Reveal className="panel relative aspect-[4/3] overflow-hidden p-4 sm:aspect-[16/11]">
          <div aria-hidden="true" className="grid-bg absolute inset-0" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
            {NODES.filter((n) => n.id !== "CVE Detection").map((n) => (
              <line
                key={n.id}
                x1="50"
                y1="50"
                x2={n.x}
                y2={n.y}
                stroke={active === n.id ? "var(--blue)" : "var(--border)"}
                strokeWidth={active === n.id ? 0.45 : 0.25}
                className="animate-dash"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className="font-display flex size-20 items-center justify-center rounded-full text-[0.7rem] font-semibold tracking-[0.14em] text-white sm:size-24 sm:text-xs"
                style={{ background: "var(--gradient-iq)", boxShadow: "var(--shadow-lift)" }}
              >
                SITEIQ
              </div>
            </div>

            {NODES.filter((n) => n.id !== "CVE Detection").map((n) => (
              <button
                key={n.id}
                type="button"
                onMouseEnter={() => setActive(n.id)}
                onFocus={() => setActive(n.id)}
                onClick={() => setActive(n.id)}
                aria-pressed={active === n.id}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1.5 font-mono text-[0.6rem] tracking-[0.08em] whitespace-nowrap uppercase transition-all duration-200 sm:text-[0.66rem]",
                  active === n.id
                    ? "border-blue bg-surface text-foreground shadow-[var(--shadow-panel)]"
                    : "border-border bg-surface/80 text-muted-foreground hover:text-foreground backdrop-blur",
                )}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                {n.id}
              </button>
            ))}
            <span
              className="border-violet/40 bg-surface/80 text-muted-foreground absolute rounded-full border px-2.5 py-1.5 font-mono text-[0.6rem] tracking-[0.08em] uppercase backdrop-blur sm:text-[0.66rem]"
              style={{ left: "50%", top: "17%", transform: "translate(-50%,-50%)" }}
            >
              CVE Detection
            </span>
          </div>
        </Reveal>

        <Reveal delay={120} className="panel p-6">
          {current ? (
            <>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-semibold">{current.id}</h3>
                <span className="label-tech">{current.checks} checks</span>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-2">
                {current.items.map((item) => (
                  <li
                    key={item}
                    className="border-border text-muted-foreground rounded-md border px-2.5 py-2 font-mono text-xs"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground border-border mt-6 border-t pt-5 text-sm leading-relaxed">
                Signals are correlated across layers — a missing security header changes the
                security score <em>and</em> the AI's prioritisation of everything else.
              </p>
            </>
          ) : null}
        </Reveal>
      </div>
    </Section>
  );
}
