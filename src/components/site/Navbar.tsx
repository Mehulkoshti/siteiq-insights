import { useEffect, useState } from "react";
import { ArrowRight, Menu, MoonStar, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const NAV = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions" },
  { label: "Compare", href: "#compare" },
  { label: "Resources", href: "#resources" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "bg-background/72 border-b border-border backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-iq flex h-16 items-center justify-between gap-6" aria-label="Main">
        <a href="#top" className="focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="text-muted-foreground hover:text-foreground hover:border-border border border-transparent flex size-9 items-center justify-center rounded-md transition-colors"
          >
            {dark ? <Sun className="size-4" /> : <MoonStar className="size-4" />}
          </button>
          <a
            href="#top"
            className="text-muted-foreground hover:text-foreground hidden px-3 py-2 text-sm font-medium transition-colors sm:block"
          >
            Sign in
          </a>
          <a
            href="#analyze"
            className="arrow-cta bg-foreground text-background hover:shadow-lift hidden items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-px sm:inline-flex"
          >
            Analyze Website <ArrowRight className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="border-border flex size-9 items-center justify-center rounded-md border lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="bg-background/95 border-border border-t backdrop-blur-xl lg:hidden">
          <ul className="container-iq flex flex-col py-3">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground block py-3 text-[0.95rem] font-medium"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2 pb-3">
              <a
                href="#analyze"
                onClick={() => setOpen(false)}
                className="bg-foreground text-background flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
              >
                Analyze Website <ArrowRight className="size-3.5" />
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
