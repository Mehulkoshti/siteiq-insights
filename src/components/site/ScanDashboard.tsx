import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useCountUp } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export const SCAN_STAGES = [
  "CONNECTING...",
  "DISCOVERING PAGES...",
  "ANALYZING SECURITY...",
  "ANALYZING PERFORMANCE...",
  "ANALYZING SEO...",
  "GENERATING AI INSIGHTS...",
];

export const SCORES = [
  { label: "Security", value: 96 },
  { label: "Performance", value: 91 },
  { label: "SEO", value: 88 },
  { label: "Accessibility", value: 94 },
];

/** Dark product dashboard shown on the light page — hero + showcase. */
export function ScanDashboard({
  status,
  stage,
  url,
}: {
  status: "idle" | "scanning" | "done";
  stage: number;
  url: string;
}) {
  const settled = status !== "scanning";
  const score = useCountUp(92, settled, 1200);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!settled) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 3), 2600);
    return () => clearInterval(id);
  }, [settled]);

  return (
    <div
      className="bg-ink relative overflow-hidden rounded-2xl border border-white/10 text-white shadow-[0_40px_80px_-32px_oklch(0.19_0.036_259/0.45)]"
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="bg-cyan animate-node size-1.5 shrink-0 rounded-full" />
          <span className="truncate font-mono text-xs text-white/70">
            {url || "example.com"}
          </span>
        </div>
        <span className="label-tech shrink-0 !text-white/35">
          {status === "scanning" ? "Scanning" : "Report"}
        </span>
      </div>

      {status === "scanning" ? (
        <div className="relative px-5 py-8 sm:px-8">
          <ul className="space-y-2.5 font-mono text-[0.78rem]">
            {SCAN_STAGES.map((s, i) => (
              <li
                key={s}
                className={cn(
                  "flex items-center gap-3 transition-opacity duration-300",
                  i > stage ? "opacity-20" : "opacity-100",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    i < stage ? "bg-success" : i === stage ? "bg-cyan animate-node" : "bg-white/25",
                  )}
                />
                <span className={i === stage ? "text-white" : "text-white/55"}>{s}</span>
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="animate-scanline pointer-events-none absolute inset-x-0 top-0 h-16"
            style={{
              background:
                "linear-gradient(to bottom, transparent, oklch(0.715 0.128 215.2 / 0.16), transparent)",
            }}
          />
        </div>
      ) : (
        <div className="relative grid gap-6 px-5 py-7 sm:px-8 sm:py-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
          <div>
            <span className="label-tech !text-white/40">Website Health</span>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-display text-[4rem] leading-none font-semibold tabular-nums">
                {score}
              </span>
              <span className="mb-2 font-mono text-sm text-white/40">/ 100</span>
            </div>
            <span className="bg-success/15 text-success mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[0.65rem] tracking-wider uppercase">
              Healthy
            </span>
          </div>

          <ul className="space-y-3.5">
            {SCORES.map((s, i) => (
              <li key={s.label}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-white/55">{s.label}</span>
                  <span className="font-mono tabular-nums">{s.value}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full transition-[width] duration-1000"
                    style={{
                      width: settled ? `${s.value}%` : "0%",
                      transitionDelay: `${i * 110}ms`,
                      background: "var(--gradient-iq)",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className="flex items-center gap-2.5 border-t border-white/10 pt-5 text-sm text-white/70 md:col-span-2">
            <Sparkles className="text-violet size-4 shrink-0" />
            AI found <strong className="font-medium text-white">4 things</strong> worth fixing
            <span className="ml-auto hidden font-mono text-[0.68rem] text-white/30 sm:block">
              {["1 critical", "2 high", "1 medium"][tick]}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
