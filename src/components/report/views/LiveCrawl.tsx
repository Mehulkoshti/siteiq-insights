import type { ParallelCheck } from "@/lib/report/types";
import { cn } from "@/lib/utils";
import { Panel, Spinner } from "../primitives";

const STATUS_DOT: Record<ParallelCheck["status"], string> = {
  pending: "bg-muted-foreground/40",
  running: "bg-blue animate-pulse",
  done: "bg-success",
  failed: "bg-danger",
  skipped: "bg-muted-foreground/30",
};

export function LiveCrawl({ url, checks }: { url: string; checks: ParallelCheck[] }) {
  return (
    <div className="mx-auto max-w-3xl py-6">
      <div className="relative mx-auto grid size-40 place-items-center">
        <div className="border-border absolute inset-0 rounded-full border" />
        <div className="border-primary/25 absolute inset-4 rounded-full border" />
        <div className="border-cyan/25 absolute inset-8 rounded-full border" />
        <div
          className="from-cyan/0 via-blue/60 to-cyan/0 absolute inset-x-6 h-px animate-scanline bg-gradient-to-r"
          aria-hidden="true"
        />
        <span className="font-display text-[0.8125rem] font-semibold tracking-tight">Analyzing</span>
      </div>

      <div className="mt-8 text-center">
        <h1 className="font-display text-[1.5rem] font-semibold tracking-tight md:text-[1.85rem]">
          Running your website analysis
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-[0.8125rem] break-all">{url}</p>
      </div>

      <Panel className="mt-8 overflow-hidden">
        <ul className="divide-border divide-y">
          {checks.map((c) => (
            <li key={c.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3">
              <span className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[c.status])} aria-hidden="true" />
              <div className="min-w-0">
                <div className="truncate text-[0.875rem] font-medium">{c.label}</div>
                {c.detail ? (
                  <div className="text-muted-foreground mt-0.5 truncate font-mono text-[0.75rem]">
                    {c.detail}
                  </div>
                ) : null}
              </div>
              {c.status === "running" ? (
                <Spinner className="text-blue" />
              ) : (
                <span className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
                  {c.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Panel>

      <p className="text-muted-foreground mt-4 text-center text-[0.8125rem]" aria-live="polite">
        Checks run in parallel. Results appear as soon as every signal is collected.
      </p>
    </div>
  );
}
