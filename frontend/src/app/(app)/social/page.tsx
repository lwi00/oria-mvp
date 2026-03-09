"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { CardSkeleton } from "@/components/Skeleton";
import { useLeaderboard, useFeed, useDiscoverUsers, useSendFriendRequest } from "@/lib/hooks";
import { useToast } from "@/components/Toast";
import { timeAgo, getInitials, formatFeedEvent } from "@/lib/utils";

export default function SocialPage() {
  const { data: board, isLoading: boardLoading } = useLeaderboard();
  const { data: feed, isLoading: feedLoading } = useFeed();
  const { data: discoverUsers } = useDiscoverUsers();
  const sendRequest = useSendFriendRequest();
  const { toast } = useToast();

  const [showAddFriend, setShowAddFriend] = useState(false);

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
      <div className="pt-[2px] pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Friends</h1>
        <button
          onClick={() => setShowAddFriend(true)}
          className="text-sm font-semibold px-4 py-2 rounded-md gradient-brand text-white shadow-button hover:shadow-[0_8px_28px_rgba(124,58,237,0.4)] transition-shadow min-h-[44px] flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 8v6M22 11h-6" />
          </svg>
          Add Friend
        </button>
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-[340px] shadow-card-hover max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-text-primary">Add Friends</h3>
              <button
                onClick={() => setShowAddFriend(false)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl leading-none p-1"
              >
                x
              </button>
            </div>

            {discoverUsers && discoverUsers.length > 0 ? (
              <div className="flex flex-col gap-2">
                {discoverUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-[14px] bg-oria-section">
                    <Avatar initials={getInitials(u.displayName ?? "?")} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{u.displayName ?? "User"}</p>
                      <p className="text-xs text-text-muted">
                        {u.streak ? `${u.streak.currentCount}🔥 · ${u.streak.currentApy.toFixed(1)}% APY` : "New user"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        sendRequest.mutate(u.id, {
                          onSuccess: () => {
                            toast(`Friend request sent to ${u.displayName}`);
                          },
                          onError: () => toast("Failed to send request", "error"),
                        });
                      }}
                      disabled={sendRequest.isPending}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full gradient-brand text-white shadow-[0_2px_8px_rgba(124,58,237,0.2)] hover:shadow-button transition-shadow min-h-[36px] disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted py-4 text-center">No new people to add right now.</p>
            )}

            <button
              onClick={() => setShowAddFriend(false)}
              className="w-full mt-4 py-3 rounded-md border border-oria text-text-secondary font-medium text-sm min-h-[44px]"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
          <div className="text-center py-6">
            <p className="text-3xl mb-2">👥</p>
            <p className="text-sm text-text-muted">No friends yet.</p>
            <button
              onClick={() => setShowAddFriend(true)}
              className="text-sm text-purple-600 font-semibold mt-2 hover:underline"
            >
              Find people to add →
            </button>
          </div>
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
          <div className="text-center py-6">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm text-text-muted">Your friends&apos; activity will appear here.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
