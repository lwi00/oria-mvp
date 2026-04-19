import cors from "@fastify/cors";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

export default fp(async (fastify: FastifyInstance) => {
  // env.CORS_ORIGIN may be comma-separated ("a.com,b.com") — split into array
  // so @fastify/cors echoes back only the matching origin, not the full string.
  const origin = env.CORS_ORIGIN.includes(",")
    ? env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : env.CORS_ORIGIN;

  await fastify.register(cors, {
    origin,
    credentials: true,
  });
});
