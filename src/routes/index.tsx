import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { HeroAudit } from "@/components/site/HeroAudit";
import { MetricStrip } from "@/components/site/MetricStrip";
import { HealthScore } from "@/components/site/HealthScore";
import { SignalNetwork } from "@/components/site/SignalNetwork";
import { WebsiteDNA } from "@/components/site/WebsiteDNA";
import { AIDiagnosis } from "@/components/site/AIDiagnosis";
import { FixPriority } from "@/components/site/FixPriority";
import { ReportPreview } from "@/components/site/ReportPreview";
import { WebsiteDoctor } from "@/components/site/WebsiteDoctor";
import { CompetitorComparison } from "@/components/site/CompetitorComparison";
import { AskSiteIQ } from "@/components/site/AskSiteIQ";
import { MonitoringTimeline } from "@/components/site/MonitoringTimeline";
import { AIAlerts } from "@/components/site/AIAlerts";
import { AgencyTools } from "@/components/site/AgencyTools";
import { UseCases } from "@/components/site/UseCases";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";

const title = "SiteIQ — AI-Powered Website Intelligence";
const description =
  "SiteIQ analyzes your website across security, performance, SEO, accessibility and infrastructure — then tells you exactly what to fix, and why.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <HeroAudit />
        <MetricStrip />
        <HealthScore />
        <SignalNetwork />
        <WebsiteDNA />
        <AIDiagnosis />
        <FixPriority />
        <ReportPreview />
        <WebsiteDoctor />
        <CompetitorComparison />
        <AskSiteIQ />
        <MonitoringTimeline />
        <AIAlerts />
        <AgencyTools />
        <UseCases />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
