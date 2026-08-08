import { useState } from "react";
import { Cloud, Code2, Gauge, Lock } from "lucide-react";
import { Section, SectionHeader, Reveal } from "./Section";
import { cn } from "@/lib/utils";

const BRANCHES = [
  {
    id: "Frontend",
    icon: Code2,
    items: ["Next.js 15", "React 19", "Tailwind CSS", "Edge runtime"],
    note: "Server-rendered with streaming; hydration cost measured at 84 KB.",
  },
  {
    id: "Infrastructure",
    icon: Cloud,
    items: ["Vercel", "Cloudflare", "HTTP/3", "Brotli"],
    note: "Multi-region edge delivery, 31 ms median TTFB from 12 probes.",
  },
  {
    id: "Analytics",
    icon: Gauge,
    items: ["Google Analytics 4", "Vercel Analytics", "Segment"],
    note: "3 third-party scripts, 112 KB total, all loaded after interaction.",
  },
  {
    id: "Security",
    icon: Lock,
    items: ["HTTPS", "HSTS", "CSP", "SPF · DKIM · DMARC"],
    note: "CSP present but permits inline scripts — one weakening directive.",
  },
];

export function WebsiteDNA() {
  const [active, setActive] = useState("Frontend");

  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Website DNA"
        title="Every Website Has a DNA."
        sub="Understand what powers a website — from frameworks and infrastructure to analytics, hosting and third-party services."
      />

      <div className="mt-14 lg:mt-20">
        <Reveal className="panel overflow-hidden">
          <div className="border-border flex items-center gap-3 border-b px-5 py-3">
            <span className="bg-cyan animate-node size-1.5 rounded-full" />
            <span className="font-mono text-xs">example.com</span>
            <span className="label-tech ml-auto hidden sm:block">DNA MAP · 4 STRANDS</span>
          </div>

          <div className="grid gap-px md:grid-cols-4" style={{ background: "var(--border)" }}>
            {BRANCHES.map((b) => {
              const Icon = b.icon;
              const on = active === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onMouseEnter={() => setActive(b.id)}
                  onFocus={() => setActive(b.id)}
                  onClick={() => setActive(b.id)}
                  aria-pressed={on}
                  className={cn(
                    "bg-surface group relative p-6 text-left transition-colors duration-200",
                    on ? "bg-accent/60" : "hover:bg-accent/40",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 top-0 h-px transition-opacity duration-300",
                      on ? "opacity-100" : "opacity-0",
                    )}
                    style={{ background: "var(--gradient-iq)" }}
                  />
                  <Icon className={cn("size-4", on ? "text-blue" : "text-muted-foreground")} />
                  <h3 className="mt-4 text-sm font-semibold">{b.id}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {b.items.map((i) => (
                      <li key={i} className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                        <span className={cn("size-1 rounded-full", on ? "bg-cyan" : "bg-border")} />
                        {i}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <p className="border-border text-muted-foreground border-t px-5 py-4 text-sm">
            {BRANCHES.find((b) => b.id === active)?.note}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
