"use client";

import { useState } from "react";
import { useLogActivity, useUser, useAppleHealthStatus } from "@/lib/hooks";
import { useToast } from "@/components/Toast";

interface LogActivityModalProps {
  open: boolean;
  onClose: () => void;
}

export function LogActivityModal({ open, onClose }: LogActivityModalProps) {
  const { data: user } = useUser();
  const logActivity = useLogActivity();
  const { toast } = useToast();
  const { data: healthStatus } = useAppleHealthStatus();

  const [km, setKm] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  if (!open) return null;

  const goalType = user?.goalType ?? "running";
  const goalLabel =
    goalType === "cycling"
      ? "Cycling"
      : goalType === "steps"
        ? "Steps"
        : "Running";

  const handleSubmit = () => {
    if (!km) return;
    logActivity.mutate(
      { distanceKm: parseFloat(km), weekStart: date },
      {
        onSuccess: () => {
          toast(`Logged ${km} km!`);
          setKm("");
          onClose();
        },
        onError: () => toast("Failed to log activity", "error"),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-[390px] bg-white rounded-t-2xl sm:rounded-2xl p-6 pb-8 shadow-card-hover animate-[slideUp_0.3s_ease-out]">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-purple-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Log Activity
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center border-none cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Activity type badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="px-3 py-1.5 rounded-lg gradient-brand">
            <span className="text-xs font-semibold text-white">
              {goalLabel}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-oria">
            <span className="text-xs font-medium text-text-muted">
              Manual entry
            </span>
          </div>
          {healthStatus?.connected ? (
            <div className="px-3 py-1.5 rounded-lg gradient-brand">
              <span className="text-xs font-semibold text-white">
                Apple Health
              </span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 opacity-50">
              <span className="text-xs font-medium text-text-muted">
                Strava
              </span>
            </div>
          )}
        </div>

        {/* Distance input */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
            Distance
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder="0.0"
              autoFocus
              className="w-full px-5 py-4 rounded-xl border border-oria bg-oria-bg text-[28px] font-extrabold text-text-primary focus:border-purple-600 outline-none tabular-nums tracking-tight pr-16"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-base font-semibold text-text-muted">
              km
            </span>
          </div>
        </div>

        {/* Date selector */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-oria bg-oria-bg text-sm text-text-primary focus:border-purple-600 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!km || logActivity.isPending}
          className="w-full h-[52px] rounded-[14px] gradient-brand text-white font-semibold text-base shadow-button cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {logActivity.isPending ? "Saving..." : "Log Activity"}
        </button>
      </div>
    </div>
  );
}
