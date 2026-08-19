import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_GROUPS } from "@/lib/report/nav";
import { btn } from "./primitives";

function NavList({
  active,
  onSelect,
  counts,
}: {
  active: string;
  onSelect: (id: string) => void;
  counts: Record<string, number>;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const group = NAV_GROUPS.find((g) => g.items.some((i) => i.id === active));
    if (group) setCollapsed((c) => ({ ...c, [group.id]: false }));
  }, [active]);

  return (
    <nav aria-label="Report sections" className="flex flex-col gap-5 px-3 py-4">
      {NAV_GROUPS.map((group) => {
        const isCollapsed = collapsed[group.id] ?? false;
        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => setCollapsed((c) => ({ ...c, [group.id]: !isCollapsed }))}
              aria-expanded={!isCollapsed}
              className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between px-2 pb-1.5 font-mono text-[0.6875rem] tracking-[0.08em] uppercase transition-colors"
            >
              {group.label}
              <ChevronDown
                className={cn("size-3.5 transition-transform duration-200", isCollapsed && "-rotate-90")}
                aria-hidden="true"
              />
            </button>

            {!isCollapsed ? (
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.id === active;
                  const count = counts[item.id];
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(item.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex h-9 w-full items-center gap-2.5 rounded-[9px] px-2.5 text-left text-[0.875rem] transition-colors duration-150",
                          isActive
                            ? "bg-primary/10 text-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <item.icon
                          className={cn("size-4 shrink-0", isActive ? "text-primary" : "")}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {count ? (
                          <span className="text-muted-foreground bg-muted shrink-0 rounded px-1.5 py-0.5 font-mono text-[0.6875rem]">
                            {count}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

export function ReportSidebar({
  active,
  onSelect,
  counts,
  open,
  onClose,
}: {
  active: string;
  onSelect: (id: string) => void;
  counts: Record<string, number>;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <aside className="border-border bg-surface hidden w-[244px] shrink-0 border-r lg:block">
        <div className="sticky top-[57px] max-h-[calc(100vh-57px)] overflow-y-auto">
          <NavList active={active} onSelect={onSelect} counts={counts} />
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="bg-foreground/30 absolute inset-0 backdrop-blur-[2px]"
          />
          <div className="bg-surface border-border absolute inset-y-0 left-0 w-[268px] overflow-y-auto border-r">
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <span className="font-display text-sm font-semibold">Report sections</span>
              <button type="button" onClick={onClose} className={btn.icon} aria-label="Close navigation">
                <X className="size-4" />
              </button>
            </div>
            <NavList
              active={active}
              onSelect={(id) => {
                onSelect(id);
                onClose();
              }}
              counts={counts}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
