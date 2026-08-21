import { Radar } from "lucide-react";
import { EmptyState } from "../primitives";

export function EngineView({ label, blurb }: { label: string; blurb: string }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[1.65rem] font-semibold tracking-tight md:text-[2rem]">
          {label}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[0.9375rem] leading-relaxed">{blurb}</p>
      </div>
      <EmptyState
        icon={Radar}
        title="Not part of this analysis"
        description="This module is served by the full SiteIQ audit engine. The current analysis did not collect data for it, so there is nothing to display rather than a placeholder."
      />
    </div>
  );
}
