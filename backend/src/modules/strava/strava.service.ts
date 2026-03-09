import type { PrismaClient } from "@prisma/client";
import { env } from "../../config/env.js";
import { computeApy } from "../streaks/apy.utils.js";

const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
}

interface StravaActivity {
  name: string;
  distance: number;
  start_date: string;
  moving_time: number;
  type: string;
}

function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function exchangeStravaCode(
  prisma: PrismaClient,
  userId: string,
  code: string,
) {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Strava token exchange failed: ${JSON.stringify(err)}`);
  }

  const data = await res.json() as StravaTokenResponse;
  const { access_token, refresh_token } = data;

  // Store refresh token + set dataSource to strava
  await prisma.user.update({
    where: { id: userId },
    data: { stravaToken: refresh_token, dataSource: "strava" },
  });

  // Sync recent activities right away
  await syncStravaActivities(prisma, userId, access_token);

  return { connected: true };
}

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) throw new Error("Failed to refresh Strava token");
  const data = await res.json() as StravaTokenResponse;
  return data.access_token;
}

export async function getLastRun(prisma: PrismaClient, userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.stravaToken) return { lastRun: null };

  const token = await getAccessToken(user.stravaToken);
  const res = await fetch(`${STRAVA_ACTIVITIES_URL}?per_page=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return { lastRun: null };
  const activities = await res.json() as StravaActivity[];
  const a = activities[0];
  if (!a) return { lastRun: null };

  return {
    lastRun: {
      name: a.name,
      distanceKm: parseFloat((a.distance / 1000).toFixed(2)),
      date: a.start_date,
      movingTimeSec: a.moving_time,
      type: a.type,
    },
  };
}

export async function syncStravaActivities(
  prisma: PrismaClient,
  userId: string,
  accessToken?: string,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.stravaToken) throw new Error("Strava not connected");

  const token = accessToken ?? (await getAccessToken(user.stravaToken));

  // Fetch last 8 weeks of activities
  const after = Math.floor(Date.now() / 1000) - 8 * 7 * 86400;
  const res = await fetch(
    `${STRAVA_ACTIVITIES_URL}?per_page=100&after=${after}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) throw new Error("Failed to fetch Strava activities");
  const activities = await res.json() as StravaActivity[];

  // Group by week, sum distances
  const weekMap = new Map<string, number>();
  for (const act of activities) {
    const date = new Date(act.start_date);
    const weekStart = getWeekStart(date);
    const key = weekStart.toISOString();
    const km = (act.distance ?? 0) / 1000;
    weekMap.set(key, (weekMap.get(key) ?? 0) + km);
  }

  // Upsert one activity record per week
  const currentWeekStart = getWeekStart();
  for (const [weekKey, totalKm] of weekMap.entries()) {
    const weekStart = new Date(weekKey);
    const goalMet = totalKm >= user.targetKm;
    await prisma.activity.upsert({
      where: { userId_weekStart: { userId, weekStart } },
      update: { distanceKm: totalKm, source: "strava", goalMet },
      create: { userId, weekStart, distanceKm: totalKm, source: "strava", goalMet },
    });

    // Update streak if current week's goal is met
    if (weekStart.getTime() === currentWeekStart.getTime() && goalMet) {
      const streak = await prisma.streak.findUnique({ where: { userId } });
      if (streak && !streak.lastWeekMet) {
        const newCount = streak.currentCount + 1;
        await prisma.streak.update({
          where: { userId },
          data: { currentCount: newCount, lastWeekMet: true, currentApy: computeApy(newCount) },
        });
      } else if (streak) {
        await prisma.streak.update({
          where: { userId },
          data: { lastWeekMet: true, currentApy: computeApy(streak.currentCount) },
        });
      }
    }
  }

  // Find the most recent individual activity for "last run" display
  const lastActivity = activities
    .filter((a) => a.distance > 0)
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0];

  const lastRun = lastActivity
    ? {
        name: lastActivity.name,
        distanceKm: parseFloat((lastActivity.distance / 1000).toFixed(2)),
        date: lastActivity.start_date,
        movingTimeSec: lastActivity.moving_time,
        type: lastActivity.type,
      }
    : null;

  return { synced: weekMap.size, lastRun };
}
