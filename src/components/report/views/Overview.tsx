import { ArrowRight, CheckCircle2, Clock, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, SEVERITY_ORDER, type AuditReport, type CategoryId } from "@/lib/report/types";
import {
  MetricCard,
  Panel,
  PanelHeader,
  ScoreRing,
  SeverityBadge,
  StatusBadge,
  btn,
  riskTone,
  scoreLabel,
  scoreTone,
} from "../primitives";

const CATEGORY_NAV: Record<CategoryId, string> = {
  seo: "seo",
  security: "security",
  performance: "performance",
  accessibility: "accessibility",
  infrastructure: "infrastructure",
  privacy: "privacy",
};

const BAR_TONE: Record<string, string> = {
  success: "bg-success",
  info: "bg-blue",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-muted-foreground",
};

export function Overview({
  report,
  onNavigate,
}: {
  report: AuditReport;
  onNavigate: (id: string) => void;
}) {
  const priority = [...report.findings]
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
    .filter((f) => f.severity === "critical" || f.severity === "high")
    .slice(0, 5);

  const criticalCount = report.findings.filter((f) => f.severity === "critical").length;

  return (
    <div className="space-y-6">
      {/* Level 1 — website health */}
      <Panel className="p-5 md:p-6">
        <div className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
          Website health
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="flex items-center gap-5">
            <ScoreRing score={report.score} />
            <div className="min-w-0">
              <div className="font-display text-[1.35rem] leading-tight font-semibold tracking-tight">
                {scoreLabel(report.score)}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {report.risk ? (
                  <StatusBadge
                    tone={riskTone(report.risk)}
                    label={`${report.risk[0]!.toUpperCase()}${report.risk.slice(1)} risk`}
                  />
                ) : null}
                {report.grade ? (
                  <StatusBadge tone={scoreTone(report.score)} label={`Grade ${report.grade}`} icon={false} />
                ) : null}
              </div>
              <p className="text-muted-foreground mt-3 text-[0.8125rem]">
                Scanned{" "}
                {new Date(report.scannedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MetricCard label="Pages found" value={report.crawl.discovered} />
            <MetricCard label="Issues" value={report.findings.length} />
            <MetricCard
              label="Critical"
              value={criticalCount}
              tone={criticalCount ? "danger" : "success"}
            />
            <MetricCard
              label="Broken pages"
              value={report.crawl.broken}
              tone={report.crawl.broken ? "danger" : "neutral"}
            />
            <MetricCard label="Redirects" value={report.crawl.redirects} />
            <MetricCard
              label="Avg response"
              value={report.crawl.avgResponseMs === null ? "—" : `${report.crawl.avgResponseMs}ms`}
            />
          </div>
        </div>

        {report.coverageNote ? (
          <p className="border-border text-muted-foreground mt-5 border-t pt-4 text-[0.8125rem] leading-relaxed">
            {report.coverageNote}
          </p>
        ) : null}
      </Panel>

      {/* Level 2 — what needs attention */}
      <Panel>
        <PanelHeader
          title="What needs your attention"
          sub="The highest-severity issues SiteIQ found, in the order worth fixing them."
          action={
            <button type="button" onClick={() => onNavigate("findings")} className={btn.tertiary}>
              All findings <ArrowRight className="size-3.5" />
            </button>
          }
        />
        {priority.length ? (
          <ul className="divide-border divide-y">
            {priority.map((f) => (
              <li
                key={f.id}
                className="hover:bg-accent/40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={f.severity} />
                    <span className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
                      {CATEGORY_LABELS[f.category]}
                    </span>
                  </div>
                  <div className="mt-2 truncate text-[0.9375rem] font-medium">{f.title}</div>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-[0.8125rem]">
                    {f.impact}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(CATEGORY_NAV[f.category])}
                  className={btn.tertiary}
                >
                  Review <ArrowRight className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3 px-5 py-8">
            <CheckCircle2 className="text-success size-5 shrink-0" aria-hidden="true" />
            <p className="text-[0.9375rem]">
              No critical or high-severity issues were found in this analysis.
            </p>
          </div>
        )}
      </Panel>

      {/* Level 3 — category health */}
      <Panel>
        <PanelHeader title="Website health by area" sub="Scores derived from the checks SiteIQ completed." />
        <ul className="grid gap-px sm:grid-cols-2 xl:grid-cols-3">
          {report.categories.map((c) => {
            const tone = scoreTone(c.score);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(CATEGORY_NAV[c.id])}
                  className="hover:bg-accent/40 w-full p-5 text-left transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[0.9375rem] font-medium">{c.label}</span>
                    <span className="font-display text-[1.1rem] font-semibold tracking-tight">
                      {c.score ?? "—"}
                      <span className="text-muted-foreground text-[0.8125rem] font-normal"> / 100</span>
                    </span>
                  </div>
                  <div className="bg-muted mt-3 h-1.5 overflow-hidden rounded-full">
                    <div
                      className={cn("h-full rounded-full transition-[width] duration-700", BAR_TONE[tone])}
                      style={{ width: `${c.score ?? 0}%` }}
                    />
                  </div>
                  <div className="text-muted-foreground mt-2.5 flex items-center justify-between text-[0.75rem]">
                    <span>{scoreLabel(c.score)}</span>
                    <span className="font-mono">
                      {c.issues} issue{c.issues === 1 ? "" : "s"}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      {/* Level 4 — crawl */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Panel>
          <PanelHeader title="Site crawl" sub="Requests SiteIQ completed for this report." />
          <div className="grid grid-cols-2 gap-3 p-5">
            <MetricCard label="Discovered" value={report.crawl.discovered} />
            <MetricCard label="Crawled" value={report.crawl.crawled} />
            <MetricCard label="Broken" value={report.crawl.broken} tone={report.crawl.broken ? "danger" : "neutral"} />
            <MetricCard label="Redirects" value={report.crawl.redirects} />
            <MetricCard
              label="Orphans"
              value={report.crawl.orphans ?? "—"}
              {...(report.crawl.orphans === null ? { hint: "Needs full crawl" } : {})}
            />
            <MetricCard
              label="Avg response"
              value={report.crawl.avgResponseMs === null ? "—" : `${report.crawl.avgResponseMs}ms`}
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Recently crawled"
            sub="Live results from this analysis."
            action={
              <button type="button" onClick={() => onNavigate("pages")} className={btn.tertiary}>
                View all pages <ArrowRight className="size-3.5" />
              </button>
            }
          />
          <PagesTable pages={report.pages.slice(0, 8)} />
        </Panel>
      </div>
    </div>
  );
}

export function PagesTable({ pages }: { pages: AuditReport["pages"] }) {
  if (!pages.length) {
    return (
      <div className="text-muted-foreground flex items-center gap-2.5 px-5 py-8 text-[0.875rem]">
        <FileSearch className="size-4" aria-hidden="true" /> No pages recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-[0.875rem]">
        <thead className="text-muted-foreground border-border border-b">
          <tr className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
            <th className="px-5 py-2.5 font-normal">Status</th>
            <th className="px-3 py-2.5 font-normal">URL</th>
            <th className="px-3 py-2.5 font-normal">Response</th>
            <th className="px-5 py-2.5 font-normal">Issues</th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {pages.map((p) => (
            <tr key={p.url} className="hover:bg-accent/40 transition-colors">
              <td className="px-5 py-2.5">
                <StatusBadge
                  tone={p.status === null ? "danger" : p.status >= 400 ? "danger" : p.status >= 300 ? "warning" : "success"}
                  label={p.status === null ? "Failed" : String(p.status)}
                  icon={false}
                />
              </td>
              <td className="text-muted-foreground max-w-[280px] truncate px-3 py-2.5 font-mono text-[0.8125rem]">
                {p.path}
              </td>
              <td className="px-3 py-2.5 font-mono text-[0.8125rem]">
                <span className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Clock className="size-3" aria-hidden="true" />
                  {p.responseMs === null ? "—" : `${p.responseMs}ms`}
                </span>
              </td>
              <td className="px-5 py-2.5 font-mono text-[0.8125rem]">{p.issues}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
