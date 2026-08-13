import { Gauge, Search, Shield, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, Section, SectionHeader } from "./Section";

const ITEMS: { icon: LucideIcon; title: string; text: string; accent: string }[] = [
  {
    icon: Search,
    title: "Find what's hurting your visibility.",
    text: "Metadata, indexing, canonicals, structure — the SEO signals search engines actually read.",
    accent: "var(--blue)",
  },
  {
    icon: Gauge,
    title: "Find what's making your website slow.",
    text: "Core Web Vitals, render blocking, oversized assets, and where real users feel the lag.",
    accent: "var(--cyan)",
  },
  {
    icon: Shield,
    title: "Find the gaps before they become problems.",
    text: "Headers, SSL/TLS, email authentication and exposure risks across every route.",
    accent: "var(--violet)",
  },
  {
    icon: Sparkles,
    title: "Know what to fix — and why it matters.",
    text: "AI reads every signal together and explains the impact in plain language.",
    accent: "var(--success)",
  },
];

export function Capabilities() {
  return (
    <Section id="product">
      <SectionHeader
        eyebrow="Core Capabilities"
        title="Everything Your Website Needs to Stay Healthy."
        sub="One intelligent scan. The signals that actually matter."
      />

      <div className="mt-14 grid gap-px md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <Reveal
            key={it.title}
            delay={i * 80}
            className="group border-border bg-surface hover:shadow-lift relative border p-6 transition-all duration-300 hover:-translate-y-1 lg:p-7"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
              style={{ background: it.accent }}
            />
            <it.icon className="size-5" style={{ color: it.accent }} aria-hidden="true" />
            <h3 className="mt-6 text-[1.0625rem] leading-snug font-medium">{it.title}</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{it.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
