"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { CardSkeleton } from "@/components/Skeleton";
import { useChallenges, useCreateChallenge, useJoinChallenge, useUser } from "@/lib/hooks";
import { getInitials, daysUntil } from "@/lib/utils";
import { useToast } from "@/components/Toast";

export default function ChallengesPage() {
  const { data: challenges, isLoading } = useChallenges();
  const { data: user } = useUser();
  const createChallenge = useCreateChallenge();
  const joinChallenge = useJoinChallenge();
  const { toast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [goalKm, setGoalKm] = useState("");
  const [duration, setDuration] = useState("4");
  const [maxMembers, setMaxMembers] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="pt-[2px] pb-2">
          <div className="h-7 w-36 animate-pulse bg-purple-100/60 rounded" />
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const resetForm = () => {
    setTitle("");
    setGoalKm("");
    setDuration("4");
    setMaxMembers("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-[2px] pb-2">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Challenges</h1>
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className="w-full p-4 rounded-lg border-2 border-dashed border-purple-300/40 bg-oria-section text-purple-600 font-semibold text-[15px] cursor-pointer hover:border-purple-400/60 transition-colors min-h-[44px]"
      >
        + Create Challenge
      </button>

      {/* Create Challenge Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-[340px] shadow-card-hover">
            <h3 className="text-lg font-bold text-text-primary mb-4">New Challenge</h3>

            <label className="text-sm text-text-secondary mb-1 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer 10K Challenge"
              className="w-full px-4 py-3 rounded-md border border-oria bg-white/80 text-[15px] focus:border-purple-600 outline-none mb-3"
            />

            <label className="text-sm text-text-secondary mb-1 block">Weekly goal (km)</label>
            <input
              type="number"
              step="1"
              min="1"
              value={goalKm}
              onChange={(e) => setGoalKm(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-4 py-3 rounded-md border border-oria bg-white/80 text-[15px] focus:border-purple-600 outline-none mb-3 tabular-nums"
            />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Duration (weeks)</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="52"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-oria bg-white/80 text-[15px] focus:border-purple-600 outline-none tabular-nums"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Max members</label>
                <input
                  type="number"
                  step="1"
                  min="2"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(e.target.value)}
                  placeholder="No limit"
                  className="w-full px-4 py-3 rounded-md border border-oria bg-white/80 text-[15px] focus:border-purple-600 outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowCreate(false); resetForm(); }}
                className="flex-1 py-3 rounded-md border border-oria text-text-secondary font-medium text-sm min-h-[44px]"
              >
                Cancel
              </button>
              <button
                disabled={!title || !goalKm || createChallenge.isPending}
                onClick={() => {
                  createChallenge.mutate(
                    {
                      title,
                      goalKmWeek: parseFloat(goalKm),
                      durationWeeks: parseInt(duration) || 4,
                      ...(maxMembers ? { maxMembers: parseInt(maxMembers) } : {}),
                    },
                    {
                      onSuccess: () => {
                        setShowCreate(false);
                        resetForm();
                        toast("Challenge created!");
                      },
                      onError: () => toast("Failed to create challenge", "error"),
                    },
                  );
                }}
                className="flex-1 py-3 rounded-md gradient-brand text-white font-semibold text-sm shadow-button disabled:opacity-50 min-h-[44px]"
              >
                {createChallenge.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {challenges && challenges.length > 0 ? (
        challenges.map((c) => {
          const memberCount = c._count.members;
          const ends = daysUntil(c.endDate);
          const avgProgress =
            c.members.length > 0
              ? c.members.reduce((sum, m) => sum + (m.weeksTotal > 0 ? m.weeksMet / m.weeksTotal : 0), 0) / c.members.length
              : 0;

          return (
            <Card key={c.id}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-base font-bold text-text-primary tracking-tight">{c.title}</p>
                  <p className="text-[13px] text-text-muted mt-0.5">
                    {c.goalKmWeek} km/week · ends in {ends}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-sm bg-purple-100 text-xs text-purple-600 font-semibold tabular-nums">
                  {memberCount}/{c.maxMembers ?? "..."}
                </div>
              </div>

              <div className="h-2 rounded bg-purple-100 overflow-hidden mb-3">
                <div
                  className="h-full rounded bg-gradient-to-r from-purple-600 to-purple-400"
                  style={{ width: `${Math.round(avgProgress * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex">
                  {c.members.slice(0, 4).map((m, i) => (
                    <div key={m.id} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i }}>
                      <Avatar initials={getInitials(m.user.displayName)} size={28} />
                    </div>
                  ))}
                  {memberCount > 4 && (
                    <div
                      className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-semibold text-purple-600"
                      style={{ marginLeft: -8 }}
                    >
                      +{memberCount - 4}
                    </div>
                  )}
                </div>
                {user && !c.members.some((m) => m.userId === user.id) && (
                  <button
                    onClick={() =>
                      joinChallenge.mutate(c.id, {
                        onSuccess: () => toast("Joined challenge!"),
                        onError: () => toast("Failed to join", "error"),
                      })
                    }
                    disabled={joinChallenge.isPending}
                    className="text-xs text-purple-600 font-semibold bg-purple-100 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors min-h-[44px] flex items-center cursor-pointer"
                  >
                    Join
                  </button>
                )}
              </div>
            </Card>
          );
        })
      ) : (
        <Card>
          <p className="text-sm text-text-muted">No active challenges. Create one to get started!</p>
        </Card>
      )}
    </div>
  );
}
