import fp from "fastify-plugin";
import type { FastifyInstance, FastifyRequest } from "fastify";
import { env } from "../config/env.js";
import { MOCK_USER_ID, MOCK_PRIVY_ID } from "../config/constants.js";
import { UnauthorizedError } from "../lib/errors.js";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorateRequest("userId", "");
  fastify.decorateRequest("privyId", "");

  fastify.addHook("onRequest", async (request: FastifyRequest) => {
    // Skip auth for health check
    if (request.url === "/health") return;

    if (env.MOCK_AUTH) {
      request.userId = MOCK_USER_ID;
      request.privyId = MOCK_PRIVY_ID;
      return;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing or invalid authorization header");
    }

    const token = authHeader.slice(7);
    try {
      const { PrivyClient } = await import("@privy-io/server-auth");
      const privy = new PrivyClient(env.PRIVY_APP_ID, env.PRIVY_APP_SECRET);
      const verified = await privy.verifyAuthToken(token);
      request.privyId = verified.userId;

      // Look up internal user ID
      const user = await fastify.prisma.user.findUnique({
        where: { privyId: verified.userId },
        select: { id: true },
      });
      if (user) {
        request.userId = user.id;
      }
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  });
});

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    privyId: string;
  }
}
