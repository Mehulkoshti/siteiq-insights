import { Reveal } from "./Section";
import { cn } from "@/lib/utils";

const ALERTS = [
  { dot: "bg-danger", title: "Security score dropped", body: "96 → 71 · CSP header removed", pos: "md:col-start-1 md:row-start-1", delay: 0 },
  { dot: "bg-warning", title: "SEO issue detected", body: "9 canonicals point to a redirect", pos: "md:col-start-3 md:row-start-1", delay: 90 },
  { dot: "bg-blue", title: "New pages discovered", body: "6 pages added under /resources", pos: "md:col-start-1 md:row-start-2", delay: 180 },
  { dot: "bg-success", title: "Performance improved", body: "Mobile LCP 4.1s → 2.2s", pos: "md:col-start-3 md:row-start-2", delay: 270 },
];

export function AIAlerts() {
  return (
    <div className="border-border border-y">
      <div className="container-iq relative py-20 md:py-28">
        <div aria-hidden="true" className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" />
        <div className="relative grid items-center gap-5 md:grid-cols-3 md:grid-rows-2">
          {ALERTS.slice(0, 2).map((a) => (
            <Reveal key={a.title} delay={a.delay} className={cn(a.pos)}>
              <AlertCard {...a} />
            </Reveal>
          ))}

          <Reveal
            delay={140}
            className="panel md:col-start-2 md:row-span-2 md:row-start-1 md:self-stretch"
          >
            <div className="flex h-full flex-col justify-center p-6 text-center">
              <span className="label-tech">Always on</span>
              <p className="font-display mt-3 text-2xl leading-tight font-semibold">
                Intelligent system alerts
              </p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                SiteIQ only interrupts you when a change actually matters — ranked by severity,
                explained in one line, linked to the exact deploy.
              </p>
              <div className="mt-6 flex justify-center gap-1.5" aria-hidden="true">
                {["bg-danger", "bg-warning", "bg-blue", "bg-success"].map((c, i) => (
                  <span
                    key={c}
                    className={cn("animate-node size-1.5 rounded-full", c)}
                    style={{ animationDelay: `${i * 350}ms` }}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {ALERTS.slice(2).map((a) => (
            <Reveal key={a.title} delay={a.delay} className={cn(a.pos)}>
              <AlertCard {...a} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertCard({ dot, title, body }: { dot: string; title: string; body: string }) {
  return (
    <div className="panel hover:border-foreground/20 hover:shadow-lift flex items-start gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5">
      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", dot)} />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground mt-0.5 font-mono text-xs">{body}</p>
      </div>
    </div>
  );
}
