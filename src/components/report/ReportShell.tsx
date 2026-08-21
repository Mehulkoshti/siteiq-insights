import { useMemo, useState } from "react";
import { AlertOctagon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { findNavItem, NAV_ITEMS } from "@/lib/report/nav";
import { useAuditReport } from "@/lib/report/source";
import { useTheme } from "@/hooks/use-theme";
import type { ParallelCheck } from "@/lib/report/types";
import { ReportHeader } from "./ReportHeader";
import { ReportSidebar } from "./ReportSidebar";
import { EmptyState, SkeletonCard, btn } from "./primitives";
import { Overview } from "./views/Overview";
import { Findings } from "./views/Findings";
import { Pages } from "./views/Pages";
import { Priorities } from "./views/Priorities";
import { EngineView } from "./views/EngineView";
import { LiveCrawl } from "./views/LiveCrawl";

const PENDING_CHECKS: ParallelCheck[] = [
  { id: "fetch", label: "Fetching homepage", status: "running" },
  { id: "headers", label: "Reading response headers", status: "running" },
  { id: "html", label: "Parsing HTML and metadata", status: "running" },
  { id: "robots", label: "Checking robots.txt", status: "running" },
  { id: "sitemap", label: "Locating sitemap", status: "running" },
  { id: "score", label: "Scoring signals", status: "pending" },
];

export function ReportShell({
  url,
  view,
  onViewChange,
}: {
  url: string;
  view: string;
  onViewChange: (id: string) => void;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { data: report, isPending, error, refetch } = useAuditReport(url);

  const item = findNavItem(view);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    if (!report) return map;
    for (const nav of NAV_ITEMS) {
      if (nav.view.kind === "category") {
        const category = nav.view.category;
        map[nav.id] = report.findings.filter((f) => f.category === category).length;
      } else if (nav.view.kind === "findings") {
        map[nav.id] = report.findings.length;
      } else if (nav.view.kind === "pages") {
        map[nav.id] = report.pages.length;
      }
    }
    return map;
  }, [report]);

  return (
    <div className="bg-background min-h-screen">
      <ReportHeader
        url={url}
        report={report}
        dark={dark}
        onToggleTheme={toggle}
        onOpenNav={() => setNavOpen(true)}
        onExport={() => window.print()}
        onHistory={() => onViewChange("overview")}
      />

      <div className="flex">
        <ReportSidebar
          active={item.id}
          onSelect={onViewChange}
          counts={counts}
          open={navOpen}
          onClose={() => setNavOpen(false)}
        />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1180px]">
            {isPending ? (
              <LiveCrawl url={url} checks={PENDING_CHECKS} />
            ) : error || !report ? (
              <EmptyState
                icon={AlertOctagon}
                title="We couldn't analyze this website"
                description={
                  error instanceof Error
                    ? error.message
                    : "The site did not respond in a way SiteIQ could read. Check the URL and try again."
                }
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    <button type="button" onClick={() => void refetch()} className={btn.primary}>
                      Try again
                    </button>
                    <Link to="/" className={btn.secondary}>
                      Analyze another site
                    </Link>
                  </div>
                }
              />
            ) : (
              renderView()
            )}
          </div>
        </main>
      </div>
    </div>
  );

  function renderView() {
    if (!report) return null;
    const v = item.view;
    switch (v.kind) {
      case "overview":
        return <Overview report={report} onNavigate={onViewChange} />;
      case "priorities":
        return <Priorities report={report} />;
      case "pages":
        return <Pages report={report} />;
      case "findings":
        return (
          <Findings
            report={report}
            title="All findings"
            description="Every issue SiteIQ detected, sorted by severity. Expand a finding for impact, evidence and the fix."
          />
        );
      case "category":
        return (
          <Findings
            report={report}
            category={v.category}
            title={item.label}
            description={`Findings SiteIQ detected in the ${item.label.toLowerCase()} area of your website.`}
          />
        );
      case "engine":
        return <EngineView label={item.label} blurb={v.blurb} />;
    }
  }
}

export { SkeletonCard };
