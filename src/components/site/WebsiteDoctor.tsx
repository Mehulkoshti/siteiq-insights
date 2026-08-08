import { ArrowRight, Activity } from "lucide-react";
import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { Section, SectionHeader, Reveal } from "./Section";

const VITALS = [
  { label: "Healthy", value: 48, color: "var(--success)" },
  { label: "Warnings", value: 11, color: "var(--warning)" },
  { label: "Critical", value: 6, color: "var(--danger)" },
];

export function WebsiteDoctor() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.25);
  const score = useCountUp(73, visible);
  const total = VITALS.reduce((a, v) => a + v.value, 0);

  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="AI Website Doctor"
        title={
          <>
            Your Website Has Symptoms.
            <br />
            SiteIQ Finds the Cause.
          </>
        }
        sub="A diagnostic read of every vital sign — with a treatment plan you can actually execute."
      />

      <div ref={ref} className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Reveal className="panel p-6 md:p-8">
          <span className="label-tech">Website Health</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-7xl leading-none font-semibold tabular-nums">{score}</span>
            <span className="text-muted-foreground text-xl">/ 100</span>
          </div>

          <div className="bg-border mt-7 flex h-2 overflow-hidden rounded-full">
            {VITALS.map((v, i) => (
              <span
                key={v.label}
                className="block h-full transition-[width] duration-1000"
                style={{
                  width: visible ? `${(v.value / total) * 100}%` : 0,
                  background: v.color,
                  transitionDelay: `${i * 120}ms`,
                }}
              />
            ))}
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {VITALS.map((v) => (
              <li key={v.label} className="flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full" style={{ background: v.color }} />
                <span className="font-display font-semibold tabular-nums">{v.value}</span>
                <span className="text-muted-foreground">{v.label}</span>
              </li>
            ))}
          </ul>

          <div className="border-border mt-8 border-t pt-6">
            <span className="label-tech flex items-center gap-2">
              <Activity className="text-cyan size-3.5" /> Vitals trend
            </span>
            <svg viewBox="0 0 300 60" className="mt-4 w-full" aria-hidden="true">
              <polyline
                points="0,42 40,38 80,44 120,30 160,34 200,22 240,26 300,14"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polyline
                points="0,42 40,38 80,44 120,30 160,34 200,22 240,26 300,14 300,60 0,60"
                fill="var(--cyan)"
                opacity="0.08"
                stroke="none"
              />
            </svg>
          </div>
        </Reveal>

        <Reveal delay={120} className="panel flex flex-col justify-between p-6 md:p-8">
          <div>
            <span className="label-tech">Diagnosis</span>
            <p className="mt-4 text-xl leading-relaxed md:text-2xl">
              Your website is fast, but you're{" "}
              <span className="text-gradient-iq font-semibold">leaking SEO potential</span>.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Core Web Vitals pass on every template, yet a third of your indexable pages inherit a
              shared description and sit five clicks deep. Crawlers see a fast site with a shallow
              signal — search engines discount what they can't reach or distinguish.
            </p>

            <ul className="mt-7 space-y-2.5">
              {[
                "Flatten /services and /resources to two clicks",
                "Generate unique descriptions for 27 templated pages",
                "Restore CSP to close the one critical exposure",
              ].map((t, i) => (
                <li key={t} className="text-muted-foreground flex gap-3 text-sm">
                  <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="arrow-cta bg-foreground text-background hover:shadow-lift mt-8 inline-flex items-center justify-center gap-2 self-start rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-px"
          >
            Treatment Plan <ArrowRight className="size-4" />
          </button>
        </Reveal>
      </div>
    </Section>
  );
}
