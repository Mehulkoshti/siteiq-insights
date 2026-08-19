import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, type Finding } from "@/lib/report/types";
import { btn, Panel, SeverityBadge } from "./primitives";

const DIFFICULTY: Record<Finding["difficulty"], string> = {
  easy: "Easy fix",
  moderate: "Moderate",
  hard: "Involved",
};

export function FindingCard({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false);

  return (
    <Panel as="article" className="overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={finding.severity} />
            <span className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
              {CATEGORY_LABELS[finding.category]}
            </span>
          </div>
          <h3 className="font-display mt-2.5 text-[1rem] leading-snug font-semibold tracking-tight">
            {finding.title}
          </h3>
          <p className="text-muted-foreground mt-1.5 text-[0.875rem] leading-relaxed">
            {finding.description}
          </p>
          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.75rem]">
            <span>{DIFFICULTY[finding.difficulty]}</span>
            <span className="font-mono">
              {finding.affectedPages.length} page{finding.affectedPages.length === 1 ? "" : "s"} affected
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={cn(btn.secondary, "shrink-0")}
        >
          <span className="hidden sm:inline">{open ? "Hide" : "View"} details</span>
          <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </div>

      {open ? (
        <div className="border-border bg-surface grid gap-5 border-t p-4 sm:grid-cols-2 sm:p-5">
          <Detail title="Why it matters" body={finding.impact} />
          <Detail title="How to fix" body={finding.howToFix} />
          {finding.evidence ? <Detail title="Evidence" body={finding.evidence} mono /> : null}
          <div>
            <DetailTitle>Affected pages</DetailTitle>
            <ul className="mt-1.5 space-y-1">
              {finding.affectedPages.map((p) => (
                <li key={p} className="text-muted-foreground truncate font-mono text-[0.8125rem]">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <button type="button" className={btn.secondary} disabled title="Connects to the SiteIQ AI suggestion service">
              <Sparkles className="size-4" /> Ask SiteIQ
            </button>
            <p className="text-muted-foreground mt-2 text-[0.75rem]">
              AI fix suggestions are served by the SiteIQ audit engine.
            </p>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function DetailTitle({ children }: { children: string }) {
  return (
    <div className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
      {children}
    </div>
  );
}

function Detail({ title, body, mono }: { title: string; body: string; mono?: boolean }) {
  return (
    <div>
      <DetailTitle>{title}</DetailTitle>
      <p className={cn("mt-1.5 text-[0.875rem] leading-relaxed", mono && "font-mono text-[0.8125rem]")}>
        {body}
      </p>
    </div>
  );
}
