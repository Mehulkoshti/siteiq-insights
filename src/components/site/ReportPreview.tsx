import { useState } from "react";
import { AlertTriangle, ChevronRight, Info, ShieldAlert, Sparkles } from "lucide-react";
import { Section, SectionHeader, Reveal } from "./Section";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Security", "Performance", "SEO", "Infrastructure"] as const;
type Tab = (typeof TABS)[number];

const SCORES = [
  { label: "Security", value: 96 },
  { label: "Performance", value: 91 },
  { label: "SEO", value: 88 },
  { label: "Accessibility", value: 94 },
  { label: "Infrastructure", value: 97 },
];

const FINDINGS: Record<Tab, { level: string; title: string; body: string }[]> = {
  Overview: [
    { level: "Critical", title: "Content-Security-Policy missing on /app", body: "Inline scripts are unrestricted on the authenticated area." },
    { level: "High", title: "LCP 4.1s on mobile /pricing", body: "Hero image served at 2400px into a 720px slot." },
    { level: "Medium", title: "Duplicate meta descriptions", body: "3 templates emit the same description across 27 pages." },
  ],
  Security: [
    { level: "Critical", title: "CSP header absent", body: "No Content-Security-Policy on 4 of 6 route groups." },
    { level: "Medium", title: "Cookies without SameSite", body: "2 first-party cookies default to Lax implicitly." },
    { level: "Low", title: "Permissions-Policy not set", body: "Camera, microphone and geolocation are unrestricted." },
  ],
  Performance: [
    { level: "High", title: "Unoptimised hero image", body: "1.4 MB PNG could be 96 KB as AVIF." },
    { level: "Medium", title: "Render-blocking font CSS", body: "180 ms blocking time before first paint." },
    { level: "Low", title: "No preconnect to CDN", body: "Adds ~40 ms on cold connections." },
  ],
  SEO: [
    { level: "High", title: "Canonical points to redirect", body: "9 pages canonicalise to a 301 target." },
    { level: "Medium", title: "Internal link depth of 5", body: "/services sits five clicks from the homepage." },
    { level: "Low", title: "Missing Organization schema", body: "No structured data on the homepage." },
  ],
  Infrastructure: [
    { level: "Medium", title: "No DMARC policy enforcement", body: "p=none allows spoofed mail to be delivered." },
    { level: "Low", title: "IPv6 not advertised", body: "AAAA records absent for the apex domain." },
    { level: "Low", title: "Single origin region", body: "Origin in iad1 only; edge cache absorbs most traffic." },
  ],
};

const LEVEL: Record<string, { cls: string; Icon: typeof Info }> = {
  Critical: { cls: "text-danger bg-danger/10", Icon: ShieldAlert },
  High: { cls: "text-warning bg-warning/15", Icon: AlertTriangle },
  Medium: { cls: "text-blue bg-blue/10", Icon: Info },
  Low: { cls: "text-muted-foreground bg-muted", Icon: Info },
};

export function ReportPreview() {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <Section id="compare">
      <SectionHeader
        eyebrow="Interactive Report"
        title={
          <>
            From URL
            <br />
            to Intelligence.
          </>
        }
        sub="One report that a developer, an SEO lead and a founder can all read — without translation."
      />

      <Reveal className="panel mt-14 overflow-hidden lg:mt-20">
        <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="bg-success size-1.5 rounded-full" />
            <span className="font-mono text-sm">example.com</span>
            <span className="label-tech hidden sm:inline">Scanned 2 min ago</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="label-tech">Overall</span>
            <span className="font-display text-2xl font-semibold tabular-nums">92</span>
            <span className="text-muted-foreground text-sm">/ 100</span>
          </div>
        </div>

        <div className="border-border grid grid-cols-2 gap-px border-b bg-[var(--border)] sm:grid-cols-5">
          {SCORES.map((s) => (
            <div key={s.label} className="bg-surface px-5 py-4">
              <div className="label-tech">{s.label}</div>
              <div className="font-display mt-1.5 text-2xl font-semibold tabular-nums">{s.value}</div>
              <div className="bg-border mt-2 h-0.5">
                <span className="bg-foreground/60 block h-0.5" style={{ width: `${s.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div
          className="border-border scrollbar-none flex gap-1 overflow-x-auto border-b px-3 py-2"
          role="tablist"
          aria-label="Report sections"
        >
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="bg-surface p-5">
            <span className="label-tech">Technical Findings</span>
            <ul className="mt-4 space-y-px">
              {FINDINGS[tab].map((f) => {
                const { cls, Icon } = LEVEL[f.level]!;
                return (
                  <li key={f.title} className="border-border hover:bg-accent/50 flex gap-3 border-b py-3.5 last:border-b-0">
                    <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md", cls)}>
                      <Icon className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{f.title}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{f.body}</p>
                    </div>
                    <ChevronRight className="text-muted-foreground ml-auto size-4 self-center" />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-surface p-5">
            <span className="label-tech">AI Priorities</span>
            <ul className="mt-4 space-y-2">
              {[
                { k: "Critical", v: "1 finding", c: "border-danger/40 text-danger" },
                { k: "High", v: "2 findings", c: "border-warning/40 text-warning" },
                { k: "Medium", v: "5 findings", c: "border-blue/40 text-blue" },
              ].map((p) => (
                <li key={p.k} className={cn("flex items-center justify-between rounded-lg border px-3 py-2 text-sm", p.c)}>
                  <span className="font-medium">{p.k}</span>
                  <span className="font-mono text-xs">{p.v}</span>
                </li>
              ))}
            </ul>

            <span className="label-tech mt-7 block">AI Recommendations</span>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              <Sparkles className="text-violet mr-1.5 inline size-3.5 align-[-2px]" />
              Ship a strict CSP on /app first — it closes the only critical exposure and lifts
              Security to 99. Then compress the pricing hero; that single change recovers an
              estimated 1.9s of mobile LCP.
            </p>
            <button
              type="button"
              className="arrow-cta border-border hover:bg-accent mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors"
            >
              Open full report <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
