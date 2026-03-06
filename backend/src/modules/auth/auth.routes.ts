import type { FastifyInstance } from "fastify";
import { verifyBodySchema } from "./auth.schemas.js";
import { verifyAndUpsertUser } from "./auth.service.js";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/verify", async (request, reply) => {
    const body = verifyBodySchema.parse(request.body);
    const result = await verifyAndUpsertUser(
      app.prisma,
      request.privyId,
      body,
    );
    return reply.send(result);
  });
}
