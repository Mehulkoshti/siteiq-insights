/**
 * SiteIQ report data contract.
 *
 * This is the ONLY shape the report UI knows about. The current data source is a
 * minimal real analysis (see `analyze.functions.ts`) used so the workspace is
 * functional and testable. To plug in the real SiteIQ audit engine later, replace
 * the source in `src/lib/report/source.ts` with an adapter that maps the existing
 * API responses onto these types — no UI changes required.
 */

export type Severity = "critical" | "high" | "medium" | "low";

export type CheckStatus = "pending" | "running" | "done" | "failed" | "skipped";

export type CategoryId =
  | "seo"
  | "security"
  | "performance"
  | "accessibility"
  | "infrastructure"
  | "privacy";

export interface Finding {
  id: string;
  severity: Severity;
  category: CategoryId;
  title: string;
  description: string;
  /** Why it matters, in plain language. */
  impact: string;
  difficulty: "easy" | "moderate" | "hard";
  howToFix: string;
  affectedPages: string[];
  evidence?: string | undefined;
}

export interface CategoryScore {
  id: CategoryId;
  label: string;
  /** null when the source could not measure this category. */
  score: number | null;
  issues: number;
}

export interface CrawlPage {
  url: string;
  path: string;
  status: number | null;
  responseMs: number | null;
  issues: number;
}

export interface ParallelCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail?: string | undefined;
}

export interface CrawlStats {
  discovered: number;
  crawled: number;
  broken: number;
  redirects: number;
  orphans: number | null;
  avgResponseMs: number | null;
}

export interface AuditReport {
  url: string;
  host: string;
  scannedAt: string;
  score: number | null;
  grade: string | null;
  risk: "low" | "medium" | "high" | "critical" | null;
  categories: CategoryScore[];
  findings: Finding[];
  crawl: CrawlStats;
  pages: CrawlPage[];
  checks: ParallelCheck[];
  /** True when the source only covered part of the site (e.g. preview analysis). */
  partial: boolean;
  /** Human-readable note about coverage limits. */
  coverageNote?: string | undefined;
}

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  seo: "SEO",
  security: "Security",
  performance: "Performance",
  accessibility: "Accessibility",
  infrastructure: "Infrastructure",
  privacy: "Privacy",
};

export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];
