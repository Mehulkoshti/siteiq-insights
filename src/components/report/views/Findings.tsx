import { useMemo, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  SEVERITY_ORDER,
  type AuditReport,
  type CategoryId,
  type Severity,
} from "@/lib/report/types";
import { FindingCard } from "../FindingCard";
import { EmptyState, Panel } from "../primitives";

export function Findings({
  report,
  category,
  title,
  description,
}: {
  report: AuditReport;
  category?: CategoryId;
  title: string;
  description: string;
}) {
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [query, setQuery] = useState("");

  const base = useMemo(
    () =>
      [...report.findings]
        .filter((f) => (category ? f.category === category : true))
        .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)),
    [report.findings, category],
  );

  const filtered = base.filter((f) => {
    if (severity !== "all" && f.severity !== severity) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      f.title.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      CATEGORY_LABELS[f.category].toLowerCase().includes(q)
    );
  });

  const counts = SEVERITY_ORDER.map((s) => ({
    severity: s,
    count: base.filter((f) => f.severity === s).length,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[1.65rem] font-semibold tracking-tight md:text-[2rem]">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[0.9375rem] leading-relaxed">
          {description}
        </p>
      </div>

      <Panel className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <label className="relative min-w-0">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <span className="sr-only">Search findings</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues…"
            className="border-border bg-background focus-visible:ring-ring h-9 w-full rounded-[9px] border pr-3 pl-9 text-[0.875rem] focus-visible:ring-2 focus-visible:outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={severity === "all"} onClick={() => setSeverity("all")}>
            All <span className="font-mono opacity-70">{base.length}</span>
          </FilterChip>
          {counts.map(({ severity: s, count }) => (
            <FilterChip key={s} active={severity === s} onClick={() => setSeverity(s)} disabled={!count}>
              {s[0]!.toUpperCase() + s.slice(1)} <span className="font-mono opacity-70">{count}</span>
            </FilterChip>
          ))}
        </div>
      </Panel>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckCircle2}
          title={base.length ? "No matching findings" : "Nothing to fix here"}
          description={
            base.length
              ? "Try a different severity filter or search term."
              : "SiteIQ did not detect any issues in this area during the analysis."
          }
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-[9px] border px-3 text-[0.8125rem] font-medium transition-colors duration-150 disabled:opacity-40",
        active
          ? "border-primary/30 bg-primary/10 text-foreground"
          : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
