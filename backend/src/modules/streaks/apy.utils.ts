import { APY } from "../../config/constants.js";

export function computeApy(streakCount: number): number {
  if (streakCount <= 0) return APY.BASE;
  if (streakCount >= APY.MAX_STREAK) return APY.MAX;

  const progress =
    Math.log(1 + streakCount) / Math.log(1 + APY.MAX_STREAK);
  const apy = APY.BASE + (APY.MAX - APY.BASE) * Math.min(1, progress);
  return Math.round(apy * 100) / 100;
}
