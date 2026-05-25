import Link from "next/link";
import { readSummary } from "@/lib/docs";

export const metadata = {
  title: "Oria · Docs",
  description: "How Oria works — the yield model, the product, and the trust assumptions.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = readSummary();
  return (
    <div
      className="min-h-screen text-white relative"
      style={{ background: "linear-gradient(160deg, #0d0818 0%, #140d2e 50%, #0a0620 100%)" }}
    >
      {/* Subtle ambient glow, mirroring /landing */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-[15%] -right-[5%] w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.04) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#0d0818]/80 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link href="/landing" className="flex items-center gap-2.5 group">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[17px] font-extrabold text-white tracking-tight">Oria</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-purple-300 ml-1">
              Docs
            </span>
          </Link>
          <Link
            href="/onboarding"
            className="text-[13px] font-semibold px-4 py-2 rounded-xl text-white"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              boxShadow: "0 2px 16px rgba(124,58,237,0.35)",
            }}
          >
            Launch App
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 flex gap-10 pt-10">
        {/* Sidebar */}
        <aside className="hidden md:block w-[240px] shrink-0">
          <nav className="sticky top-[80px] flex flex-col gap-6 pb-12">
            {nav.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-purple-300/70 mb-2 pl-3">
                    {section.heading}
                  </p>
                )}
                <ul className="flex flex-col gap-0.5">
                  {section.links.map((l) => {
                    const href = l.slug === "" ? "/docs" : `/docs/${l.slug}`;
                    return (
                      <li key={l.slug}>
                        <Link
                          href={href}
                          className="block px-3 py-1.5 rounded-lg text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {l.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile nav (collapsible alternative would be nicer; pragmatic
            scroll-list for the MVP) */}
        <details className="md:hidden mb-4">
          <summary className="cursor-pointer text-[13px] font-semibold text-purple-300 py-2">
            Browse docs
          </summary>
          <nav className="mt-3 flex flex-col gap-4">
            {nav.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-purple-300/70 mb-2">
                    {section.heading}
                  </p>
                )}
                <ul className="flex flex-col gap-0.5">
                  {section.links.map((l) => {
                    const href = l.slug === "" ? "/docs" : `/docs/${l.slug}`;
                    return (
                      <li key={l.slug}>
                        <Link
                          href={href}
                          className="block px-3 py-1.5 rounded-lg text-[13px] text-white/70 hover:bg-white/5"
                        >
                          {l.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </details>

        {/* Content */}
        <main className="flex-1 min-w-0 pb-24">
          <article className="docs-prose">{children}</article>
        </main>
      </div>
    </div>
  );
}
