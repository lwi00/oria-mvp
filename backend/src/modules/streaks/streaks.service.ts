import type { PrismaClient } from "@prisma/client";
import { computeApy, computeMultipliers } from "./apy.utils.js";
import { STREAK_MILESTONES, APY } from "../../config/constants.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { sendPushToUser } from "../push/push.service.js";
import type { LogActivityBody } from "./streaks.schemas.js";

function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = 0
  d.setUTCDate(d.getUTCDate() - diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function logActivity(
  prisma: PrismaClient,
  userId: string,
  body: LogActivityBody,
) {
  const weekStart = body.weekStart
    ? getWeekStart(new Date(body.weekStart))
    : getWeekStart();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { targetKm: true },
  });
  if (!user) throw new NotFoundError("User");

  // Accumulate distance for the week (don't replace)
  const previousActivity = await prisma.activity.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  });
  const previousDistance = previousActivity?.distanceKm ?? 0;
  const wasGoalAlreadyMet = previousActivity?.goalMet ?? false;
  const totalDistance = previousDistance + body.distanceKm;
  const goalMet = totalDistance >= user.targetKm;

  const activity = await prisma.activity.upsert({
    where: {
      userId_weekStart: { userId, weekStart },
    },
    update: {
      distanceKm: totalDistance,
      source: body.source,
      goalMet,
    },
    create: {
      userId,
      weekStart,
      distanceKm: body.distanceKm,
      source: body.source,
      goalMet,
    },
  });

  // Update streak in real-time only when goal transitions to met for the first time this week
  if (goalMet && !wasGoalAlreadyMet) {
    const streak = await prisma.streak.findUnique({ where: { userId } });
    if (streak) {
      const newCount = streak.currentCount + 1;
      const baseApy = computeApy(newCount);
      const longRunThreshold = user.targetKm * APY.LONG_RUN_MULTIPLIER;
      const m = computeMultipliers(
        baseApy, streak.weekSessions, streak.weekLongestRun,
        longRunThreshold, streak.monthAvgPace, streak.prevMonthAvgPace,
      );
      await prisma.streak.update({
        where: { userId },
        data: {
          currentCount: newCount,
          lastWeekMet: true,
          currentApy: baseApy,
          ...m,
        },
      });

      // Push notification for goal met
      sendPushToUser(prisma, userId, {
        title: "Weekly Goal Crushed!",
        body: `You hit ${totalDistance.toFixed(1)}km — streak is now ${newCount} weeks!`,
        url: "/streak",
        tag: "goal-met",
      }).catch(() => {});
    }
  }

  return activity;
}

export async function getActivities(
  prisma: PrismaClient,
  userId: string,
  weeks: number,
) {
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);

  return prisma.activity.findMany({
    where: {
      userId,
      weekStart: { gte: since },
    },
    orderBy: { weekStart: "desc" },
  });
}

export async function getMyStreak(prisma: PrismaClient, userId: string) {
  const streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak) throw new NotFoundError("Streak");

  // Get current week's activities for day-by-day progress
  const weekStart = getWeekStart();
  const activity = await prisma.activity.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  });

  return {
    ...streak,
    currentWeek: {
      weekStart,
      distanceKm: activity?.distanceKm ?? 0,
      goalMet: activity?.goalMet ?? false,
    },
  };
}

export async function recoverStreak(prisma: PrismaClient, userId: string) {
  const streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak) throw new NotFoundError("Streak");
  if (streak.lastWeekMet) throw new BadRequestError("Your streak is active — no recovery needed!");
  if (streak.currentCount === 0) throw new BadRequestError("No streak to recover");

  // Check if user has enough deposit balance (5 USDC cost)
  const RECOVERY_COST = 5;
  const deposits = await prisma.deposit.aggregate({
    where: { userId, status: "earning" },
    _sum: { amount: true },
  });
  const balance = deposits._sum.amount ?? 0;
  if (balance < RECOVERY_COST) throw new BadRequestError(`Need at least $${RECOVERY_COST} deposited to recover streak`);

  // Restore the streak
  await prisma.streak.update({
    where: { userId },
    data: { lastWeekMet: true },
  });

  // Create a feed event
  await prisma.feedEvent.create({
    data: {
      userId,
      eventType: "streak_recovered",
      payload: { streakCount: streak.currentCount, cost: RECOVERY_COST },
    },
  });

  return { recovered: true, streakCount: streak.currentCount, cost: RECOVERY_COST };
}

export async function evaluateStreaks(prisma: PrismaClient) {
  const weekStart = getWeekStart();
  const users = await prisma.user.findMany({
    include: { streak: true },
  });

  const results = [];

  for (const user of users) {
    if (!user.streak) continue;

    const activity = await prisma.activity.findUnique({
      where: { userId_weekStart: { userId: user.id, weekStart } },
    });

    const goalMet = activity?.goalMet ?? false;
    // If lastWeekMet is already true and goal is met, logActivity already incremented — don't double-count
    const alreadyIncremented = user.streak.lastWeekMet && goalMet;
    const newCount = goalMet ? (alreadyIncremented ? user.streak.currentCount : user.streak.currentCount + 1) : 0;
    const newLongest = Math.max(user.streak.longestCount, newCount);
    const baseApy = computeApy(newCount);
    const longRunThreshold = user.targetKm * APY.LONG_RUN_MULTIPLIER;
    const m = computeMultipliers(
      baseApy, user.streak.weekSessions, user.streak.weekLongestRun,
      longRunThreshold, user.streak.monthAvgPace, user.streak.prevMonthAvgPace,
    );

    await prisma.streak.update({
      where: { userId: user.id },
      data: {
        currentCount: newCount,
        longestCount: newLongest,
        lastWeekMet: goalMet,
        currentApy: baseApy,
        // Reset multiplier tracking for new week
        weekSessions: 0,
        weekLongestRun: 0,
        ...m,
      },
    });

    // Emit feed events for milestones
    if (goalMet) {
      await prisma.feedEvent.create({
        data: {
          userId: user.id,
          eventType: "goal_met",
          payload: {
            weekStart: weekStart.toISOString(),
            distanceKm: activity!.distanceKm,
          },
        },
      });

      if (STREAK_MILESTONES.includes(newCount as any)) {
        await prisma.feedEvent.create({
          data: {
            userId: user.id,
            eventType: "streak_milestone",
            payload: { streakCount: newCount },
          },
        });
      }
    } else if (user.streak.currentCount > 0) {
      await prisma.feedEvent.create({
        data: {
          userId: user.id,
          eventType: "streak_lost",
          payload: { previousCount: user.streak.currentCount },
        },
      });
    }

    results.push({
      userId: user.id,
      goalMet,
      newCount,
      newApy: baseApy,
    });
  }

  return results;
}
