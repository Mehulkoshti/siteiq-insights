import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Link2 } from "lucide-react";
import { IntelligenceCore } from "./IntelligenceCore";
import { Reveal } from "./Section";

const HOST_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

/** Accepts example.com, www.example.com, https://example.com. */
export function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value || value.length > 2048) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    if (!HOST_RE.test(url.hostname)) return null;
    return url.origin + (url.pathname === "/" ? "" : url.pathname);
  } catch {
    return null;
  }
}

export function HeroAudit() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Enter a valid website URL.");
      return;
    }
    setError(null);
    navigate({ to: "/report", search: { url: normalized } });
  };

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div
        aria-hidden="true"
        className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_45%_20%,black,transparent)]"
      />

      <div className="container-iq relative grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-6 xl:col-span-6">
          <span className="label-tech">AI-powered website intelligence</span>

          <h1 className="mt-5 text-[2.7rem] leading-[1.03] font-semibold tracking-[-0.035em] md:text-[4.25rem] lg:text-[5rem]">
            Know Your Website.
            <br />
            Not Just Its <span className="text-blue">Score.</span>
          </h1>

          <p className="text-muted-foreground mt-6 max-w-xl text-[1.0625rem] leading-relaxed md:text-lg">
            SiteIQ analyzes your website across SEO, security, performance and technical health —
            then tells you what actually matters.
          </p>

          <form onSubmit={submit} id="analyze" className="mt-8 max-w-xl">
            <div className="panel focus-within:ring-ring/20 flex flex-col gap-2 p-2 transition-shadow focus-within:ring-4 sm:flex-row sm:items-center">
              <label htmlFor="site-url" className="sr-only">
                Website URL
              </label>
              <div className="flex flex-1 items-center gap-2.5 px-3">
                <Link2 className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                <input
                  id="site-url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your website URL"
                  inputMode="url"
                  autoComplete="url"
                  maxLength={2048}
                  aria-invalid={!!error}
                  aria-describedby={error ? "site-url-error" : undefined}
                  className="placeholder:text-muted-foreground w-full bg-transparent py-2.5 font-mono text-[0.9rem] outline-none"
                />
              </div>
              <button
                type="submit"
                className="arrow-cta bg-foreground text-background hover:shadow-lift inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-px"
              >
                Analyze Website <ArrowRight className="size-4" />
              </button>
            </div>

            {error ? (
              <p id="site-url-error" role="alert" className="text-destructive mt-2.5 px-1 text-sm">
                {error}
              </p>
            ) : null}
          </form>

          <p className="text-muted-foreground mt-5 flex flex-wrap items-center gap-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase">
            <span className="bg-cyan size-1 rounded-full" />
            65+ signals · AI-powered insights · Real results
          </p>
        </Reveal>

        <Reveal delay={140} className="lg:col-span-6 lg:-mr-[6%] xl:-mr-[10%]">
          <IntelligenceCore className="mx-auto max-w-[420px] sm:max-w-[520px] lg:max-w-none" />
        </Reveal>
      </div>
    </section>
  );
}
