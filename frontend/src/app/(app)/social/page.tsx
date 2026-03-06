"use client";

import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { CardSkeleton } from "@/components/Skeleton";
import { useLeaderboard, useFeed } from "@/lib/hooks";
import { timeAgo, getInitials, formatFeedEvent } from "@/lib/utils";

export default function SocialPage() {
  const { data: board, isLoading: boardLoading } = useLeaderboard();
  const { data: feed, isLoading: feedLoading } = useFeed();

  if (boardLoading || feedLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="pt-[2px] pb-2">
          <div className="h-7 w-28 animate-pulse bg-purple-100/60 rounded" />
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-[2px] pb-2">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Friends</h1>
      </div>

      {/* Leaderboard */}
      <Card>
        <p className="text-base font-bold text-text-primary mb-4 tracking-tight">🏅 Friends Leaderboard</p>
        {board && board.length > 0 ? (
          board.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 p-3 rounded-[14px] mb-1.5 ${
                p.isMe ? "gradient-surface border border-purple-300/25" : ""
              }`}
            >
              <span className={`text-base font-bold w-6 text-center ${p.rank <= 3 ? "text-purple-600" : "text-text-muted"}`}>
                {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : `#${p.rank}`}
              </span>
              <Avatar initials={getInitials(p.displayName)} size={34} highlight={p.isMe} />
              <div className="flex-1">
                <p className={`text-sm ${p.isMe ? "font-bold" : "font-medium"} text-text-primary`}>
                  {p.displayName ?? "User"}{" "}
                  {p.isMe && <span className="text-[11px] text-purple-600 font-semibold">(you)</span>}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[15px] font-extrabold text-purple-600 tabular-nums">{p.streak}🔥</p>
                <p className="text-[11px] text-text-muted tabular-nums">{p.apy.toFixed(2)}%</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-muted py-2">Add friends to see the leaderboard.</p>
        )}
      </Card>

      {/* Activity Feed */}
      <Card>
        <p className="text-base font-bold text-text-primary mb-4 tracking-tight">📢 Activity Feed</p>
        {feed && feed.length > 0 ? (
          feed.map((f, i) => {
            const { text, emoji } = formatFeedEvent(f.eventType, f.payload as Record<string, unknown>);
            return (
              <div
                key={f.id}
                className={`flex gap-3 py-3 ${i < feed.length - 1 ? "border-b border-purple-100/50" : ""}`}
              >
                <Avatar initials={getInitials(f.user.displayName)} size={36} />
                <div className="flex-1">
                  <p className="text-sm text-text-primary leading-snug">
                    <span className="font-semibold">{f.user.displayName ?? "User"}</span>{" "}
                    {text} <span className="text-base">{emoji}</span>
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{timeAgo(f.createdAt)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-text-muted py-2">No activity yet. Start logging runs!</p>
        )}
      </Card>
    </div>
  );
}
