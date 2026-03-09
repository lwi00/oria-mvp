"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { CardSkeleton } from "@/components/Skeleton";
import { useUser, useWalletBalance, useAppleHealthStatus, useConnectAppleHealth } from "@/lib/hooks";
import { useToast } from "@/components/Toast";
import { getInitials } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { usePrivy } from "@privy-io/react-auth";

export default function ProfilePage() {
  const { data: user, isLoading, refetch } = useUser();
  const { data: wallet } = useWalletBalance();
  const { toast } = useToast();
  const { logout } = usePrivy();
  const { data: healthStatus } = useAppleHealthStatus();
  const connectHealth = useConnectAppleHealth();

  const [displayName, setDisplayName] = useState("");
  const [goalType, setGoalType] = useState("running");
  const [targetKm, setTargetKm] = useState(10);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? "");
      setGoalType(user.goalType);
      setTargetKm(user.targetKm);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="pt-[2px] pb-2">
          <div className="h-7 w-24 animate-pulse bg-purple-100/60 rounded" />
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const walletAddr = wallet?.walletAddr;
  const truncatedAddr = walletAddr
    ? `${walletAddr.slice(0, 6)}...${walletAddr.slice(-4)}`
    : "No wallet connected";

  const handleCopy = () => {
    if (walletAddr) {
      navigator.clipboard.writeText(walletAddr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({ displayName, goalType, targetKm }),
      });
      await refetch();
      toast("Profile updated!");
    } catch {
      toast("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const activities = [
    { id: "running", label: "Running" },
    { id: "cycling", label: "Cycling" },
    { id: "steps", label: "Steps" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-[2px] pb-2">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Profile
        </h1>
      </div>

      {/* Avatar & Name */}
      <div className="flex flex-col items-center py-4">
        <div className="relative mb-4">
          <Avatar
            initials={getInitials(displayName || "User")}
            size={80}
            highlight
          />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-brand flex items-center justify-center shadow-button border-2 border-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        </div>
        <p className="text-lg font-bold text-text-primary">
          {displayName || "Set your name"}
        </p>
      </div>

      {/* Display Name */}
      <Card>
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
          Display name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl border border-oria bg-oria-bg text-[15px] text-text-primary focus:border-purple-600 outline-none"
        />
      </Card>

      {/* Goal Settings */}
      <Card>
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 block">
          Activity type
        </label>
        <div className="flex gap-2 mb-5">
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => setGoalType(a.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                goalType === a.id
                  ? "gradient-brand text-white shadow-button"
                  : "bg-purple-50 text-purple-600 border border-oria"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
          Weekly target
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTargetKm(Math.max(1, targetKm - 1))}
            className="w-10 h-10 rounded-lg bg-purple-50 border border-oria flex items-center justify-center text-purple-600 text-lg font-bold cursor-pointer flex-shrink-0"
          >
            -
          </button>
          <div className="flex-1 px-4 py-3 rounded-xl border border-oria bg-oria-bg text-center">
            <span className="text-xl font-extrabold text-text-primary tabular-nums">
              {targetKm}
            </span>
            <span className="text-sm text-text-muted font-medium ml-1">
              {goalType === "steps" ? "k steps" : "km"}
            </span>
          </div>
          <button
            onClick={() => setTargetKm(targetKm + 1)}
            className="w-10 h-10 rounded-lg bg-purple-50 border border-oria flex items-center justify-center text-purple-600 text-lg font-bold cursor-pointer flex-shrink-0"
          >
            +
          </button>
        </div>
      </Card>

      {/* Connected Apps */}
      <Card>
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 block">
          Connected apps
        </label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FC4C02]/10 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FC4C02">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-.956l2.09 4.128L3 0h4.138" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Strava</p>
                <p className="text-[11px] text-text-muted">Auto-sync activities</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-warning-500 bg-warning-100 px-2.5 py-1 rounded-md">
              Coming soon
            </span>
          </div>
          <div className="h-px bg-purple-100/50" />
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF2D55">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Apple Health
                </p>
                <p className="text-[11px] text-text-muted">Sync running activities</p>
              </div>
            </div>
            {healthStatus?.connected ? (
              <span className="text-[11px] font-semibold text-success-500 bg-success-100 px-2.5 py-1 rounded-md">
                ✓ Connected
              </span>
            ) : (
              <button
                onClick={() => {
                  connectHealth.mutate(undefined, {
                    onSuccess: () => toast("Apple Health connected!"),
                  });
                }}
                disabled={connectHealth.isPending}
                className="text-[11px] font-semibold text-white gradient-brand px-3 py-1.5 rounded-md cursor-pointer border-none shadow-button min-h-[32px] disabled:opacity-50"
              >
                {connectHealth.isPending ? "Connecting..." : "Connect"}
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Wallet Address */}
      <Card>
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
          Wallet address
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1 px-4 py-3 rounded-xl bg-oria-bg border border-oria">
            <span className="text-sm text-text-primary font-mono tabular-nums">
              {truncatedAddr}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="w-10 h-10 rounded-lg bg-purple-50 border border-oria flex items-center justify-center cursor-pointer flex-shrink-0"
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
          </button>
        </div>
      </Card>

      {/* Save & Sign Out */}
      <div className="flex flex-col gap-3 mt-2 pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-[52px] rounded-[14px] gradient-brand text-white font-semibold text-base shadow-button cursor-pointer border-none disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={async () => {
            await logout();
            document.cookie = "oria_onboarded=; path=/; max-age=0";
            window.location.href = "/";
          }}
          className="w-full py-3 text-sm text-error-500 font-medium cursor-pointer bg-transparent border-none"
        >
          Sign Out
        </button>
        <button
          onClick={() => {
            document.cookie = "oria_onboarded=; path=/; max-age=0";
            window.location.href = "/";
          }}
          className="w-full py-3 text-sm text-text-muted font-medium cursor-pointer bg-transparent border-none hover:text-text-secondary"
        >
          Reset Demo
        </button>
      </div>
    </div>
  );
}
