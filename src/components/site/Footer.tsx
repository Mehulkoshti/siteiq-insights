import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Product",
    links: ["Website Audit", "Monitoring", "Compare Sites", "Bulk Audit", "AI Insights"],
  },
  { title: "Resources", links: ["Documentation", "FAQ", "Blog", "Changelog"] },
  { title: "Company", links: ["Codaiman", "About", "Contact"] },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-iq border-t border-white/10 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
          <div>
            <Logo mark={30} className="text-white [&_span]:text-[1.25rem]" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              AI-powered website intelligence for security, performance, SEO and beyond.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3" aria-label="Footer">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[0.68rem] tracking-[0.16em] text-white/40 uppercase">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#top"
                        className="text-sm text-white/65 transition-colors hover:text-white"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>© 2026 SiteIQ. All rights reserved.</p>
          <p>Built by Codaiman.</p>
        </div>
      </div>
    </footer>
  );
}
