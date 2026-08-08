import { ArrowRight, Download, GitCompare, Radar } from "lucide-react";
import { Section, SectionHeader, Reveal } from "./Section";
import { cn } from "@/lib/utils";

const SITES = [
  { host: "northgate.co", score: 92 },
  { host: "lumen-clinic.com", score: 88 },
  { host: "vaultpay.io", score: 84 },
  { host: "harborline.dev", score: 96 },
  { host: "studio-kern.com", score: 91 },
  { host: "atlas-freight.net", score: 78 },
];

const TOOLS = [
  { icon: Download, label: "Export Report", note: "PDF · CSV · JSON" },
  { icon: GitCompare, label: "Compare Sites", note: "Any two clients" },
  { icon: Radar, label: "Monitor Clients", note: "Daily re-scan" },
];

function tone(score: number) {
  if (score >= 90) return "text-success";
  if (score >= 85) return "text-blue";
  return "text-warning";
}

export function AgencyTools() {
  return (
    <Section id="pricing" tone="surface">
      <SectionHeader
        eyebrow="Agencies & Developers"
        title={
          <>
            One Website Is Useful.
            <br />
            A Hundred Are Powerful.
          </>
        }
        sub="Run every client site through the same intelligence layer and see the whole portfolio at a glance."
      />

      <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Reveal className="panel overflow-hidden">
          <div className="border-border flex items-center justify-between border-b px-5 py-3">
            <span className="label-tech">Bulk Audit</span>
            <span className="font-mono text-xs">12 Websites · 6 shown</span>
          </div>
          <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--border)" }}>
            {SITES.map((s) => (
              <li key={s.host} className="bg-surface hover:bg-accent/50 p-5 transition-colors">
                <p className="text-muted-foreground truncate font-mono text-xs">{s.host}</p>
                <p className={cn("font-display mt-2 text-3xl font-semibold tabular-nums", tone(s.score))}>
                  {s.score}
                </p>
                <div className="bg-border mt-3 h-0.5">
                  <span className="bg-foreground/50 block h-0.5" style={{ width: `${s.score}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="border-border text-muted-foreground border-t px-5 py-3 text-xs">
            Portfolio average <strong className="text-foreground font-medium">88.2</strong> · 3 sites
            with critical findings
          </div>
        </Reveal>

        <Reveal delay={120} className="flex flex-col gap-3">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="panel hover:border-foreground/20 flex items-center gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Icon className="text-blue size-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-muted-foreground text-xs">{t.note}</p>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            className="arrow-cta bg-foreground text-background hover:shadow-lift mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-px"
          >
            Explore Agency Tools <ArrowRight className="size-4" />
          </button>
        </Reveal>
      </div>
    </Section>
  );
}
