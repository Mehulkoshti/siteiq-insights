import type { ReactNode } from "react";
import { AlertTriangle, Check, Info, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/report/types";

/* ------------------------------------------------------------------ surfaces */

export function Panel({
  className,
  children,
  as: Tag = "section",
}: {
  className?: string;
  children: ReactNode;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag
      className={cn(
        "bg-card border-border rounded-xl border shadow-[0_1px_2px_oklch(0.19_0.036_259/0.04)] dark:shadow-none",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function PanelHeader({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-border grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-5 py-4">
      <div className="min-w-0">
        <h2 className="font-display truncate text-[1.0625rem] font-semibold tracking-tight">
          {title}
        </h2>
        {sub ? <p className="text-muted-foreground mt-0.5 truncate text-[0.8125rem]">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------- buttons */

const BTN =
  "inline-flex items-center justify-center gap-2 rounded-[9px] text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

export const btn = {
  primary: cn(BTN, "bg-primary text-primary-foreground px-3.5 py-2 hover:bg-primary/90"),
  secondary: cn(BTN, "border border-border bg-card px-3.5 py-2 hover:bg-accent"),
  tertiary: cn(BTN, "text-muted-foreground px-2.5 py-2 hover:text-foreground hover:bg-accent"),
  icon: cn(BTN, "border border-transparent hover:border-border text-muted-foreground hover:text-foreground size-9"),
};

/* -------------------------------------------------------------------- badges */

type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE: Record<StatusTone, string> = {
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warning/12 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/25",
  info: "bg-blue/10 text-blue border-blue/25",
  neutral: "bg-muted text-muted-foreground border-border",
};

const TONE_ICON: Record<StatusTone, typeof Check> = {
  success: Check,
  warning: AlertTriangle,
  danger: X,
  info: Info,
  neutral: Info,
};

export function StatusBadge({
  tone,
  label,
  icon = true,
  className,
}: {
  tone: StatusTone;
  label: string;
  icon?: boolean;
  className?: string;
}) {
  const Icon = TONE_ICON[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[0.75rem] font-medium whitespace-nowrap",
        TONE[tone],
        className,
      )}
    >
      {icon ? <Icon className="size-3 shrink-0" aria-hidden="true" /> : null}
      {label}
    </span>
  );
}

export const SEVERITY_TONE: Record<Severity, StatusTone> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "neutral",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <StatusBadge
      tone={SEVERITY_TONE[severity]}
      label={severity[0]!.toUpperCase() + severity.slice(1)}
      className="uppercase tracking-wide text-[0.6875rem]"
    />
  );
}

export function riskTone(risk: string | null): StatusTone {
  if (risk === "critical" || risk === "high") return "danger";
  if (risk === "medium") return "warning";
  if (risk === "low") return "success";
  return "neutral";
}

export function scoreTone(score: number | null): StatusTone {
  if (score === null) return "neutral";
  if (score >= 80) return "success";
  if (score >= 60) return "info";
  if (score >= 40) return "warning";
  return "danger";
}

export function scoreLabel(score: number | null): string {
  if (score === null) return "Not measured";
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Needs attention";
  return "Critical";
}

/* ---------------------------------------------------------------- score ring */

const RING_COLOR: Record<StatusTone, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  info: "var(--blue)",
  neutral: "var(--muted-foreground)",
};

export function ScoreRing({
  score,
  size = 132,
  stroke = 9,
  label,
}: {
  score: number | null;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = score === null ? 0 : Math.max(0, Math.min(100, score)) / 100;
  const tone = scoreTone(score);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={RING_COLOR[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[2.1rem] leading-none font-semibold tracking-tight">
          {score ?? "—"}
        </span>
        <span className="text-muted-foreground mt-1 font-mono text-[0.6875rem]">
          {label ?? "/ 100"}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- metrics */

export function MetricCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: StatusTone;
}) {
  return (
    <div className="border-border bg-surface rounded-lg border p-3.5">
      <div className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
        {label}
      </div>
      <div
        className={cn(
          "font-display mt-1.5 text-[1.5rem] leading-none font-semibold tracking-tight",
          tone === "danger" && "text-danger",
          tone === "warning" && "text-warning",
          tone === "success" && "text-success",
        )}
      >
        {value}
      </div>
      {hint ? <div className="text-muted-foreground mt-1 text-[0.75rem]">{hint}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ feedback */

export function SkeletonCard({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <Panel className={cn("p-5", className)}>
      <div className="bg-muted h-4 w-40 animate-pulse rounded" />
      <div className="mt-4 space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="bg-muted h-3 animate-pulse rounded"
            style={{ width: `${88 - i * 13}%` }}
          />
        ))}
      </div>
    </Panel>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Check;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Panel className="flex flex-col items-center px-6 py-14 text-center">
      <div className="border-border bg-surface text-muted-foreground grid size-11 place-items-center rounded-xl border">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className="font-display mt-4 text-[1.0625rem] font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md text-[0.875rem] leading-relaxed">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Panel>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-4 animate-spin", className)} aria-hidden="true" />;
}
