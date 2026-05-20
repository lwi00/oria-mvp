"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { CardSkeleton } from "@/components/Skeleton";
import { useStreak, useUser, useActivities, useRecoverStreak } from "@/lib/hooks";
import { useToast } from "@/components/Toast";
import { formatMoney } from "@/lib/utils";

const MILESTONES = [1, 2, 4, 6, 8, 12, 16, 24];

export default function StreakDetailPage() {
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: activities } = useActivities(52);
  const recoverStreak = useRecoverStreak();
  const { toast } = useToast();

  if (streakLoading || userLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 pt-1 pb-2">
          <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-oria-card border border-oria flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </Link>
          <div className="h-7 w-32 skeleton-shimmer rounded" />
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const count = streak?.currentCount ?? 0;
  const longest = streak?.longestCount ?? 0;
  const targetKm = user?.targetKm ?? 10;
  const currentKm = streak?.currentWeek?.distanceKm ?? 0;
  const pct = Math.min(100, Math.round((currentKm / targetKm) * 100));
  const canRecover = !streak?.lastWeekMet && count === 0 && longest > 0;

  // Pool-model APY context (replaces the legacy tiered 4→8% ramp).
  const breakdown = streak?.apyBreakdown;
  const baselineApy = breakdown?.baseline ?? 3;
  const vaultMax = breakdown?.vaultRate ?? 5;
  const effectiveApy = streak?.effectiveApy ?? baselineApy;
  // Projected effective APY at a given streak length, holding the other
  // activity-score components flat. Linear ramp from baseline (0 w) to
  // vault-rate ceiling (16 w+). Good-enough visual; the real model is
  // computed server-side per request.
  const projectedApy = (weeks: number): number => {
    const norm = Math.min(1, weeks / 16);
    return baselineApy + (vaultMax - baselineApy) * norm;
  };

  // Build weekly history from activities
  const weekHistory = (activities ?? []).map((a) => ({
    week: new Date(a.weekStart).toLocaleDateString("en", { month: "short", day: "numeric" }),
    km: a.distanceKm,
    met: a.goalMet,
  })).reverse();

  // Next milestone
  const nextMilestone = MILESTONES.find((m) => m > count) ?? MILESTONES[MILESTONES.length - 1];
  const milestonePct = Math.min(100, Math.round((count / nextMilestone) * 100));

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-1 pb-2">
        <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-oria-card border border-oria flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Link>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">Streak details</h1>
      </div>

      {/* Hero — flame + streak count + effective APY (matches Home treatment) */}
      <Card className="relative overflow-hidden !p-6 text-center">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(252,76,2,0.20)_0%,transparent_60%)] blur-[28px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18)_0%,transparent_60%)] blur-[24px] pointer-events-none" />
        <div className="relative">
          <div className="flex items-baseline justify-center gap-2">
            <span
              className="text-[56px] leading-none drop-shadow-[0_2px_14px_rgba(252,76,2,0.45)]"
              aria-hidden
            >
              🔥
            </span>
            <span className="text-[80px] font-extrabold text-text-primary leading-none tracking-tight tabular-nums">
              {count}
            </span>
          </div>
          <p className="text-lg font-bold text-text-primary mt-4">
            {count === 0 ? "No active streak" : `${count} week${count > 1 ? "s" : ""} strong`}
          </p>
          <p className="text-sm text-accent-purple-bright font-semibold mt-1 tabular-nums">
            Earning <span className="font-extrabold">{effectiveApy.toFixed(2)}% APY</span>
          </p>
          <p className="text-[12px] text-text-muted mt-2">
            Longest ever · <span className="text-text-secondary font-semibold">{longest} week{longest !== 1 ? "s" : ""}</span>
          </p>
        </div>
      </Card>

      {/* Next milestone */}
      <Card className="!p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-gold">Next milestone</p>
          <span className="text-sm font-bold text-text-primary tabular-nums">{count} / {nextMilestone} weeks</span>
        </div>
        <div className="h-2 rounded-full bg-oria-chip overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-gold to-accent-sport transition-all duration-700"
            style={{ width: `${milestonePct}%` }}
          />
        </div>
        <p className="text-[12px] text-text-muted mt-2">
          {nextMilestone - count} more week{nextMilestone - count > 1 ? "s" : ""} to unlock the {nextMilestone}-week badge.
        </p>
      </Card>

      {/* APY impact — projected effective APY at each streak length, under the
          current vault rate. Baseline anchors the left, vault ceiling the right. */}
      <Card className="!p-4">
        <div className="flex justify-between items-baseline mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Streak APY impact</p>
          <p className="text-[10px] text-text-muted tabular-nums">
            {baselineApy.toFixed(2)}% baseline · {vaultMax.toFixed(2)}% max
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {MILESTONES.filter((m) => m <= 20).map((m) => {
            const apyAtM = projectedApy(m);
            const reached = count >= m;
            const widthPct = vaultMax > baselineApy
              ? Math.max(2, ((apyAtM - baselineApy) / (vaultMax - baselineApy)) * 100)
              : 0;
            return (
              <div key={m} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                  reached
                    ? "bg-gradient-to-br from-accent-purple to-accent-purple-bright text-white shadow-button"
                    : m === nextMilestone
                      ? "bg-accent-gold/15 border border-accent-gold/30 text-accent-gold"
                      : "bg-oria-chip text-text-muted"
                }`}>
                  {m}
                </div>
                <div className="flex-1">
                  <div className="h-1.5 rounded-full bg-oria-chip overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        reached
                          ? "bg-gradient-to-r from-accent-purple to-accent-purple-bright"
                          : "bg-accent-purple/15"
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
                <span className={`text-[13px] font-semibold tabular-nums w-16 text-right ${reached ? "text-accent-purple-bright" : "text-text-muted"}`}>
                  {apyAtM.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-text-muted mt-3 leading-relaxed">
          Projected effective APY at each streak length, assuming the vault rate stays where it is today.
        </p>
      </Card>

      {/* This week status */}
      <Card className="!p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">This Week</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[22px] font-extrabold text-text-primary tabular-nums leading-none">
              {currentKm.toFixed(1)}<span className="text-[13px] text-text-muted font-medium"> / {targetKm} km</span>
            </p>
            <p className="text-[12px] text-text-muted mt-1">
              {pct >= 100 ? "Goal reached!" : `${Math.max(0, targetKm - currentKm).toFixed(1)} km to go`}
            </p>
          </div>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${pct >= 100 ? "bg-success-500/15" : "bg-accent-sport/10"}`}>
            {pct >= 100 ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            ) : (
              <span className="text-[15px] font-bold text-accent-sport tabular-nums">{pct}%</span>
            )}
          </div>
        </div>
      </Card>

      {/* Streak recovery */}
      {canRecover && (
        <Card className="!p-4 border-accent-gold/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-text-primary">Recover your streak</p>
              <p className="text-[12px] text-text-muted mt-0.5">Get back to {longest} weeks for {(() => { const f = formatMoney(5, user?.settings?.currency ?? "USD"); return `${f.symbol}${f.intPart}`; })()}</p>
            </div>
            <button
              onClick={() => recoverStreak.mutate(undefined, {
                onSuccess: () => toast("Streak recovered!"),
                onError: (e) => toast(e.message, "error"),
              })}
              disabled={recoverStreak.isPending}
              className="px-4 py-2 rounded-xl gradient-gold text-white text-sm font-semibold cursor-pointer border-none disabled:opacity-50"
            >
              {recoverStreak.isPending ? "..." : (() => { const f = formatMoney(5, user?.settings?.currency ?? "USD"); return `${f.symbol}${f.intPart}`; })()}
            </button>
          </div>
        </Card>
      )}

      {/* Week history */}
      {weekHistory.length > 0 && (
        <Card className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">History</p>
          <div className="flex flex-col gap-2">
            {weekHistory.slice(-12).map((w, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${w.met ? "bg-success-500/20" : "bg-oria-chip"}`}>
                  {w.met ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-text-muted" />
                  )}
                </div>
                <span className="text-[13px] text-text-secondary flex-1">{w.week}</span>
                <span className="text-[13px] font-semibold text-text-primary tabular-nums">{w.km.toFixed(1)} km</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
