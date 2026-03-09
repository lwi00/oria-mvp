import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { exchangeStravaCode, syncStravaActivities, getLastRun } from "./strava.service.js";

const exchangeBodySchema = z.object({ code: z.string() });

export default async function stravaRoutes(app: FastifyInstance) {
  // POST /api/strava/exchange — exchange OAuth code for tokens
  app.post("/exchange", async (request, reply) => {
      const { code } = exchangeBodySchema.parse(request.body);
      const result = await exchangeStravaCode(
        app.prisma,
        request.userId,
        code,
      );
      return reply.send(result);
    },
  );

  // POST /api/strava/sync — manually re-sync activities
  app.post("/sync", async (request, reply) => {
    const result = await syncStravaActivities(app.prisma, request.userId);
    return reply.send(result);
  });

  // GET /api/strava/status — check if Strava is connected
  app.get("/status", async (request, reply) => {
    const user = await app.prisma.user.findUnique({
      where: { id: request.userId },
      select: { stravaToken: true, dataSource: true },
    });
    return reply.send({ connected: !!user?.stravaToken });
  });

  // GET /api/strava/last-run — fetch latest activity from Strava API
  app.get("/last-run", async (request, reply) => {
    const result = await getLastRun(app.prisma, request.userId);
    return reply.send(result);
  });
}
