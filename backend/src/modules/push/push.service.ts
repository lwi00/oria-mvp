import type { PrismaClient } from "@prisma/client";
import webpush from "web-push";
import { env } from "../../config/env.js";

// Initialize web-push with VAPID keys
if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY && env.VAPID_SUBJECT) {
  webpush.setVapidDetails(
    env.VAPID_SUBJECT,
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY,
  );
}

interface SubscriptionPayload {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function subscribe(
  prisma: PrismaClient,
  userId: string,
  subscription: SubscriptionPayload,
) {
  return prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: { userId, keys: subscription.keys as object },
    create: {
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys as object,
    },
  });
}

export async function unsubscribe(
  prisma: PrismaClient,
  userId: string,
  endpoint: string,
) {
  return prisma.pushSubscription.deleteMany({
    where: { userId, endpoint },
  });
}

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

export async function sendPushToUser(
  prisma: PrismaClient,
  userId: string,
  payload: PushPayload,
) {
  if (!env.VAPID_PUBLIC_KEY) return;

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys as { p256dh: string; auth: string },
          },
          JSON.stringify(payload),
        );
      } catch (err: unknown) {
        // Remove expired/invalid subscriptions (410 Gone or 404)
        if (err && typeof err === "object" && "statusCode" in err) {
          const statusCode = (err as { statusCode: number }).statusCode;
          if (statusCode === 410 || statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
        }
        throw err;
      }
    }),
  );

  return results;
}

export function getVapidPublicKey() {
  return env.VAPID_PUBLIC_KEY ?? null;
}
