import Fastify from "fastify";
import { env } from "./config/env.js";
import corsPlugin from "./plugins/cors.js";
import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";
import { AppError } from "./lib/errors.js";
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import streaksRoutes from "./modules/streaks/streaks.routes.js";
import socialRoutes from "./modules/social/social.routes.js";
import challengesRoutes from "./modules/challenges/challenges.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
    },
  });

  // Plugins
  await app.register(corsPlugin);
  await app.register(prismaPlugin);
  await app.register(authPlugin);

  // Global error handler
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
      });
    }

    app.log.error(error);
    return reply.status(500).send({
      error: "InternalServerError",
      message: env.NODE_ENV === "production" ? "Internal server error" : error.message,
    });
  });

  // Health check
  app.get("/health", { config: { skipAuth: true } }, async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // API routes
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(usersRoutes, { prefix: "/api/users" });
  await app.register(streaksRoutes, { prefix: "/api" });
  await app.register(socialRoutes, { prefix: "/api" });
  await app.register(challengesRoutes, { prefix: "/api" });
  await app.register(walletRoutes, { prefix: "/api/wallet" });

  return app;
}
