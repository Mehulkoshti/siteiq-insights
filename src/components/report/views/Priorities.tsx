import { CheckCircle2 } from "lucide-react";
import { CATEGORY_LABELS, SEVERITY_ORDER, type AuditReport } from "@/lib/report/types";
import { FindingCard } from "../FindingCard";
import { EmptyState, Panel, PanelHeader, StatusBadge } from "../primitives";

const WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 } as const;
const EFFORT = { easy: 1, moderate: 2, hard: 3 } as const;

export function Priorities({ report }: { report: AuditReport }) {
  const ranked = [...report.findings].sort((a, b) => {
    const impact = WEIGHT[b.severity] / EFFORT[b.difficulty] - WEIGHT[a.severity] / EFFORT[a.difficulty];
    if (impact !== 0) return impact;
    return SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
  });

  const top = ranked.slice(0, 8);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[1.65rem] font-semibold tracking-tight md:text-[2rem]">
          Fix these first
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[0.9375rem] leading-relaxed">
          SiteIQ ranks findings by severity against how much work the fix takes, so the top of this
          list is where your time pays off most.
        </p>
      </div>

      {top.length ? (
        <>
          <Panel>
            <PanelHeader title="Priority order" sub="Highest impact per unit of effort, first." />
            <ol className="divide-border divide-y">
              {top.map((f, i) => (
                <li key={f.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5">
                  <span className="text-muted-foreground w-6 shrink-0 font-mono text-[0.8125rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[0.9375rem] font-medium">{f.title}</div>
                    <div className="text-muted-foreground mt-0.5 font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
                      {CATEGORY_LABELS[f.category]}
                    </div>
                  </div>
                  <StatusBadge
                    tone={f.difficulty === "easy" ? "success" : f.difficulty === "moderate" ? "info" : "warning"}
                    label={f.difficulty === "easy" ? "Easy fix" : f.difficulty === "moderate" ? "Moderate" : "Involved"}
                    icon={false}
                  />
                </li>
              ))}
            </ol>
          </Panel>

          <div className="space-y-3">
            {top.map((f) => (
              <FindingCard key={f.id} finding={f} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={CheckCircle2}
          title="Nothing waiting on you"
          description="SiteIQ found no issues to prioritise in this analysis."
        />
      )}
    </div>
  );
}
