import { ArrowRight } from "lucide-react";
import { Reveal } from "./Section";

export function FinalCTA() {
  return (
    <section className="bg-ink relative overflow-hidden py-28 text-white md:py-40">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.35) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.35) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, black, transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[720px] -translate-x-1/2 -translate-y-1/2 opacity-25"
        style={{ background: "radial-gradient(circle, var(--blue), transparent 62%)" }}
      />
      <div
        aria-hidden="true"
        className="animate-node pointer-events-none absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "var(--cyan)", boxShadow: "0 0 40px 8px oklch(0.715 0.128 215.2 / 0.5)" }}
      />

      <div className="container-iq relative text-center">
        <Reveal>
          <h2 className="text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.035em] md:text-[4.5rem]">
            Know Your Website.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-white/60">
            Stop guessing. Start understanding.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#analyze"
              className="arrow-cta text-ink inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-medium transition-transform duration-200 hover:-translate-y-px"
            >
              Analyze Your Website <ArrowRight className="size-4" />
            </a>
            <a
              href="#product"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-sm font-medium text-white/85 transition-colors duration-200 hover:border-white/40 hover:text-white"
            >
              Explore SiteIQ
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
