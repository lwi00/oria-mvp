"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  streakCount: number;
}

const SCREENS = 5;

/**
 * Swipable primer explaining how Oria works, built for someone with zero DeFi
 * background: lending → why it's protected → what you hold → how the rate is
 * set each week → risk. No fixed rates are quoted — the yield is variable.
 */
export function LearnBottomSheet({ open, onClose, streakCount }: Props) {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setPage(0);
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const goTo = (i: number) => {
    setPage(i);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/55 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="How Oria works"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] bg-[#0F0F16] rounded-t-3xl border-t border-x border-oria sheet-in max-h-[90vh] flex flex-col"
      >
        <div className="pt-3 pb-2 flex flex-col items-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-oria-strong mb-3" />
          <div className="w-full px-5 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-purple-bright">
              How Oria works
            </p>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-oria-chip border border-oria flex items-center justify-center"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA0AC" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="overflow-x-auto snap-x snap-mandatory flex-1 scrollbar-none"
          onScroll={(e) => {
            const el = e.currentTarget;
            const idx = Math.round(el.scrollLeft / el.clientWidth);
            if (idx !== page) setPage(idx);
          }}
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex">
            {/* Screen 1 — What lending on a blockchain is */}
            <div className="min-w-full snap-start px-6 py-6 flex flex-col gap-4">
              <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
                Lending, in plain terms
              </h2>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                A bank takes your deposit, lends it out, and keeps most of the interest. <span className="text-text-primary font-semibold">DeFi</span> — finance that runs on open software instead of a bank — lets you lend directly.
              </p>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                When someone borrows what you&apos;ve put in, they pay interest. That interest is your yield — no branch, no middleman, just public code matching lenders and borrowers.
              </p>
            </div>

            {/* Screen 2 — Why it's protected */}
            <div className="min-w-full snap-start px-6 py-6 flex flex-col gap-4">
              <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
                Why a borrower can&apos;t run off with it
              </h2>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                To borrow anything, they first lock up <span className="text-text-primary font-semibold">more value than they take out</span> — borrow $100 and you might post $150 of collateral.
              </p>
              <div className="rounded-2xl border border-accent-purple/25 bg-accent-purple/8 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-purple-bright">Over-collateralised</p>
                <p className="text-[12px] text-text-muted mt-1.5 leading-snug">
                  If a borrower stops repaying, the system automatically sells their collateral to pay lenders back — before the loan can ever go underwater.
                </p>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Your loan is always backed by collateral worth more than the loan itself. That&apos;s the core protection, and it runs on its own.
              </p>
            </div>

            {/* Screen 3 — What you actually hold */}
            <div className="min-w-full snap-start px-6 py-6 flex flex-col gap-4">
              <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
                What you actually hold
              </h2>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                You don&apos;t lend regular dollars — you lend <span className="text-text-primary font-semibold">USDC</span>: a digital token worth $1, issued by Circle and backed by real dollars and US Treasury bills. The dollar, in a form a blockchain can move.
              </p>
              <div className="rounded-2xl border border-oria bg-oria-section p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Morpho</p>
                <p className="text-[16px] font-bold text-text-primary mt-1">~$7.4B deposited</p>
                <p className="text-[12px] text-text-muted mt-1.5 leading-snug">
                  Your USDC sits in a Morpho vault — the lending protocol matching it with those collateralised borrowers.
                </p>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                The wallet holding your position is <span className="text-text-primary font-semibold">yours</span> — Privy-issued, no seed phrase — and you can withdraw any time. Oria never signs on your behalf.
              </p>
            </div>

            {/* Screen 4 — How your rate is set each week */}
            <div className="min-w-full snap-start px-6 py-6 flex flex-col gap-4">
              <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
                How your rate is set each week
              </h2>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                The vault pays a yield. <span className="text-text-primary font-semibold">Everyone earns a baseline share</span> of it, whatever they do. The rest goes into a bonus pool that&apos;s split by how consistent you&apos;ve been.
              </p>
              <div className="rounded-2xl border border-accent-sport/25 bg-accent-sport/8 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sport">Your activity score</p>
                <ul className="text-[12px] text-text-muted mt-2 leading-relaxed flex flex-col gap-1">
                  <li><span className="text-text-secondary font-semibold">Consistency</span> — your weekly streak (the biggest factor)</li>
                  <li><span className="text-text-secondary font-semibold">Regularity</span> — three or more sessions a week</li>
                  <li><span className="text-text-secondary font-semibold">Long run</span> — hitting your long-session target</li>
                  <li><span className="text-text-secondary font-semibold">Progression</span> — beating your recent average pace</li>
                </ul>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Every <span className="text-text-primary font-semibold">Sunday at 12:00</span>, your score is recalculated and your rate is locked in for the week ahead.{" "}
                {streakCount > 0
                  ? `You're on a ${streakCount}-week streak — keep the weeks coming and your slice of the pool grows.`
                  : "Hit your first weekly goal and your slice of the pool starts to grow."}
              </p>
            </div>

            {/* Screen 5 — Is it risky? */}
            <div className="min-w-full snap-start px-6 py-6 flex flex-col gap-4">
              <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
                Is it risky?
              </h2>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Yes, like any investment. Three things to know:
              </p>
              <div className="flex flex-col gap-2">
                <RiskRow
                  label="Smart contract"
                  body="Morpho is code, and code can have bugs. The vaults are audited by Spearbit, Trail of Bits and OpenZeppelin — zero risk doesn't exist."
                />
                <RiskRow
                  label="USDC peg"
                  body="USDC is backed by Circle and pegged to the dollar. In 2023 the peg briefly drifted. Rare, but real."
                />
                <RiskRow
                  label="Variable yield"
                  body="If borrowing demand on Morpho drops, your yield drops too. Nothing here is a fixed rate."
                />
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed pt-1 border-t border-oria">
                Oria doesn&apos;t touch your funds, doesn&apos;t take leverage, doesn&apos;t promise a fixed return. You hold the keys, you withdraw whenever, and you can track your position on Morpho directly.
              </p>
              <div className="mt-auto pt-2 flex flex-col gap-2">
                <Link
                  href="/profile/learn/security"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1 text-[12px] font-semibold text-accent-purple-bright"
                >
                  Full security FAQ →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 pt-2 pb-5 flex items-center justify-between">
          <button
            onClick={() => goTo(Math.max(0, page - 1))}
            disabled={page === 0}
            aria-label="Previous"
            className="w-9 h-9 rounded-full bg-oria-chip border border-oria flex items-center justify-center disabled:opacity-30"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: SCREENS }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to screen ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === page ? "w-6 bg-accent-purple-bright" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
          {page < SCREENS - 1 ? (
            <button
              onClick={() => goTo(Math.min(SCREENS - 1, page + 1))}
              aria-label="Next"
              className="w-9 h-9 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6 6-6" /></svg>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-[12px] font-bold text-white px-3.5 py-2 rounded-full gradient-brand shadow-button"
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function RiskRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-2xl bg-oria-section border border-oria p-3.5">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-accent-purple/15 border border-accent-purple/25 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-text-primary">{label}</p>
          <p className="text-[12px] text-text-muted mt-0.5 leading-snug">{body}</p>
        </div>
      </div>
    </div>
  );
}
