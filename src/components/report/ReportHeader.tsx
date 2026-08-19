import { Link } from "@tanstack/react-router";
import { Download, History, Menu, MoonStar, Plus, Sun } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { btn, riskTone, StatusBadge } from "./primitives";
import type { AuditReport } from "@/lib/report/types";

export function ReportHeader({
  url,
  report,
  dark,
  onToggleTheme,
  onOpenNav,
  onExport,
  onHistory,
}: {
  url: string;
  report: AuditReport | undefined;
  dark: boolean;
  onToggleTheme: () => void;
  onOpenNav: () => void;
  onExport: () => void;
  onHistory: () => void;
}) {
  const risk = report?.risk ?? null;

  return (
    <header className="bg-background/85 border-border sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 md:px-6 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenNav}
            className={`${btn.icon} lg:hidden`}
            aria-label="Open report navigation"
          >
            <Menu className="size-[18px]" />
          </button>
          <Link to="/" className="shrink-0" aria-label="SiteIQ home">
            <Logo mark={22} />
          </Link>
        </div>

        <div className="hidden min-w-0 items-center gap-2.5 lg:flex">
          <span className="text-border" aria-hidden="true">
            /
          </span>
          <span className="text-foreground shrink-0 text-[0.8125rem] font-medium">
            Full Site Audit
          </span>
          <span className="text-border" aria-hidden="true">
            /
          </span>
          <span className="text-muted-foreground truncate font-mono text-[0.8125rem]">{url}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {risk ? (
            <StatusBadge
              tone={riskTone(risk)}
              label={`${risk[0]!.toUpperCase()}${risk.slice(1)} risk`}
              className="hidden sm:inline-flex"
            />
          ) : null}
          <button type="button" onClick={onHistory} className={`${btn.tertiary} hidden md:inline-flex`}>
            <History className="size-4" /> History
          </button>
          <button type="button" onClick={onExport} className={`${btn.secondary} hidden sm:inline-flex`}>
            <Download className="size-4" /> Export PDF
          </button>
          <Link to="/" className={btn.primary}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Audit</span>
          </Link>
          <button
            type="button"
            onClick={onToggleTheme}
            className={btn.icon}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {dark ? <Sun className="size-4" /> : <MoonStar className="size-4" />}
          </button>
        </div>
      </div>

      <div className="border-border text-muted-foreground truncate border-t px-4 py-1.5 font-mono text-[0.75rem] lg:hidden">
        {url}
      </div>
    </header>
  );
}
