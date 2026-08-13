import { useEffect, useRef, useState } from "react";
import { ArrowRight, Link2, RotateCcw } from "lucide-react";
import { ScanDashboard, SCAN_STAGES } from "./ScanDashboard";
import { Reveal } from "./Section";

const SAMPLES = ["github.com", "stripe.com", "vercel.com"];
const TRUST = ["65+ checks", "AI-powered insights", "Results in seconds"];

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
      timers.current.push(setTimeout(() => setStage(i), i * 380));
    });
    timers.current.push(setTimeout(() => setStatus("done"), SCAN_STAGES.length * 380 + 250));
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setStatus("idle");
    setStage(0);
  };

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        aria-hidden="true"
        className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_20%,black,transparent)]"
      />

      <div className="container-iq relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h1 className="text-[2.7rem] leading-[1.02] font-semibold tracking-[-0.035em] md:text-[4.25rem] lg:text-[5.25rem]">
            Know What's Holding
            <br />
            Your <span className="text-gradient-iq">Website</span> Back.
          </h1>
          <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-[1.0625rem] leading-relaxed md:text-lg">
            SiteIQ scans your website for SEO, security, performance and technical issues —
            then tells you what actually needs fixing.
          </p>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-10 max-w-2xl">
          <form
            id="analyze"
            onSubmit={(e) => {
              e.preventDefault();
              run(url);
            }}
            className="panel focus-within:ring-ring/20 flex flex-col gap-2 p-2 transition-shadow focus-within:ring-4 sm:flex-row sm:items-center"
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
                className="placeholder:text-muted-foreground w-full bg-transparent py-2.5 font-mono text-[0.9rem] outline-none"
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
                  className="hover:text-foreground font-mono text-[0.82rem] underline decoration-dotted underline-offset-4 transition-colors"
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

          <ul className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase">
                <span className="bg-cyan size-1 rounded-full" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={200} className="mx-auto mt-16 max-w-4xl">
          <ScanDashboard status={status} stage={stage} url={url} />
        </Reveal>
      </div>
    </section>
  );
}
