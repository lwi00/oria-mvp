export const APY = {
  BASE: 4.0,
  MAX: 8.0,
  MAX_STREAK: 10,
  EFFECTIVE_CAP: 9.0,
  REGULARITY_BONUS: 0.3,    // 3+ sessions/week
  REGULARITY_MIN_SESSIONS: 3,
  LONG_RUN_BONUS: 0.2,      // 1 run > threshold
  LONG_RUN_MULTIPLIER: 1.5,  // threshold = targetKm * 1.5 (e.g. 10km target → 15km long run)
  PROGRESSION_BONUS: 0.2,    // pace improved vs last month
} as const;

export const STREAK_MILESTONES = [3, 5, 10, 25, 50] as const;

export const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";
export const MOCK_PRIVY_ID = "did:privy:mock-user-001";
