import type { FastifyInstance } from "fastify";
import { depositSchema } from "./wallet.schemas.js";
import {
  getBalance,
  recordDeposit,
  startEarning,
  getEarnings,
} from "./wallet.service.js";

export default async function walletRoutes(app: FastifyInstance) {
  app.get("/balance", async (request, reply) => {
    const balance = await getBalance(app.prisma, request.userId);
    return reply.send(balance);
  });

  app.post("/deposit", async (request, reply) => {
    const { amount, token } = depositSchema.parse(request.body);
    const deposit = await recordDeposit(
      app.prisma,
      request.userId,
      amount,
      token,
    );
    return reply.status(201).send(deposit);
  });

  app.post("/start-earning", async (request, reply) => {
    const result = await startEarning(app.prisma, request.userId);
    return reply.send(result);
  });

  app.get("/earnings", async (request, reply) => {
    const earnings = await getEarnings(app.prisma, request.userId);
    return reply.send(earnings);
  });
}
