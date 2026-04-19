"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { QuickAction } from "@/components/QuickAction";
import { ProgressRing } from "@/components/ProgressRing";
import { CardSkeleton, ErrorCard } from "@/components/Skeleton";
import { LogActivityModal } from "@/components/LogActivityModal";
import { Celebration } from "@/components/Celebration";
import { RunWelcome } from "@/components/RunWelcome";
import {
  useUser, useStreak, useFeed, useEarnings,
  useStravaStatus, useStravaSync, useLastRun,
  useFriendsWeekly, useActivities,
} from "@/lib/hooks";
import { ProgressChart } from "@/components/ProgressChart";
import { useToast } from "@/components/Toast";
import { timeAgo, getInitials, formatFeedEvent } from "@/lib/utils";

export default function DashboardPage() {
  const { data: user, isLoading: userLoading, isError: userError, refetch: refetchUser } = useUser();
  const { data: streak, isLoading: streakLoading, isError: streakError, refetch: refetchStreak } = useStreak();
  const { data: feed } = useFeed(3);
  const { data: earnings } = useEarnings();
  const { data: friendsWeekly } = useFriendsWeekly();
  const { data: activities } = useActivities(8);
  const { data: stravaStatus } = useStravaStatus();
  const stravaSync = useStravaSync();
  const { data: lastRunData } = useLastRun();
  const { toast } = useToast();

  const [showLogModal, setShowLogModal] = useState(false);
  const [showSyncCelebration, setShowSyncCelebration] = useState(false);
  const [syncedKm, setSyncedKm] = useState(0);
  const [showRunWelcome, setShowRunWelcome] = useState(false);
  const welcomeChecked = useRef(false);
  const autoSynced = useRef(false);

  // Show celebration when there's new distance since last time we celebrated
  useEffect(() => {
    if (welcomeChecked.current || !streak) return;
    welcomeChecked.current = true;
    const currentKm = streak.currentWeek?.distanceKm ?? 0;
    if (currentKm <= 0) return;
    const stored = parseFloat(localStorage.getItem("oria_celebrated_km") ?? "0");
    if (currentKm > stored) {
      setShowRunWelcome(true);
      localStorage.setItem("oria_celebrated_km", String(currentKm));
    }
  }, [streak]);

  // Auto-sync Strava on dashboard load (once per session)
  useEffect(() => {
    if (stravaStatus?.connected && !autoSynced.current && !stravaSync.isPending) {
      autoSynced.current = true;
      stravaSync.mutate(undefined);
    }
  }, [stravaStatus?.connected]); // eslint-disable-line react-hooks/exhaustive-deps

  if (userLoading || streakLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="pt-1 pb-2">
          <div className="h-4 w-28 skeleton-shimmer rounded" />
          <div className="h-10 w-44 skeleton-shimmer rounded mt-2" />
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (userError || streakError) {
    return (
      <div className="flex flex-col gap-4">
        <div className="pt-1 pb-2">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Home</h1>
        </div>
        <ErrorCard onRetry={() => { refetchUser(); refetchStreak(); }} />
      </div>
    );
  }

  const displayName = user?.displayName?.split(" ")[0] ?? "there";
  const streakCount = streak?.currentCount ?? 0;
  const apy = streak?.currentApy ?? 4.0;
  const effectiveApy = streak?.effectiveApy ?? apy;
  const targetKm = user?.targetKm ?? 10;
  const currentKm = streak?.currentWeek?.distanceKm ?? 0;
  const pct = Math.min(100, Math.round((currentKm / targetKm) * 100));
  const balance = (earnings?.totalDeposited ?? 0) + (earnings?.totalEarned ?? 0);
  const earned = earnings?.totalEarned ?? 0;

  const [intPart, decPartRaw] = balance.toFixed(2).split(".");
  const intWithCommas = Number(intPart).toLocaleString();


  return (
    <div className="flex flex-col gap-4">
      {/* Greeting + Balance Hero */}
      <section className="pt-2 pb-1">
        <p className="text-[13px] text-text-secondary font-medium">
          Hello, <span className="text-text-primary">{displayName}</span>
        </p>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-[15px] text-text-muted font-medium mr-1">$</span>
          <span className="text-[48px] font-extrabold text-text-primary leading-none tracking-tight tabular-nums">
            {intWithCommas}
          </span>
          <span className="text-[22px] text-text-muted font-bold tabular-nums">.{decPartRaw}</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-[13px]">
          <span className="text-success-500 font-semibold tabular-nums">
            +${earned.toFixed(2)}
          </span>
          <span className="text-text-muted">total earned</span>
          <Link href="/apy" className="ml-auto px-2.5 py-1 rounded-full bg-accent-purple/15 border border-accent-purple/25 text-accent-purple-bright text-[11px] font-semibold tabular-nums active:scale-95 transition-transform flex items-center gap-1">
            {effectiveApy.toFixed(2)}% APY
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </Link>
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-4 gap-2 py-2">
        <QuickAction
          label="Log run"
          tint="sport"
          onClick={() => setShowLogModal(true)}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13" cy="4" r="2" />
              <path d="M4 22l4-6 4 3 4-7 4 4" />
              <path d="M11 14l-1-4 4-3 3 4" />
            </svg>
          }
        />
        <QuickAction
          label="Deposit"
          tint="gold"
          href="/wallet"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
        />
        <QuickAction
          label="Invite"
          tint="purple"
          href="/social"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
          }
        />
        <QuickAction
          label="Stats"
          tint="neutral"
          href="/challenges"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 14l4-4 3 3 5-6" />
            </svg>
          }
        />
      </section>

      {/* Streak Hero */}
      <Link href="/streak" className="block">
        <Card className="relative overflow-hidden !p-5 cursor-pointer active:scale-[0.98] transition-transform">
          <div className="absolute -top-16 -right-10 w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(252,76,2,0.25)_0%,transparent_60%)] blur-[20px] pointer-events-none" />
          <div className="flex items-center gap-4 relative">
            <div className="w-[82px] h-[82px] rounded-full gradient-sport flex items-center justify-center shadow-sport-glow flex-shrink-0">
              <span className="text-[42px] font-extrabold text-white leading-none tracking-tight tabular-nums">
                {streakCount}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sport">
                Current streak
              </p>
              <p className="text-[17px] font-bold text-text-primary mt-0.5">
                {streakCount === 0
                  ? "Start your streak this week"
                  : `${streakCount} week${streakCount > 1 ? "s" : ""} strong`}
              </p>
              <p className="text-[12px] text-text-secondary mt-0.5">
                {streakCount >= 10
                  ? `Max base APY — ${effectiveApy > 8 ? `${effectiveApy.toFixed(2)}% with bonuses` : "8.00%"}`
                  : `${(8 - apy).toFixed(2)}% to unlock max base APY`}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted flex-shrink-0"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </Card>
      </Link>

      {/* This week progress */}
      <Card className="!p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              This week
            </p>
            <p className="text-[24px] font-extrabold text-text-primary mt-1 tabular-nums leading-none">
              {currentKm.toFixed(1)}
              <span className="text-[14px] text-text-secondary font-medium"> / {targetKm} km</span>
            </p>
          </div>
          <ProgressRing percent={pct} />
        </div>
        <div className="h-1.5 rounded-full bg-oria-chip overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-sport to-accent-gold animate-bar"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-[12px] text-text-muted">
            {Math.max(0, targetKm - currentKm).toFixed(1)} km remaining
            {stravaStatus?.connected && (
              <span className="text-accent-sport ml-1">· via Strava</span>
            )}
          </span>
          {stravaStatus?.connected && (
            <button
              onClick={() =>
                stravaSync.mutate(undefined, {
                  onSuccess: (d) => {
                    if (d.synced > 0 && d.lastRun) {
                      setSyncedKm(d.lastRun.distanceKm);
                      setShowSyncCelebration(true);
                    } else {
                      toast(`Synced ${d.synced} weeks from Strava`);
                    }
                  },
                  onError: () => toast("Sync failed", "error"),
                })
              }
              disabled={stravaSync.isPending}
              className="text-[11px] font-semibold text-accent-purple-bright cursor-pointer bg-accent-purple/15 border border-accent-purple/25 px-3 py-1.5 rounded-full min-h-[32px] flex items-center gap-1.5 disabled:opacity-50"
            >
              {stravaSync.isPending ? (
                <span className="inline-block w-3 h-3 border-2 border-accent-purple-bright/30 border-t-accent-purple-bright rounded-full animate-spin" />
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                </svg>
              )}
              Sync
            </button>
          )}
        </div>
        <Link href="/activities" className="flex items-center justify-center gap-1 mt-3 pt-2 border-t border-oria text-[12px] text-accent-purple-bright font-semibold">
          View all activities
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </Link>
      </Card>

      {/* Progress chart */}
      {activities && activities.length >= 2 && (
        <Card className="!p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">
            Weekly progress
          </p>
          <ProgressChart data={activities} targetKm={targetKm} />
        </Card>
      )}

      {/* Last run */}
      {lastRunData?.lastRun && (
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-sport/15 border border-accent-sport/25 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FC4C02">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-.956l2.09 4.128L3 0h4.138" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Last activity
              </p>
              <p className="text-[14px] font-semibold text-text-primary truncate">{lastRunData.lastRun.name}</p>
              <p className="text-[11px] text-text-muted">{new Date(lastRunData.lastRun.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[20px] font-extrabold text-text-primary tabular-nums leading-none">
                {lastRunData.lastRun.distanceKm}<span className="text-[12px] text-text-muted font-medium"> km</span>
              </p>
              <p className="text-[11px] text-text-muted tabular-nums mt-0.5">
                {Math.floor(lastRunData.lastRun.movingTimeSec / 60)} min
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Weekly consistency — you + friends */}
      {friendsWeekly && friendsWeekly.length > 0 && (
        <Card className="!p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-text-primary tracking-tight">Weekly consistency</p>
            <Link href="/social" className="text-[12px] text-accent-purple-bright font-semibold hover:text-accent-purple">
              See all →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {friendsWeekly.slice(0, 5).map((f) => {
              const pctF = Math.min(100, Math.round((f.distanceKm / f.targetKm) * 100));
              return (
                <div key={f.id} className={`rounded-xl ${f.isMe ? "bg-accent-purple/8 border border-accent-purple/15 p-2.5" : "p-0.5"}`}>
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={getInitials(f.displayName)} size={28} highlight={f.isMe} />
                    <span className="text-[13px] font-semibold text-text-primary flex-1 truncate">
                      {f.isMe ? "You" : (f.displayName ?? "User")}
                    </span>
                    <span className="text-[12px] font-bold tabular-nums text-text-primary">
                      {f.distanceKm.toFixed(1)}
                      <span className="text-text-muted font-medium">/{f.targetKm}</span>
                    </span>
                    {f.goalMet ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <span className="text-[11px] font-semibold text-text-muted tabular-nums w-[14px] text-center">
                        {pctF}%
                      </span>
                    )}
                  </div>
                  <div className="h-1 rounded-full bg-oria-chip overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full animate-bar ${f.goalMet ? "bg-success-500" : "bg-gradient-to-r from-accent-sport to-accent-gold"}`}
                      style={{ width: `${pctF}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Coaching plan */}
      {(() => {
        const sessionsPerWeek = Math.max(3, Math.min(5, Math.ceil(targetKm / 3)));
        const longRunTarget = Math.round(targetKm * 0.4 * 10) / 10;
        const nextMonthTarget = Math.round(targetKm * 1.1 * 10) / 10;
        const weekSessions = streak?.weekSessions ?? 0;
        const monthPace = streak?.monthAvgPace ?? 0;
        const remainingKm = Math.max(0, targetKm - currentKm);
        const daysLeft = 7 - new Date().getUTCDay() + (new Date().getUTCDay() === 0 ? 0 : 1);
        const remainingSessions = Math.max(1, sessionsPerWeek - weekSessions);
        const goalDone = currentKm >= targetKm;

        return (
          <>
            {/* Next run CTA */}
            <Card className={`!p-0 overflow-hidden ${goalDone ? "border-success-500/30" : ""}`}>
              <div className={`px-5 py-4 ${goalDone ? "bg-success-500/8" : "bg-gradient-to-r from-accent-sport/8 to-transparent"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      {goalDone ? "Goal complete" : "Next run"}
                    </p>
                    <p className="text-[22px] font-extrabold text-text-primary mt-1 leading-none tabular-nums">
                      {goalDone ? (
                        <span className="text-success-500">Done</span>
                      ) : (
                        <>{(remainingKm / remainingSessions).toFixed(1)}<span className="text-[14px] text-text-muted font-semibold"> km</span></>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {!goalDone && (
                      <>
                        <p className="text-[13px] font-bold text-text-primary tabular-nums">
                          {remainingSessions} run{remainingSessions > 1 ? "s" : ""} left
                        </p>
                        <p className="text-[11px] text-text-muted tabular-nums">
                          {daysLeft}d remaining
                        </p>
                      </>
                    )}
                    {goalDone && (
                      <div className="w-10 h-10 rounded-full bg-success-500/15 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Weekly plan + projection */}
            <div className="grid grid-cols-2 gap-3">
              {/* Optimal split */}
              <Card className="!p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-purple-bright">Plan</p>
                <p className="text-[20px] font-extrabold text-text-primary mt-1 leading-none tabular-nums">
                  <span className="animate-count-pop inline-block">{weekSessions}</span>
                  <span className="text-[12px] text-text-muted font-semibold">/{sessionsPerWeek}</span>
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${(streak?.weekLongestRun ?? 0) >= longRunTarget ? "bg-success-500" : "bg-accent-sport"}`} />
                    <span className={`text-[11px] ${(streak?.weekLongestRun ?? 0) >= longRunTarget ? "text-success-500 line-through" : "text-text-secondary"}`}>
                      1 long: {longRunTarget} km
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${weekSessions >= sessionsPerWeek ? "bg-success-500" : "bg-accent-purple"}`} />
                    <span className={`text-[11px] ${weekSessions >= sessionsPerWeek - 1 ? "text-success-500" : "text-text-secondary"}`}>
                      {Math.max(0, sessionsPerWeek - 1 - Math.max(0, weekSessions - 1))} easy left
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: sessionsPerWeek }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < weekSessions ? "bg-accent-sport animate-bar" : "bg-oria-chip"}`}
                      style={i < weekSessions ? { animationDelay: `${i * 0.1}s` } : undefined}
                    />
                  ))}
                </div>
              </Card>

              {/* Next month projection */}
              <Card className="!p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-gold">Next month</p>
                <p className="text-[20px] font-extrabold text-text-primary mt-1 leading-none tabular-nums">
                  {nextMonthTarget}<span className="text-[12px] text-text-muted font-semibold"> km/wk</span>
                </p>
                <p className="text-[11px] text-text-secondary mt-2">
                  +10% progressive overload
                </p>
                {monthPace > 0 ? (
                  <p className="text-[11px] text-text-muted mt-1 tabular-nums">
                    Pace: {monthPace.toFixed(1)} min/km
                  </p>
                ) : (
                  <p className="text-[11px] text-text-muted mt-1">
                    Expect 5-8% pace gain
                  </p>
                )}
                <div className="mt-2 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  </svg>
                  <span className="text-[10px] text-text-muted">Buist et al. 2010</span>
                </div>
              </Card>
            </div>
          </>
        );
      })()}

      {/* Log Activity Modal */}
      <LogActivityModal open={showLogModal} onClose={() => setShowLogModal(false)} />

      {/* Strava sync celebration */}
      <Celebration
        show={showSyncCelebration}
        onDone={() => setShowSyncCelebration(false)}
        streakCount={streakCount}
        distanceKm={syncedKm}
        goalMet={currentKm + syncedKm >= targetKm}
      />

      {/* Friends activity */}
      <Card className="!p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-text-primary tracking-tight">Friends activity</span>
          <Link href="/social" className="text-[12px] text-accent-purple-bright font-semibold hover:text-accent-purple">
            See all →
          </Link>
        </div>
        {feed && feed.length > 0 ? (
          feed.map((f, i) => {
            const { text, emoji } = formatFeedEvent(f.eventType, f.payload as Record<string, unknown>);
            return (
              <div key={f.id} className={`flex items-center gap-3 py-2.5 ${i < feed.length - 1 ? "border-b border-oria" : ""}`}>
                <Avatar initials={getInitials(f.user.displayName)} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-text-primary leading-snug">
                    <span className="font-semibold">{f.user.displayName ?? "User"}</span>{" "}
                    <span className="text-text-secondary">{text}</span>
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">{timeAgo(f.createdAt)}</p>
                </div>
                <span className="text-base">{emoji}</span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-text-muted py-2">No recent activity from friends yet.</p>
        )}
      </Card>

      {/* Run welcome celebration — shows on app open if new km */}
      {showRunWelcome && (
        <RunWelcome
          distanceKm={currentKm}
          targetKm={targetKm}
          streakCount={streakCount}
          goalMet={currentKm >= targetKm}
          onDone={() => setShowRunWelcome(false)}
        />
      )}
    </div>
  );
}
