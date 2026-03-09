"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api";

// Types matching backend responses
interface Streak {
  id: string;
  userId: string;
  currentCount: number;
  longestCount: number;
  lastWeekMet: boolean;
  currentApy: number;
  currentWeek: {
    weekStart: string;
    distanceKm: number;
    goalMet: boolean;
  };
}

interface User {
  id: string;
  privyId: string;
  displayName: string | null;
  avatarUrl: string | null;
  goalType: string;
  targetKm: number;
  dataSource: string;
  streak: {
    currentCount: number;
    longestCount: number;
    currentApy: number;
    lastWeekMet: boolean;
  } | null;
}

interface Activity {
  id: string;
  userId: string;
  weekStart: string;
  distanceKm: number;
  source: string;
  goalMet: boolean;
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  streak: number;
  apy: number;
  isMe: boolean;
}

interface FeedEvent {
  id: string;
  userId: string;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
  user: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

interface Challenge {
  id: string;
  creatorId: string;
  title: string;
  description: string | null;
  goalKmWeek: number;
  startDate: string;
  endDate: string;
  maxMembers: number | null;
  status: string;
  members: Array<{
    id: string;
    userId: string;
    weeksMet: number;
    weeksTotal: number;
    user: {
      id: string;
      displayName: string | null;
      avatarUrl: string | null;
    };
  }>;
  _count: { members: number };
}

interface WalletBalance {
  walletAddr: string | null;
  balances: { USDC: number; AVAX: number };
  chain: string;
}

interface Earnings {
  totalDeposited: number;
  totalEarned: number;
  currentApy: number;
  projectedWeekly: number;
  projectedAnnual: number;
}

// Hooks
export function useUser() {
  return useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: () => apiFetch("/api/users/me"),
  });
}

export function useStreak() {
  return useQuery<Streak>({
    queryKey: ["streak", "me"],
    queryFn: () => apiFetch("/api/streaks/me"),
  });
}

export function useActivities(weeks = 12) {
  return useQuery<Activity[]>({
    queryKey: ["activities", weeks],
    queryFn: () => apiFetch(`/api/activities?weeks=${weeks}`),
  });
}

export function useLeaderboard() {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: () => apiFetch("/api/leaderboard"),
  });
}

export function useFeed(limit = 20) {
  return useQuery<FeedEvent[]>({
    queryKey: ["feed", limit],
    queryFn: () => apiFetch(`/api/feed?limit=${limit}`),
  });
}

export function useChallenges() {
  return useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: () => apiFetch("/api/challenges"),
  });
}

export function useWalletBalance() {
  return useQuery<WalletBalance>({
    queryKey: ["wallet", "balance"],
    queryFn: () => apiFetch("/api/wallet/balance"),
  });
}

export function useEarnings() {
  return useQuery<Earnings>({
    queryKey: ["wallet", "earnings"],
    queryFn: () => apiFetch("/api/wallet/earnings"),
  });
}

export function useLogActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { distanceKm: number }) =>
      apiFetch("/api/activities", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streak"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; token: string }) =>
      apiFetch("/api/wallet/deposit", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      goalKmWeek: number;
      durationWeeks: number;
      maxMembers?: number;
      description?: string;
    }) => {
      const startDate = new Date().toISOString();
      const endDate = new Date(
        Date.now() + data.durationWeeks * 7 * 86400_000,
      ).toISOString();
      return apiFetch("/api/challenges", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          goalKmWeek: data.goalKmWeek,
          startDate,
          endDate,
          maxMembers: data.maxMembers,
          description: data.description,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

// ── Apple Health ──
// Client-side only — no API route needed since this is a demo feature

export function useAppleHealthStatus() {
  return useQuery<{ connected: boolean }>({
    queryKey: ["apple-health"],
    queryFn: () => {
      if (typeof window === "undefined") return { connected: false };
      return { connected: localStorage.getItem("oria_apple_health") === "true" };
    },
    staleTime: Infinity,
  });
}

export function useConnectAppleHealth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.setItem("oria_apple_health", "true");
      return { connected: true };
    },
    onSuccess: () => {
      queryClient.setQueryData(["apple-health"], { connected: true });
    },
  });
}

export function useSyncAppleHealth() {
  const queryClient = useQueryClient();
  return useMutation<{ distanceKm: number }>({
    mutationFn: async () => {
      const distanceKm = parseFloat((Math.random() * 2.5 + 3).toFixed(1));
      await apiFetch("/api/activities", {
        method: "POST",
        body: JSON.stringify({ distanceKm }),
      });
      return { distanceKm };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streak"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId: string) =>
      apiFetch(`/api/challenges/${challengeId}/join`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}
