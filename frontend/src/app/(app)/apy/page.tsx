"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { CardSkeleton } from "@/components/Skeleton";
import { useStreak, useUser } from "@/lib/hooks";

function computeApy(s: number) {
  return 4 + 4 * Math.min(1, Math.log(1 + s) / Math.log(11));
}

const MILESTONES = [0, 1, 2, 3, 5, 8, 10];

export default function ApyDetailPage() {
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: user, isLoading: userLoading } = useUser();

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
  const apy = streak?.currentApy ?? 4;
  const effectiveApy = streak?.effectiveApy ?? apy;
  const regularityBonus = streak?.regularityBonus ?? 0;
  const longRunBonus = streak?.longRunBonus ?? 0;
  const progressionBonus = streak?.progressionBonus ?? 0;
  const targetKm = user?.targetKm ?? 10;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-1 pb-2">
        <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-oria-card border border-oria flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Link>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">APY Details</h1>
      </div>

      {/* Big APY display */}
      <Card className="relative overflow-hidden !p-6 text-center">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.2)_0%,transparent_60%)] blur-[30px] pointer-events-none" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Effective APY</p>
          <p className="text-[56px] font-extrabold text-accent-purple-bright mt-2 leading-none tabular-nums animate-count-pop">
            {effectiveApy.toFixed(2)}
            <span className="text-[24px] text-text-muted">%</span>
          </p>
          <p className="text-sm text-text-secondary mt-2">
            Based on {count}-week streak + bonuses
          </p>
        </div>
      </Card>

      {/* Breakdown */}
      <Card className="!p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-4">Breakdown</p>
        <div className="flex flex-col gap-3">
          {/* Base */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full gradient-brand" />
                <span className="text-[13px] text-text-secondary">Base streak ({count}w)</span>
              </div>
              <span className="text-[14px] font-bold text-text-primary tabular-nums">{apy.toFixed(2)}%</span>
            </div>
            <div className="h-2 rounded-full bg-oria-chip overflow-hidden ml-[18px]">
              <div className="h-full rounded-full gradient-brand animate-bar" style={{ width: `${(apy / 8) * 100}%` }} />
            </div>
          </div>

          {/* Regularity */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${regularityBonus > 0 ? "bg-success-500" : "bg-oria-chip"}`} />
                <span className={`text-[13px] ${regularityBonus > 0 ? "text-text-secondary" : "text-text-muted"}`}>
                  Regularity ({streak?.weekSessions ?? 0} sessions)
                </span>
              </div>
              <span className={`text-[14px] font-bold tabular-nums ${regularityBonus > 0 ? "text-success-500" : "text-text-muted"}`}>
                +{regularityBonus.toFixed(2)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-oria-chip overflow-hidden ml-[18px]">
              <div className={`h-full rounded-full ${regularityBonus > 0 ? "bg-success-500 animate-bar" : ""}`} style={{ width: `${Math.min(100, regularityBonus * 100)}%` }} />
            </div>
            <p className="text-[11px] text-text-muted mt-1 ml-[18px]">
              Run 3+ times/week for bonus
            </p>
          </div>

          {/* Long run */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${longRunBonus > 0 ? "bg-accent-sport" : "bg-oria-chip"}`} />
                <span className={`text-[13px] ${longRunBonus > 0 ? "text-text-secondary" : "text-text-muted"}`}>
                  Long run ({(streak?.weekLongestRun ?? 0).toFixed(1)} km)
                </span>
              </div>
              <span className={`text-[14px] font-bold tabular-nums ${longRunBonus > 0 ? "text-accent-sport" : "text-text-muted"}`}>
                +{longRunBonus.toFixed(2)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-oria-chip overflow-hidden ml-[18px]">
              <div className={`h-full rounded-full ${longRunBonus > 0 ? "bg-accent-sport animate-bar" : ""}`} style={{ width: `${Math.min(100, longRunBonus * 100)}%` }} />
            </div>
            <p className="text-[11px] text-text-muted mt-1 ml-[18px]">
              One run over {(targetKm * 1.5).toFixed(0)} km triggers this bonus
            </p>
          </div>

          {/* Progression */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${progressionBonus > 0 ? "bg-accent-gold" : "bg-oria-chip"}`} />
                <span className={`text-[13px] ${progressionBonus > 0 ? "text-text-secondary" : "text-text-muted"}`}>
                  Pace progression
                </span>
              </div>
              <span className={`text-[14px] font-bold tabular-nums ${progressionBonus > 0 ? "text-accent-gold" : "text-text-muted"}`}>
                +{progressionBonus.toFixed(2)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-oria-chip overflow-hidden ml-[18px]">
              <div className={`h-full rounded-full ${progressionBonus > 0 ? "bg-accent-gold animate-bar" : ""}`} style={{ width: `${Math.min(100, progressionBonus * 100)}%` }} />
            </div>
            <p className="text-[11px] text-text-muted mt-1 ml-[18px]">
              Improve avg pace month-over-month
            </p>
          </div>

          {/* Total */}
          <div className="border-t border-oria mt-2 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-bold text-text-primary">Effective APY</span>
              <span className="text-[18px] font-extrabold text-accent-purple-bright tabular-nums">{effectiveApy.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* APY Curve */}
      <Card className="!p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-4">Base APY by Streak</p>
        <div className="flex flex-col gap-2">
          {MILESTONES.map((m) => {
            const apyAtM = computeApy(m);
            const reached = count >= m;
            const isCurrent = m === count;
            return (
              <div key={m} className="flex items-center gap-3">
                <span className={`text-[12px] font-semibold tabular-nums w-6 text-right ${reached ? "text-accent-purple-bright" : "text-text-muted"}`}>
                  {m}w
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-oria-chip overflow-hidden">
                  <div
                    className={`h-full rounded-full ${reached ? "gradient-brand" : "bg-oria-chip"} ${reached ? "animate-bar" : ""}`}
                    style={{ width: `${(apyAtM / 8) * 100}%`, animationDelay: `${m * 0.05}s` }}
                  />
                </div>
                <span className={`text-[13px] font-semibold tabular-nums w-14 text-right ${isCurrent ? "text-accent-purple-bright" : reached ? "text-text-primary" : "text-text-muted"}`}>
                  {apyAtM.toFixed(2)}%
                </span>
                {isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-accent-purple-bright animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-text-muted mt-3 text-center">
          APY = 4 + 4 * min(1, ln(1+s) / ln(11))
        </p>
      </Card>

      {/* How to maximize */}
      <Card className="!p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">How to maximize APY</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-primary">Hit your weekly goal</p>
              <p className="text-[12px] text-text-muted">Run {targetKm} km each week to build your streak</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success-500/15 border border-success-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 6-8" /></svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-primary">Run regularly</p>
              <p className="text-[12px] text-text-muted">3+ sessions/week unlocks regularity bonus</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-sport/15 border border-accent-sport/25 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FC4C02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /></svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-primary">Do a long run</p>
              <p className="text-[12px] text-text-muted">One run over {(targetKm * 1.5).toFixed(0)} km for the long run bonus</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
