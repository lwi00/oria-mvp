"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { MiniJar } from "@/components/MiniJar";
import { WeekDots } from "@/components/WeekDots";
import { ProgressRing } from "@/components/ProgressRing";
import { Avatar } from "@/components/Avatar";
import { CardSkeleton } from "@/components/Skeleton";
import { LogActivityModal } from "@/components/LogActivityModal";
import { useUser, useStreak, useFeed, useEarnings } from "@/lib/hooks";
import { timeAgo, getInitials, formatFeedEvent } from "@/lib/utils";

const apySteps = [
  { s: 0, a: 4.0 }, { s: 1, a: 5.16 }, { s: 2, a: 5.83 },
  { s: 3, a: 6.31 }, { s: 4, a: 6.68 }, { s: 5, a: 6.98 },
  { s: 6, a: 7.25 }, { s: 7, a: 7.44 }, { s: 8, a: 7.62 },
  { s: 9, a: 7.78 }, { s: 10, a: 8.0 },
];

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: feed } = useFeed(3);
  const { data: earnings } = useEarnings();

  const [showLogModal, setShowLogModal] = useState(false);

  const isLoading = userLoading || streakLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="pt-[2px] pb-2">
          <div className="h-4 w-32 animate-pulse bg-purple-100/60 rounded" />
          <div className="h-7 w-40 animate-pulse bg-purple-100/60 rounded mt-2" />
        </div>
        <CardSkeleton />
        <CardSkeleton />
        <div className="grid grid-cols-2 gap-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const displayName = user?.displayName?.split(" ")[0] ?? "User";
  const streakCount = streak?.currentCount ?? 0;
  const apy = streak?.currentApy ?? 4.0;
  const targetKm = user?.targetKm ?? 10;
  const currentKm = streak?.currentWeek?.distanceKm ?? 0;
  const pct = Math.min(100, Math.round((currentKm / targetKm) * 100));

  // Build week dots (simple: just show current week's status + placeholders)
  const weekProgress: (boolean | null)[] = Array(7).fill(null);
  const today = new Date().getUTCDay();
  const dayIndex = today === 0 ? 6 : today - 1; // Monday=0
  if (streak?.currentWeek?.goalMet) {
    for (let i = 0; i <= dayIndex; i++) weekProgress[i] = true;
  } else if (currentKm > 0) {
    for (let i = 0; i <= dayIndex; i++) weekProgress[i] = currentKm >= targetKm;
  }

  const balance = earnings?.totalDeposited ?? 0;
  const earned = earnings?.totalEarned ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-[2px] pb-2">
        <p className="text-[13px] font-medium text-text-muted">
          Hello, <span className="text-text-primary font-semibold">{displayName}</span> 👋
        </p>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5 tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Streak Hero Card */}
      <Card className="gradient-surface relative overflow-hidden !p-6">
        <div className="absolute -top-[30px] -right-5 w-[140px] h-[140px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.15)_0%,transparent_70%)]" />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-[13px] font-medium text-text-secondary mb-1">Current streak</p>
            <p className="text-[44px] font-extrabold text-text-primary leading-none tracking-tight">
              {streakCount}<span className="text-[32px]">🔥</span>
            </p>
            <p className="text-sm text-purple-600 mt-2 font-semibold tabular-nums">{apy.toFixed(2)}% APY</p>
          </div>
          <MiniJar fill={pct} size={100} />
        </div>
        <div className="mt-4">
          <WeekDots days={weekProgress} />
        </div>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-text-muted mb-0.5">This week</p>
            <p className="text-[22px] font-extrabold text-text-primary tracking-tight tabular-nums">
              {currentKm} <span className="text-sm text-text-secondary font-normal">/ {targetKm} km</span>
            </p>
          </div>
          <ProgressRing percent={pct} />
        </div>
        <div className="h-2 rounded bg-purple-100 overflow-hidden">
          <div
            className="h-full rounded bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-text-muted">
            {Math.max(0, targetKm - currentKm).toFixed(1)} km remaining
          </span>
          <button
            onClick={() => setShowLogModal(true)}
            className="text-xs text-purple-600 font-semibold cursor-pointer bg-purple-100 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors min-h-[44px] flex items-center"
          >
            + Log activity
          </button>
        </div>
      </Card>

      {/* Log Activity Modal */}
      <LogActivityModal
        open={showLogModal}
        onClose={() => setShowLogModal(false)}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="!p-4">
          <p className="text-xs font-medium text-text-muted mb-1">Balance</p>
          <p className="text-[22px] font-extrabold text-text-primary tabular-nums tracking-tight">
            ${(balance + earned).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-success-500 font-semibold mt-0.5">+${earned.toFixed(2)} earned</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-text-muted mb-1">Current APY</p>
          <p className="text-[22px] font-extrabold text-purple-600 tabular-nums tracking-tight">{apy.toFixed(2)}%</p>
          <p className="text-xs text-text-muted mt-0.5">max 8% at 10🔥</p>
        </Card>
      </div>

      {/* APY Progression */}
      <Card>
        <p className="text-sm font-bold text-text-primary mb-4 tracking-tight">APY Progression</p>
        <div className="flex items-end gap-1.5 h-20">
          {apySteps.map((d) => (
            <div key={d.s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded"
                style={{
                  height: `${(d.a / 8.5) * 70}px`,
                  background: d.s <= streakCount
                    ? "linear-gradient(to top, #7c3aed, #a78bfa)"
                    : "#ede9fe",
                  border: d.s === streakCount ? "2px solid #7c3aed" : "none",
                  boxShadow: d.s === streakCount ? "0 0 8px rgba(124,58,237,0.3)" : "none",
                }}
              />
              <span
                className={`text-[8px] font-medium tabular-nums ${
                  d.s === streakCount ? "text-purple-600" : "text-text-muted"
                }`}
              >
                {d.s}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-text-muted">Streak weeks</span>
          <span className="text-[11px] text-purple-600 font-semibold tabular-nums">
            You are here: {streakCount}🔥
          </span>
        </div>
      </Card>

      {/* Friends Activity Preview */}
      <Card>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-text-primary tracking-tight">Friends Activity</span>
          <span className="text-xs text-purple-600 font-medium cursor-pointer">See all →</span>
        </div>
        {feed && feed.length > 0 ? (
          feed.map((f) => {
            const { text, emoji } = formatFeedEvent(f.eventType, f.payload as Record<string, unknown>);
            return (
              <div key={f.id} className="flex items-center gap-3 py-2 border-b border-purple-100/50 last:border-0">
                <Avatar initials={getInitials(f.user.displayName)} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-text-primary">
                    <span className="font-semibold">{f.user.displayName ?? "User"}</span>{" "}
                    {text}
                  </p>
                  <p className="text-[11px] text-text-muted">{timeAgo(f.createdAt)}</p>
                </div>
                <span className="text-lg">{emoji}</span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-text-muted py-2">No recent activity from friends.</p>
        )}
      </Card>
    </div>
  );
}
