import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { ReportShell } from "@/components/report/ReportShell";

const searchSchema = z.object({
  url: z.string().url().catch(""),
  view: z.string().catch("overview"),
});

const title = "SiteIQ — Website Analysis";
const description =
  "Run a SiteIQ analysis across SEO, security, performance and technical health for your website.";

export const Route = createFileRoute("/report")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { url, view } = Route.useSearch();
  const navigate = useNavigate({ from: "/report" });

  if (!url) {
    return (
      <main className="container-iq flex min-h-screen flex-col justify-center py-24">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-display text-[1.75rem] font-semibold tracking-tight">
            No website to analyze
          </h1>
          <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-relaxed">
            Enter a website URL on the home page to start an analysis.
          </p>
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="size-4" /> Back to SiteIQ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <ReportShell
      url={url}
      view={view}
      onViewChange={(id) =>
        void navigate({ search: (prev) => ({ ...prev, view: id }), replace: true })
      }
    />
  );
}
