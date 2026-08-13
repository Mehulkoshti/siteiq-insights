import { Sparkles } from "lucide-react";
import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { Reveal, Section, SectionHeader } from "./Section";

const LAYERS = [
  { label: "Security", value: 96 },
  { label: "Performance", value: 91 },
  { label: "SEO", value: 88 },
  { label: "Accessibility", value: 94 },
  { label: "Infrastructure", value: 97 },
];

const SERIES = [62, 70, 68, 78, 84, 81, 88, 92];

const CHIPS = [
  { label: "Critical", value: 1, color: "var(--danger)" },
  { label: "High", value: 2, color: "var(--warning)" },
  { label: "Medium", value: 1, color: "var(--blue)" },
];

export function ProductShowcase() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  const score = useCountUp(92, visible, 1400);
  const max = Math.max(...SERIES);
  const path = SERIES.map(
    (v, i) => `${i === 0 ? "M" : "L"} ${(i / (SERIES.length - 1)) * 100} ${40 - (v / max) * 34}`,
  ).join(" ");

  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="The Product"
        title={
          <>
            Meet SiteIQ.
            <br />
            Your Website's Intelligence Layer.
          </>
        }
        sub="Turn hundreds of technical signals into one clear understanding of your website."
      />

      <div ref={ref} className="mt-14 lg:mt-20">
        <Reveal className="bg-ink relative overflow-hidden rounded-2xl border border-white/10 text-white shadow-[0_60px_120px_-48px_oklch(0.19_0.036_259/0.5)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(1 0 0 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.4) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-3.5 md:px-8">
            <span className="bg-cyan animate-node size-1.5 rounded-full" />
            <span className="font-mono text-xs text-white/70">example.com</span>
            <span className="ml-auto font-mono text-[0.65rem] tracking-[0.14em] text-white/30 uppercase">
              Last scan · 2m ago
            </span>
          </div>

          <div className="relative grid gap-8 p-5 md:grid-cols-[300px_minmax(0,1fr)] md:p-8 lg:gap-12 lg:p-10">
            <div>
              <span className="label-tech !text-white/40">Website Health</span>
              <div className="mt-2 flex items-end gap-2">
                <span className="font-display text-[5rem] leading-none font-semibold tabular-nums">
                  {score}
                </span>
                <span className="mb-3 font-mono text-sm text-white/40">/ 100</span>
              </div>

              <svg viewBox="0 0 100 44" className="mt-6 w-full" aria-hidden="true">
                <path
                  d={path}
                  fill="none"
                  stroke="url(#ps-line)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: visible ? 0 : 1,
                    transition: "stroke-dashoffset 1.6s var(--ease-out-soft)",
                  }}
                />
                <defs>
                  <linearGradient id="ps-line" x1="0" x2="1">
                    <stop stopColor="#06B6D4" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="font-mono text-[0.65rem] tracking-[0.14em] text-white/30 uppercase">
                8-week trend · +30
              </p>
            </div>

            <div className="grid gap-8">
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {LAYERS.map((l, i) => (
                  <li key={l.label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-white/60">{l.label}</span>
                      <span className="font-mono tabular-nums">{l.value}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full transition-[width] duration-1000"
                        style={{
                          width: visible ? `${l.value}%` : 0,
                          transitionDelay: `${i * 100}ms`,
                          background: "var(--gradient-iq)",
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <span className="label-tech flex items-center gap-2 !text-white/40">
                  <Sparkles className="text-violet size-3.5" /> AI Insights
                </span>
                <p className="mt-3 text-[1.0625rem] leading-relaxed">
                  "Your website is healthy, but 4 things need attention."
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {CHIPS.map((c) => (
                    <li
                      key={c.label}
                      className="flex items-center gap-2 rounded-md border border-white/10 px-2.5 py-1 font-mono text-[0.65rem] tracking-wider text-white/70 uppercase"
                    >
                      <span className="size-1.5 rounded-full" style={{ background: c.color }} />
                      {c.label} · {c.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
