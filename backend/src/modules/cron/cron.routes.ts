import type { FastifyInstance } from "fastify";
import { env } from "../../config/env.js";

export default async function cronRoutes(app: FastifyInstance) {
  // GET /api/cron/run-reminders — called daily at 7 AM by PM2 cron
  // Creates a notification for each user whose runSchedule includes today
  app.get("/run-reminders", async (request, reply) => {
    // Simple secret check to prevent abuse
    const secret = (request.query as { secret?: string }).secret;
    if (secret !== env.CRON_SECRET) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const today = new Date().getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Find users whose runSchedule includes today
    // runSchedule is stored as JSON array, e.g. [1,3,5]
    const users = await app.prisma.user.findMany({
      where: { runSchedule: { not: { equals: [] } } },
      select: { id: true, displayName: true, runSchedule: true, settings: true },
    });

    const targeted = users.filter((u) => {
      const schedule = u.runSchedule as number[];
      if (!Array.isArray(schedule) || !schedule.includes(today)) return false;
      // Respect notification preferences
      const s = u.settings as Record<string, unknown> | null;
      if (s && s.notifRunReminders === false) return false;
      return true;
    });

    // Create notifications for targeted users
    if (targeted.length > 0) {
      await app.prisma.notification.createMany({
        data: targeted.map((u) => ({
          userId: u.id,
          type: "run_reminder",
          payload: {
            message: "Time to run! Your scheduled session starts today.",
            day: today,
          },
        })),
      });
    }

    return reply.send({
      ok: true,
      day: today,
      notified: targeted.length,
      total: users.length,
    });
  });

  // GET /api/cron/weekly-recap — called Sunday at 8 PM
  app.get("/weekly-recap", async (request, reply) => {
    const secret = (request.query as { secret?: string }).secret;
    if (secret !== env.CRON_SECRET) return reply.status(401).send({ error: "Unauthorized" });

    const now = new Date();
    const day = now.getUTCDay();
    const diff = day === 0 ? 6 : day - 1;
    const weekStart = new Date(now);
    weekStart.setUTCDate(weekStart.getUTCDate() - diff);
    weekStart.setUTCHours(0, 0, 0, 0);

    const users = await app.prisma.user.findMany({
      select: {
        id: true, displayName: true, targetKm: true, settings: true,
        streak: { select: { currentCount: true, currentApy: true } },
        activities: { where: { weekStart }, select: { distanceKm: true, goalMet: true } },
      },
    });

    const targeted = users.filter((u: typeof users[0]) => {
      const s = u.settings as Record<string, unknown> | null;
      return !s || s.notifWeeklySummary !== false;
    });

    const notifications = targeted.map((u: typeof targeted[0]) => {
      const km = u.activities[0]?.distanceKm ?? 0;
      const goalMet = u.activities[0]?.goalMet ?? false;
      const streak = u.streak?.currentCount ?? 0;
      return {
        userId: u.id,
        type: "weekly_recap",
        payload: {
          message: goalMet
            ? `Great week! You ran ${km.toFixed(1)}km and kept your ${streak}-week streak alive!`
            : `You ran ${km.toFixed(1)}km this week (target: ${u.targetKm}km). ${streak > 0 ? "Don't let your streak slip!" : "Every step counts!"}`,
          distanceKm: km,
          goalMet,
          streakCount: streak,
        },
      };
    });

    if (notifications.length > 0) {
      await app.prisma.notification.createMany({ data: notifications });
    }

    return reply.send({ ok: true, notified: notifications.length });
  });
}
