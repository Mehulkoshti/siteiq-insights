import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const searchSchema = z.object({ url: z.string().url().catch("") });

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
  const { url } = Route.useSearch();

  return (
    <>
      <Navbar />
      <main className="container-iq pt-32 pb-24">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">Website analysis</h1>
        <p className="text-muted-foreground mt-3 font-mono text-sm break-all">
          {url || "No website URL provided."}
        </p>

        {url ? (
          <div className="panel mt-8 flex items-center gap-3 p-6">
            <Loader2 className="text-blue size-4 animate-spin" aria-hidden="true" />
            <p className="text-sm" aria-live="polite">
              Starting analysis — SiteIQ is crawling this site and collecting signals. Results will
              appear here as soon as the scan completes.
            </p>
          </div>
        ) : (
          <div className="panel mt-8 p-6 text-sm">
            Enter a website URL on the{" "}
            <Link to="/" className="text-blue underline underline-offset-4">
              home page
            </Link>{" "}
            to start an analysis.
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
