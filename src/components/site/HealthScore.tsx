import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { Reveal, Section, SectionHeader } from "./Section";

const LAYERS = [
  { label: "Security", value: 96 },
  { label: "Performance", value: 91 },
  { label: "SEO", value: 88 },
  { label: "Accessibility", value: 94 },
  { label: "Infrastructure", value: 97 },
  { label: "Email Security", value: 82 },
  { label: "SSL/TLS", value: 99 },
  { label: "Technology", value: 93 },
];

export function HealthScore() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.3);
  const score = useCountUp(92, visible, 1400);
  const R = 132;
  const C = 2 * Math.PI * R;

  return (
    <Section id="product" tone="surface">
      <SectionHeader
        eyebrow="Website Health"
        title={
          <>
            Know Your Website.
            <br />
            Not Just Your Score.
          </>
        }
        sub="SiteIQ turns hundreds of technical signals into one clear picture of your website's health."
      />

      <div ref={ref} className="mt-16 grid items-center gap-12 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Reveal className="relative mx-auto w-full max-w-[420px]">
          <svg viewBox="0 0 320 320" className="w-full" role="img" aria-label="Website health score: 92 out of 100">
            <defs>
              <linearGradient id="hs-arc" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#06B6D4" />
                <stop offset="0.5" stopColor="#2563EB" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <circle cx="160" cy="160" r={R} fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="160"
              cy="160"
              r={R}
              fill="none"
              stroke="url(#hs-arc)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={visible ? C * (1 - 0.92) : C}
              transform="rotate(-90 160 160)"
              style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)" }}
            />
            <circle cx="160" cy="160" r="104" fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.7" />
            {Array.from({ length: 72 }).map((_, i) => {
              const a = (i / 72) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={(160 + Math.cos(a) * 112).toFixed(2)}
                  y1={(160 + Math.sin(a) * 112).toFixed(2)}
                  x2={(160 + Math.cos(a) * (i % 6 === 0 ? 120 : 116)).toFixed(2)}
                  y2={(160 + Math.sin(a) * (i % 6 === 0 ? 120 : 116)).toFixed(2)}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[4.5rem] leading-none font-semibold tabular-nums">
              {score}
            </span>
            <span className="label-tech mt-3">Website Health</span>
          </div>
        </Reveal>

        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-1">
          {LAYERS.map((l, i) => (
            <Reveal as="li" key={l.label} delay={i * 60} className="border-border border-b pb-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium">{l.label}</span>
                <span className="font-mono text-sm tabular-nums">{l.value}</span>
              </div>
              <div className="bg-border/70 mt-2 h-px w-full overflow-hidden">
                <span
                  className="bg-foreground/70 block h-px transition-[width] duration-1000"
                  style={{ width: visible ? `${l.value}%` : 0, transitionDelay: `${i * 60}ms` }}
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
