import { Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export const SCAN_STAGES = [
  "CONNECTING TO WEBSITE...",
  "DISCOVERING PAGES...",
  "ANALYZING SECURITY...",
  "ANALYZING PERFORMANCE...",
  "ANALYZING SEO...",
  "ANALYZING INFRASTRUCTURE...",
  "GENERATING AI INSIGHTS...",
];

export const SCORES = [
  { label: "Security", value: 96 },
  { label: "Performance", value: 91 },
  { label: "SEO", value: 88 },
  { label: "Accessibility", value: 94 },
  { label: "Infrastructure", value: 97 },
];

function Bar({ value, active, delay }: { value: number; active: boolean; delay: number }) {
  return (
    <div className="bg-border/70 relative h-1 w-full overflow-hidden rounded-full">
      <span
        className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-1000"
        style={{
          width: active ? `${value}%` : "0%",
          transitionDelay: `${delay}ms`,
          background: "var(--gradient-iq)",
        }}
      />
    </div>
  );
}

function Wireframe({ scanning }: { scanning: boolean }) {
  return (
    <div className="border-border bg-background/60 relative overflow-hidden rounded-lg border p-4">
      <div className="flex gap-2">
        <span className="bg-danger/60 size-2 rounded-full" />
        <span className="bg-warning/60 size-2 rounded-full" />
        <span className="bg-success/60 size-2 rounded-full" />
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="bg-muted h-6 w-2/5 rounded" />
        <div className="bg-muted h-2 w-4/5 rounded" />
        <div className="bg-muted h-2 w-3/5 rounded" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-muted h-12 rounded" />
          <div className="bg-muted h-12 rounded" />
          <div className="bg-muted h-12 rounded" />
        </div>
        <div className="bg-muted h-2 w-2/3 rounded" />
      </div>
      {scanning ? (
        <span
          aria-hidden="true"
          className="animate-scanline pointer-events-none absolute inset-x-0 top-0 h-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.715 0.128 215.2 / 0.28), transparent)",
            borderBottom: "1px solid var(--cyan)",
          }}
        />
      ) : null}
    </div>
  );
}

export function LiveScan({
  status,
  stage,
  url,
}: {
  status: "idle" | "scanning" | "done";
  stage: number;
  url: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.25);
  const done = status === "done";
  const overall = useCountUp(92, done);
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "") || "example.com";

  return (
    <div ref={ref} className="panel overflow-hidden">
      <div className="border-border flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "size-1.5 rounded-full",
              status === "scanning" ? "bg-cyan animate-node" : done ? "bg-success" : "bg-muted-foreground/40",
            )}
          />
          <span className="label-tech">
            {status === "idle" ? "SITEIQ ENGINE · IDLE" : `SITEIQ ENGINE · ${host}`}
          </span>
        </div>
        <span className="label-tech hidden sm:block">
          {done ? "COMPLETE" : status === "scanning" ? "RUNNING" : "8 LAYERS READY"}
        </span>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-[1.05fr_1fr]">
        <Wireframe scanning={status === "scanning"} />

        <div className="flex flex-col">
          {status !== "done" ? (
            <ol className="space-y-2.5" aria-live="polite">
              {SCAN_STAGES.map((s, i) => {
                const state = status === "idle" ? "pending" : i < stage ? "done" : i === stage ? "active" : "pending";
                return (
                  <li
                    key={s}
                    className={cn(
                      "flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.08em] transition-opacity duration-300",
                      state === "pending" && "text-muted-foreground/45",
                      state === "active" && "text-foreground",
                      state === "done" && "text-muted-foreground",
                    )}
                  >
                    {state === "done" ? (
                      <Check className="text-success size-3.5 shrink-0" />
                    ) : state === "active" ? (
                      <Loader2 className="text-blue size-3.5 shrink-0 animate-spin" />
                    ) : (
                      <span className="border-border size-3.5 shrink-0 rounded-full border" />
                    )}
                    {s}
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex items-end justify-between">
                <div>
                  <p className="label-tech">Website Health</p>
                  <p className="font-display mt-1 text-5xl leading-none font-semibold tabular-nums">
                    {overall}
                    <span className="text-muted-foreground text-xl font-normal"> / 100</span>
                  </p>
                </div>
                <span className="bg-success/10 text-success flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
                  <ShieldCheck className="size-3.5" /> Healthy
                </span>
              </div>

              <ul className="mt-5 space-y-3">
                {SCORES.map((s, i) => (
                  <li key={s.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-mono tabular-nums">{s.value}</span>
                    </div>
                    <Bar value={s.value} active={visible} delay={i * 90} />
                  </li>
                ))}
              </ul>

              <p className="border-border text-muted-foreground mt-5 flex items-center gap-2 border-t pt-4 text-sm">
                <Sparkles className="text-violet size-4" />
                AI found <strong className="text-foreground font-medium">4 opportunities</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
