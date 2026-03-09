// In-memory mock data store for demo mode
// State is mutable so mutations (log activity, deposit, etc.) feel real during the demo

const now = new Date();
const weekStart = new Date(now);
weekStart.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7)); // Monday
weekStart.setUTCHours(0, 0, 0, 0);

function apyFromStreak(s: number): number {
  return 4 + 4 * Math.min(1, Math.log(1 + s) / Math.log(11));
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function weeksFromNow(w: number): string {
  return new Date(Date.now() + w * 7 * 86400_000).toISOString();
}

// ── User ──
export const mockUser = {
  id: "u-demo-001",
  privyId: "privy-demo-001",
  displayName: "Alex Runner",
  avatarUrl: null,
  goalType: "running",
  targetKm: 10,
  dataSource: "manual",
  streak: {
    currentCount: 4,
    longestCount: 6,
    currentApy: apyFromStreak(4),
    lastWeekMet: true,
  },
};

// ── Streak ──
export const mockStreak = {
  id: "s-demo-001",
  userId: mockUser.id,
  currentCount: 4,
  longestCount: 6,
  lastWeekMet: true,
  currentApy: apyFromStreak(4),
  currentWeek: {
    weekStart: weekStart.toISOString(),
    distanceKm: 6.2,
    goalMet: false,
  },
};

// ── Activities ──
export const mockActivities = [
  { id: "a-1", userId: mockUser.id, weekStart: weekStart.toISOString(), distanceKm: 6.2, source: "manual", goalMet: false },
];

// ── Friends for leaderboard + feed ──
const friends = [
  { id: "u-f1", displayName: "Sarah Chen", avatarUrl: null },
  { id: "u-f2", displayName: "Marcus Lee", avatarUrl: null },
  { id: "u-f3", displayName: "Priya Patel", avatarUrl: null },
  { id: "u-f4", displayName: "James Wilson", avatarUrl: null },
  { id: "u-f5", displayName: "Lea Martin", avatarUrl: null },
];

// ── Leaderboard ──
export const mockLeaderboard = [
  { rank: 1, id: friends[0].id, displayName: friends[0].displayName, avatarUrl: null, streak: 8, apy: apyFromStreak(8), isMe: false },
  { rank: 2, id: friends[1].id, displayName: friends[1].displayName, avatarUrl: null, streak: 6, apy: apyFromStreak(6), isMe: false },
  { rank: 3, id: mockUser.id, displayName: mockUser.displayName, avatarUrl: null, streak: 4, apy: apyFromStreak(4), isMe: true },
  { rank: 4, id: friends[2].id, displayName: friends[2].displayName, avatarUrl: null, streak: 3, apy: apyFromStreak(3), isMe: false },
  { rank: 5, id: friends[3].id, displayName: friends[3].displayName, avatarUrl: null, streak: 2, apy: apyFromStreak(2), isMe: false },
  { rank: 6, id: friends[4].id, displayName: friends[4].displayName, avatarUrl: null, streak: 1, apy: apyFromStreak(1), isMe: false },
];

// ── Feed ──
export const mockFeed = [
  { id: "fe-1", userId: friends[0].id, eventType: "streak_milestone", payload: { streakCount: 8 }, createdAt: hoursAgo(1), user: friends[0] },
  { id: "fe-2", userId: friends[1].id, eventType: "goal_met", payload: { distanceKm: 12.5 }, createdAt: hoursAgo(3), user: friends[1] },
  { id: "fe-3", userId: friends[2].id, eventType: "deposit", payload: { amount: 500, token: "USDC" }, createdAt: hoursAgo(5), user: friends[2] },
  { id: "fe-4", userId: mockUser.id, eventType: "goal_met", payload: { distanceKm: 10 }, createdAt: hoursAgo(26), user: { id: mockUser.id, displayName: mockUser.displayName, avatarUrl: null } },
  { id: "fe-5", userId: friends[3].id, eventType: "challenge_joined", payload: { title: "March Madness 5K" }, createdAt: hoursAgo(30), user: friends[3] },
  { id: "fe-6", userId: friends[4].id, eventType: "streak_lost", payload: { previousCount: 3 }, createdAt: hoursAgo(48), user: friends[4] },
  { id: "fe-7", userId: friends[0].id, eventType: "goal_met", payload: { distanceKm: 15 }, createdAt: hoursAgo(50), user: friends[0] },
  { id: "fe-8", userId: friends[1].id, eventType: "deposit", payload: { amount: 1000, token: "USDC" }, createdAt: hoursAgo(72), user: friends[1] },
];

// ── Challenges ──
export const mockChallenges = [
  {
    id: "ch-1",
    creatorId: friends[0].id,
    title: "March Madness 5K",
    description: null,
    goalKmWeek: 5,
    startDate: hoursAgo(14 * 24),
    endDate: weeksFromNow(2),
    maxMembers: 10,
    status: "active",
    members: [
      { id: "cm-1", userId: friends[0].id, weeksMet: 2, weeksTotal: 2, user: friends[0] },
      { id: "cm-2", userId: mockUser.id, weeksMet: 1, weeksTotal: 2, user: { id: mockUser.id, displayName: mockUser.displayName, avatarUrl: null } },
      { id: "cm-3", userId: friends[2].id, weeksMet: 2, weeksTotal: 2, user: friends[2] },
      { id: "cm-4", userId: friends[3].id, weeksMet: 1, weeksTotal: 2, user: friends[3] },
    ],
    _count: { members: 4 },
  },
  {
    id: "ch-2",
    creatorId: mockUser.id,
    title: "Spring Runners Club",
    description: null,
    goalKmWeek: 10,
    startDate: hoursAgo(7 * 24),
    endDate: weeksFromNow(5),
    maxMembers: 6,
    status: "active",
    members: [
      { id: "cm-5", userId: mockUser.id, weeksMet: 1, weeksTotal: 1, user: { id: mockUser.id, displayName: mockUser.displayName, avatarUrl: null } },
      { id: "cm-6", userId: friends[1].id, weeksMet: 1, weeksTotal: 1, user: friends[1] },
    ],
    _count: { members: 2 },
  },
];

// ── Wallet / Earnings ──
export const mockWallet = {
  walletAddr: "0x7a3B...dE4F",
  balances: { USDC: 0, AVAX: 0 },
  chain: "Avalanche C-Chain (Fuji)",
};

export const mockEarnings = {
  totalDeposited: 0,
  totalEarned: 0,
  currentApy: apyFromStreak(4),
  projectedWeekly: 0,
  projectedAnnual: 0,
};

// ── Deposit ledger ──
interface MockDeposit {
  id: string;
  amount: number;
  token: string;
  status: string;
  createdAt: string;
  txHash: string | null;
}

const mockDeposits: MockDeposit[] = [];
let depositCounter = 0;

export function getDeposits(): MockDeposit[] {
  return mockDeposits;
}

export function recalcEarnings() {
  const now = Date.now();
  let totalYield = 0;
  for (const d of mockDeposits) {
    const elapsed = (now - new Date(d.createdAt).getTime()) / (1000 * 86400 * 365);
    totalYield += d.amount * (mockEarnings.currentApy / 100) * elapsed;
  }
  mockEarnings.totalEarned = parseFloat(totalYield.toFixed(2));
  mockEarnings.projectedWeekly = parseFloat(
    ((mockEarnings.totalDeposited * mockEarnings.currentApy / 100) / 52).toFixed(2),
  );
  mockEarnings.projectedAnnual = parseFloat(
    (mockEarnings.totalDeposited * mockEarnings.currentApy / 100).toFixed(2),
  );
}

// ── Mutation helpers (modify in-memory state) ──
let feedCounter = 100;

export function logActivity(distanceKm: number) {
  mockStreak.currentWeek.distanceKm += distanceKm;
  if (mockStreak.currentWeek.distanceKm >= mockUser.targetKm) {
    mockStreak.currentWeek.goalMet = true;
  }

  mockFeed.unshift({
    id: `fe-${++feedCounter}`,
    userId: mockUser.id,
    eventType: "goal_met",
    payload: { distanceKm },
    createdAt: new Date().toISOString(),
    user: { id: mockUser.id, displayName: mockUser.displayName, avatarUrl: null },
  });

  return { success: true, distanceKm: mockStreak.currentWeek.distanceKm };
}

export function deposit(amount: number, token: string, txHash?: string) {
  mockEarnings.totalDeposited += amount;
  if (token === "USDC") mockWallet.balances.USDC += amount;
  else mockWallet.balances.AVAX += amount;

  const createdAt = new Date().toISOString();

  mockDeposits.unshift({
    id: `dep-${++depositCounter}`,
    amount,
    token,
    status: "earning",
    createdAt,
    txHash: txHash ?? null,
  });

  recalcEarnings();

  mockFeed.unshift({
    id: `fe-${++feedCounter}`,
    userId: mockUser.id,
    eventType: "deposit",
    payload: { amount, token },
    createdAt,
    user: { id: mockUser.id, displayName: mockUser.displayName, avatarUrl: null },
  });

  return { success: true };
}

let challengeCounter = 10;

export function createChallenge(data: { title: string; goalKmWeek: number; durationWeeks: number; maxMembers?: number }) {
  const id = `ch-${++challengeCounter}`;
  const challenge = {
    id,
    creatorId: mockUser.id,
    title: data.title,
    description: null,
    goalKmWeek: data.goalKmWeek,
    startDate: new Date().toISOString(),
    endDate: weeksFromNow(data.durationWeeks),
    maxMembers: data.maxMembers ?? 10,
    status: "active",
    members: [
      { id: `cm-${Date.now()}`, userId: mockUser.id, weeksMet: 0, weeksTotal: 0, user: { id: mockUser.id, displayName: mockUser.displayName, avatarUrl: null } },
    ],
    _count: { members: 1 },
  };
  mockChallenges.unshift(challenge);
  return challenge;
}

export function updateUser(updates: { displayName?: string; goalType?: string; targetKm?: number }) {
  if (updates.displayName !== undefined) mockUser.displayName = updates.displayName;
  if (updates.goalType !== undefined) mockUser.goalType = updates.goalType;
  if (updates.targetKm !== undefined) mockUser.targetKm = updates.targetKm;
  return mockUser;
}
