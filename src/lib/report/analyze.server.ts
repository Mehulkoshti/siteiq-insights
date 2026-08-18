/**
 * Minimal REAL analysis used as the development data source for the report UI.
 *
 * It performs a small number of genuine HTTP requests against the target site and
 * derives findings only from what it actually observed. It deliberately does NOT
 * crawl, does not simulate progress, and never invents scores for signals it could
 * not measure (those come back as `null`).
 */
import type {
  AuditReport,
  CategoryId,
  CategoryScore,
  CrawlPage,
  Finding,
  ParallelCheck,
  Severity,
} from "./types";
import { CATEGORY_LABELS } from "./types";

interface Fetched {
  url: string;
  status: number | null;
  responseMs: number | null;
  headers: Record<string, string>;
  body: string;
  redirected: boolean;
  error?: string;
}

const UA = "SiteIQ-Preview-Analyzer/1.0 (+https://siteiq.app)";

async function grab(url: string, withBody: boolean): Promise<Fetched> {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": UA, accept: "*/*" },
      signal: AbortSignal.timeout(12_000),
    });
    const body = withBody ? (await res.text()).slice(0, 400_000) : "";
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));
    return {
      url,
      status: res.status,
      responseMs: Date.now() - started,
      headers,
      body,
      redirected: res.redirected,
    };
  } catch (e) {
    return {
      url,
      status: null,
      responseMs: null,
      headers: {},
      body: "",
      redirected: false,
      error: e instanceof Error ? e.message : "Request failed",
    };
  }
}

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 26,
  high: 15,
  medium: 7,
  low: 3,
};

function scoreFor(findings: Finding[], category: CategoryId, measured: boolean): number | null {
  if (!measured) return null;
  const penalty = findings
    .filter((f) => f.category === category)
    .reduce((sum, f) => sum + SEVERITY_WEIGHT[f.severity], 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

function gradeFor(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function riskFor(findings: Finding[]): AuditReport["risk"] {
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  if (critical > 0) return "critical";
  if (high >= 3) return "high";
  if (high > 0) return "medium";
  return "low";
}

function textBetween(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m?.[1]?.trim() ?? null;
}

function metaContent(html: string, name: string, attr: "name" | "property" = "name"): string | null {
  const re = new RegExp(
    `<meta[^>]+${attr}=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${name}["']`,
    "i",
  );
  return textBetween(html, re) ?? textBetween(html, alt);
}

export async function analyzeSite(rawUrl: string): Promise<AuditReport> {
  const target = new URL(rawUrl);
  const origin = target.origin;

  const [main, robots, sitemap] = await Promise.all([
    grab(target.toString(), true),
    grab(`${origin}/robots.txt`, false),
    grab(`${origin}/sitemap.xml`, false),
  ]);

  const findings: Finding[] = [];
  const add = (f: Omit<Finding, "affectedPages"> & { affectedPages?: string[] }) =>
    findings.push({ affectedPages: [target.pathname || "/"], ...f });

  const h = main.headers;
  const html = main.body;
  const reachable = main.status !== null;

  if (!reachable) {
    add({
      id: "net-unreachable",
      severity: "critical",
      category: "infrastructure",
      title: "The site did not respond",
      description: main.error ?? "SiteIQ could not complete a request to this URL.",
      impact: "If SiteIQ cannot reach the site, visitors and search engines may not either.",
      difficulty: "hard",
      howToFix: "Check DNS, hosting status and firewall rules, then re-run the analysis.",
    });
  }

  // ---- Security -------------------------------------------------------------
  const isHttps = target.protocol === "https:";
  if (!isHttps) {
    add({
      id: "sec-no-https",
      severity: "critical",
      category: "security",
      title: "Site is served over plain HTTP",
      description: "The analyzed URL does not use TLS.",
      impact: "Traffic can be read or modified in transit, and browsers flag the site as not secure.",
      difficulty: "moderate",
      howToFix: "Install a TLS certificate and redirect all HTTP traffic to HTTPS.",
    });
  }
  if (reachable) {
    const headerChecks: Array<[string, string, Severity, string]> = [
      ["content-security-policy", "No Content-Security-Policy header", "high", "A CSP is the main defence against cross-site scripting."],
      ["strict-transport-security", "No HSTS header", "high", "Without HSTS, browsers can be downgraded to HTTP on the first visit."],
      ["x-content-type-options", "No X-Content-Type-Options header", "medium", "Browsers may MIME-sniff responses into executable types."],
      ["x-frame-options", "No clickjacking protection", "medium", "The page can be framed by another site to trick your users."],
      ["referrer-policy", "No Referrer-Policy header", "low", "Full URLs may leak to third-party sites."],
    ];
    for (const [key, title, severity, impact] of headerChecks) {
      if (!h[key] && !(key === "x-frame-options" && /frame-ancestors/i.test(h["content-security-policy"] ?? ""))) {
        add({
          id: `sec-${key}`,
          severity,
          category: "security",
          title,
          description: `The response from ${target.host} did not include a \`${key}\` header.`,
          impact,
          difficulty: "easy",
          howToFix: `Add the \`${key}\` response header at your web server, CDN or framework middleware.`,
          evidence: `Response headers observed: ${Object.keys(h).length}`,
        });
      }
    }
    if (h["x-powered-by"] || /^(Apache|nginx)\/[\d.]/i.test(h["server"] ?? "")) {
      add({
        id: "sec-version-disclosure",
        severity: "low",
        category: "security",
        title: "Server software version disclosed",
        description: `Headers expose ${h["x-powered-by"] ?? h["server"]}.`,
        impact: "Version banners make it easier to target known vulnerabilities.",
        difficulty: "easy",
        howToFix: "Suppress or genericise the `Server` and `X-Powered-By` headers.",
      });
    }
  }

  // ---- SEO ------------------------------------------------------------------
  const title = textBetween(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = metaContent(html, "description");
  const canonical = textBetween(html, /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const ogTitle = metaContent(html, "og:title", "property");
  const h1s = html.match(/<h1[\s>]/gi)?.length ?? 0;

  if (html) {
    if (!title) {
      add({ id: "seo-title", severity: "high", category: "seo", title: "Page has no <title>", description: "No title element was found in the HTML.", impact: "Search results and browser tabs have nothing meaningful to show.", difficulty: "easy", howToFix: "Add a unique 50–60 character title to the page head." });
    } else if (title.length > 65) {
      add({ id: "seo-title-long", severity: "low", category: "seo", title: "Title tag is longer than 65 characters", description: `Observed title is ${title.length} characters.`, impact: "Search engines truncate long titles in results.", difficulty: "easy", howToFix: "Shorten the title to roughly 50–60 characters.", evidence: title });
    }
    if (!description) {
      add({ id: "seo-desc", severity: "medium", category: "seo", title: "Missing meta description", description: "No meta description was found.", impact: "Search engines generate their own snippet, which is usually less compelling.", difficulty: "easy", howToFix: "Add a 120–155 character meta description summarising the page." });
    }
    if (!canonical) {
      add({ id: "seo-canonical", severity: "medium", category: "seo", title: "No canonical URL declared", description: "The page does not declare a canonical link.", impact: "Duplicate URLs can split ranking signals across variants.", difficulty: "easy", howToFix: "Add `<link rel=\"canonical\" href=\"…\">` pointing at the preferred URL." });
    }
    if (h1s === 0) {
      add({ id: "seo-h1", severity: "medium", category: "seo", title: "Page has no H1 heading", description: "No <h1> element was found.", impact: "The page's main topic is unclear to search engines and screen readers.", difficulty: "easy", howToFix: "Add a single descriptive H1 to the page." });
    } else if (h1s > 1) {
      add({ id: "seo-h1-multi", severity: "low", category: "seo", title: `Page uses ${h1s} H1 headings`, description: "More than one H1 was found on the page.", impact: "Multiple top-level headings weaken the page's topical signal.", difficulty: "easy", howToFix: "Keep one H1 and demote the rest to H2/H3." });
    }
    if (!ogTitle) {
      add({ id: "seo-og", severity: "low", category: "seo", title: "No Open Graph metadata", description: "og:title was not found.", impact: "Links shared on social platforms render without a proper preview.", difficulty: "easy", howToFix: "Add og:title, og:description and og:image meta tags." });
    }
  }
  if (robots.status !== 200) {
    add({ id: "seo-robots", severity: "low", category: "seo", title: "No robots.txt found", description: `${origin}/robots.txt returned ${robots.status ?? "no response"}.`, impact: "Crawlers get no guidance about which paths to index.", difficulty: "easy", howToFix: "Publish a robots.txt that references your sitemap.", affectedPages: ["/robots.txt"] });
  }
  if (sitemap.status !== 200) {
    add({ id: "seo-sitemap", severity: "medium", category: "seo", title: "No sitemap.xml found", description: `${origin}/sitemap.xml returned ${sitemap.status ?? "no response"}.`, impact: "Search engines discover pages more slowly without a sitemap.", difficulty: "moderate", howToFix: "Generate a sitemap.xml and reference it from robots.txt.", affectedPages: ["/sitemap.xml"] });
  }

  // ---- Performance ----------------------------------------------------------
  const ms = main.responseMs;
  if (ms !== null) {
    if (ms > 1500) {
      add({ id: "perf-ttfb", severity: "high", category: "performance", title: "Slow server response", description: `The document took ${ms}ms to return.`, impact: "Slow first bytes delay everything else on the page and hurt Core Web Vitals.", difficulty: "moderate", howToFix: "Add server-side caching or a CDN in front of the origin." });
    } else if (ms > 700) {
      add({ id: "perf-ttfb-mod", severity: "medium", category: "performance", title: "Server response could be faster", description: `The document took ${ms}ms to return.`, impact: "Above ~600ms, response time becomes a noticeable part of load time.", difficulty: "moderate", howToFix: "Cache the HTML response or move the origin closer to users." });
    }
  }
  if (reachable && !h["cache-control"]) {
    add({ id: "perf-cache", severity: "low", category: "performance", title: "No Cache-Control header on the document", description: "The HTML response did not declare caching rules.", impact: "Browsers and CDNs cannot make good caching decisions.", difficulty: "easy", howToFix: "Set an explicit Cache-Control policy for HTML responses." });
  }
  if (html.length > 250_000) {
    add({ id: "perf-html-size", severity: "medium", category: "performance", title: "Very large HTML document", description: `The document is roughly ${Math.round(html.length / 1024)}KB.`, impact: "Large HTML delays parsing and first render, especially on mobile.", difficulty: "moderate", howToFix: "Move inlined data and markup out of the initial document." });
  }

  // ---- Accessibility --------------------------------------------------------
  if (html) {
    const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
    const missingAlt = imgs.filter((t) => !/\salt=/i.test(t)).length;
    if (missingAlt > 0) {
      add({ id: "a11y-alt", severity: missingAlt > 5 ? "high" : "medium", category: "accessibility", title: `${missingAlt} image${missingAlt === 1 ? "" : "s"} missing alt text`, description: `${missingAlt} of ${imgs.length} <img> elements have no alt attribute.`, impact: "Screen reader users get no description of these images.", difficulty: "easy", howToFix: "Add descriptive alt text, or alt=\"\" for purely decorative images." });
    }
    if (!/<html[^>]+lang=/i.test(html)) {
      add({ id: "a11y-lang", severity: "medium", category: "accessibility", title: "No language declared on <html>", description: "The root element has no lang attribute.", impact: "Screen readers cannot choose the right pronunciation rules.", difficulty: "easy", howToFix: "Add lang=\"en\" (or the correct language) to the <html> element." });
    }
    if (!/<meta[^>]+name=["']viewport["']/i.test(html)) {
      add({ id: "a11y-viewport", severity: "high", category: "accessibility", title: "No responsive viewport meta tag", description: "The page does not declare a viewport.", impact: "Mobile browsers zoom out the whole layout, making text unreadable.", difficulty: "easy", howToFix: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">." });
    }
  }

  // ---- Privacy --------------------------------------------------------------
  const setCookie = h["set-cookie"];
  if (setCookie) {
    if (!/secure/i.test(setCookie)) {
      add({ id: "priv-cookie-secure", severity: "high", category: "privacy", title: "Cookie set without the Secure flag", description: "A Set-Cookie header was returned without `Secure`.", impact: "The cookie can be sent over an unencrypted connection.", difficulty: "easy", howToFix: "Add the Secure attribute to all cookies." });
    }
    if (!/httponly/i.test(setCookie)) {
      add({ id: "priv-cookie-httponly", severity: "medium", category: "privacy", title: "Cookie readable by JavaScript", description: "A Set-Cookie header was returned without `HttpOnly`.", impact: "Any injected script can read the cookie value.", difficulty: "easy", howToFix: "Add HttpOnly to cookies that client scripts do not need." });
    }
    if (!/samesite/i.test(setCookie)) {
      add({ id: "priv-cookie-samesite", severity: "low", category: "privacy", title: "Cookie has no SameSite attribute", description: "A Set-Cookie header was returned without `SameSite`.", impact: "The cookie may be sent on cross-site requests.", difficulty: "easy", howToFix: "Set SameSite=Lax or Strict." });
    }
  }
  if (html && !/privacy/i.test(html)) {
    add({ id: "priv-policy-link", severity: "low", category: "privacy", title: "No privacy policy link found on the page", description: "The analyzed document contains no reference to a privacy policy.", impact: "Most privacy regimes expect a reachable policy from every page.", difficulty: "easy", howToFix: "Link your privacy policy from the site footer." });
  }

  // ---- Infrastructure -------------------------------------------------------
  if (reachable && main.status !== null && main.status >= 400) {
    add({ id: "infra-status", severity: "critical", category: "infrastructure", title: `Homepage returned HTTP ${main.status}`, description: "The analyzed URL did not return a successful response.", impact: "Visitors and crawlers reaching this URL see an error.", difficulty: "hard", howToFix: "Investigate the server logs for this route." });
  }
  if (isHttps && reachable) {
    const httpProbe = await grab(`http://${target.host}/`, false);
    if (httpProbe.status !== null && !httpProbe.redirected && httpProbe.status < 300) {
      add({ id: "infra-no-redirect", severity: "high", category: "infrastructure", title: "HTTP does not redirect to HTTPS", description: "The plain-HTTP version of the site served content directly.", impact: "Users landing on http:// stay on an unencrypted connection.", difficulty: "easy", howToFix: "Add a permanent 301 redirect from HTTP to HTTPS." });
    }
  }

  // ---- Aggregate ------------------------------------------------------------
  const measured: Record<CategoryId, boolean> = {
    security: reachable,
    seo: Boolean(html),
    performance: reachable,
    accessibility: Boolean(html),
    infrastructure: true,
    privacy: reachable,
  };

  const categories: CategoryScore[] = (
    Object.keys(CATEGORY_LABELS) as CategoryId[]
  ).map((id) => ({
    id,
    label: CATEGORY_LABELS[id],
    score: scoreFor(findings, id, measured[id]),
    issues: findings.filter((f) => f.category === id).length,
  }));

  const scored = categories.filter((c) => c.score !== null);
  const score = scored.length
    ? Math.round(scored.reduce((s, c) => s + (c.score ?? 0), 0) / scored.length)
    : null;

  const probes = [main, robots, sitemap];
  const pages: CrawlPage[] = probes.map((p) => {
    const u = new URL(p.url);
    return {
      url: p.url,
      path: u.pathname === "" ? "/" : u.pathname,
      status: p.status,
      responseMs: p.responseMs,
      issues: findings.filter((f) => f.affectedPages.includes(u.pathname || "/")).length,
    };
  });

  const timed = pages.filter((p) => p.responseMs !== null);
  const checks: ParallelCheck[] = [
    { id: "headers", label: "Security Headers", status: reachable ? "done" : "failed", detail: reachable ? `${Object.keys(h).length} headers read` : main.error },
    { id: "tls", label: "SSL / TLS", status: reachable ? "done" : "failed", detail: isHttps ? "HTTPS in use" : "No TLS" },
    { id: "seo", label: "SEO & Metadata", status: html ? "done" : "skipped", detail: html ? "Document parsed" : "No HTML returned" },
    { id: "a11y", label: "Accessibility", status: html ? "done" : "skipped" },
    { id: "robots", label: "Robots & Sitemap", status: robots.status !== null || sitemap.status !== null ? "done" : "failed" },
    { id: "response", label: "Response Timing", status: ms !== null ? "done" : "failed", detail: ms !== null ? `${ms}ms` : undefined },
  ];

  return {
    url: target.toString(),
    host: target.host,
    scannedAt: new Date().toISOString(),
    score,
    grade: score !== null ? gradeFor(score) : null,
    risk: riskFor(findings),
    categories,
    findings,
    crawl: {
      discovered: pages.length,
      crawled: pages.filter((p) => p.status !== null).length,
      broken: pages.filter((p) => p.status !== null && p.status >= 400).length,
      redirects: probes.filter((p) => p.redirected).length,
      orphans: null,
      avgResponseMs: timed.length
        ? Math.round(timed.reduce((s, p) => s + (p.responseMs ?? 0), 0) / timed.length)
        : null,
    },
    pages,
    checks,
    partial: true,
    coverageNote:
      "Preview analysis: SiteIQ checked the entry URL, robots.txt and sitemap.xml only. Full-site crawling, CVE scanning, PageSpeed, DNS and carbon data come from the SiteIQ audit engine.",
  };
}
