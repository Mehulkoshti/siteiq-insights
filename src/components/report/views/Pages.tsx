import type { AuditReport } from "@/lib/report/types";
import { Panel, PanelHeader } from "../primitives";
import { PagesTable } from "./Overview";

export function Pages({ report }: { report: AuditReport }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[1.65rem] font-semibold tracking-tight md:text-[2rem]">
          Pages
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[0.9375rem] leading-relaxed">
          Every URL SiteIQ requested during this analysis, with its status, response time and issue
          count.
        </p>
      </div>

      <Panel>
        <PanelHeader
          title="Crawled pages"
          sub={`${report.pages.length} page${report.pages.length === 1 ? "" : "s"} recorded`}
        />
        <PagesTable pages={report.pages} />
      </Panel>
    </div>
  );
}
