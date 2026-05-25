"use client";

import Link from "next/link";

/** Shared chrome for the 5 "Understand Oria" pages. */
export function LearnShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 pt-1 pb-2">
        <Link
          href="/profile"
          aria-label="Back to profile"
          className="w-9 h-9 rounded-xl bg-oria-card border border-oria flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Link>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-purple-bright">Understand Oria</p>
          <h1 className="text-[22px] font-extrabold text-text-primary tracking-tight leading-tight">{title}</h1>
        </div>
      </div>

      {intro && (
        <p className="text-[14px] text-text-secondary leading-relaxed">{intro}</p>
      )}

      <article className="learn-prose">{children}</article>
    </div>
  );
}
