import { APY } from "../../config/constants.js";

export function computeApy(streakCount: number): number {
  if (streakCount <= 0) return APY.BASE;
  if (streakCount >= APY.MAX_STREAK) return APY.MAX;

  const progress =
    Math.log(1 + streakCount) / Math.log(1 + APY.MAX_STREAK);
  const apy = APY.BASE + (APY.MAX - APY.BASE) * Math.min(1, progress);
  return Math.round(apy * 100) / 100;
}

export interface MultiplierResult {
  regularityBonus: number;
  longRunBonus: number;
  progressionBonus: number;
  effectiveApy: number;
}

export function computeMultipliers(
  baseApy: number,
  weekSessions: number,
  weekLongestRunKm: number,
  longRunThresholdKm: number,
  monthAvgPace: number,
  prevMonthAvgPace: number,
): MultiplierResult {
  const regularity =
    weekSessions >= APY.REGULARITY_MIN_SESSIONS ? APY.REGULARITY_BONUS : 0;

  const longRun =
    longRunThresholdKm > 0 && weekLongestRunKm >= longRunThresholdKm
      ? APY.LONG_RUN_BONUS
      : 0;

  // Pace progression: lower pace = faster. Both must be > 0 (have data).
  const progression =
    monthAvgPace > 0 && prevMonthAvgPace > 0 && monthAvgPace < prevMonthAvgPace
      ? APY.PROGRESSION_BONUS
      : 0;

  const effective = Math.min(
    APY.EFFECTIVE_CAP,
    Math.round((baseApy + regularity + longRun + progression) * 100) / 100,
  );

  return {
    regularityBonus: regularity,
    longRunBonus: longRun,
    progressionBonus: progression,
    effectiveApy: effective,
  };
}
