/**
 * Data source boundary for the report workspace.
 *
 * Every screen reads its data through `useAuditReport`. Swapping in the real
 * SiteIQ audit engine means replacing the query function below with a call to the
 * existing report API (or an SSE-backed store) that returns an `AuditReport`.
 * No component needs to change.
 */
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { runAnalysis } from "./analyze.functions";
import type { AuditReport } from "./types";

export function useAuditReport(url: string) {
  const analyze = useServerFn(runAnalysis);

  return useQuery<AuditReport>({
    queryKey: ["siteiq-report", url],
    enabled: Boolean(url),
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: () => analyze({ data: { url } }),
  });
}
