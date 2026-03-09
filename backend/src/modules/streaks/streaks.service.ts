import type { PrismaClient } from "@prisma/client";
import { computeApy } from "./apy.utils.js";
import { STREAK_MILESTONES } from "../../config/constants.js";
import { NotFoundError } from "../../lib/errors.js";
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

  const goalMet = body.distanceKm >= user.targetKm;

  const activity = await prisma.activity.upsert({
    where: {
      userId_weekStart: { userId, weekStart },
    },
    update: {
      distanceKm: body.distanceKm,
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

  // Auto-update streak APY when goal is met so dashboard reflects immediately
  if (goalMet) {
    const streak = await prisma.streak.findUnique({ where: { userId } });
    if (streak && !streak.lastWeekMet) {
      const newCount = streak.currentCount + 1;
      const newApy = computeApy(newCount);
      await prisma.streak.update({
        where: { userId },
        data: { currentCount: newCount, lastWeekMet: true, currentApy: newApy },
      });
    } else if (streak) {
      await prisma.streak.update({
        where: { userId },
        data: { lastWeekMet: true, currentApy: computeApy(streak.currentCount) },
      });
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
    const newCount = goalMet ? user.streak.currentCount + 1 : 0;
    const newLongest = Math.max(user.streak.longestCount, newCount);
    const newApy = computeApy(newCount);

    await prisma.streak.update({
      where: { userId: user.id },
      data: {
        currentCount: newCount,
        longestCount: newLongest,
        lastWeekMet: goalMet,
        currentApy: newApy,
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
      newApy,
    });
  }

  return results;
}
