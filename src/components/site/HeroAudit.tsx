import { useEffect, useRef, useState } from "react";
import { ArrowRight, Link2, RotateCcw } from "lucide-react";
import { LiveScan, SCAN_STAGES } from "./LiveScan";
import { Reveal } from "./Section";

const SAMPLES = ["github.com", "stripe.com", "vercel.com"];

export function HeroAudit() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "done">("idle");
  const [stage, setStage] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = (value: string) => {
    const target = value.trim() || "example.com";
    setUrl(target);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStatus("scanning");
    setStage(0);
    SCAN_STAGES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStage(i), i * 620));
    });
    timers.current.push(
      setTimeout(() => setStatus("done"), SCAN_STAGES.length * 620 + 300),
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setStatus("idle");
    setStage(0);
  };

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div aria-hidden="true" className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,black,transparent)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-20%] left-1/2 h-[520px] w-[900px] -translate-x-1/2 opacity-[0.14]"
        style={{ background: "radial-gradient(ellipse at center, var(--blue), transparent 65%)" }}
      />

      <div className="container-iq relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="border-border bg-surface/70 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.16em] uppercase backdrop-blur">
            <span className="bg-cyan animate-node size-1.5 rounded-full" />
            AI-Powered Website Intelligence
          </span>
          <h1 className="mt-7 text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.035em] md:text-[4rem] lg:text-[5.25rem]">
            Your Website.
            <br />
            <span className="text-gradient-iq">Under the Microscope.</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-7 max-w-2xl text-[1.0625rem] leading-relaxed md:text-lg">
            SiteIQ uses AI to understand your website across security, performance, SEO,
            accessibility, infrastructure and more — then tells you exactly what to fix.
          </p>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-10 max-w-2xl">
          <form
            id="analyze"
            onSubmit={(e) => {
              e.preventDefault();
              run(url);
            }}
            className="panel focus-within:ring-ring/25 flex flex-col gap-2 p-2 transition-shadow focus-within:ring-4 sm:flex-row sm:items-center"
          >
            <label htmlFor="site-url" className="sr-only">
              Website URL
            </label>
            <div className="flex flex-1 items-center gap-2.5 px-3">
              <Link2 className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
              <input
                id="site-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL"
                inputMode="url"
                autoComplete="url"
                className="placeholder:text-muted-foreground w-full bg-transparent py-2.5 text-[0.95rem] outline-none"
              />
            </div>
            <button
              type="submit"
              className="arrow-cta bg-foreground text-background hover:shadow-lift inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-px"
            >
              Analyze Website <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
            <span>Try:</span>
            {SAMPLES.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => run(s)}
                  className="hover:text-foreground underline decoration-dotted underline-offset-4 transition-colors"
                >
                  {s}
                </button>
                {i < SAMPLES.length - 1 ? <span aria-hidden="true">·</span> : null}
              </span>
            ))}
            {status !== "idle" ? (
              <button
                type="button"
                onClick={reset}
                className="hover:text-foreground ml-2 inline-flex items-center gap-1.5 text-xs"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={200} className="mx-auto mt-14 max-w-5xl">
          <LiveScan status={status} stage={stage} url={url} />
        </Reveal>
      </div>
    </section>
  );
}
