import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { HeroAudit } from "@/components/site/HeroAudit";
import { Problem } from "@/components/site/Problem";
import { Capabilities } from "@/components/site/Capabilities";
import { ProductShowcase } from "@/components/site/ProductShowcase";
import { FixPriority } from "@/components/site/FixPriority";
import { CompetitorComparison } from "@/components/site/CompetitorComparison";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";

const title = "SiteIQ — Know What's Holding Your Website Back";
const description =
  "SiteIQ scans your website for SEO, security, performance and technical issues — then tells you what actually needs fixing, and what to fix first.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <HeroAudit />
        <Problem />
        <Capabilities />
        <ProductShowcase />
        <FixPriority />
        <CompetitorComparison />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
