import { Reveal, Section, SectionHeader } from "./Section";
import { useReveal } from "@/hooks/use-reveal";

const NODES = [
  { label: "SEO", x: 50, y: 8 },
  { label: "Security", x: 92, y: 34 },
  { label: "Performance", x: 78, y: 84 },
  { label: "Accessibility", x: 22, y: 84 },
  { label: "Infrastructure", x: 8, y: 34 },
];

export function Problem() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.25);

  return (
    <Section tone="surface">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <SectionHeader
          eyebrow="The Problem"
          className="max-w-xl"
          title={
            <>
              Your Website Has More
              <br />
              Problems Than You Can See.
            </>
          }
          sub="Slow pages. Broken links. Weak SEO. Security gaps. Missing metadata. Technical issues buried across your website."
        />

        <div ref={ref} className="relative mx-auto w-full max-w-[460px]">
          <Reveal className="relative aspect-square">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
              {NODES.map((n, i) => (
                <line
                  key={n.label}
                  x1={n.x}
                  y1={n.y}
                  x2="50"
                  y2="50"
                  stroke="var(--border)"
                  strokeWidth="0.4"
                  strokeDasharray="1.6 2"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: `opacity .7s ${i * 120}ms`,
                  }}
                />
              ))}
              <circle
                cx="50"
                cy="50"
                r="26"
                fill="none"
                stroke="var(--border)"
                strokeWidth="0.4"
              />
            </svg>

            {NODES.map((n, i) => (
              <span
                key={n.label}
                className="border-border bg-background text-foreground absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 font-mono text-[0.65rem] tracking-wider uppercase transition-all duration-700"
                style={{
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  opacity: visible ? 1 : 0,
                  transform: `translate(-50%,-50%) scale(${visible ? 1 : 0.85})`,
                  transitionDelay: `${i * 110}ms`,
                }}
              >
                {n.label}
              </span>
            ))}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-ink flex size-32 flex-col items-center justify-center rounded-full text-white shadow-[0_24px_48px_-20px_oklch(0.19_0.036_259/0.5)] sm:size-36">
                <span className="font-mono text-[0.6rem] tracking-[0.18em] text-white/45 uppercase">
                  SiteIQ
                </span>
                <span className="font-display mt-1 text-4xl font-semibold tabular-nums">92</span>
                <span className="font-mono text-[0.58rem] tracking-[0.14em] text-white/40 uppercase">
                  Health
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-muted-foreground mt-8 text-center text-sm">
              <strong className="text-foreground font-medium">
                SiteIQ puts everything in one clear picture.
              </strong>
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
