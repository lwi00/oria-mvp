import type { FastifyInstance } from "fastify";
import { subscribe, unsubscribe, getVapidPublicKey } from "./push.service.js";

export default async function pushRoutes(app: FastifyInstance) {
  // Get VAPID public key (no auth required)
  app.get("/api/push/vapid-key", async () => {
    return { publicKey: getVapidPublicKey() };
  });

  // Subscribe to push notifications
  app.post("/api/push/subscribe", async (request) => {
    const userId = (request as any).userId;
    const body = request.body as {
      endpoint: string;
      keys: { p256dh: string; auth: string };
    };

    await subscribe(app.prisma, userId, body);
    return { subscribed: true };
  });

  // Unsubscribe from push notifications
  app.post("/api/push/unsubscribe", async (request) => {
    const userId = (request as any).userId;
    const { endpoint } = request.body as { endpoint: string };

    await unsubscribe(app.prisma, userId, endpoint);
    return { unsubscribed: true };
  });
}
