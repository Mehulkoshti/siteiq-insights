import { cn } from "@/lib/utils";

export function Logo({ className, mark = 26 }: { className?: string; mark?: number }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={mark}
        height={mark}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#iq-g)" />
        <circle cx="14" cy="14" r="6.2" stroke="white" strokeWidth="1.8" opacity="0.95" />
        <path d="M18.6 18.6 24 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M11 14h6M14 11v6" stroke="white" strokeWidth="1.2" opacity="0.6" />
        <defs>
          <linearGradient id="iq-g" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#06B6D4" />
            <stop offset="0.5" stopColor="#2563EB" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display text-[1.075rem] font-semibold tracking-[-0.03em]">
        SiteIQ
      </span>
    </span>
  );
}
