import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section";
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}

export function Section({
  id,
  children,
  className,
  tone = "light",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "light" | "surface" | "dark";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-24 md:py-32 lg:py-40",
        tone === "surface" && "bg-surface border-y border-border",
        tone === "dark" && "bg-ink text-white",
        className,
      )}
    >
      <div className="container-iq relative">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <div className="label-tech mb-5 flex items-center gap-2.5">
          <span className="bg-cyan inline-block size-1.5 rounded-full" />
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-[2.35rem] leading-[1.04] font-semibold md:text-[3.2rem] lg:text-[3.75rem]">
        {title}
      </h2>
      {sub ? (
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}
