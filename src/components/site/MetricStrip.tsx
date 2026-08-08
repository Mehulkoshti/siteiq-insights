import { Reveal } from "./Section";

const METRICS = [
  { value: "65+", label: "Website Signals" },
  { value: "<10s", label: "Average Analysis" },
  { value: "8", label: "Intelligence Layers" },
  { value: "AI", label: "Actionable Insights" },
];

export function MetricStrip() {
  return (
    <div className="border-border border-y">
      <div className="container-iq grid grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 70}
            className="border-border px-2 py-8 not-last:border-r odd:pr-6 even:pl-6 lg:px-6 lg:even:pl-2 [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r"
          >
            <div className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {m.value}
            </div>
            <div className="label-tech mt-2">{m.label}</div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
